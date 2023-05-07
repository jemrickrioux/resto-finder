import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";
import { Button } from "~/components/Button";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import ReactGA from "react-ga4";

const Home: NextPage = () => {
  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: "/",
      title: "Landing Page",
    });
  });

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-hero flex min-h-screen flex-col items-center justify-center bg-accent bg-hero-i-like-food ">
        <section
          className={"mx-4 flex flex-col items-start space-y-4  text-left"}
        >
          <h1 className="-mb-4 font-anek text-4xl font-bold uppercase  text-secondary md:text-8xl">
            {"C'est quoi qu'on mange?"}
          </h1>
          <h2 className={"font-anek text-xl text-white md:text-4xl"}>
            {
              "Parce que toi aussi t'es écouré(e) que ton/ta chum te demandes ça."
            }
          </h2>
          <div className={"flex space-x-4"}>
            <Button
              text={"Continuer en tant qu'invité"}
              size={"xs"}
              link={"/app"}
            ></Button>
            <Button
              text={"Connexion"}
              size={"xs"}
              action={() =>
                signIn("facebook", {
                  callbackUrl: "/app",
                })
              }
            ></Button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
