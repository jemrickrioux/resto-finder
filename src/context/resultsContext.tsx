import { createContext, Dispatch, SetStateAction, useState } from "react";
import { RestoBusiness } from "~/types/types";
import _ from "lodash";

type ResultsContextType = {
  choices: RestoBusiness[];
  liked: RestoBusiness[];
  disliked: RestoBusiness[];
  setChoices: Dispatch<SetStateAction<RestoBusiness[]>>;
  addLiked: (resto: RestoBusiness) => void;
  addDisliked: (resto: RestoBusiness) => void;
  current: RestoBusiness | undefined;
  recommandation: RestoBusiness | undefined;
  left: number;
  resetChoices: () => void;
  isNextChoiceUsed: boolean;
  nextChoice: () => void;
  reset: () => void;
};

export const Results = createContext(
  {} as {
    choices: RestoBusiness[];
    liked: RestoBusiness[];
    disliked: RestoBusiness[];
    setChoices: Dispatch<SetStateAction<RestoBusiness[]>>;
    addLiked: (resto: RestoBusiness) => void;
    addDisliked: (resto: RestoBusiness) => void;
    current: RestoBusiness | undefined;
    recommandation: RestoBusiness | undefined;
    reset: () => void;
    resetChoices: () => void;
    isNextChoiceUsed: boolean;
    nextChoice: () => void;
    left: number;
  }
);

const ResultsContext = (props: { children: React.ReactNode }) => {
  const [choices, setChoices] = useState([] as RestoBusiness[]);
  const [liked, setLiked] = useState([] as RestoBusiness[]);
  const [disliked, setDisliked] = useState([] as RestoBusiness[]);
  const [isNextChoiceUsed, setIsNextChoiceUsed] = useState(false);
  const [recommandation, setRecommandation] = useState(
    undefined as RestoBusiness | undefined
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const findRecommandation = () => {
    const random = _.random(liked.length) - 1;
    setRecommandation(liked[random]);
  };

  const handleIndex = () => {
    if (currentIndex === choices.length - 1) {
      findRecommandation();
    } else {
      setCurrentIndex((prevState) => prevState + 1);
    }
  };

  const addLiked = (resto: RestoBusiness) => {
    setLiked((prevState) => [...prevState, resto]);
    handleIndex();
  };

  const addDisliked = (resto: RestoBusiness) => {
    setDisliked((prevState) => [...prevState, resto]);
    handleIndex();
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

  return (
    <Results.Provider
      value={{
        choices,
        setChoices,
        addLiked,
        addDisliked,
        isNextChoiceUsed,
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
