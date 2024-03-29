"use client";

import React, { ReactElement } from "react";

interface Props {
  songId: string;
  previewUrl: string;
}

function PlaySong({ songId, previewUrl }: Props): ReactElement {
  const [play, setPlay] = React.useState<boolean>(false);

  return (
    <div>
      <button onClick={() => setPlay(!play)}>{play ? "Stop" : "Play"}</button>
      {play && (
        <audio id={`song-preview-${songId}`} src={previewUrl} autoPlay />
      )}
    </div>
  );
}

export default PlaySong;
