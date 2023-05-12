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
import { useRedirects } from "~/hooks/useRedirects";

const Restaurant: NextPage = () => {
  const { restaurantChoice } = useContext(Results);

  useRedirects();

  return (
    <AppLayout
      title={`Résultats | On Manges Quoi`}
      description={"Trouves ton lunch!"}
    >
      <div className={"flex w-full flex-col"}>
        <h2
          className={
            "mb-4 self-start font-anek text-2xl font-medium uppercase text-primary"
          }
        >
          {"C'est là que notre aventure se termine comrad..."}
        </h2>
        <p
          className={
            "mb-4 self-start text-left font-anek text-xs font-light text-gray-100"
          }
        >
          Merci pour tout!
        </p>
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
