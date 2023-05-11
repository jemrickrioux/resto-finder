import { type NextPage } from "next";
import Head from "next/head";

import { Finder } from "~/components/Finder";
import { SkeletonFinder } from "~/components/SkeletonFinder";
import React, { useContext, useEffect, useState } from "react";
import {
  ResultsBusinessCard,
  DetailedBusinessCard,
  TinderBusinessCard,
} from "~/components/MainBusinessCard";
import { Results } from "~/context/resultsContext";
import { ArrowPathRoundedSquareIcon } from "@heroicons/react/24/solid";
import { signIn, useSession } from "next-auth/react";

import { Modal } from "~/components/Modal";
import { Menu } from "~/components/Menu";
import { UserBadge } from "~/components/UserBadge";
import LocationContext, { LocationData } from "~/context/locationContext";
import ReactGA from "react-ga4";
import { BaseLayout } from "~/layouts/BaseLayout";
import { LocationIndicator } from "~/components/LocationIndicator";
import { AppLayout } from "~/layouts/AppLayout";

const Index: NextPage = () => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    nextChoice,
    choices,
    current,
    recommandation,
    isNextChoiceUsed,
    resetChoices,
    reset,
    left,
  } = useContext(Results);

  const distance = useContext(LocationData);

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: "/app",
      title: "App",
    });
  });

  return (
    <AppLayout
      title={"On Manges Quoi | App"}
      description={"Trouves ton lunch!"}
    >
      <>
        <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}></Modal>

        <div className=" flex h-full w-full flex-col">
          <section
            className={
              "flex w-full flex-col items-center text-center md:w-[800px]"
            }
          >
            <div className={"w-full"}>
              {distance.loading && <SkeletonFinder />}
              {!distance.loading && choices.length === 0 && <Finder />}
            </div>
          </section>
        </div>
      </>
    </AppLayout>
  );
};

export default Index;
