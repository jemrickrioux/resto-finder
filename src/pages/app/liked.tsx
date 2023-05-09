import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";
import { MainBusinessCard } from "~/components/MainBusinessCard";
import { calculateDistance } from "~/utils/distance";
import { useContext } from "react";
import { LocationData } from "~/context/locationContext";

const Home: NextPage = () => {
  const liked = api.user.getLiked.useQuery();
  const distance = useContext(LocationData);
  return (
    <>
      <Head>
        <title>On Mange Quoi</title>
        <meta
          name="description"
          content="Trouves un réponse à cette fameuse question"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-hero flex min-h-screen flex-col items-center justify-center bg-accent bg-hero-i-like-food ">
        <section
          className={"mx-4 flex flex-col items-start space-y-4  text-left"}
        >
          {liked.data &&
            liked.data.map((item) => {
              if (distance.coordinates.lat === null) return null;
              if (distance.coordinates.lng === null) return null;
              const businessData = {
                ...item,
                lat: item.lat!,
                lng: item.lng!,
                rating: item.ratings,
                types: item.types as string[],
                distance: calculateDistance(
                  {
                    lat: distance.coordinates.lat,
                    lng: distance.coordinates.lng,
                  },
                  { lat: item.lat!, lng: item.lng! }
                ),
              };
              return <MainBusinessCard key={item.id} business={businessData} />;
            })}
        </section>
      </main>
    </>
  );
};

export default Home;
