import { ReactElement, Suspense } from "react";
import Image from "next/image";

import logo from "@/images/logo.png";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import SearchBar from "@/components/SearchBar";

import styles from "./UserBar.module.css";
import Link from "next/link";
import { getUserDetails } from "@/db/users";
import { cookies } from "next/headers";

function UserBar(): ReactElement {
  return (
    <div className={styles.gridContainer}>
      <div className={styles.logo}>
        <Link href="/">
          <Image
            className="h-10 w-10"
            src={logo}
            alt=""
            height="48"
            width="48"
          />
        </Link>
      </div>
      <div className={styles.search}>
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>
      </div>
      <div className={styles.userDetails}>
        <Suspense fallback={<UserDetailsSkeleton />}>
          <UserDetails />
        </Suspense>
      </div>
    </div>
  );
}

async function UserDetails() {
  const session = cookies().get("session")?.value;

  if (!session) return <NotLoggedIn />;

  const user = await getUserDetails(session);

  if (!user) return <NotLoggedIn />;

  return (
    <div className="flex gap-3 items-center justify-between sm:justify-end h-full p-3">
      <div>
        <div className="text-xs">Logged in</div>
        <div className="truncate">{user.name}</div>
      </div>
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

function NotLoggedIn() {
  return (
    <div className="flex gap-6 items-center justify-between sm:justify-end h-full p-3">
      <Link className="underline" href="/login">
        Login
      </Link>
      <Link className="underline" href="/register">
        Register
      </Link>
    </div>
  );
}

export default UserBar;
