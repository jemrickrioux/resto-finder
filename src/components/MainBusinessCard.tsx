import { YelpBusiness } from "~/server/api/routers/yelp";
import { LinkIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/solid";
import {
  RestoBusiness,
  RestoBusinessDetails,
} from "~/server/api/routers/places";
import { api } from "~/utils/api";
import {
  SportsBarRounded,
  WineBarRounded,
  DeliveryDiningRounded,
  TakeoutDiningRounded,
} from "@mui/icons-material";
import { PlaceDetailsResponse } from "@googlemaps/google-maps-services-js";

const YelpBadge = ({ text }: { text: string }) => {
  return (
    <div
      className={
        "w-max rounded-sm bg-primary px-2 py-1 text-xs font-bold uppercase text-main"
      }
    >
      {text}
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
  const photo = business.image
    ? api.places.photo.useQuery(business.image, {
        refetchOnWindowFocus: false,
        refetchInterval: false,
        staleTime: Infinity,
      })
    : "https://picsum.photos/600/250";

  return (
    <div
      className={
        "relative flex  flex-col justify-center rounded-lg border-2 border-primary bg-white/50 shadow-xl md:w-[600px]"
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
            "bold flex w-full justify-between bg-primary/90 px-6 py-4 text-left font-anek uppercase text-secondary"
          }
        >
          <div>
            <div
              className={
                "flex w-max max-w-sm items-center justify-center text-xl font-bold text-main md:text-3xl"
              }
            >
              {business.name}
            </div>
          </div>
          <div className={"items center flex w-full justify-end space-x-2"}>
            <a href={business.website}>
              <LinkIcon
                className={
                  "h-8 w-8 cursor-pointer text-main hover:text-secondary"
                }
              ></LinkIcon>
            </a>
            <a href={`tel:${business.phone}`}>
              <PhoneIcon
                className={
                  "h-8 w-8 cursor-pointer text-main hover:text-secondary"
                }
              ></PhoneIcon>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MainYelpBusinessCard = ({
  business,
}: {
  business: YelpBusiness;
}) => {
  return (
    <div
      className={
        "relative flex w-[600px] flex-col justify-center rounded-lg border-2 border-primary bg-main shadow-xl"
      }
    >
      <div
        className={
          "absolute right-4 top-4 z-10 flex space-x-1 rounded-sm bg-light px-2 py-1 font-anek text-sm font-bold"
        }
      >
        <MapPinIcon className={"h-4 w-4 text-accent"}></MapPinIcon>
        <div>{(business.distance / 1000).toFixed(2)} km</div>
      </div>
      <div className={"absolute left-4 top-4 z-10 space-y-1 rounded-md"}>
        {business.categories.map((category) => (
          <YelpBadge key={category.alias} text={category.title}></YelpBadge>
        ))}
      </div>
      <img
        src={business.image_url}
        alt={business.name}
        className={"relative h-[250px] w-full rounded-t-lg object-cover"}
      />

      <div
        className={
          "bold flex w-full justify-between px-6 py-4 text-left font-anek uppercase text-secondary"
        }
      >
        <div>
          <div className={"py-2 text-3xl font-bold"}>{business.name}</div>
          <div className={"flex flex-row space-x-1"}>
            {business.categories.map((category) => (
              <YelpBadge key={category.alias} text={category.title}></YelpBadge>
            ))}
          </div>
        </div>
        <div className={"flex items-center space-x-4 px-6 py-4"}>
          <a href={business.url}>
            <LinkIcon className={"h-8 w-8 text-light"}></LinkIcon>
          </a>
          <a href={`tel:${business.phone}`}>
            <PhoneIcon className={"h-8 w-8 text-light"}></PhoneIcon>
          </a>
        </div>
      </div>
    </div>
  );
};