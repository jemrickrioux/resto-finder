import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { PlaceOption } from "~/types/types";
import { useGeoLocation } from "~/hooks/useGeolocation";
import { useFavoriteAddress } from "~/hooks/useFavoriteAddress";

export const LocationData = createContext(
  {} as {
    setLoading: Dispatch<SetStateAction<boolean>>;
    setError: Dispatch<SetStateAction<null | string>>;
    setCoordinates: Dispatch<
      SetStateAction<{ lat: null | number; lng: null | number }>
    >;
    setName: Dispatch<SetStateAction<null | string>>;
    setSaved: Dispatch<SetStateAction<boolean>>;
    setPlace: Dispatch<SetStateAction<PlaceOption | null>>;
    loading: boolean;
    coordinates: { lat: null | number; lng: null | number };
    error: null | string;
    place: PlaceOption | null;
    saved: boolean;
    name: null | string;
    locationMode: "none" | "browser" | "favorite";
  }
);
const LocationContext = (props: { children: React.ReactNode }) => {
  const [coordinates, setCoordinates] = useState<{
    lat: null | number;
    lng: null | number;
  }>({
    lat: null,
    lng: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [place, setPlace] = useState<PlaceOption | null>(null);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState<null | string>(null);
  const [locationMode, setLocationMode] = useState<
    "none" | "browser" | "favorite"
  >("none");

  useGeoLocation(setCoordinates, setError, setLoading, setLocationMode);
  useFavoriteAddress(
    setCoordinates,
    setError,
    setLoading,
    setName,
    setSaved,
    setLocationMode,
    coordinates
  );

  return (
    <LocationData.Provider
      value={{
        loading,
        coordinates,
        locationMode,
        error,
        place,
        saved,
        name,
        setLoading,
        setError,
        setCoordinates,
        setName,
        setSaved,
        setPlace,
      }}
    >
      {props.children}
    </LocationData.Provider>
  );
};

export default LocationContext;
