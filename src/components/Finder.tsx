import * as React from "react";
import { Formik, Field, Form, FormikHelpers, useFormikContext } from "formik";
import { Button } from "~/components/Button";
import { api } from "~/utils/api";
import { Dispatch, SetStateAction, useContext } from "react";
import * as Yup from "yup";
import { env } from "~/env.mjs";
import { DistanceSelect } from "~/components/form/DistanceSelect";
import { KeywordSelect } from "~/components/form/KeywordSelect";
import { PriceLevelSelect } from "~/components/form/PriceLevelSelect";
import { ToggleInput } from "~/components/form/ToggleInput";
import { useSession } from "next-auth/react";
import { LocationData } from "~/context/locationContext";
import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
} from "react-google-places-autocomplete";
import { SingleValue } from "react-select";

import { YelpData } from "~/context/context";

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

const MyField = (props: any) => {
  return <Field className={"bg-accent"} {...props} />;
};

export const Label = (props: any) => {
  return <label className={"text-md text-primary md:text-xl"} {...props} />;
};

export const FieldGroup = (props: any) => {
  return (
    <div className={" mb-4 flex  flex-col items-start space-y-2"} {...props} />
  );
};

type PlaceOption = {
  label: string;
  value: PlaceResult;
};

type PlaceResult = {
  description: string;
  place_id: string;
  reference: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  terms: {
    offset: number;
    value: string;
  }[];
  types: string[];
};

const GooglePlacesAutoComplete = (props: any) => {
  const [place, setPlace] = React.useState<SingleValue<PlaceOption>>(null);
  const { values, setFieldValue } = useFormikContext();
  const { setCoordinates } = useContext(LocationData);

  async function handlePlaceChange(
    place: SingleValue<PlaceOption>,
    action: any
  ) {
    setPlace(place);
    if (!place) return;
    const result = await geocodeByPlaceId(place.value.place_id);
    if (!result || result[0] === undefined) return;
    setCoordinates(
      result[0].geometry.location.lat(),
      result[0].geometry.location.lng()
    );
  }

  return (
    <GooglePlacesAutocomplete
      apiOptions={{
        language: "fr",
        region: "CA",
      }}
      selectProps={{
        value: place,
        className: "bg-accent w-max",
        placeholder: "Entrez votre adresse",

        onChange: (place, actionMeta) => {
          void handlePlaceChange(place, actionMeta);
        },
      }}
      apiKey={env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}
    />
  );
};

export const Finder = ({
  openModal,
}: {
  openModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const { data: session } = useSession();
  const getRestaurants = api.places.restaurant.useMutation();
  const [advanced, setAdvanced] = React.useState(false);
  const distance = useContext(LocationData);
  const { setData } = useContext(YelpData);
  const [location, setLocation] = React.useState(
    {} as MyFormValues["coordinates"]
  );
  const { data } = useContext(LocationData);

  return (
    <div
      className={
        "min-w-11/12 w-full rounded-lg bg-main px-4 py-4 text-primary md:mx-0 md:w-[800px]  md:px-10 md:py-10"
      }
    >
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
            latitude: data.coords.lat || 0,
            longitude: data.coords.lng || 0,
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
          values: MyFormValues,
          { setSubmitting }: FormikHelpers<MyFormValues>
        ) => {
          setSubmitting(true);

          const payload =
            data.coords.lng && data.coords.lat
              ? {
                  latitude: data.coords.lat,
                  longitude: data.coords.lng,
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
          setData(restaurantData);
          setSubmitting(false);
        }}
      >
        <Form className={"flex w-full flex-col items-start space-y-2"}>
          {!distance.data.usingLocation && (
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
            <p>{"Plus d'options"}</p>
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
