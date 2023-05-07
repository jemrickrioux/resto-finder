import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import YelpContext from "~/context/context";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <YelpContext>
        <Component {...pageProps} />
      </YelpContext>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
