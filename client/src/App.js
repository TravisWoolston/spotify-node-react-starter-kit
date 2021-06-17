import React, { Component } from 'react';
import './App.css';
import App from './SnakeGame'
import SpotifyWebApi from 'spotify-web-api-js';
// import ImageColors from 'react-native-image-colors'
import { ColorExtractor } from 'react-color-extractor'
const spotifyApi = new SpotifyWebApi();

class Player extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      tempo: 0,
      nowPlaying: { name: 'Not Checked', albumArt: '' },
      aiCount: 0,
      colors: []
    }
  }
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getNowPlaying(){
    let uri;
    let tempo
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        uri = response.item.id
        spotifyApi.getAudioFeaturesForTrack(uri)
      .then((response) => {
        console.log(response)
        // if (response.tempo > 140) tempo = response.tempo/2
        // else tempo = response.tempo
        tempo = response.tempo
        
        this.setState({
          tempo
        });
        console.log(response.tempo)
      })
      spotifyApi.getAudioAnalysisForTrack(uri)
      .then((response) => {
        console.log(response)
      })
      
        console.log(response.item.album.images[0].url)
        this.setState({
          nowPlaying: { 
              name: response.item.name, 
              // colors: ImageColors.getColors(response.item.album.images[0].url, config),
              albumArt: response.item.album.images[0].url
            },
          
        });
      
      })
     
  }

  addAi(){
  
    let aiCount = this.state.aiCount + 1
    this.setState({aiCount})
  }
  subAi(){
  if(this.state.aiCount>=0){
    let aiCount = this.state.aiCount - 1
    this.setState({aiCount})
  }
  }
  fiftyBPM(){
    this.setState({
      tempo: 50
    })
  }
  oneTwentyBPM(){
    this.setState({
      tempo: 120
    })
  }
  // getUpdatedTrack(){
  //  ()=>this.getNowPlaying()
  //  setTimeout(()=> this.getUpdatedTrack(), 5)
  // }
  renderSwatches = () => {
    const { colors } = this.state

    return colors.map((color, id) => {
      return (
        <div
          key={id}
          style={{
            backgroundColor: color,
            width: 100,
            height: 100
          }}
        />
      )
    })
  }

  getColors = colors =>
  this.setState(state => ({ colors: [ ...colors] }))

  render() {
  
    let renderDiv = <div></div>
    if(this.state.tempo !== 0){
      renderDiv = <App
      tempo = {this.state.tempo}
      albumArt = {this.state.nowPlaying.albumArt}
      aiCount = {this.state.aiCount}
      extractedColors = {this.state.colors}
      />
    //  this.getUpdatedTrack()
    }
    return (
      <div className="App">
        <a href='http://localhost:8888' > Login to Spotify </a>
        <div>
          Tempo: { this.state.tempo} {' '}
          Now Playing: { this.state.nowPlaying.name }
        </div>
        <div>
          <img src={this.state.nowPlaying.albumArt} alt = 'album cover'style={{ height: 150 }}/>
        </div>
        { this.state.loggedIn &&
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>
         
        }
        {
          <button onClick={() => this.fiftyBPM()}>
            50 BPM
          </button>
          
        }
        {    <button onClick={() => this.oneTwentyBPM()}>
          120 BPM
        </button>}
        {renderDiv}
       
       <button onClick={() => this.subAi()}>-</button>
       <button onClick={() => this.addAi()}>+</button>
       <div>
        <ColorExtractor getColors={this.getColors}>
          <img
            src= {`${this.state.nowPlaying.albumArt}`}
            style={{ width: 700, height: 500 }}
          />
        </ColorExtractor>
        <div
          style={{
            marginTop: 20,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          {this.renderSwatches()}
        </div>
      </div>
      </div>
     
    );
  }
}

export default Player;
