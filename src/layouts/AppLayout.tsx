import React, { useContext } from "react";
import Head from "next/head";
import { LocationData } from "~/context/locationContext";
import { HelloBar } from "~/components/HelloBar";
import { Menu } from "~/components/Menu";
import { UserBadge } from "~/components/UserBadge";
import { signIn, useSession } from "next-auth/react";

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
export const AppLayout = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  const { error } = useContext(LocationData);
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={
          "bg-hero flex h-screen w-full flex-col justify-start overflow-y-hidden bg-accent px-4 bg-hero-i-like-food"
        }
      >
        {error && <HelloBar message={error} />}
        <AppBar />
        {children}
      </div>
    </>
  );
};
