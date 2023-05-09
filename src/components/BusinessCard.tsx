import { PhoneIcon } from "@heroicons/react/24/solid";
import { YelpBusiness } from "~/types/types";

export const BusinessCard = ({ business }: { business: YelpBusiness }) => {
  return (
    <div
      className={
        "border-main-2 flex max-w-sm flex-col justify-center rounded-lg bg-main shadow-lg"
      }
    >
      <img
        src={business.image_url}
        alt={business.name}
        className={"relative h-[100px] w-full rounded-t-lg object-cover"}
      />

      <div
        className={
          "bold px-6 py-4 text-left font-anek text-2xl uppercase text-secondary"
        }
      >
        {business.name}
      </div>
      <div className={"flex px-6 py-4"}>
        <PhoneIcon className={"h-8 w-8 text-secondary"}></PhoneIcon>
      </div>
    </div>
  );
};
