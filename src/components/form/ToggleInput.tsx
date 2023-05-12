import React, { Dispatch, SetStateAction, useState } from "react";
import { Switch } from "@headlessui/react";
import {
  DeliveryDiningRounded,
  CircleRounded,
  SvgIconComponent,
} from "@mui/icons-material";

export function ToggleInput({
  handler,
  value,
  label,
  Icon,
}: {
  handler: Dispatch<SetStateAction<boolean>>;
  value: boolean;
  label?: string;
  Icon?: SvgIconComponent;
}) {
  return (
    <div className={"flex w-max items-center space-x-4"}>
      <Switch
        checked={value}
        onChange={(e) => handler(e)}
        className={`${
          value ? "bg-primary" : "bg-gray-200"
        } relative inline-flex h-6 w-11 items-center rounded-full`}
      >
        <CircleRounded
          className={`${
            value ? "translate-x-5 text-white" : ""
          } inline-block h-6 w-6 transform rounded-full transition`}
        />
      </Switch>
      {Icon && (
        <Icon
          fontSize={"large"}
          className={value ? "text-primary" : "text-gray-200"}
        ></Icon>
      )}
      <div
        className={`font-anek text-xl ${
          value ? "text-primary" : "text-gray-200"
        }`}
      >
        {label}
      </div>
    </div>
  );
}
