import React from "react";
import { User } from "next-auth";

export const UserBadge = ({ user }: { user: User }) => {
  return (
    <div className={"group flex cursor-pointer flex-col space-y-2"}>
      <div className={"group flex items-center space-x-2 pr-8 pt-8"}>
        <div className={"font-anek text-2xl font-bold text-primary"}>
          {user.name}
        </div>
        <img
          src={user.image ? user.image : "https://www.gravatar.com/avatar/0"}
          alt={user.name?.toString() || "ok"}
          className={"h-12 w-12 rounded-full"}
        />
      </div>
    </div>
  );
};
