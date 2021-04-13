import { useState, useEffect } from "react";

import SpotifyWebAPI from "spotify-web-api-node";

export default function useSpotifySearch(search, accessToken) {
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!accessToken || !search) {
      setSearchResults([]);
      return;
    }
    console.log("searching");
    let cancel = false;
    let spotify = new SpotifyWebAPI();
    spotify.setAccessToken(accessToken);
    spotify
      .searchTracks(search)
      .then((results) => {
        if (!cancel) {
          setSearchResults(results.body.tracks.items);
        }
      })
      .catch((err) => {
        console.log(err);
        setSearchResults([]);
      });
    return () => {
      cancel = true;
    };
  }, [search, accessToken]);

  return searchResults;
}
