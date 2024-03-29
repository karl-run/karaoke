import Image from "next/image";
import { search } from "@/spotify/search";
import PlaySong from "@/components/PlaySong";

export default async function Home() {
  const result = await search("uptown funk", "track");

  return (
    <main className="">
      <div className="grid grid-cols-8">
        {result.map((track) => (
          <div key={track.id} className="col-span-2">
            <Image
              src={track.image.url}
              alt={track.name}
              width={200}
              height={200}
            />
            <div>{track.name}</div>
            <div>{track.artist}</div>
            {track.preview_url && (
              <PlaySong songId={track.id} previewUrl={track.preview_url} />
            )}
          </div>
        ))}
      </div>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </main>
  );
}
