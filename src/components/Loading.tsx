import { LoopRounded } from "@mui/icons-material";
import React from "react";

export const Loading = () => {
  return (
    <div
      className={
        "mx-4 flex w-full flex-col items-center rounded-lg py-4 font-anek font-bold text-secondary md:text-4xl"
      }
    >
      <div className={"text-[100px]"}>
        <LoopRounded
          className={
            "h-10 w-10 animate-[spin_2s_linear_infinite] text-secondary md:h-20 md:w-20"
          }
          fontSize={"inherit"}
        ></LoopRounded>
      </div>
      <h3 className={"animate-pulse bg-accent/60"}>{"Let him cook..."}</h3>
    </div>
  );
};
