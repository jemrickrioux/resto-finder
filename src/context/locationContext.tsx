import { createContext, useState } from "react";
import { LocationState, PlaceOption } from "~/types/types";

export const LocationData = createContext(
  {} as {
    data: LocationState;
    setData: (prev: LocationState) => void;
    setLoading: (value: boolean) => void;
    setError: (value: null | string) => void;
    setCoordinates: (lat: number, lng: number) => void;
    setName: (name: string) => void;
    setSaved: (saved: boolean) => void;
    setUsingLocation: (usingLocation: boolean) => void;
    setPlace: (place: PlaceOption) => void;
  }
);
const LocationContext = (props: { children: React.ReactNode }) => {
  const [data, setData] = useState<LocationState>({
    loading: false,
    error: null,
    saved: false,
    name: null,
    usingLocation: false,
    place: null,
    coords: {
      lat: null,
      lng: null,
    },
  } as LocationState);
  function setLoading(value: boolean) {
    setData((prev) => ({
      ...prev,
      loading: value,
    }));
  }

  function setPlace(place: PlaceOption) {
    setData((prev) => ({
      ...prev,
      place,
    }));
  }
  function setError(value: null | string) {
    setData((prev) => ({
      ...prev,
      error: value,
    }));
  }

  function setCoordinates(lat: number, lng: number) {
    setData((prev) => {
      return {
        ...prev,
        coords: {
          lat,
          lng,
        },
      };
    });
  }

  function setName(name: string) {
    setData((prev) => {
      return {
        ...prev,
        name,
      };
    });
  }

  function setUsingLocation(usingLocation: boolean) {
    setData((prev) => {
      return {
        ...prev,
        usingLocation,
      };
    });
  }

  function setSaved(saved: boolean) {
    setData((prev) => {
      return {
        ...prev,
        saved,
      };
    });
  }
  return (
    <LocationData.Provider
      value={{
        data,
        setData,
        setLoading,
        setError,
        setCoordinates,
        setName,
        setSaved,
        setUsingLocation,
        setPlace,
      }}
    >
      {props.children}
    </LocationData.Provider>
  );
};

export default LocationContext;
