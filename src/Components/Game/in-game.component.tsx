import React, { useContext } from 'react'
import { Paper, Typography, Avatar, Fade, Grow, Grid, Tab, IconButton, Tooltip, Icon } from '@material-ui/core'
import { GameContext } from '../../provider'
import { Voting } from './voting.component'
import { Mission } from './mission.component'
import '../../App.css';
import { Player } from '../../../../avalon-fire-functions/functions/src/connivance/schema';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import AddIcon from '@material-ui/icons/Add';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import BadIcon from '@material-ui/icons/SentimentDissatisfied';
import GoodIcon from '@material-ui/icons/InsertEmoticon';
import MemberIcon from '@material-ui/icons/TurnedIn';
import StarHalfIcon from '@material-ui/icons/StarHalf';
import firebase from 'firebase';

const PlayersList = ({ players }: { players: Player[] }) => {
    return (
        <>
            {
                players.map((player) => <PlayerCard key={player.uid} {...player} />)
            }
        </>
    )
};


const PlayerCard = (player: Player) => {
    const ctx = useContext(GameContext);
    const playerCardStyle: React.CSSProperties = { marginBottom: 8, padding: 8, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", border: 'none' };

    const knows = ctx.state?.character?.knows || [];
    const knownMatch = knows.find(known => known?.player?.uid == player.uid);


    const isCaptain: boolean = ctx.state?.captain?.uid === firebase.auth().currentUser?.uid
    const teamSelect = ctx.state.action === "select team";
    const voteAction = ctx.state.action === "vote";
    const memberLimit = ctx.state.mission?.memberCount ?? 0;
    const members = { ...ctx.state.missionMembers };
    const membersKeys = Object.keys(members)
    const membersCount = membersKeys.length;

    const playerIsMember = members[player.uid]
    const playerIsCaptain = player.uid === ctx.state?.captain?.uid
    const shouldAddMembers = isCaptain && teamSelect && !playerIsMember && memberLimit > membersCount
    const shouldRemoveMembers = isCaptain && teamSelect && playerIsMember

    const addToTeam = () => {
        ctx.dispatch({ type: "SET_MISSION_MEMBERS", payload: { ...members, [player.uid]: player } })
    }

    const removeFromTeam = () => {
        delete members[player.uid]
        ctx.dispatch({ type: "SET_MISSION_MEMBERS", payload: { ...members } })
    }
    return (
        <Grow in={true}>
            <Paper elevation={4} style={playerCardStyle}>
                <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Tooltip title={player.displayName}>
                        <Avatar style={{ marginRight: 8 }} alt={player.displayName} src={player.photoURL} />
                    </Tooltip>
                    {shouldAddMembers &&
                        <>
                            <Tooltip title={`add to team`}>
                                <IconButton aria-label="add" onClick={addToTeam}>
                                    <AddCircleOutlineIcon />
                                </IconButton>
                            </Tooltip>
                        </>
                    }
                    {shouldRemoveMembers &&
                        <>
                            <Tooltip title={`remove team`}>
                                <IconButton aria-label="remove" onClick={removeFromTeam}>
                                    <HighlightOffIcon />
                                </IconButton>
                            </Tooltip>
                        </>
                    }

                    {
                        knownMatch &&
                        <>
                            <Tooltip title={`${knownMatch.characterName} ${knownMatch.alignment}`}>
                                <IconButton>
                                    {knownMatch.alignment === "good" ? <GoodIcon /> : <BadIcon />}
                                </IconButton>
                            </Tooltip>
                        </>
                    }

                    {
                        playerIsCaptain &&
                        <>
                            <Tooltip title={`captain`}>
                                <Icon>
                                    <StarHalfIcon />
                                </Icon>
                            </Tooltip>
                        </>
                    }

                    {
                        playerIsMember && voteAction &&
                        <>
                            <Tooltip title={`Selected by captain`}>
                                <Icon>
                                    <MemberIcon />
                                </Icon>
                            </Tooltip>
                        </>
                    }

                </div>
            </Paper>
        </Grow>
    )
}

export const InGame = () => {
    const ctx = useContext(GameContext);
    const voteAction = ctx.state.action === "vote";
    const missionAction = ctx.state.action === "run mission";
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
                <Voting open={voteAction} />
                <Mission open={missionAction} />
            </div>
        </>
    )
}