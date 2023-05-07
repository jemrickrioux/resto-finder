import { createContext, useState } from "react";

import type { YelpBusiness } from "~/server/api/routers/yelp";
import { RestoBusiness } from "~/server/api/routers/places";

export const YelpData = createContext(
  {} as { data: RestoBusiness[]; setData: (data: RestoBusiness[]) => void }
);
const YelpContext = (props: { children: React.ReactNode }) => {
  const [data, setData] = useState([] as RestoBusiness[]);
  return (
    <YelpData.Provider value={{ data, setData }}>
      {props.children}{" "}
    </YelpData.Provider>
  );
};

export default YelpContext;
