import * as React from "react";

export const Label = (props: any) => {
  return <label className={"text-md text-primary md:text-xl"} {...props} />;
};

export const FieldGroup = (props: any) => {
  return (
    <div
      className={" mb-4 flex w-full  flex-col items-start space-y-2"}
      {...props}
    />
  );
};
