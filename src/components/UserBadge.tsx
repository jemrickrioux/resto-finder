import React from "react";
import { User } from "next-auth";

export const UserBadge = ({ user }: { user: User }) => {
  return (
    <div className={"group flex items-center space-x-2 pr-4 md:pr-8"}>
      <div
        className={"hidden font-anek text-2xl font-bold text-primary md:flex"}
      >
        {user.name}
      </div>
      <img
        src={user.image ? user.image : "https://www.gravatar.com/avatar/0"}
        alt={user.name?.toString() || "ok"}
        className={"h-12 w-12 rounded-full"}
      />
    </div>
  );
};
