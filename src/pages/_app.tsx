import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import YelpContext from "~/context/context";

import { api } from "~/utils/api";

import ReactGA from "react-ga4";

ReactGA.initialize(process.env.NEXT_PUBLIC_GA4_ID!);

import "~/styles/globals.css";
import LocationContext, { LocationData } from "~/context/locationContext";
import { ReactNode, useContext, useEffect, useState } from "react";
import { calculateDistance } from "~/utils/distance";
import React from "react";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";

Bugsnag.start({
  apiKey: process.env.NEXT_PUBLIC_BUGSNAG_API_KEY!,
  plugins: [new BugsnagPluginReact()],
});
const ErrorBoundary = Bugsnag.getPlugin("react")!.createErrorBoundary(React);

const useGeoLocation = () => {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if ("geolocation" in navigator) {
      setLoading(true);
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const { latitude, longitude } = coords;

          setLatitude(latitude);
          setLongitude(longitude);
          setLoading(false);
          setError(null);
        },
        () => {
          setLoading(false);
          setError("Impossible d'accéder à votre emplacement");
        }
      );
    }
  }, []);
  return {
    latitude,
    longitude,
    error,
    loading,
  };
};

const Global = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const distance = useContext(LocationData);
  const favorite = api.user.getFavoriteAddress.useQuery(undefined, {
    enabled: session?.user !== null,
  });
  const { latitude, longitude, error, loading } = useGeoLocation();
  useEffect(() => {
    distance.setError(error);
    distance.setLoading(loading);
    if (latitude && longitude) {
      distance.setCoordinates(latitude, longitude);
    }
    if (favorite.data !== undefined && favorite.data !== null) {
      if (latitude && longitude) {
        const theDistance = calculateDistance(
          { lat: latitude, lng: longitude },
          { lat: favorite.data.lat, lng: favorite.data.lng }
        );
        if (theDistance > 0 && theDistance < 0.5) {
          distance.setCoordinates(favorite.data.lat, favorite.data.lng);
          distance.setName(favorite.data.name);
          distance.setSaved(true);
        }
      }
    }
  }, [favorite.data, loading]);

  return <div>{children}</div>;
};
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ErrorBoundary>
      <SessionProvider session={session}>
        <LocationContext>
          <YelpContext>
            <Global>
              <Component {...pageProps} />
            </Global>
          </YelpContext>
        </LocationContext>
      </SessionProvider>
    </ErrorBoundary>
  );
};

export default api.withTRPC(MyApp);
