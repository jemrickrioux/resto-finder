import * as React from "react";
import { SingleValue } from "react-select";
import { useFormikContext } from "formik";
import { useContext } from "react";
import { LocationData } from "~/context/locationContext";
import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
} from "react-google-places-autocomplete";
import { env } from "~/env.mjs";
import { PlaceOption } from "~/types/types";

export function GooglePlacesAutoComplete(props: any) {
  const {
    setCoordinates,
    setPlace: setPlaceContext,
    data,
  } = useContext(LocationData);
  const [place, setPlace] = React.useState<SingleValue<PlaceOption>>(
    data.place
  );
  const { values, setFieldValue } = useFormikContext();

  async function handlePlaceChange(
    place: SingleValue<PlaceOption>,
    action: any
  ) {
    setPlace(place);
    if (!place) return;
    setPlaceContext(place);

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
        placeholder: "Entrez votre adresse",
        styles: {
          control: (provided) => ({
            ...provided,
            width: "100%",
          }),
        },
        onChange: (place, actionMeta) => {
          void handlePlaceChange(place, actionMeta);
        },
      }}
      apiKey={env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}
    />
  );
}
