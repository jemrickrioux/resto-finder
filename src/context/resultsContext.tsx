import { createContext, Dispatch, SetStateAction, useState } from "react";
import { RestoBusiness } from "~/types/types";

type ResultsContextType = {
  choices: RestoBusiness[];
  liked: RestoBusiness[];
  disliked: RestoBusiness[];
  setChoices: Dispatch<SetStateAction<RestoBusiness[]>>;
  addLiked: (resto: RestoBusiness) => void;
  addDisliked: (resto: RestoBusiness) => void;
  current: RestoBusiness | undefined;
  recommandation: RestoBusiness | undefined;
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
  }
);

const ResultsContext = (props: { children: React.ReactNode }) => {
  const [choices, setChoices] = useState([] as RestoBusiness[]);
  const [liked, setLiked] = useState([] as RestoBusiness[]);
  const [disliked, setDisliked] = useState([] as RestoBusiness[]);
  const [recommandation, setRecommandation] = useState(
    undefined as RestoBusiness | undefined
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const findRecommandation = () => {
    const random = Math.floor(Math.random() * liked.length);
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

  return (
    <Results.Provider
      value={{
        choices,
        setChoices,
        addLiked,
        addDisliked,
        liked,
        disliked,
        current: choices[currentIndex],
        recommandation,
      }}
    >
      {props.children}
    </Results.Provider>
  );
};

export default ResultsContext;
