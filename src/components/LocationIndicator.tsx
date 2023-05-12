import { LocationState } from "~/types/types";
import React from "react";
import { useSession } from "next-auth/react";
import { MapPinIcon } from "@heroicons/react/24/solid";

export const LocationIndicator = ({
  distance,
  setIsModalOpen,
}: {
  distance: LocationState;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data: session } = useSession();
  return (
    <div className={"group flex items-center space-x-2 pl-8"}>
      <MapPinIcon
        className={`h-8 w-8 ${
          distance.error &&
          distance.coordinates.lat === 0 &&
          distance.coordinates.lng === 0
            ? "text-secondary"
            : "text-primary"
        }
              ${distance.loading ? "animate-pulse" : ""}`}
      />
      <div
        onClick={() => setIsModalOpen(true)}
        className={`${
          distance.name
            ? "text-primary"
            : distance.error &&
              distance.coordinates.lat === 0 &&
              distance.coordinates.lng === 0
            ? " text-secondary"
            : "cursor-pointer text-main underline hover:text-primary"
        }`}
      >
        {distance.name ? distance.name : session ? "Enregistrer le lieu" : ""}
      </div>
    </div>
  );
};
