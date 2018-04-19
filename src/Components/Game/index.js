import React, { Component, Fragment } from 'react'
import {Paper, Typography, TextField, Button} from 'material-ui';
import minion from '../../assets/imgs/characters/minion.svg';
import morgana from '../../assets/imgs/characters/morgana.svg';
import mordred from '../../assets/imgs/characters/mordred.svg';
import knight from '../../assets/imgs/characters/knight.svg';
import merlin from '../../assets/imgs/characters/merlin.svg';
import percival from '../../assets/imgs/characters/percival.svg';

import io from 'socket.io-client';

import '../../App.css';

const GameContext = React.createContext();

    const HOST = window.location.origin.replace(/^http/, 'ws');
    // const socket = new WebSocket(HOST);
    const socket = io();
// const socket = new WebSocket(( window.location.origin.includes('localhost') )?'ws://localhost:5333/' : HOST+":3333");
// url.replace(/([a-zA-Z+.\-]+):\/\/([^\/]+):([0-9]+)\//, "$1://$2/");
// console.log(HOST+":3333");
// if(window.location.origin.includes('alchemy-games.herokuapp.com')? :)
// const socket = new WebSocket('ws://localhost:5333/');
// const socket = new WebSocket('ws://localhost:5333/');

const characterPics = {
  minion: minion,
  morgana: morgana,
  mordred: mordred,
  knight: knight,
  merlin: merlin,
  percival: percival,
}
    // class GameProvider extends Component {
    //   constructor(){
    //     super();
    //     this.state = {}
    //   }
    //   socket.onopen = (e) => {
    //     console.log("sockets have been connected", e)
    //   }
    // }
    // export default class extends Component {
    //   render(){
    //     return (
    //         <GameProvider />
    //     )
    //   }
    // }
              

class GameProvider extends Component {
  constructor(){
    super();
    this.state = {
      playerId: Math.floor((Math.random()*100)**10).toString(16), 
      // socket: new WebSocket('ws://localhost:5333/'),
      name: '',
      secret: '',
      character: '',
      players: [],
      alert:'',
      animateCard: false,
      centerPoint: [160, 140],
      points: [[127, 82.4], [193.3, 82.4], [226.5, 139.9], [193.3, 197.4],  [127, 197.4], [93.8, 139.9]],
      squarePoints: [[127, 82.4], [193.3, 82.4], [193.3, 139.9], [193.3, 197.4],  [127, 197.4], [127, 139.9]],
      step: 1,
      
    }

    // Math.floor(Math.random() * 41) + 50
    // this.state.socket.onopen = (e) => {
    socket.onopen = (e) => {
      console.log("sockets have been connected", e)
    }

    // this.state.socket.onmessage = (e) => {
    socket.on('message', (e) => {
    // socket.onmessage = (e) => {
      let socketData = JSON.parse(e);
      console.log("message recieved", socketData);
      if(!socketData.success){
        // show error message
        return false;
      }
    // });
      
      if(socketData.step){
        this.setState({step:socketData.step});
      }
      
      if(socketData.players){
        this.setState({players:socketData.players});
      }
      
      if(socketData.character){
        
        this.setState({character:socketData.character});
        // console.log(socketData.character, this.state.character);
      }
      
      if(socketData.step === 4){
         this.setState({animateCard:true});
         let animationToCheck = document.getElementById("animation-to-check");
         // run this on a click or whenever you want
        animationToCheck.beginElement();
      }
      // 
      // if(socketData.step){
      //   animationToCheck = document.getElementById("animation-to-check");
      //   // run this on a click or whenever you want
      //   animationToCheck.beginElement();
      // }
    
    });
    
    // console.log("constructed");
    // setTimeout(()=>{
    //   this.setState({animate:true});
    // });
    
  }
  componentWillUpdate() {
    console.log(this.state.character);
  }
  sendMessage = () =>  { 
    // this.state.socket.send(JSON.stringify(this.state));
    socket.send(JSON.stringify(this.state));
  }
  
  handleKeyDown = (e) => {
    if(e.key === "Enter"){
      this.sendMessage();
    }
  }
  // 
  // alertWriter = () => {
  //   if (this.state.alert.i < this.state.alert.txt.length) {
  //       this.setState({alert:  this.state.alert.message += this.state.alert.txt.charAt(this.state.alert.i);
  //       i++;
  //       setTimeout(this.alertWriter, (Math.floor(Math.random() * 150) + 30));
  //     }else{
  // 
  //     }
  // }
  // 
  startGame = () => {
    if(this.state.players){
    // if(this.state.players.length >= 5){
      console.log("sending to the server")
      // this.state.socket.send(JSON.stringify(this.state));
      socket.send(JSON.stringify(this.state));
    }
    console.log(JSON.stringify(this.state));
  }
  
  componentDidMount(){
    console.log("mounted");
  }
    
  render(){
    return (
      <GameContext.Provider value={{
        state: this.state,
        handleInputChange: (e) => this.setState({[e.target.id]: e.target.value }) , 
        sendMessage: this.sendMessage ,
        handleKeyDown: this.handleKeyDown ,
        startGame: this.startGame,
      }}>
        {this.props.children}
      </GameContext.Provider>
    )
  }
  
}

