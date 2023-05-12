import React from "react";
import { User } from "next-auth";

export const UserBadge = ({ user }: { user: User }) => {
  return (
    <div className={"group ml-4 flex items-center"}>
      <div
        className={"hidden font-anek text-2xl font-bold text-primary md:flex"}
      >
        {user.name}
      </div>
      <img
        src={user.image ? user.image : "https://www.gravatar.com/avatar/0"}
        alt={user.name?.toString() || "ok"}
        className={"h-8 w-8 rounded-full"}
      />
    </div>
  );
};
