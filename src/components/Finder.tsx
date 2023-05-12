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
import {
  DeliveryDiningRounded,
  SettingsApplicationsRounded,
  TakeoutDiningRounded,
} from "@mui/icons-material";
import { Transition } from "@headlessui/react";
import { FieldGroup, Label } from "~/components/form/FormItems";
import {
  DEFAULT_KEYWORD_SELECT_VALUE,
  DISTANCE_SELECT_OPTIONS,
  KEYWORD_SELECT_OPTIONS,
  PRICE_SELECT_OPTIONS,
} from "~/config";
import { useRouter } from "next/router";

export const Finder = () => {
  const getRestaurants = api.places.restaurant.useMutation();
  const [advanced, setAdvanced] = React.useState(false);
  const [livraison, setLivraison] = React.useState(false);
  const [error, setError] = React.useState<null | string>(null);
  const [takeout, setTakeout] = React.useState(false);
  const distance = useContext(LocationData);
  const { handleChoices } = useContext(Results);
  const { coordinates } = useContext(LocationData);

  const router = useRouter();

  return (
    <div
      className={
        "mx-4 max-w-full rounded-lg bg-main px-4 py-4 text-primary md:mx-0 md:px-10 md:py-10"
      }
    >
      {error && (
        <p className={"text-primary"}>{error}. Veuillez modifier vos choix.</p>
      )}
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
          priceLevel: PRICE_SELECT_OPTIONS[2]!,
          distance: DISTANCE_SELECT_OPTIONS[0]!,
          coordinates: {
            latitude: coordinates.lat || 0,
            longitude: coordinates.lng || 0,
          },
          keyword: DEFAULT_KEYWORD_SELECT_VALUE,
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

          const payload = {
            latitude: coordinates.lat!,
            longitude: coordinates.lng!,
            priceLevel: values.priceLevel.value,
            distance: values.distance.value,
            keyword: values.keyword.value,
            takeout,
            livraison,
          };
          const restaurantData = await getRestaurants.mutateAsync(payload);

          handleChoices(restaurantData);
          setSubmitting(false);
          setError(null);
          void router.push("/app/tinder");
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
              <PriceLevelSelect choices={PRICE_SELECT_OPTIONS} />
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="distance">
                {"Quel rayon (en km) on utilises pour la recherche?"}
              </Label>
              <DistanceSelect choices={DISTANCE_SELECT_OPTIONS} />
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="distance">{"As-tu une demande spéciale?"}</Label>
              <KeywordSelect choices={KEYWORD_SELECT_OPTIONS} />
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
