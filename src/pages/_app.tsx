import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import ResultsContext from "~/context/resultsContext";

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

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ErrorBoundary>
      <SessionProvider session={session}>
        <LocationContext>
          <ResultsContext>
            <Component {...pageProps} />
          </ResultsContext>
        </LocationContext>
      </SessionProvider>
    </ErrorBoundary>
  );
};

export default api.withTRPC(MyApp);
