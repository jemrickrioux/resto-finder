import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";
import { Finder } from "~/components/Finder";
import { SkeletonFinder } from "~/components/SkeletonFinder";
import React, { useContext, useEffect, useState } from "react";
import { MainBusinessCard } from "~/components/MainBusinessCard";
import { YelpData } from "~/context/context";
import {
  ArrowPathRoundedSquareIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import { RestoBusiness } from "~/server/api/routers/places";
import { signIn, useSession } from "next-auth/react";
import { Modal } from "~/components/Modal";
import { Menu } from "~/components/Menu";
import { UserBadge } from "~/components/UserBadge";
import { ServicesFilters } from "~/components/ServicesFilters";
import { LocationData } from "~/context/locationContext";
import ReactGA from "react-ga4";

const useRandomizer = (
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

const App: NextPage = () => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [change, setChange] = useState(false);
  const { setData, data } = useContext(YelpData);
  const [livraison, setLivraison] = useState(false);
  const [takeout, setTakeout] = useState(false);
  const business = useRandomizer(data, livraison, takeout, change);
  const distance = useContext(LocationData);

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: "/app",
      title: "App",
    });
  });

  return (
    <>
      <Head>
        <title>On Mange Quoi</title>
        <meta
          name="description"
          content="Trouves un réponse à cette fameuse question"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={
          "bg-hero flex w-screen flex-col items-end bg-accent bg-hero-i-like-food"
        }
      >
        <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}></Modal>

        <div className={"flex w-screen justify-between"}>
          <div className={"group flex items-center space-x-2 pl-8 pt-8"}>
            <MapPinIcon
              className={`h-8 w-8 ${
                distance.data.error ? "text-secondary" : "text-primary"
              }
              ${distance.data.loading ? "animate-pulse" : ""}`}
            />
            <div
              onClick={() => setIsModalOpen(true)}
              className={`${
                distance.data.name
                  ? "text-primary"
                  : distance.data.error
                  ? " text-secondary"
                  : "cursor-pointer text-main underline hover:text-primary"
              }`}
            >
              {distance.data.name
                ? distance.data.name
                : session
                ? "Enregistrer le lieu"
                : distance.data.error
                ? distance.data.error
                : ""}
            </div>
          </div>
          <Menu disabled={!session}>
            <div className={"group"}>
              {session ? (
                <UserBadge user={session.user} />
              ) : (
                <p
                  className={
                    "p-4 font-anek text-xl hover:text-primary hover:underline"
                  }
                  onClick={() => void signIn("facebook")}
                >
                  Se connecter
                </p>
              )}
            </div>
          </Menu>
        </div>

        <div className=" flex min-h-screen w-screen flex-col items-center justify-center">
          <section className={"flex flex-col items-center text-center"}>
            <ServicesFilters
              livraison={livraison}
              handler={setLivraison}
              takeout={takeout}
              handler1={setTakeout}
            />
            <div className={"flex flex-col items-end"}>
              {business && (
                <>
                  <MainBusinessCard business={business} />
                  <div
                    className={
                      "flex w-full justify-between space-x-4 px-2 py-2"
                    }
                  >
                    <div
                      onClick={() => setChange(!change)}
                      className={
                        "group flex cursor-pointer items-center space-x-2 text-primary"
                      }
                    >
                      <ArrowPathRoundedSquareIcon
                        className={
                          "h-10 w-10 hover:transform group-hover:scale-110"
                        }
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
            <div>
              {!distance.data.loading && !business ? (
                <Finder openModal={setIsModalOpen} />
              ) : (
                !business && <SkeletonFinder />
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default App;
