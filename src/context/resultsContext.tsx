import { createContext, Dispatch, SetStateAction, useState } from "react";
import { RestoBusiness } from "~/types/types";

type ResultsContextType = {
  choices: RestoBusiness[];
  liked: RestoBusiness[];
  disliked: RestoBusiness[];
  setChoices: Dispatch<SetStateAction<RestoBusiness[]>>;
  addLiked: (resto: RestoBusiness) => void;
  addDisliked: (resto: RestoBusiness) => void;
};

export const YelpData = createContext(
  {} as {
    choices: RestoBusiness[];
    liked: RestoBusiness[];
    disliked: RestoBusiness[];
    setChoices: Dispatch<SetStateAction<RestoBusiness[]>>;
    addLiked: (resto: RestoBusiness) => void;
    addDisliked: (resto: RestoBusiness) => void;
  }
);

const ResultsContext = (props: { children: React.ReactNode }) => {
  const [choices, setChoices] = useState([] as RestoBusiness[]);
  const [liked, setLiked] = useState([] as RestoBusiness[]);
  const [disliked, setDisliked] = useState([] as RestoBusiness[]);

  const addLiked = (resto: RestoBusiness) => {
    setLiked((prevState) => [...prevState, resto]);
  };

  const addDisliked = (resto: RestoBusiness) => {
    setDisliked((prevState) => [...prevState, resto]);
  };

  return (
    <YelpData.Provider
      value={{ choices, setChoices, addLiked, addDisliked, liked, disliked }}
    >
      {props.children}
    </YelpData.Provider>
  );
};

export default ResultsContext;
