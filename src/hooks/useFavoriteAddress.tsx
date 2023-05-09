import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { calculateDistance } from "~/utils/distance";
export const useFavoriteAddress = (
  setCoordinates: Dispatch<
    SetStateAction<{ lat: null | number; lng: null | number }>
  >,
  setError: Dispatch<SetStateAction<string | null>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setName: Dispatch<SetStateAction<string | null>>,
  setSaved: Dispatch<SetStateAction<boolean>>,
  setLocationMode: Dispatch<SetStateAction<"none" | "browser" | "favorite">>,
  coordinates: { lat: null | number; lng: null | number }
) => {
  const { data: session } = useSession();
  const favorite = api.user.getFavoriteAddress.useQuery();
  useEffect(() => {
    if (favorite.data !== undefined && favorite.data !== null) {
      setLoading(false);
      if (coordinates.lng !== null && coordinates.lat !== null) {
        const theDistance = calculateDistance(
          { lat: coordinates.lat, lng: coordinates.lng },
          { lat: favorite.data.lat, lng: favorite.data.lng }
        );
        console.log(favorite.data.name + " est à " + theDistance + " km");
        if (theDistance > 0 && theDistance < 0.5) {
          setCoordinates({
            lat: favorite.data.lat,
            lng: favorite.data.lng,
          });
          setName(favorite.data.name);
          setSaved(true);
          setLocationMode("favorite");
        }
      } else {
        setCoordinates({
          lat: favorite.data.lat,
          lng: favorite.data.lng,
        });
        setName(favorite.data.name);
        setSaved(true);
        setLocationMode("favorite");
      }
    } else {
      setLoading(false);
    }
  }, [favorite.data]);
};
