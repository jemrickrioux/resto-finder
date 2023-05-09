import { createContext, useState } from "react";
import { RestoBusiness } from "~/types/types";

export const YelpData = createContext(
  {} as { data: RestoBusiness[]; setData: (data: RestoBusiness[]) => void }
);
const ResultsContext = (props: { children: React.ReactNode }) => {
  const [data, setData] = useState([] as RestoBusiness[]);
  return (
    <YelpData.Provider value={{ data, setData }}>
      {props.children}{" "}
    </YelpData.Provider>
  );
};

export default ResultsContext;
