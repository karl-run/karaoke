import React, { PropsWithChildren, ReactElement, Suspense } from "react";
import Image from "next/image";

import logo from "@/images/logo.png";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function UserBar({ children }: PropsWithChildren): ReactElement {
  return (
    <div className="flex gap-3 px-3">
      <div className="flex items-center">
        <Image className="h-10 w-10" src={logo} alt="" height="48" width="48" />
      </div>
      <div>{children}</div>
      <div className="grow" />
      <Suspense fallback={<UserDetailsSkeleton />}>
        <UserDetails />
      </Suspense>
    </div>
  );
}

function UserDetails() {
  const user = {
    name: "John Doe",
    groups: [{ id: "abc", name: "The Karaoke Bois" }],
  };

  return (
    <div className="flex gap-3 items-center">
      {user.groups.length === 1 && (
        <div>
          <div className="text-xs">Active group</div>
          <div>{user.groups[0].name}</div>
        </div>
      )}
      <Avatar>
        <AvatarFallback>
          {user.name.slice(0, 2).toLocaleUpperCase()}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}

function UserDetailsSkeleton() {
  return (
    <div className="flex gap-3">
      <div className="bg-gray-200 w-20 h-4"></div>
      <div className="bg-gray-200 w-20 h-4"></div>
    </div>
  );
}

export default UserBar;