const Input = (props) => (
  <GameContext.Consumer>
    {context => (
         <React.Fragment>
          <Paper className="game_container" elevation={4}>
            <Typography variant="headline" component="h3">
              {(props.step === "secret" ?"Enter The Secret" : "What Is Your Name")}
            </Typography>
              <TextField
                 id={props.step}
                 fullWidth
                 required
                 onKeyDown={context.handleKeyDown}
                 onChange={context.handleInputChange}
                 className="marg_0"
                 margin="normal"
                 value={context.state[props.step]}
               />
             <Button variant="raised" fullWidth onClick={context.sendMessage}>
               Default
             </Button>
          </Paper>
        </React.Fragment>
    )}
  </GameContext.Consumer>
)


const PlayersList = (props) => {
    return ( (props.players.length > 0 ) ? (props.players.map(x => <Player name={x} />)) : <React.Fragment /> );
}

const Player = (props) => (
  <Paper elevation={4}>
    {props.name}
  </Paper>
)

const WaitingRoom = (props) => (
    <GameContext.Consumer>
      {context => (
           <React.Fragment>
            <Paper className="game_container" elevation={4}>
              <Button variant="raised" fullWidth onClick={context.startGame}  disable={( context.state.players >= 5 ? false : true )}>
                Play Game
              </Button>
            </Paper>
            <h2 className="game_container">Players</h2>
            <div className="game_container player_list">
              <PlayersList players={context.state.players}/>
            </div>
          </React.Fragment>
      )}
      </GameContext.Consumer>
)

const gameStateRouter = (param) => {
   switch (param) {
      case 1:
      case 2:
        return ([
          <Input step={(param===1?"secret":"name")} />,
        ]);
        break;
      case 3:
         return ([
            <WaitingRoom />,
         ]);
      default:
        return null;
        
   }
}

// const Circles = () => {
//       return <div>
//                 <h1>Hello World!</h1>
//                 <p>This is my first React Component.</p>
//              </div>
//       }

const CharacterCard = (props) => (
    <GameContext.Consumer>
      {context => (
           <React.Fragment>
                  <text x="100" y="55" fontFamily="Verdana" fontSize="35" fill="blue">{context.state.character.name}</text>
                  <text x="100" y="70" fontFamily="Verdana" fontSize="15" fill="green">Aignment: {context.state.character.alignment}</text>
                  {/* <img src={characterPics[context.state.character.name]} /> */}
                  '<image href={characterPics[context.state.character.name]} x="110" y="75" height="100" width="100" />
                  {(context.state.character.known ? <KnownInfo data={context.state.character.known} />: <React.Fragment />)}
          </React.Fragment>
      )}
      </GameContext.Consumer>
)

const KnownInfo= (props) => {
    return  ( props.data ? Object.keys(props.data).map((k, i) => <KnownData character={k} xpos={i} names={props.data[k]} /> ) : <React.Fragment />);
}
const KnownData= (props) => {
    return <Fragment> 
              <text x="100" y="170" font-family="Verdana" font-size="30" fill="green">{props.character}</text>
              { props.names.map((name, i) => <text x="100" y={((i * 20) + 200)} font-family="Verdana" font-size="" fill="green">{name}</text> ) }
            </Fragment>
}


export default class extends Component {
  
  render(){
    return (
      <Fragment>
      
        <GameProvider>
          <GameContext.Consumer>
                
              {context => (
               <Fragment>
                 <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 320 280" 
                   style={{enableBackground:"new 0 0 320 280"}} >
                   <g className={(context.state.step < 4?null:'hideMe')}>
                     <g className={(context.state.step >= 3?null:'rotateMe')}>
                       {context.state.points.map((x, i) => <line key={"l"+i} id={"l"+i} x1={context.state.centerPoint[0]} y1={context.state.centerPoint[1]} x2={x[0]} y2={x[1]} /> )}
                     </g>
                     <g>
                       {context.state.points.map((x, i) => <circle key={"c"+i} id={"c"+i} r="66.5"
                        cx={(context.state.step <= 1 ? context.state.centerPoint[0] : x[0])} cy={(context.state.step <= 1 ? context.state.centerPoint[1] : x[1])} 
                        stroke="none" fill={ ( (i % 2 == 0) ? 'rgba(179, 255, 251, .5)' : 'rgba(255, 182, 208, .5)' ) }/> )}
                     </g>
                   </g>
                   <defs>
                      <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" style= {{stopColor:"#ea789b", stopOpacity:"0"}} />
                        <stop offset="100%" style= {{stopColor:"#2dcbe0", stopOpacity:"1"}} />
                      </radialGradient>
                      <radialGradient id="grad2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" style= {{stopColor:"#ea789b", stopOpacity:"0"}} />
                        <stop offset="100%" style= {{stopColor:"#2dcbe0", stopOpacity:"0"}} />
                      </radialGradient>
                    </defs>
        
                   <g  className={ (context.state.step >= 3 ? "hexShow" : 'hexHide') }>
                     <polygon className={ (context.state.step >= 4 ? "growSquare" : null) } points={context.state.points.map(x => x.join()).join(" ")} 
                       fill={ (context.state.step >= 4 ? "url(#grad2)" : "url(#grad1)") } stroke={ (context.state.step >= 4 ? "rgba(0,0,0,1)" : "rgba(0,0,0,0)") } >
                       <animate id="animation-to-check" repeatCount="1" fill="freeze"  begin="indefinite" attributeName="points" dur="2000ms" to={context.state.squarePoints.map(x => x.join()).join(" ")} />
                     </polygon>
                     {(! context.state.character ? null : <CharacterCard /> )}
                   </g>
                  </svg>
                   
                  { gameStateRouter(context.state.step) }
               </Fragment>
              )}
          </GameContext.Consumer>
        </GameProvider>
      </Fragment>
    )
  }
  
}
    