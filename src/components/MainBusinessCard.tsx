import {
  LinkIcon,
  PhoneIcon,
  MapPinIcon,
  StarIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";

import { api } from "~/utils/api";
import {
  SportsBarRounded,
  DeliveryDiningRounded,
  TakeoutDiningRounded,
  SvgIconComponent,
  Tune,
  TuneRounded,
  RestartAltRounded,
  ShuffleRounded,
  ChangeCircleRounded,
  PlusOneRounded,
} from "@mui/icons-material";
import React, { ReactNode, useContext, useEffect } from "react";
import { RestoBusiness, RestoBusinessDetails } from "~/types/types";
import { ReactComponentLike } from "prop-types";
import { Results } from "~/context/resultsContext";
import { Button } from "~/components/Button";

const IconList = ({
  number,
  type,
  Icon,
}: {
  number: number;
  type: "star" | "price";
  Icon: ReactComponentLike;
}) => {
  const stars = [...Array(Math.floor(number)).keys()];
  const maxNumber = type === "star" ? 5 : 4;
  const max = [...Array(maxNumber - stars.length).keys()];
  return (
    <div className={"flex w-max items-center space-x-1"}>
      {stars.map((star: number) => (
        <Icon key={star} className={" h-5 w-5 text-primary"} />
      ))}
      {max.map((star: number) => (
        <Icon key={star} className={" h-5 w-5 text-gray-200"} />
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
      className={`flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-4 border-primary text-primary ${
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

export const TinderBusinessCard = ({
  business,
}: {
  business: RestoBusiness;
}) => {
  const { addDisliked, addLiked } = useContext(Results);

  const handleLike = () => {
    addLiked(business);
  };
  const handleDislike = () => {
    addDisliked(business);
  };

  return (
    <div
      className={
        "flex w-full justify-between rounded-lg bg-main px-4 py-4 text-primary md:px-8 "
      }
    >
      <div className={"flex flex-col justify-center"}>
        <TinderLikeIcon type={"DISLIKE"} action={handleDislike} />
      </div>
      <div className={"flex w-full flex-col justify-center "}>
        <div
          className={
            "flex w-full items-center justify-center text-xl font-bold  md:text-3xl"
          }
        >
          {business.name}
        </div>
        <div
          className={
            "flex w-full items-center justify-center text-xl font-bold  md:text-3xl"
          }
        >
          {business.distance.toFixed(2)} km
        </div>
        <div className={"flex w-full flex-col items-center justify-center"}>
          <IconList type={"star"} number={business.rating} Icon={StarIcon} />
          <IconList
            type={"price"}
            number={business.priceLevel}
            Icon={CurrencyDollarIcon}
          />
        </div>
      </div>
      <div className={"flex flex-col justify-center"}>
        <TinderLikeIcon type={"LIKE"} action={handleLike} />
      </div>
    </div>
  );
};
const PrimaryAction = ({
  text,
  action,
  Icon = ArrowRightIcon,
}: {
  text: string;
  Icon: typeof SportsBarRounded | typeof MapPinIcon;
  action: () => void;
}) => {
  return (
    <div
      onClick={action}
      className={`col-span-2 flex items-center justify-center space-x-2 rounded-md border-2 border-primary bg-primary/80 px-2 py-2  text-main `}
    >
      <Icon className={"h-4 w-4"}></Icon>
      <h3 className={"text-md"}>{text}</h3>
    </div>
  );
};

const SecondaryAction = ({
  text,
  Icon = ArrowRightIcon,
  action,
}: {
  text: string;
  Icon: typeof SportsBarRounded | typeof MapPinIcon;
  action: () => void;
}) => {
  return (
    <div
      onClick={action}
      className={`flex cursor-pointer items-center justify-start space-x-2 px-2 py-1 text-gray-300 hover:text-primary`}
    >
      <Icon className={"h-4 w-4"}></Icon>
      <h3 className={"text-[10px]"}>{text}</h3>
    </div>
  );
};

export const ResultsBusinessCard = ({
  business,
}: {
  business: RestoBusiness;
}) => {
  const {
    resetChoices,
    isNextChoiceUsed,
    handleRestaurantSelection,
    nextChoice,
    choices,
  } = useContext(Results);
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

  return (
    <>
      <div
        className={
          "rounded-lg border-2 border-main bg-main font-anek text-primary text-primary"
        }
      >
        <img
          src={typeof photo === "string" ? photo : photo.data}
          alt={business.name}
          className={
            "relative h-[200px] w-screen rounded-t-lg object-cover md:h-[600px] md:w-[1200px]"
          }
        />
        <div
          className={
            "mt-4 flex w-full items-center px-6  text-xl font-bold md:text-3xl"
          }
        >
          {business.name}
        </div>
        <div
          className={
            "bold flex w-full flex-col justify-between space-y-2 px-6 py-4 text-left font-anek md:flex-row md:space-y-0"
          }
        >
          <div className={"mb-4 flex flex-col space-y-2"}>
            <div className={"flex space-x-2"}>
              {details.data && (
                <IconList
                  type={"star"}
                  Icon={StarIcon}
                  number={business.rating}
                />
              )}
            </div>
            {details.data && (
              <IconList
                type={"price"}
                Icon={CurrencyDollarIcon}
                number={business.priceLevel}
              />
            )}
          </div>
          <div className={""}>
            <PrimaryAction
              action={handleRestaurantSelection}
              text={"VOILÀ. Je choisis ça"}
              Icon={CheckIcon}
            />
          </div>
          <div
            className={
              "text-xs font-light text-gray-200 hover:text-primary hover:underline"
            }
          >
            {"Signaler mon mécontentement"}
          </div>
        </div>
      </div>
      <div className={"flex w-full justify-between"}>
        {!isNextChoiceUsed && choices.length > 1 && (
          <SecondaryAction
            text={"Donne moi 1 choix de plus. pls"}
            Icon={PlusOneRounded}
            action={nextChoice}
          />
        )}
        <SecondaryAction
          action={resetChoices}
          text={"Recommencer"}
          Icon={RestartAltRounded}
        />
      </div>
    </>
  );
};

export const DetailedBusinessCard = ({
  business,
}: {
  business: RestoBusiness;
}) => {
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

  return (
    <div
      className={
        "rounded-lg border-2 border-main bg-main font-anek text-primary text-primary"
      }
    >
      <img
        src={typeof photo === "string" ? photo : photo.data}
        alt={business.name}
        className={
          "relative h-[200px] w-screen rounded-t-lg object-cover md:h-[600px] md:w-[1200px]"
        }
      />
      <div
        className={
          "my-4 flex w-full items-center px-6  text-xl font-bold md:text-3xl"
        }
      >
        {business.name}
      </div>
      <div
        className={
          "bold flex w-full flex-col justify-between space-y-2 px-6 py-4 text-left font-anek md:flex-row md:space-y-0"
        }
      >
        <div>
          <div className={"flex space-x-2"}>
            {details.data && (
              <IconList
                type={"star"}
                Icon={StarIcon}
                number={business.rating}
              />
            )}
            <div className={"align-self-end text-sm"}>
              {business.numberOfRatings} avis
            </div>
          </div>
          {details.data && (
            <IconList
              type={"price"}
              Icon={CurrencyDollarIcon}
              number={business.priceLevel}
            />
          )}
        </div>
        {details.data && (
          <div className={"flex flex-col space-y-2"}>
            <div
              className={
                "flex cursor-pointer space-x-2 text-xl hover:underline"
              }
            >
              <MapPinIcon className={"h-6 w-6"} />
              <a
                target="__blank__"
                href={details.data.url}
                className={
                  "flex cursor-pointer space-x-2 text-xl hover:underline"
                }
              >
                {business.address}
              </a>
            </div>
            <div
              className={"items center flex w-full space-x-2 md:justify-end"}
            >
              <a target={"__blank__"} href={details.data.website}>
                <LinkIcon
                  className={"h-8 w-8 cursor-pointer hover:text-secondary"}
                ></LinkIcon>
              </a>
              {details.data.phone && (
                <a href={`tel:${details.data.phone}`}>
                  <PhoneIcon
                    className={"h-8 w-8 cursor-pointer hover:text-secondary"}
                  ></PhoneIcon>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
