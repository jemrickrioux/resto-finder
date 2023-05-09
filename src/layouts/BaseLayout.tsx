import React, { useContext } from "react";
import Head from "next/head";
import { LocationData } from "~/context/locationContext";
import { HelloBar } from "~/components/HelloBar";

export const BaseLayout = ({
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
      <div className={"flex flex-col overflow-y-hidden"}>
        {error && <HelloBar message={error} />}
        <main
          className={`bg-hero flex h-full min-h-screen flex-col items-center justify-center bg-accent bg-hero-i-like-food `}
        >
          {children}
        </main>
      </div>
    </>
  );
};
