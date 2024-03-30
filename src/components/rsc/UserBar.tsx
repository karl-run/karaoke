import { ReactElement, Suspense } from "react";
import Image from "next/image";

import logo from "@/images/logo.png";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import SearchBar from "@/components/SearchBar";

import styles from "./UserBar.module.css";

function UserBar(): ReactElement {
  return (
    <div className={styles.gridContainer}>
      <div className={styles.logo}>
        <Image className="h-10 w-10" src={logo} alt="" height="48" width="48" />
      </div>
      <div className={styles.search}>
        <SearchBar />
      </div>
      <div className={styles.userDetails}>
        <Suspense fallback={<UserDetailsSkeleton />}>
          <UserDetails />
        </Suspense>
      </div>
    </div>
  );
}

function UserDetails() {
  const user = {
    name: "John Doe",
    groups: [{ id: "abc", name: "The Karaoke Bois" }],
  };

  return (
    <div className="flex gap-3 items-center justify-between sm:justify-end h-full p-3">
      {user.groups.length === 1 && (
        <div>
          <div className="text-xs">Active group</div>
          <div className="truncate">{user.groups[0].name}</div>
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
