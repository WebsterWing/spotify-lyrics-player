require("dotenv").config();
const express = require("express");
const cors = require("cors");
const SpotifyWebApi = require("spotify-web-api-node");
const lyricsFinder = require("lyrics-finder");

const app = express();

const port = process.env.PORT;
const spotifyCredentials = {
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
};

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.post("/login", (req, res) => {
  const code = req.body.code;
  let spotifyApi = new SpotifyWebApi(spotifyCredentials);
  spotifyApi
    .authorizationCodeGrant(code)
    .then((response) => {
      res.json({
        accessToken: response.body.access_token,
        expiresIn: response.body.expires_in,
        refreshToken: response.body.refresh_token,
      });
    })
    .catch((err) => {
      console.log(
        Date.now().toLocaleString("en-US", { hour: "numeric", hour12: true })
      );
      console.log(err);
      res.status(400);
    });
});

app.post("/refresh", (req, res) => {
  const { accessToken, refreshToken } = req.body;
  let spotifyApi = new SpotifyWebApi(spotifyCredentials);
  spotifyApi.setAccessToken(accessToken);
  spotifyApi.setRefreshToken(refreshToken);

  spotifyApi
    .refreshAccessToken()
    .then((response) => {
      console.log(response.body);
      res.json({
        accessToken: response.body.access_token,
        expiresIn: response.body.expires_in,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
    });
});

app.get("/lyrics", (req, res) => {
  const { artist, title } = req.query;
  lyricsFinder(artist, title)
    .then((lyrics) => {
      res.json({ lyrics });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
    });
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
