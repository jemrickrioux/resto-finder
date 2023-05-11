import { BaseLayout } from "~/layouts/BaseLayout";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";
import { Results } from "~/context/resultsContext";
import { LocationData } from "~/context/locationContext";
import ReactGA from "react-ga4";
import { DetailedBusinessCard } from "~/components/MainBusinessCard";
import { Button } from "~/components/Button";
import { AppLayout } from "~/layouts/AppLayout";

const Restaurant: NextPage = () => {
  const { data: session } = useSession();
  const {
    nextChoice,
    choices,
    current,
    recommandation,
    isNextChoiceUsed,
    restaurantChoice,
    resetChoices,
    reset,
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
      title={`Résultats | On Manges Quoi`}
      description={"Trouves ton lunch!"}
    >
      <div className={"flex w-full flex-col"}>
        {restaurantChoice && (
          <DetailedBusinessCard business={restaurantChoice} />
        )}
        {!restaurantChoice && (
          <div className={"flex flex-col space-y-2"}>
            <h1
              className={
                "font-anek text-2xl font-medium uppercase text-primary"
              }
            >
              {"Pauvre ti-pou... t'es perdu"}
            </h1>
            <Button text={"Revenir en lieu sûr!"} size={"sm"} link={"/app"} />
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Restaurant;
