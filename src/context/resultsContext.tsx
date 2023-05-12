import { createContext, useEffect, useState } from "react";
import { RestoBusiness } from "~/types/types";
import _ from "lodash";
import { useRouter } from "next/router";
import useLocalStorage from "~/hooks/useLocalStorage";

type ResultsContextType = {
  choices: RestoBusiness[];
  liked: RestoBusiness[];
  disliked: RestoBusiness[];
  handleChoices: (choices: RestoBusiness[]) => void;
  addLiked: (resto: RestoBusiness) => void;
  addDisliked: (resto: RestoBusiness) => void;
  current: RestoBusiness | undefined;
  restaurantChoice: RestoBusiness | undefined;
  recommandation: RestoBusiness | undefined;
  left: number;
  resetChoices: () => void;
  isNextChoiceUsed: boolean;
  nextChoice: () => void;
  findRecommandation: () => void;
  handleRestaurantSelection: () => void;
  reset: () => void;
};

export const Results = createContext(
  {} as {
    choices: RestoBusiness[];
    liked: RestoBusiness[];
    disliked: RestoBusiness[];
    restaurantChoice?: RestoBusiness;
    handleChoices: (choices: RestoBusiness[]) => void;
    handleLike: (type: "LIKE" | "DISLIKE") => void;
    recommandation?: RestoBusiness;
    reset: () => void;
    findRecommandation: () => void;
    resetChoices: () => void;
    isNextChoiceUsed: boolean;
    nextChoice: () => void;
    handleRestaurantSelection: () => void;
  }
);

type ResultsData = {
  choices: RestoBusiness[];
  liked: RestoBusiness[];
  disliked: RestoBusiness[];
  restaurantChoice: RestoBusiness | undefined;
  recommandation: RestoBusiness | undefined;
  isNextChoiceUsed: boolean;
};

const ResultsContext = (props: { children: React.ReactNode }) => {
  const [choices, setChoices] = useLocalStorage<RestoBusiness[]>(
    "choices",
    [] as RestoBusiness[]
  );
  const [liked, setLiked] = useLocalStorage<RestoBusiness[]>(
    "liked",
    [] as RestoBusiness[]
  );
  const [disliked, setDisliked] = useLocalStorage<RestoBusiness[]>(
    "disliked",
    [] as RestoBusiness[]
  );
  const [isNextChoiceUsed, setIsNextChoiceUsed] = useLocalStorage<boolean>(
    "isNextChoiceUsed",
    false
  );
  const [recommandation, setRecommandation] = useLocalStorage<
    RestoBusiness | undefined
  >("recommandation", undefined);

  const [restaurantChoice, setRestaurantChoice] = useLocalStorage<
    RestoBusiness | undefined
  >("restaurantChoice", undefined);

  const router = useRouter();

  const findRecommandation = () => {
    const random = _.random(liked.length - 1);
    console.log(`Random: ${random}
    Length: ${liked.length}`);
    if (liked[random] === undefined) return;
    setRecommandation(liked[random]);
    void router.push("/app/results");
  };

  const handleLike = (type: "LIKE" | "DISLIKE") => {
    const current = choices[0] as RestoBusiness;

    setChoices((choices) => choices.slice(1));
    if (type === "LIKE") {
      gtag("event", "like", {
        event_category: "restaurants",
        event_label: current.name,
      });
      setLiked((liked) => [...liked, current]);
    }
    if (type === "DISLIKE") {
      gtag("event", "dislike", {
        event_category: "restaurants",
        event_label: current.name,
      });
      setDisliked((disliked) => [...disliked, current]);
    }
    if (choices.length === 1) {
      findRecommandation();
    }
  };

  const reset = () => {
    setLiked([]);
    setDisliked([]);
    setRecommandation(undefined);
    setRestaurantChoice(undefined);
    setIsNextChoiceUsed(false);
  };

  const resetChoices = () => {
    reset();
    setChoices([]);
    setLiked([]);
    setDisliked([]);
    void router.push("/app");
  };

  const nextChoice = () => {
    findRecommandation();
    setRestaurantChoice(undefined);
    setIsNextChoiceUsed(true);
  };

  const handleRestaurantSelection = () => {
    if (!recommandation) return;
    setRestaurantChoice(recommandation);
    void router.push("/app/restaurant");
  };

  const handleChoices = (choices: RestoBusiness[]) => {
    if (choices.length === 0) {
      return;
    } else if (choices.length === 1) {
      setChoices(choices);
      setRecommandation(choices[0]);
    } else {
      setChoices(choices);
    }
  };

  return (
    <Results.Provider
      value={{
        choices,
        findRecommandation,
        handleChoices,
        restaurantChoice,
        isNextChoiceUsed,
        handleRestaurantSelection,
        handleLike,
        liked,
        reset,
        nextChoice,
        disliked,
        recommandation,
        resetChoices,
      }}
    >
      {props.children}
    </Results.Provider>
  );
};

export default ResultsContext;
