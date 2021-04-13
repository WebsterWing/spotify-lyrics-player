import { useState, useEffect } from "react";

import SpotifyPlayer from "react-spotify-web-playback";

export default function Player({ accessToken, trackUri }) {
  // trigger player to start whenever a track is selected
  const [play, setPlay] = useState(false);
  useEffect(() => setPlay(true), [trackUri]);

  // player breaks if rendered without a token
  if (!accessToken) return <></>;

  return (
    <SpotifyPlayer
      autoPlay
      token={accessToken}
      uris={trackUri}
      play={play}
      callback={(state) => {
        // set play to false so that way next trackUri change restarts player
        if (!state.isPlaying) setPlay(false);
      }}
    />
  );
}
