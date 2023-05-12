import { BaseLayout } from "~/layouts/BaseLayout";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";
import { Results } from "~/context/resultsContext";
import { LocationData } from "~/context/locationContext";
import ReactGA from "react-ga4";
import {
  DetailedBusinessCard,
  ResultsBusinessCard,
} from "~/components/MainBusinessCard";
import { Button } from "~/components/Button";
import { AppLayout } from "~/layouts/AppLayout";
import { useRouter } from "next/router";
import { useRedirects } from "~/hooks/useRedirects";

const Result: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { choices, recommandation, restaurantChoice, liked, disliked } =
    useContext(Results);

  useRedirects();
  const totalLength = choices.length + liked.length + disliked.length;

  return (
    <AppLayout
      title={`Résultats | On Manges Quoi`}
      description={"Trouves ton lunch!"}
    >
      <div className={"w-full"}>
        {recommandation && (
          <>
            <h2
              className={
                "mb-4 self-start font-anek text-2xl font-medium uppercase text-primary"
              }
            >
              {totalLength > 1
                ? "C'est décidé, tu manges là"
                : "Bon, ben y'a juste ça... sorry"}
            </h2>
            <p
              className={
                "mb-4 self-start text-left font-anek text-xs font-light text-gray-100"
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
        )}
      </div>
    </AppLayout>
  );
};

export default Result;
