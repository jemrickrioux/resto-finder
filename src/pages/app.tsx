import { type NextPage } from "next";
import Head from "next/head";

import { Finder } from "~/components/Finder";
import { SkeletonFinder } from "~/components/SkeletonFinder";
import React, { useContext, useEffect, useState } from "react";
import { MainBusinessCard } from "~/components/MainBusinessCard";
import { YelpData } from "~/context/resultsContext";
import {
  ArrowPathRoundedSquareIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import { signIn, useSession } from "next-auth/react";

import { Modal } from "~/components/Modal";
import { Menu } from "~/components/Menu";
import { UserBadge } from "~/components/UserBadge";
import { ServicesFilters } from "~/components/ServicesFilters";
import { LocationData } from "~/context/locationContext";
import ReactGA from "react-ga4";
import { useRandomizer } from "~/hooks/useRandomizer";
import { BaseLayout } from "~/layouts/BaseLayout";

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
    <BaseLayout
      title={"On Manges Quoi | App"}
      description={"Trouves ton lunch!"}
    >
      <>
        <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}></Modal>

        <div className={"flex w-screen justify-between pt-8"}>
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
              {distance.name
                ? distance.name
                : session
                ? "Enregistrer le lieu"
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
                    "pr-8 font-anek text-xl hover:text-primary hover:underline"
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
                  <div className={"flex w-full justify-between px-2 py-2"}>
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
              {!distance.loading && !business ? (
                <Finder openModal={setIsModalOpen} />
              ) : (
                !business && <SkeletonFinder />
              )}
            </div>
          </section>
        </div>
      </>
    </BaseLayout>
  );
};

export default App;
