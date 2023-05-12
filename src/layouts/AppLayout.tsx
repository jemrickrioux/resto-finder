import React, { useContext, useEffect } from "react";
import Head from "next/head";
import { LocationData } from "~/context/locationContext";
import { HelloBar } from "~/components/HelloBar";
import { Menu } from "~/components/Menu";
import { UserBadge } from "~/components/UserBadge";
import { signIn, useSession } from "next-auth/react";
import ReactGA from "react-ga4";
import { Results } from "~/context/resultsContext";
import { Button } from "~/components/Button";

const AppBar = () => {
  const { data: session } = useSession();
  return (
    <div className={"flex w-full justify-center py-1"}>
      <div className={"flex w-screen justify-between"}>
        <Menu disabled={!session}>
          <div className={"group"}>
            {session ? (
              <UserBadge user={session.user} />
            ) : (
              <p
                className={
                  "font-anek text-xl hover:text-primary hover:underline"
                }
                onClick={() => void signIn("facebook")}
              >
                Se connecter
              </p>
            )}
          </div>
        </Menu>
      </div>
    </div>
  );
};

const State = ({
  text,
  label,
}: {
  label: string;
  text: string | boolean | number;
}) => {
  if (typeof text === "boolean") {
    text = text ? "Oui" : "Non";
  }
  return (
    <div className={"flex space-x-2"}>
      <div className={"text-gray-400"}>{label}</div>
      <div className={"text-white"}>{text}</div>
    </div>
  );
};
export const AppLayout = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: "/app",
      title,
    });
  }, []);
  const distance = useContext(LocationData);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={
          "bg-hero flex h-screen w-full flex-col justify-start space-y-8 overflow-y-hidden bg-accent px-4 bg-hero-i-like-food"
        }
      >
        {distance.error && <HelloBar message={distance.error} />}
        <AppBar />

        {children}
      </div>
    </>
  );
};
