require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENTID,
  clientSecret: process.env.SPOTIFY_CLIENTSECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.search)
    .then((data) => {
      console.log(data.body.artists.items);
      res.render("artist-search-results", { artists: data.body.artists.items });
    })
    .catch((error) => console.log("An error occured:", error));
});

app.get("/albums/:id", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then((data) => {
      res.render("albums", { albums: data.body.items });
      console.log(data.body);
    })
    .catch((error) => console.log("An error occured:", error));
});

app.get("/albums/tracks/:id", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.id, { limit: 5, offset: 1 })
    .then((data) => {
      res.render("tracks", { tracks: data.body.items });
      console.log(data.body);
    })
    .catch((error) => console.log("An error occured:", error));
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
