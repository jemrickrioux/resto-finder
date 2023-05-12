import { BaseLayout } from "~/layouts/BaseLayout";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect } from "react";
import { Results } from "~/context/resultsContext";
import { LocationData } from "~/context/locationContext";
import ReactGA from "react-ga4";
import {
  DetailedBusinessCard,
  TinderBusinessCard,
} from "~/components/MainBusinessCard";
import { Button } from "~/components/Button";
import { AppLayout } from "~/layouts/AppLayout";
import { Loading } from "~/components/Loading";
import { useRouter } from "next/router";
import { useRedirects } from "~/hooks/useRedirects";

const Tinder: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { liked, disliked, choices, recommandation, restaurantChoice } =
    useContext(Results);

  const distance = useContext(LocationData);
  useRedirects();

  return (
    <AppLayout
      title={`Résultats | On Manges Quoi`}
      description={"Trouves ton lunch!"}
    >
      <div className={"flex w-full flex-col"}>
        {choices[0] && !recommandation && choices.length > 0 && (
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
            <p className={"text-md self-center pb-4 font-anek text-primary"}>
              {choices.length} restaurants à trier
            </p>

            <TinderBusinessCard business={choices[0]} />
          </>
        )}
        {!choices[0] && !recommandation && choices.length > 0 && <Loading />}
      </div>
    </AppLayout>
  );
};

export default Tinder;
