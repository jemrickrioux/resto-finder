import { createContext, useEffect, useState } from "react";
import { RestoBusiness } from "~/types/types";
import _ from "lodash";
import { router } from "next/client";
import { useRouter } from "next/router";
import useLocalStorage from "uselocalstoragenextjs";

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
  handleRestaurantSelection: () => void;
  reset: () => void;
};

export const Results = createContext(
  {} as {
    choices: RestoBusiness[];
    liked: RestoBusiness[];
    disliked: RestoBusiness[];
    restaurantChoice: RestoBusiness | undefined;
    handleChoices: (choices: RestoBusiness[]) => void;
    addLiked: (resto: RestoBusiness) => void;
    addDisliked: (resto: RestoBusiness) => void;
    current: RestoBusiness | undefined;
    recommandation: RestoBusiness | undefined;
    reset: () => void;
    resetChoices: () => void;
    isNextChoiceUsed: boolean;
    nextChoice: () => void;
    handleRestaurantSelection: () => void;
    left: number;
  }
);

type ResultsData = {
  choices: RestoBusiness[];
  liked: RestoBusiness[];
  disliked: RestoBusiness[];
  restaurantChoice: RestoBusiness | undefined;
  current: RestoBusiness | undefined;
  recommandation: RestoBusiness | undefined;
  isNextChoiceUsed: boolean;
  left: number;
};

const ResultsContext = (props: { children: React.ReactNode }) => {
  const {
    value, //Value of element in localStorage
    setLocalStorage, //function for modify localStorage
    load, //if the value has been loaded or not
  } = useLocalStorage<ResultsData>({
    name: "results",
    updateValue(oldValue: ResultsData, newValue: ResultsData) {
      return {
        ...newValue,
      };
    },
    //name of element in localStorage
  });
  const [choices, setChoices] = useState(
    value?.choices || ([] as RestoBusiness[])
  );
  const [liked, setLiked] = useState([] as RestoBusiness[]);
  const [disliked, setDisliked] = useState([] as RestoBusiness[]);
  const [isNextChoiceUsed, setIsNextChoiceUsed] = useState(false);
  const [recommandation, setRecommandation] = useState(value?.recommandation);
  const [restaurantChoice, setRestaurantChoice] = useState(
    value?.restaurantChoice
  );
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);

  const findRecommandation = () => {
    const random = _.random(liked.length);
    void router.push("/results");
    setRecommandation(liked[random]);
  };

  const handleIndex = () => {
    if (currentIndex === choices.length - 1) {
      findRecommandation();
    } else {
      setCurrentIndex((prevState) => prevState + 1);
    }
    setLocalStorage({
      choices,
      liked,
      disliked,
      restaurantChoice,
      current: choices[currentIndex],
      recommandation,
      isNextChoiceUsed,
      left: choices.length - currentIndex,
    });
  };

  const addLiked = (resto: RestoBusiness) => {
    handleIndex();
    setLiked((prevState) => [...prevState, resto]);
  };

  const addDisliked = (resto: RestoBusiness) => {
    handleIndex();
    setDisliked((prevState) => [...prevState, resto]);
  };

  const reset = () => {
    setLiked([]);
    setDisliked([]);
    setRecommandation(undefined);
    setCurrentIndex(0);
    setIsNextChoiceUsed(false);
  };

  const resetChoices = () => {
    reset();
    setChoices([]);
  };

  const nextChoice = () => {
    findRecommandation();
    setIsNextChoiceUsed(true);
  };

  const handleRestaurantSelection = () => {
    if (!recommandation) return;
    setRestaurantChoice(recommandation);
    void router.push("/restaurant");
  };

  useEffect(() => {
    console.log(value?.choices);
    setLiked(value?.liked || []);
    setDisliked(value?.disliked || []);
    setRecommandation(value?.recommandation);
    setRestaurantChoice(value?.restaurantChoice);
    setChoices(value?.choices || []);
  }, [value]);

  const handleChoices = (choices: RestoBusiness[]) => {
    console.log("choices", choices[0], choices.length);
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
        handleChoices,
        restaurantChoice,
        addLiked,
        addDisliked,
        isNextChoiceUsed,
        handleRestaurantSelection,
        liked,
        reset,
        left: choices.length - currentIndex,
        nextChoice,
        disliked,
        current: choices[currentIndex],
        recommandation,
        resetChoices,
      }}
    >
      {props.children}
    </Results.Provider>
  );
};

export default ResultsContext;
