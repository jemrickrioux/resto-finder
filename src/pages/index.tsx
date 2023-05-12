import { type NextPage } from "next";
import { Button } from "~/components/Button";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { BaseLayout } from "~/layouts/BaseLayout";
import Link from "next/link";

const Home: NextPage = () => {
  const { data: session } = useSession();

  return (
    <BaseLayout title={"On Mange Quoi"} description={"Manges quoi?"}>
      <div className={"mx-4 flex flex-col justify-between space-y-10 "}>
        <section className={"flex flex-col items-start space-y-4 text-left"}>
          <h1 className="-mb-4 font-anek text-4xl font-bold uppercase  text-secondary md:text-8xl">
            {"C'est quoi qu'on mange?"}
          </h1>
          <h2 className={"font-anek text-xl text-white md:text-4xl"}>
            {
              "Parce que toi aussi t'es écœuré(e) que ton/ta chum te demande ça."
            }
          </h2>
          <div
            className={
              "flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0"
            }
          >
            <Button
              text={session ? "Continuer" : "Se connecter avec Facebook"}
              size={"xs"}
              action={() =>
                signIn("facebook", {
                  callbackUrl: "/app",
                  success: () => {
                    gtag("event", "sign_in", {
                      event_category: "restaurants",
                      event_label: "success",
                    });
                  },
                })
              }
            ></Button>
          </div>
        </section>
        {!session && (
          <Link href={"/app"}>
            <div
              className={"font-anek text-sm text-primary underline md:text-xs"}
            >
              Je veux accéder y accéder <strong>sans me connecter</strong> même
              si les fonctionnalités vont être <strong>limitées</strong>.
            </div>
          </Link>
        )}
      </div>
    </BaseLayout>
  );
};

export default Home;
