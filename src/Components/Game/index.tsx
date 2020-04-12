import React, { Component, useContext } from 'react'
import { GameContext, GameProvider } from './provider'
import { CharacterCard } from './character-card.component'
import { WaitingRoom } from './waiting-room.component'
import { GameSecret } from './game-secret.component'
import { FBLogin } from './../facebook-login.component'
import '../../App.css';

const suggestedSettup = {
  5: { "good": 3, "evil": 2 },
  6: { "good": 4, "evil": 2 },
  7: { "good": 4, "evil": 3 },
  8: { "good": 5, "evil": 3 },
  9: { "good": 6, "evil": 3 },
  10: { "good": 6, "evil": 4 },
}

const centerPoint = [160, 140];
const points = [[127, 82.4], [193.3, 82.4], [226.5, 139.9], [193.3, 197.4], [127, 197.4], [93.8, 139.9]];
const squarePoints = [[127, 82.4], [193.3, 82.4], [193.3, 139.9], [193.3, 197.4], [127, 197.4], [127, 139.9]];

const gameStateRouter = (param) => {
  switch (param) {
    case 1:
      return <FBLogin />
    case 2:
      return <GameSecret />
    case 3:
      return <WaitingRoom />
    default:
      return null;

  }
}

const Game = () => {
  const ctx = useContext(GameContext);
  return (
    <>
      <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 320 280">
        <g className={(ctx.state.step < 4 ? '' : 'hideMe')}>
          <g className={(ctx.state.step >= 3 ? '' : 'rotateMe')}>
            {points.map((x, i) => <line key={"l" + i} id={"l" + i} x1={centerPoint[0]} y1={centerPoint[1]} x2={x[0]} y2={x[1]} />)}
          </g>
          <g>
            {points.map((x, i) => <circle key={"c" + i} id={"c" + i} r="66.5"
              cx={(ctx.state.step <= 1 ? centerPoint[0] : x[0])} cy={(ctx.state.step <= 1 ? centerPoint[1] : x[1])}
              stroke="none" fill={((i % 2 === 0) ? 'rgba(179, 255, 251, .5)' : 'rgba(255, 182, 208, .5)')} />)}
          </g>
        </g>
        <defs>
          <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style={{ stopColor: "#ea789b", stopOpacity: 0 }} />
            <stop offset="100%" style={{ stopColor: "#2dcbe0", stopOpacity: 1 }} />
          </radialGradient>
          <radialGradient id="grad2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style={{ stopColor: "#ea789b", stopOpacity: 0 }} />
            <stop offset="100%" style={{ stopColor: "#2dcbe0", stopOpacity: 0 }} />
          </radialGradient>
        </defs>

        <g className={(ctx.state.step >= 3 ? "hexShow" : 'hexHide')}>
          <polygon className={(ctx.state.step >= 4 ? "growSquare" : '')} points={points.map(x => x.join()).join(" ")}
            fill={(ctx.state.step >= 4 ? "url(#grad2)" : "url(#grad1)")} stroke={(ctx.state.step >= 4 ? "rgba(0,0,0,1)" : "rgba(0,0,0,0)")} >
            <animate id="animation-to-check" repeatCount="1" fill="freeze" begin="indefinite" attributeName="points" dur="2000ms" to={squarePoints.map(x => x.join()).join(" ")} />
          </polygon>
          {(!ctx.state.character ? null : <CharacterCard />)}
        </g>
      </svg>

      {gameStateRouter(ctx.state.step)}
    </>
  )
}

export default class extends Component {
  render() {
    return (
      <GameProvider>
        <Game />
      </GameProvider>
    )
  }

}
