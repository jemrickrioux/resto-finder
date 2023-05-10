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
    <div className={"flex w-full flex-col"}>
      <div className={"flex w-max items-center space-x-4"}>
        <ToggleInput
          handler={props.handler}
          value={props.livraison}
        ></ToggleInput>
        <DeliveryDiningRounded
          fontSize={"large"}
          className={props.livraison ? "text-primary" : "text-gray-200"}
        ></DeliveryDiningRounded>
        <div
          className={`font-anek text-xl ${
            props.livraison ? "text-primary" : "text-gray-200"
          }`}
        >
          Livraison
        </div>
      </div>

      <div className={"flex w-max items-center space-x-4"}>
        <TakeoutDiningRounded
          fontSize={"large"}
          className={` transition ease-in-out ${
            props.takeout ? "text-primary" : "text-gray-200"
          }`}
        />
        <ToggleInput
          handler={props.handler1}
          value={props.takeout}
        ></ToggleInput>

        {props.takeout && (
          <div className={"font-anek text-xl text-primary"}>Takeout</div>
        )}
      </div>
    </div>
  );
}
