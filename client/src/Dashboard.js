import React, { useState } from "react";

import Form from "react-bootstrap/Form";

import useSpotifySearch from "./useSpotifySearch";
import SongDisplay from "./SongDisplay";
import Player from "./Player";

export default function Dashboard({ accessToken }) {
  const [search, setSearch] = useState("");
  const searchResults = useSpotifySearch(search, accessToken);
  const [trackUri, setTrackUri] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const selectTrack = (track) => setTrackUri(track.uri);

  return (
    <div className="d-flex flex-column vh-100 p-2">
      <Form.Control
        type="search"
        placeholder="search songs/artists"
        value={search}
        onChange={handleSearch}
      />
      <div className="track_container">
        {searchResults.map((track) => (
          <SongDisplay track={track} selectTrack={selectTrack} key={track.id} />
        ))}
      </div>
      <Player accessToken={accessToken} trackUri={trackUri} />
    </div>
  );
}
