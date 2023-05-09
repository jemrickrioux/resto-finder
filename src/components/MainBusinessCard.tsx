import {
  LinkIcon,
  PhoneIcon,
  MapPinIcon,
  StarIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
} from "@heroicons/react/24/solid";

import { api } from "~/utils/api";
import {
  SportsBarRounded,
  DeliveryDiningRounded,
  TakeoutDiningRounded,
} from "@mui/icons-material";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { RestoBusiness, RestoBusinessDetails } from "~/types/types";

const Rating = ({ rating }: { rating: number }) => {
  const stars = [...Array(Math.floor(rating)).keys()];
  return (
    <div className={"flex items-center space-x-1"}>
      {stars.map((star: number) => (
        <StarIcon key={star} className={" h-6 w-6 text-main"} />
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

export const MainBusinessCard = ({ business }: { business: RestoBusiness }) => {
  const utils = api.useContext();
  const { data: session } = useSession();

  const addPlace = api.places.addPlace.useMutation();
  const like = api.user.likePlace.useMutation({
    onSuccess: async () => {
      await utils.invalidate(undefined);
    },
  });
  const dislike = api.user.dislikePlace.useMutation({
    onSuccess: async () => {
      await utils.invalidate(undefined);
    },
  });
  const actions = api.user.actions.useQuery(business.id);
  const status = React.useMemo(() => {
    const data = actions.data;
    if (!data) return { liked: false, disliked: false };
    return {
      liked: data.map((d) => d.type).includes("LIKE"),
      disliked: data.map((d) => d.type).includes("DISLIKE"),
    };
  }, [actions.data, business]);
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
        lat: business.lat,
        lng: business.lng,
      });
    }
  }, [details.data]);

  return (
    <div
      className={
        "relative mx-4  flex flex-col justify-center rounded-lg border-2 border-primary bg-white/50 shadow-xl md:w-[600px]"
      }
    >
      <img
        src={typeof photo === "string" ? photo : photo.data}
        alt={business.name}
        className={
          "relative h-[450px] w-screen rounded-t-lg object-cover md:w-[600px]"
        }
      />
      <div className={"absolute right-4 top-4 z-10"}>
        <Badge text={business.distance.toFixed(2) + "km"} Icon={MapPinIcon} />
        {session && (
          <div className={"my-2 flex space-x-2"}>
            <HandThumbUpIcon
              className={`h-8 w-8 cursor-pointer ${
                status.liked ? "text-green-400" : "text-main"
              } hover:text-green-400`}
              onClick={() => like.mutate(business.id)}
            />
            <HandThumbDownIcon
              className={`h-8 w-8 ${
                status.disliked ? "text-secondary" : "text-main"
              } cursor-pointer  hover:text-secondary`}
              onClick={() => dislike.mutate(business.id)}
            />
          </div>
        )}
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
              {details.data && <Rating rating={details.data.ratings} />}
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
