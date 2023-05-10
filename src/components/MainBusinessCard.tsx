import {
  LinkIcon,
  PhoneIcon,
  MapPinIcon,
  StarIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/solid";

import { api } from "~/utils/api";
import {
  SportsBarRounded,
  DeliveryDiningRounded,
  TakeoutDiningRounded,
  SvgIconComponent,
} from "@mui/icons-material";
import React, { ReactNode, useContext, useEffect } from "react";
import { useSession } from "next-auth/react";
import { RestoBusiness, RestoBusinessDetails } from "~/types/types";
import { ReactComponentLike } from "prop-types";
import LocationContext, { LocationData } from "~/context/locationContext";
import { Results } from "~/context/resultsContext";

const IconList = ({
  number,
  Icon,
}: {
  number: number;
  Icon: ReactComponentLike;
}) => {
  const stars = [...Array(Math.floor(number)).keys()];
  return (
    <div className={"flex w-max items-center space-x-1"}>
      {stars.map((star: number) => (
        <Icon key={star} className={" h-6 w-6 text-main"} />
      ))}
    </div>
  );
};

const Badge = ({
  text,
  Icon,
}: {
  text: string;
  Icon: typeof SportsBarRounded | typeof MapPinIcon;
}) => {
  return (
    <div
      className={
        "flex w-max items-center space-x-1 rounded-sm bg-primary px-2 py-1 text-xs font-bold uppercase text-main"
      }
    >
      <Icon className={"h-4 w-4 text-accent"}></Icon>
      <div>{text}</div>
    </div>
  );
};

const BadgeList = ({ business }: { business: RestoBusiness }) => {
  return (
    <div className={"flex flex-col items-start space-y-1"}>
      {business.types.includes("meal_takeaway") && (
        <Badge text={"Takeout"} Icon={TakeoutDiningRounded} />
      )}

      {business.types.includes("meal_delivery") && (
        <Badge text={"Livraison"} Icon={DeliveryDiningRounded} />
      )}
    </div>
  );
};

const TinderLikeIcon = ({
  type,
  action,
}: {
  type: "LIKE" | "DISLIKE";
  action: () => void;
}) => {
  return (
    <div
      onClick={action}
      className={`flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-4 border-main text-main ${
        type === "LIKE" ? "hover:border-green-300" : "hover:border-secondary"
      } hover:text-secondary`}
    >
      {type === "LIKE" ? (
        <HandThumbUpIcon className={"h-10 w-10 hover:text-green-300"} />
      ) : (
        <HandThumbDownIcon className={"h-10 w-10 hover:text-secondary"} />
      )}
    </div>
  );
};

export const MainBusinessCard = ({ business }: { business: RestoBusiness }) => {
  const { addDisliked, addLiked } = useContext(Results);

  const handleLike = () => {
    addLiked(business);
  };
  const handleDislike = () => {
    addDisliked(business);
  };

  return (
    <div className={"flex w-full justify-between bg-primary px-4"}>
      <div className={"flex flex-col justify-center"}>
        <TinderLikeIcon type={"DISLIKE"} action={handleLike} />
      </div>
      <div className={"flex w-full flex-col justify-center "}>
        <div
          className={
            "flex w-full items-center justify-center text-xl font-bold text-main md:text-3xl"
          }
        >
          {business.name}
        </div>
        <div
          className={
            "flex w-full items-center justify-center text-xl font-bold text-main md:text-3xl"
          }
        >
          {business.distance.toFixed(2)} km
        </div>
        <div className={"flex w-full flex-col items-center justify-center"}>
          <IconList number={business.rating} Icon={StarIcon} />
          <IconList number={business.priceLevel} Icon={CurrencyDollarIcon} />
        </div>
        <BadgeList business={business} />
      </div>
      <div className={"flex flex-col justify-center"}>
        <TinderLikeIcon type={"LIKE"} action={handleDislike} />
      </div>
    </div>
  );
};
export const MainBusinessCard1 = ({
  business,
}: {
  business: RestoBusiness;
}) => {
  const addPlace = api.places.addPlace.useMutation();

  const photo = business.image
    ? api.places.photo.useQuery(business.image, {
        refetchOnWindowFocus: false,
        refetchInterval: false,
        staleTime: Infinity,
      })
    : "https://picsum.photos/600/250";

  const details = api.places.details.useQuery<RestoBusinessDetails>(
    business.id,
    {
      refetchOnWindowFocus: false,
      refetchInterval: false,
      staleTime: Infinity,
    }
  );
  useEffect(() => {
    if (details.data) {
      const { id, ...restBusiness } = business;
      addPlace.mutate({
        ...restBusiness,
        ...details.data,
        googlePlaceId: business.id,
        lat: business.coordinates.lat,
        lng: business.coordinates.lng,
      });
    }
  }, [details.data]);

  return (
    <div
      className={
        "relative mx-4  flex flex-col justify-center rounded-lg border-2 border-primary bg-white/50 shadow-xl md:w-[1200px]"
      }
    >
      <img
        src={typeof photo === "string" ? photo : photo.data}
        alt={business.name}
        className={
          "relative h-[450px] w-screen rounded-t-lg object-cover md:h-[600px] md:w-[1200px]"
        }
      />
      <div className={"absolute right-4 top-4 z-10"}>
        <Badge text={business.distance.toFixed(2) + "km"} Icon={MapPinIcon} />
      </div>
      <div
        className={
          "absolute left-4 top-4 z-10 space-y-1 rounded-md font-anek text-sm font-bold"
        }
      >
        <BadgeList business={business} />
      </div>
      <div className={"absolute bottom-0 left-0 right-0 z-10"}>
        <div
          className={
            "bold flex w-full justify-between bg-primary px-6 py-4 text-left font-anek uppercase text-secondary"
          }
        >
          <div>
            <div
              className={
                "flex w-full items-center justify-center overflow-hidden text-ellipsis text-xl font-bold text-main md:text-3xl"
              }
            >
              {business.name}
            </div>
            <div>
              {details.data && (
                <IconList Icon={StarIcon} number={details.data.ratings} />
              )}
            </div>
          </div>
          {details.data && (
            <div className={"flex flex-col"}>
              <div className={"items center flex w-full justify-end space-x-2"}>
                <a target={"__blank__"} href={details.data.website}>
                  <LinkIcon
                    className={
                      "h-8 w-8 cursor-pointer text-main hover:text-secondary"
                    }
                  ></LinkIcon>
                </a>
                <a href={`tel:${details.data.phone}`}>
                  <PhoneIcon
                    className={
                      "h-8 w-8 cursor-pointer text-main hover:text-secondary"
                    }
                  ></PhoneIcon>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
