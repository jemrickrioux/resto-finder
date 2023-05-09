import React from "react";

export const HelloBar = ({ message }: { message: string }) => {
  return (
    <div
      className={
        "flex w-screen justify-center bg-secondary font-anek text-xs md:text-sm"
      }
    >
      <strong>{message}</strong>
    </div>
  );
};
