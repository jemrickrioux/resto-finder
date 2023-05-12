import { Dispatch, SetStateAction, useEffect } from "react";

export const useGeoLocation = (
  setCoordinates: Dispatch<
    SetStateAction<{ lat: null | number; lng: null | number }>
  >,
  setError: Dispatch<SetStateAction<string | null>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setLocationMode: Dispatch<SetStateAction<"none" | "browser" | "favorite">>
) => {
  useEffect(() => {
    if ("geolocation" in navigator) {
      setLoading(true);
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const { latitude, longitude } = coords;

          setCoordinates({ lat: latitude, lng: longitude });
          setLoading(false);
          setError(null);
          setLocationMode("browser");
        },
        () => {
          setLoading(false);
          setError("Impossible d'accéder à votre emplacement");
        }
      );
    }
    setLoading(false);
  }, []);
};
