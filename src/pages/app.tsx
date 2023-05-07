import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";
import { Button } from "~/components/Button";
import { Finder } from "~/components/Finder";
import React, { useContext, useState } from "react";
import { MainBusinessCard } from "~/components/MainBusinessCard";
import { ToggleInput } from "~/components/form/ToggleInput";
import { YelpData } from "~/context/context";
import {
  ArrowPathRoundedSquareIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/solid";
import { RestoBusiness } from "~/server/api/routers/places";
import {
  DeliveryDiningRounded,
  TakeoutDiningRounded,
} from "@mui/icons-material";

const Home: NextPage = () => {
  //const restaurants = api.yelp.restaurant.useQuery();
  const [change, setChange] = useState(false);
  const { setData, data } = useContext(YelpData);
  const [livraison, setLivraison] = useState(false);
  const [takeout, setTakeout] = useState(false);
  const business = React.useMemo(() => {
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
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-hero flex min-h-screen w-screen flex-col items-center justify-center bg-accent bg-hero-i-like-food">
        <section className={"flex flex-col items-center text-center"}>
          <div className={"flex w-screen justify-between md:w-full "}>
            <div className={"flex w-max items-center space-x-2"}>
              <DeliveryDiningRounded
                fontSize={"large"}
                className={livraison ? "text-primary" : "text-gray-200"}
              ></DeliveryDiningRounded>
              <ToggleInput
                handler={setLivraison}
                value={livraison}
              ></ToggleInput>
            </div>
            <div className={"flex items-center space-x-2"}>
              <ToggleInput handler={setTakeout} value={takeout}></ToggleInput>
              <TakeoutDiningRounded
                fontSize={"large"}
                className={` transition ease-in-out ${
                  takeout ? "text-primary" : "text-gray-200"
                }`}
              ></TakeoutDiningRounded>
            </div>
          </div>
          <div className={"flex flex-col items-end"}>
            {business && (
              <>
                <MainBusinessCard business={business} />
                <div
                  className={"flex w-full justify-between space-x-4 px-2 py-2"}
                >
                  <div
                    onClick={() => setChange(!change)}
                    className={
                      "flex cursor-pointer items-center space-x-2 text-primary"
                    }
                  >
                    <ArrowPathRoundedSquareIcon
                      className={"h-10 w-10 hover:scale-110 hover:transform"}
                    />
                    <p className={"font-anek text-primary"}>Bof</p>
                  </div>

                  <div
                    onClick={() => setData([])}
                    className={
                      "text-md h-full cursor-pointer items-center font-anek text-secondary transition hover:underline"
                    }
                  >
                    Recommencer
                  </div>
                </div>
              </>
            )}
          </div>
          <div>{!business && <Finder />}</div>
        </section>
      </main>
    </>
  );
};

export default Home;