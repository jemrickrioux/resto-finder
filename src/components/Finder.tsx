import * as React from "react";
import { Formik, Field, Form, FormikHelpers, useFormikContext } from "formik";
import { Button } from "~/components/Button";
import { api } from "~/utils/api";
import { Dispatch, Fragment, SetStateAction, useContext } from "react";
import * as Yup from "yup";
import { DistanceSelect } from "~/components/form/DistanceSelect";
import { KeywordSelect } from "~/components/form/KeywordSelect";
import { PriceLevelSelect } from "~/components/form/PriceLevelSelect";
import { ToggleInput } from "~/components/form/ToggleInput";
import { useSession } from "next-auth/react";
import { LocationData } from "~/context/locationContext";

import { Results } from "~/context/resultsContext";
import { GooglePlacesAutoComplete } from "~/components/form/GooglePlacesAutocomplete";
import { FinderFormValues } from "~/types/types";
import { ServicesFilters } from "~/components/ServicesFilters";
import {
  DeliveryDiningRounded,
  InfoRounded,
  SettingsApplicationsRounded,
  TakeoutDiningRounded,
} from "@mui/icons-material";
import { Transition } from "@headlessui/react";

const MyField = (props: any) => {
  return <Field className={"bg-accent"} {...props} />;
};

export const Label = (props: any) => {
  return <label className={"text-md text-primary md:text-xl"} {...props} />;
};

export const FieldGroup = (props: any) => {
  return (
    <div
      className={" mb-4 flex w-full  flex-col items-start space-y-2"}
      {...props}
    />
  );
};

export const Finder = () => {
  const { data: session } = useSession();
  const getRestaurants = api.places.restaurant.useMutation();
  const [advanced, setAdvanced] = React.useState(false);
  const [livraison, setLivraison] = React.useState(false);
  const [error, setError] = React.useState<null | string>(null);
  const [takeout, setTakeout] = React.useState(false);
  const distance = useContext(LocationData);
  const { setChoices } = useContext(Results);
  const [location, setLocation] = React.useState(
    {} as FinderFormValues["coordinates"]
  );
  const { coordinates } = useContext(LocationData);

  return (
    <div
      className={
        "mx-4 max-w-full rounded-lg bg-main px-4 py-4 text-primary md:mx-0 md:px-10 md:py-10"
      }
    >
      <p className={"text-primary"}>{error}</p>
      <h2
        className={
          "bold py-6 text-left font-anek text-2xl font-bold uppercase text-primary md:text-4xl"
        }
      >
        {"Trouves ton lunch!"}
      </h2>
      <Formik
        initialValues={{
          location: "",
          priceLevel: {
            value: 4,
            label: "You decide | Go hard or go home!... wait..",
          },
          distance: { value: 10000, label: "10km | Allez!" },
          coordinates: {
            latitude: coordinates.lat || 0,
            longitude: coordinates.lng || 0,
          },
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
          values: FinderFormValues,
          { setSubmitting }: FormikHelpers<FinderFormValues>
        ) => {
          setSubmitting(true);

          const payload =
            coordinates.lng && coordinates.lat
              ? {
                  latitude: coordinates.lat,
                  longitude: coordinates.lng,
                  priceLevel: values.priceLevel.value,
                  distance: values.distance.value,
                  keyword: values.keyword.value,
                }
              : values.coordinates.latitude && values.coordinates.longitude
              ? {
                  latitude: values.coordinates.latitude,
                  longitude: values.coordinates.longitude,
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
          const restaurantData = await getRestaurants.mutateAsync(payload);

          setChoices(restaurantData);
          setSubmitting(false);
          setError(null);
          if (restaurantData.length === 0)
            setError("Aucun résultat disponible");
        }}
      >
        <Form className={"flex w-full flex-col items-start space-y-2"}>
          {distance.locationMode === "none" && (
            <FieldGroup>
              <Label htmlFor="firstName">{"T'es où toi?"}</Label>
              <GooglePlacesAutoComplete />
            </FieldGroup>
          )}

          <ToggleInput
            Icon={TakeoutDiningRounded}
            value={takeout}
            handler={setTakeout}
            label={"Takeout"}
          />
          <ToggleInput
            Icon={DeliveryDiningRounded}
            handler={setLivraison}
            value={livraison}
            label={"Livraison"}
          />
          <ToggleInput
            Icon={SettingsApplicationsRounded}
            handler={setAdvanced}
            value={advanced}
            label={"Plus d'options"}
          />
          <Transition
            as={"div"}
            show={advanced}
            enter="transform transition duration-[400ms]"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transform duration-200 transition ease-in-out"
            leaveFrom="opacity-100  "
            leaveTo="opacity-0  "
            className={"flex max-w-full flex-col items-start space-y-2"}
          >
            <FieldGroup>
              <Label htmlFor="priceLevel">{"C'est quoi ton budget?"}</Label>
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
                {"Quel rayon (en km) on utilises pour la recherche?"}
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
              <Label htmlFor="distance">{"As-tu une demande spéciale?"}</Label>
              <KeywordSelect
                choices={[
                  { value: "bière", label: "Je veux de la broue" },
                  { value: "vin", label: "Je veux du vin" },
                  { value: "fast food", label: "D'la junk svp" },
                  { value: "poulet", label: "Poula!" },
                  { value: "indien", label: "Indien!" },
                  { value: "tacos", label: "Tacos 🌮" },
                ]}
              />
            </FieldGroup>
          </Transition>
          <div className={"py-8"}>
            <Button text={"Go"} size={"sm"} submit />
          </div>
        </Form>
      </Formik>
    </div>
  );
};
