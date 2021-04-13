import React, { useState, useEffect } from "react";

import Form from "react-bootstrap/Form";

import useSpotifySearch from "./useSpotifySearch";
import SongDisplay from "./SongDisplay";
import Player from "./Player";
import axios from "axios";

export default function Dashboard({ accessToken }) {
  const [search, setSearch] = useState("");
  const searchResults = useSpotifySearch(search, accessToken);
  const [track, setTrack] = useState();
  const [lyrics, setLyrics] = useState("");

  useEffect(() => {
    if (!track?.artists) return;
    axios
      .get("http://localhost:3001/lyrics", {
        params: { artist: track.artists[0].name, title: track.name },
      })
      .then((response) => {
        console.log(response);
        const { lyrics } = response.data;
        setLyrics(lyrics || "No lyrics found");
      })
      .catch((err) => {
        console.error(err);
        setLyrics("Error finding lyrics");
      });
  }, [track]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const selectTrack = (track) => {
    setTrack(track);
    setSearch("");
  };

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
        {searchResults.length === 0 && <div className="lyrics">{lyrics}</div>}
      </div>
      <Player accessToken={accessToken} trackUri={track?.uri || ""} />
    </div>
  );
}
