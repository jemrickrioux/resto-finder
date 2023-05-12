import { NextPage } from "next";
import { useSession } from "next-auth/react";
import React, { useContext } from "react";
import { Results } from "~/context/resultsContext";
import { ResultsBusinessCard } from "~/components/MainBusinessCard";
import { AppLayout } from "~/layouts/AppLayout";
import { useRouter } from "next/router";
import { useRedirects } from "~/hooks/useRedirects";
import { Loading } from "~/components/Loading";

const Result: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { choices, recommandation, liked, disliked } = useContext(Results);

  useRedirects();
  const totalLength = choices.length + liked.length + disliked.length;

  return (
    <AppLayout
      title={`Résultats | On Manges Quoi`}
      description={"Trouves ton lunch!"}
    >
      <div className={"flex flex-col items-center md:w-full lg:w-max"}>
        {recommandation ? (
          <>
            <h2
              className={
                "mb-4 self-start bg-accent font-anek text-2xl font-medium uppercase text-primary md:text-4xl"
              }
            >
              {totalLength > 1
                ? "C'est décidé, tu manges là"
                : "Bon, ben y'a juste ça... sorry"}
            </h2>
            <p
              className={
                "mb-4 self-start bg-accent text-left font-anek text-xs font-light text-gray-100 md:text-lg"
              }
            >
              Choisi ce restaurant pour avoir ses informations.
              <br />
              Tu as droit à <strong>(1) une seule</strong> recommandation
              supplémentaire.
              <br />
              <strong>Recommencer</strong> te ramène au début. Viens-pas
              brailler que tu dois <strong>rEcOmmAnCé</strong>.
            </p>

            <ResultsBusinessCard business={recommandation} />
          </>
        ) : (
          <Loading />
        )}
      </div>
    </AppLayout>
  );
};

export default Result;
