import React from "react";

export default function SongDisplay({ track, selectTrack }) {
  const thumbnail = track.album.images.reduce((smallest, next) => {
    return smallest.width > next.width ? next : smallest;
  });

  const onClick = () => selectTrack(track);
  return (
    <div className="song_card" onClick={onClick}>
      <img src={thumbnail.url} alt="album art" height="64px" width="64px" />
      <div className="description">
        <h4>{track.name}</h4>
        <div>{track.artists.map((artist) => artist.name).join(", ")}</div>
      </div>
    </div>
  );
}
