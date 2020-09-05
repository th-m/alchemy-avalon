import React, { useContext } from 'react'
import { Paper, Typography, Avatar, Fade, Grow, Grid, Tab, IconButton } from '@material-ui/core'
import { GameContext } from '../../provider'
import '../../App.css';
import { Player } from '../../../../schemas';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import firebase from 'firebase';

const PlayersList = ({ players }) => players.map(player => <PlayerCard key={player.uid} {...player} />);


const PlayerCard = (player: Player) => {
    const ctx = useContext(GameContext);
    const playerCardStyle: React.CSSProperties = { marginBottom: 8, padding: 8, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", border: 'none' };

    if (ctx.state.captain === firebase.auth().currentUser?.uid) {
        playerCardStyle.border = "1px solid blue";
    }

    if (ctx.state.captain === player.uid) {
        playerCardStyle.border = "1px solid gold";
    }
    const knows = ctx.state?.character?.knows || [];
    const knownMatch = knows.find(known => known?.player?.uid == player.uid);


    const isCaptain: boolean = ctx.state.captain === firebase.auth().currentUser?.uid
    const teamSelect = ctx.state.action === "select team";
    const memberLimit = ctx.state.mission?.membersCount ?? 0;
    const members = ctx.state.mission?.members ?? {};
    const membersCount = Object.keys(members).length;
    const shouldAddMembers = isCaptain && teamSelect && memberLimit <= membersCount
    const addToTeam = () => {
        ctx.dispatch({ type: "SET_UPDATE_MISSION", payload: { members: { ...members, [player.uid]: player } } })
    }
    return (
        <Grow in={true}>
            <Paper elevation={4} style={playerCardStyle}>
                <Avatar style={{ marginRight: 8 }} alt={player.displayName} src={player.photoURL} />
                <Typography>
                    {player.displayName}
                </Typography>
                {
                    knownMatch &&
                    <>
                        <Typography>
                            &nbsp; {knownMatch.alignment}
                        </Typography>
                        <Typography>
                            &nbsp; {knownMatch.characterName}
                        </Typography>
                    </>
                }
                {shouldAddMembers &&
                    <>
                        <IconButton aria-label="join" onClick={addToTeam}>
                            <TouchAppIcon />
                        </IconButton>
                    </>
                }
            </Paper>
        </Grow>
    )
}

export const InGame = () => {
    const ctx = useContext(GameContext);
    return (
        <>
            <div style={{
                marginTop: 8,
                width: '25vw',
                height: 'calc(100vh - 148px)',
                display: 'flex',
                flexDirection: 'column',
            }} >
                <PlayersList players={Object.values(ctx.state.players).map(player => player)} />
            </div>
        </>
    )
}