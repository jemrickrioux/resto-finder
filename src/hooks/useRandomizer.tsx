import { RestoBusiness } from "~/types/types";
import React from "react";

export const useRandomizer = (
  data: RestoBusiness[],
  livraison: boolean,
  takeout: boolean,
  change: boolean
) => {
  return React.useMemo(() => {
    if (data.length > 0) {
      if (livraison && takeout) {
        const filtered = data.filter(
          (item: RestoBusiness) =>
            item.types.includes("meal_delivery") &&
            item.types.includes("meal_takeaway")
        );
        const random = Math.floor(Math.random() * filtered.length);
        return filtered[random];
      }

      if (livraison) {
        const filtered = data.filter((item: RestoBusiness) =>
          item.types.includes("meal_delivery")
        );
        const random = Math.floor(Math.random() * filtered.length);
        return filtered[random];
      }

      if (takeout) {
        const filtered = data.filter((item: RestoBusiness) =>
          item.types.includes("meal_takeaway")
        );
        const random = Math.floor(Math.random() * filtered.length);
        return filtered[random];
      }
      const random = Math.floor(Math.random() * data.length);
      return data[random];
    } else {
      return null;
    }
  }, [data, change, livraison, takeout]);
};
