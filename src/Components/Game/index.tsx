import React, { Component, useContext } from 'react'
import { GameContext } from '../../provider'
import { WaitingRoom } from './waiting-room.component'
import { InGame } from './in-game.component'
import { GameSecret } from './game-secret.component'
import { BackDrop } from './backdrop.component'
import { Auth } from './../facebook-login.component'
import '../../App.css';

const gameStateRouter = (param: number) => {
  switch (param) {
    case 1:
      return <Auth />
    case 2:
      return <GameSecret />
    case 3:
      return <WaitingRoom />
    case 4:
      return <InGame />
    default:
      return null;

  }
}

const Game = () => {
  const ctx = useContext(GameContext);
  return (
    <>
      <BackDrop />
      {gameStateRouter(ctx.state.setupStep)}
    </>
  )
}

export default class extends Component {
  render() {
    return (
      <div>
        <Game />
      </div>
    )
  }

}
