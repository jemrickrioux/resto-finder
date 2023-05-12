import { BaseLayout } from "~/layouts/BaseLayout";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";
import { Results } from "~/context/resultsContext";
import { LocationData } from "~/context/locationContext";
import ReactGA from "react-ga4";
import { DetailedBusinessCard } from "~/components/MainBusinessCard";
import { AppLayout } from "~/layouts/AppLayout";
import { useRedirects } from "~/hooks/useRedirects";
import { Loading } from "~/components/Loading";

const Restaurant: NextPage = () => {
  const { restaurantChoice } = useContext(Results);

  useRedirects();

  return (
    <AppLayout
      title={`Résultats | On Manges Quoi`}
      description={"Trouves ton lunch!"}
    >
      <div className={"flex w-full flex-col"}>
        {restaurantChoice ? (
          <>
            <h2
              className={
                "mb-4 self-start bg-accent font-anek text-2xl font-medium uppercase text-primary md:text-4xl"
              }
            >
              {"Voilà mon chou."}
            </h2>
            <p
              className={
                "md:text-md mb-4 self-start bg-accent text-left font-anek text-xs font-light text-gray-100"
              }
            >
              {
                "Tu as maintenant les informations de contact. Tu peux les appeler, aller sur leur site ou même te pointer directement. T'es autonome... tu peux maintenant voler de tes propres ailes. "
              }
            </p>
            <p
              className={
                "mb-4 self-start bg-accent text-left font-anek text-xs font-light text-gray-100"
              }
            >
              {"Bisous."}
            </p>
            <DetailedBusinessCard business={restaurantChoice} />
          </>
        ) : (
          <Loading />
        )}
      </div>
    </AppLayout>
  );
};

export default Restaurant;
