import { NextPage } from "next";
import React, { useContext } from "react";
import { Results } from "~/context/resultsContext";
import { TinderBusinessCard } from "~/components/MainBusinessCard";
import { AppLayout } from "~/layouts/AppLayout";
import { Loading } from "~/components/Loading";
import { useRedirects } from "~/hooks/useRedirects";

const Tinder: NextPage = () => {
  const { liked, disliked, choices, recommandation, restaurantChoice } =
    useContext(Results);

  useRedirects();

  return (
    <AppLayout
      title={`Résultats | On Manges Quoi`}
      description={"Trouves ton lunch!"}
    >
      <div className={"flex w-full flex-col md:h-[600px] md:w-[800px]"}>
        {choices[0] && !recommandation && choices.length > 0 ? (
          <>
            <h2
              className={
                "self-center bg-accent font-anek text-xl text-primary md:text-4xl"
              }
            >
              {"'like' les restaurants que tu aimes"}
            </h2>
            <p
              className={
                "text-md self-center bg-accent pb-4 font-anek text-primary md:text-xl"
              }
            >
              {"Après ça on va te dire ce que tu manges!"}
            </p>
            <p
              className={
                "text-md self-center bg-accent pb-4 font-anek text-primary"
              }
            >
              <strong className={"pr-1 text-2xl"}>{choices.length}</strong>{" "}
              restaurants à trier
            </p>
            <div
              className={
                "text-md flex w-full justify-around self-center bg-accent pb-4 font-anek text-primary"
              }
            >
              <p className={"text-secondary"}>
                <strong className={"pr-1 text-xl"}>{disliked.length}</strong>
                refusé{disliked.length > 1 ? "s" : ""}
              </p>
              <p className={"text-green-300"}>
                <strong className={"pr-1 text-xl"}>{liked.length}</strong>
                aimé{liked.length > 1 ? "s" : ""}
              </p>
            </div>

            <TinderBusinessCard business={choices[0]} />
          </>
        ) : (
          <Loading />
        )}
      </div>
    </AppLayout>
  );
};

export default Tinder;
