import React, { useContext } from 'react'
import { Fab } from '@material-ui/core'
import { GameContext } from '../../provider';
import { startGame } from '../../firebase/actions';
import logo from '../../assets/imgs/logo.svg';
import firebase from 'firebase';
import { PlayerAction } from '../../../../schemas'
export const Footer = () => {
  const ctx = useContext(GameContext);
  const activateGame = () => {
    if (Object.keys(ctx.state.players).length >= 5) {
      startGame(ctx.state.secret)
    }
  }
  const isCaptain: boolean = ctx.state.captain === firebase.auth().currentUser?.uid
  const teamSelect = ctx.state.action === "select team";
  return (
    <div>
      <img src={logo} onClick={activateGame} className={(Object.keys(ctx.state.players).length >= 5 ? "play-able" : 'play-disable')} alt="logo" />
      {/* {isCaptain && teamSelect &&} */}
    </div>
  )
}
