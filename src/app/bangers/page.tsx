import React, { ReactElement, Suspense } from "react";
import UserBar from "@/components/rsc/UserBar";
import { getActiveSession } from "@/db/sessions";
import { cookies } from "next/headers";
import { getUserBangers } from "@/db/bangers";

function Page(): ReactElement {
  return (
    <div className="container">
      <UserBar />
      <div className="p-8 max-w-prose flex flex-col gap-8">
        <h1 className="text-xl">My bangers</h1>
        <Suspense fallback={<BangersSkeleton />}>
          <BangersList />
        </Suspense>
      </div>
    </div>
  );
}

async function BangersList(): Promise<ReactElement> {
  const session = await getActiveSession(
    cookies().get("session")?.value ?? null,
  );

  if (!session) {
    return (
      <div className="p-20 flex justify-center items-center">
        <div className="text-xl opacity-70">Log in to see your bangers</div>
      </div>
    );
  }

  const bangs = await getUserBangers(session.user_id);

  if (bangs.length === 0) {
    return (
      <div>
        <div className="text-lg opacity-70">No songs found</div>
        <p className="mt-8">
          Start adding bangers by searching for songs and adding them to your
          list.
        </p>
      </div>
    );
  }

  return (
    <div>
      {bangs.map((banger) => (
        <div key={banger.song_id}>{banger.song_id ?? 'what'}</div>
      ))}
    </div>
  );
}

function BangersSkeleton() {
  return (
    <div className="p-20 flex justify-center items-center">
      <div className="text-xl opacity-70">Loading bangers...</div>
    </div>
  );
}

export default Page;
