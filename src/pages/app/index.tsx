import { type NextPage } from "next";
import Head from "next/head";

import { Finder } from "~/components/Finder";
import { SkeletonFinder } from "~/components/SkeletonFinder";
import React, { useContext, useEffect, useState } from "react";
import {
  MainBusinessCard,
  MainBusinessCard1,
  ResultsBusinessCard,
} from "~/components/MainBusinessCard";
import { Results } from "~/context/resultsContext";
import {
  ArrowPathRoundedSquareIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import { signIn, useSession } from "next-auth/react";

import { Modal } from "~/components/Modal";
import { Menu } from "~/components/Menu";
import { UserBadge } from "~/components/UserBadge";
import { ServicesFilters } from "~/components/ServicesFilters";
import LocationContext, { LocationData } from "~/context/locationContext";
import ReactGA from "react-ga4";
import { useRandomizer } from "~/hooks/useRandomizer";
import { BaseLayout } from "~/layouts/BaseLayout";
import { LocationState } from "~/types/types";
import { LocationIndicator } from "~/components/LocationIndicator";
import { Button } from "~/components/Button";

const Index: NextPage = () => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [change, setChange] = useState(false);
  const {
    setChoices,
    nextChoice,
    choices,
    current,
    recommandation,
    isNextChoiceUsed,
    resetChoices,
    reset,
    left,
  } = useContext(Results);
  const [livraison, setLivraison] = useState(false);
  const [takeout, setTakeout] = useState(false);
  const business = useRandomizer(choices, livraison, takeout, change);
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
          <LocationIndicator
            distance={distance}
            setIsModalOpen={setIsModalOpen}
          />
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

        <div className=" flex min-h-screen w-full flex-col items-center justify-center">
          <section
            className={
              "flex w-full flex-col items-center text-center md:w-[800px]"
            }
          >
            <div className={"flex w-full flex-col items-end"}>
              {current && !recommandation && (
                <>
                  <h2
                    className={
                      "self-center font-anek text-xl text-primary md:text-4xl"
                    }
                  >
                    {"'like' les restaurants que tu aimes"}
                  </h2>
                  <p
                    className={
                      "text-md self-center pb-4 font-anek text-primary md:text-xl"
                    }
                  >
                    {"Après ça on va te dire ce que tu manges!"}
                  </p>
                  <p
                    className={
                      "text-md self-center pb-4 font-anek text-primary"
                    }
                  >
                    {left} restaurants à trier
                  </p>
                  <MainBusinessCard business={current} />
                </>
              )}
              {recommandation && (
                <>
                  <h2
                    className={
                      "mb-4 self-start font-anek text-2xl text-primary"
                    }
                  >
                    {"C'est décidé, tu manges là"}
                  </h2>
                  <ResultsBusinessCard business={recommandation} />
                  <div className={"flex w-full justify-between px-2 py-2"}>
                    {!isNextChoiceUsed && (
                      <div
                        onClick={nextChoice}
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
                    )}

                    <div
                      onClick={() => {
                        reset();
                      }}
                      className={
                        "text-md h-full cursor-pointer items-center font-anek text-secondary transition hover:underline"
                      }
                    >
                      Faire un nouveau tri
                    </div>
                  </div>
                </>
              )}
              {business && (
                <div
                  onClick={() => {
                    resetChoices();
                  }}
                  className={
                    "text-md h-full cursor-pointer items-center font-anek text-secondary transition hover:underline"
                  }
                >
                  Recommencer du début
                </div>
              )}
            </div>
            <div className={"w-full"}>
              {!distance.loading && !business ? (
                <Finder />
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

export default Index;
