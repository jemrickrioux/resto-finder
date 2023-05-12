import { useContext, useEffect } from "react";
import { Results } from "~/context/resultsContext";
import { NextRouter, useRouter } from "next/router";

const pushIfNotCurrent = (router: NextRouter, path: string) => {
  if (router.pathname !== path) {
    void router.push(path);
  }
};
export const useRedirects = () => {
  const router = useRouter();
  const {
    recommandation,
    restaurantChoice,
    choices,
    findRecommandation,
    liked,
    disliked,
  } = useContext(Results);
  const totalLength = choices.length + liked.length + disliked.length;
  useEffect(() => {
    if (restaurantChoice !== undefined) {
      pushIfNotCurrent(router, "/app/restaurant");
    } else if (recommandation !== undefined) {
      pushIfNotCurrent(router, "/app/results");
    } else if (totalLength > 1) {
      pushIfNotCurrent(router, "/app/tinder");
    }
  }, []);
};
