import * as React from "react";
import { Formik, Field, Form, FormikHelpers, useFormikContext } from "formik";
import { Button } from "~/components/Button";
import { api } from "~/utils/api";
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useContext,
  useEffect,
} from "react";
import * as Yup from "yup";

import { YelpData } from "~/context/resultsContext";
import { useRouter } from "next/router";
import { ToggleInput } from "~/components/form/ToggleInput";

export const SkeletonFinder = () => {
  return (
    <div
      className={
        "rounded-lg bg-main px-4 py-4 text-primary md:mx-0 md:w-[800px] md:px-10  md:py-10"
      }
    >
      <h2
        className={
          "bold animate-pulse py-6 text-left font-anek text-2xl font-bold uppercase text-primary md:text-4xl"
        }
      >
        {"Trouves ton lunch!"}
      </h2>
      <div>
        <form className={"flex w-full flex-col items-start space-y-2"}>
          <div className={`flex animate-pulse  space-x-2 text-gray-200`}>
            <ToggleInput handler={() => null} value={false} />
            <p>{"Sélectionne ça pour faire ton capricieux"}</p>
          </div>

          <div className={"animate-pulse py-8"}>
            <Button text={"Go"} size={"sm"} submit />
          </div>
        </form>
      </div>
    </div>
  );
};
