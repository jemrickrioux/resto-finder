import * as React from "react";
import { Formik, Field, Form, FormikHelpers, useFormikContext } from "formik";
import { Button } from "~/components/Button";
import { api } from "~/utils/api";
import { Fragment, useContext, useEffect } from "react";
import * as Yup from "yup";

import { YelpData } from "~/context/context";
import { useRouter } from "next/router";

export interface MyFormValues {
  priceLevel: {
    label: string;
    value: number;
  };
  distance: {
    label: string;
    value: number;
  };
  location: string;
  keyword: {
    label: string;
    value: string;
  };
  coordinates: { latitude: number; longitude: number };
}

import Autocomplete from "react-google-autocomplete";
import { env } from "~/env.mjs";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
import { DistanceSelect } from "~/components/form/DistanceSelect";
import { KeywordSelect } from "~/components/form/KeywordSelect";
import { PriceLevelSelect } from "~/components/form/PriceLevelSelect";
import { ToggleInput } from "~/components/form/ToggleInput";

const MyField = (props: any) => {
  return <Field className={"bg-accent"} {...props} />;
};

const Label = (props: any) => {
  return <label className={"text-md text-primary md:text-xl"} {...props} />;
};

const FieldGroup = (props: any) => {
  return (
    <div className={"mb-4 flex flex-col items-start space-y-2"} {...props} />
  );
};

const GooglePlacesAutoComplete = (props: any) => {
  const { values, setFieldValue } = useFormikContext();

  return (
    <Autocomplete
      className={"bg-accent"}
      apiKey={env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}
      onPlaceSelected={(place: { formatted_address: string }) => {
        setFieldValue("location", place.formatted_address);
      }}
    />
  );
};

export const Finder = () => {
  const get = api.places.restaurant.useMutation();
  const [advanced, setAdvanced] = React.useState(false);
  const { data, setData } = useContext(YelpData);
  const [location, setLocation] = React.useState(
    {} as MyFormValues["coordinates"]
  );
  useEffect(() => {
    if ("geolocation" in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setLocation({ latitude, longitude });
        console.log(coords);
      });
    }
  }, []);
  return (
    <div
      className={
        "rounded-lg bg-main px-4 py-4 text-primary md:mx-0 md:w-[800px] md:px-10  md:py-10"
      }
    >
      <h2
        className={
          "bold py-6 text-left font-anek text-2xl uppercase text-primary md:text-4xl"
        }
      >
        {"Ça part!"}
      </h2>
      <Formik
        initialValues={{
          location: "",
          priceLevel: {
            value: 4,
            label: "You decide | Go hard or go home!... wait..",
          },
          distance: { value: 10000, label: "10km | Allez!" },
          coordinates: location,
          keyword: {
            value: "",
            label: "C'est personnel en esti.",
          },
        }}
        validationSchema={Yup.object({
          location: Yup.string(),
          priceLevel: Yup.object({
            value: Yup.string(),
            label: Yup.string(),
          }).required("Vous devez choisir un budget!"),
          distance: Yup.object({
            value: Yup.number(),
            label: Yup.string(),
          }).required("Vous devez choisir une distance!"),
          keyword: Yup.object({
            value: Yup.string(),
            label: Yup.string(),
          }).required("Vous devez choisir un indispensable!"),
        })}
        onSubmit={async (
          values: MyFormValues,
          {
            setSubmitting,
            resetForm,
            validateForm,
          }: FormikHelpers<MyFormValues>
        ) => {
          setSubmitting(true);
          console.log(values);
          const payload =
            location.latitude > 0
              ? {
                  latitude: location.latitude,
                  longitude: location.longitude,
                  priceLevel: values.priceLevel.value,
                  distance: values.distance.value,
                  keyword: values.keyword.value,
                }
              : {
                  location: values.location,
                  priceLevel: values.priceLevel.value,
                  distance: values.distance.value,
                  keyword: values.keyword.value,
                };
          const data = await get.mutateAsync(payload);
          setData(data);
          setSubmitting(false);
        }}
      >
        <Form className={"flex w-full flex-col items-start space-y-2"}>
          {!location.longitude && (
            <FieldGroup>
              <Label htmlFor="firstName">{"T'es où toi?"}</Label>
              <GooglePlacesAutoComplete />
            </FieldGroup>
          )}
          <div
            className={`flex space-x-2 ${
              !advanced ? "text-gray-200" : "text-primary"
            }`}
          >
            <ToggleInput handler={setAdvanced} value={advanced} />
            <p>{"Sélectionne ça pour faire ton capricieux"}</p>
          </div>

          {advanced && (
            <>
              <FieldGroup>
                <Label htmlFor="priceLevel">
                  {"Tu met combien sur la table?"}
                </Label>
                <PriceLevelSelect
                  choices={[
                    { value: 1, label: "Pas gros | J'suis cheap en est!" },
                    { value: 2, label: "Un peu | Je suis cheap mais pas trop" },
                    { value: 3, label: "Correct | Je suis capable" },
                    {
                      value: 4,
                      label: "You decide | Go hard or go home!... wait..",
                    },
                  ]}
                />
              </FieldGroup>
              <FieldGroup>
                <Label htmlFor="distance">
                  {"Quel rayon on utilises pour la recherche?"}
                </Label>
                <DistanceSelect
                  choices={[
                    { value: 5000, label: "5km | Close stuff please" },
                    { value: 10000, label: "10km | Allez!" },
                    { value: 15000, label: "15km | At this point." },
                    { value: 25000, label: "25km | Je suis fucking désespéré" },
                  ]}
                />
              </FieldGroup>
              <FieldGroup>
                <Label htmlFor="distance">
                  {"C'est quoi ton indispensable?"}
                </Label>
                <KeywordSelect
                  choices={[
                    { value: "bière", label: "Je veux de la broue" },
                    { value: "vin", label: "Je veux du vin" },
                    { value: "fast food", label: "D'la junk svp" },
                    { value: "poulet", label: "Poula!" },
                  ]}
                />
              </FieldGroup>
            </>
          )}
          <div className={"py-8"}>
            <Button text={"Go"} size={"sm"} submit />
          </div>
        </Form>
      </Formik>
    </div>
  );
};
