import {
  DeliveryDiningRounded,
  TakeoutDiningRounded,
} from "@mui/icons-material";
import { ToggleInput } from "~/components/form/ToggleInput";
import React from "react";

export function ServicesFilters(props: {
  livraison: boolean;
  handler: (value: ((prevState: boolean) => boolean) | boolean) => void;
  takeout: boolean;
  handler1: (value: ((prevState: boolean) => boolean) | boolean) => void;
}) {
  return (
    <div className={"flex w-screen justify-between px-4 md:w-full "}>
      <div className={"flex w-max items-center space-x-2"}>
        <DeliveryDiningRounded
          fontSize={"large"}
          className={props.livraison ? "text-primary" : "text-gray-200"}
        ></DeliveryDiningRounded>
        <ToggleInput
          handler={props.handler}
          value={props.livraison}
        ></ToggleInput>
        {props.livraison && (
          <div className={"font-anek text-xl text-primary"}>Livraison</div>
        )}
      </div>

      <div className={"flex items-center space-x-2"}>
        {props.takeout && (
          <div className={"font-anek text-xl text-primary"}>Takeout</div>
        )}
        <ToggleInput
          handler={props.handler1}
          value={props.takeout}
        ></ToggleInput>
        <TakeoutDiningRounded
          fontSize={"large"}
          className={` transition ease-in-out ${
            props.takeout ? "text-primary" : "text-gray-200"
          }`}
        />
      </div>
    </div>
  );
}
