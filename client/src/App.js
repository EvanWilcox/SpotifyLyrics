import React, { Component } from "react";
import "./App.css";
import { getLyrics } from "genius-lyrics-api";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor() {
    super();

    const params = this.getHashParams();
    const token = params.access_token;

    if (token) {
      spotifyApi.setAccessToken(token);
    }

    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: "", artist: "", albumArt: "", lyrics: "" },
    };

    if (this.state.loggedIn) {
      this.timer = setInterval(() => this.getNowPlaying(), 1000);
    }
  }

  getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    e = r.exec(q);
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }

    window.history.replaceState("", "Spotify Lyrics", "/");

    return hashParams;
  }

  getNowPlaying() {
    const { nowPlaying } = this.state;

    spotifyApi.getMyCurrentPlaybackState().then((response) => {
      if (response) {
        if (response.item.name !== nowPlaying.name) {
          const options = {
            apiKey: process.env.REACT_APP_GENIUS_API_KEY,
            title: response.item.name,
            artist: response.item.artists[0].name,
            optimizeQuery: true,
          };

          getLyrics(options).then(
            (lyrics) =>
              this.setState({
                nowPlaying: {
                  name: response.item.name,
                  artist: response.item.artists[0].name,
                  albumArt: response.item.album.images[0].url,
                  lyrics: lyrics,
                },
              }),
            window.scrollTo(0, 0)
          );
        }
      }
    });
  }

  render() {
    const { loggedIn, nowPlaying } = this.state;
    const lyrics = nowPlaying.lyrics == null ? ["Lyrics Not Found"] : nowPlaying.lyrics.split(/\r?\n/);

    return (
      <div className="app">
        {loggedIn ? (
          <div>
            <div className="lyrics">
              {lyrics.map(function (lyric, index) {
                return lyric === "" ? <br key={index} /> : <p key={index}>{lyric}</p>;
              })}
            </div>
            <div className="artist">
              <p className="song-title">{nowPlaying.name}</p>
              <p className="song-artist">{nowPlaying.artist}</p>
              <img className="album-art" src={nowPlaying.albumArt} alt="" />
            </div>
          </div>
        ) : (
          <div className="log-in">
            <a href={process.env.REACT_APP_AUTH_ADDR + "/login"} className="log-in-button">
              Login to Spotify
            </a>
          </div>
        )}
      </div>
    );
  }
}

export default App;
