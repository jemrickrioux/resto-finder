import { LoopRounded } from "@mui/icons-material";
import React from "react";

export const Loading = () => {
  return (
    <div className={"text-[100px]"}>
      <LoopRounded
        className={"h-10 w-10 animate-[spin_2s_linear_infinite] text-primary"}
        fontSize={"inherit"}
      ></LoopRounded>
    </div>
  );
};
