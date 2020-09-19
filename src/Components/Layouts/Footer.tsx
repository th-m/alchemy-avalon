import React, { useContext } from 'react'
import { Fab } from '@material-ui/core'
import { GameContext } from '../../provider';
import { startGame, setMissionMembers } from '../../firebase/actions';
import logo from '../../assets/imgs/logo.svg';
import firebase from 'firebase';
import { PlayerAction, SetMissionMembersReq } from '../../../../avalon-fire-functions/functions/src/connivance-schema'
export const Footer = () => {
  const ctx = useContext(GameContext);
  const activateGame = () => {
    if (Object.keys(ctx.state.players).length >= 5) {
      startGame(ctx.state.secret)
    }
  }

  const setTeam = () => {
    setMissionMembers({
      gameKey: ctx.state.secret,
      missionMembers: ctx.state.missionMembers,
      captain: firebase.auth().currentUser?.uid ?? '',
    })
  }

  const isCaptain: boolean = ctx.state.captain === firebase.auth().currentUser?.uid
  const teamSelect = ctx.state.action === "select team";
  const membersIn = Object.keys(ctx.state?.missionMembers ?? {}).length === ctx.state?.mission?.memberCount ?? 100;

  const showConfirmTeamButton = isCaptain && teamSelect && membersIn
  return (
    <div>
      <img src={logo} onClick={activateGame} className={(Object.keys(ctx.state.players).length >= 5 ? "play-able" : 'play-disable')} alt="logo" />
      {showConfirmTeamButton && <button onClick={setTeam}>team selected</button>}
    </div>
  )
}
