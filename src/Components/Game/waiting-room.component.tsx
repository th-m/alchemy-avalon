import React, { useContext } from 'react'
import { Paper, Typography, Avatar, Grow, Fab } from '@material-ui/core'
import { GameContext } from '../../provider'
import { Player } from '../../../../avalon-fire-functions/functions/src/connivance/schema';

const PlayersList = ({ players }: { players: Player[] }) => {
    return (
        <>
            {
                players.map((player) => <PlayerCard key={player.uid} {...player} />)
            }
        </>
    )
};

const PlayerCard = (props: Player) => {
    return (
        <Grow in={true}>
            <Paper elevation={4} style={{ padding: 8, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                <Avatar style={{ marginRight: 8 }} alt={props.displayName} src={props.photoURL} />
                <Typography>

                    {props.displayName}
                </Typography>
            </Paper>
        </Grow>
    )
}

export const WaitingRoom = () => {
    const ctx = useContext(GameContext);
    return (
        <>
            <div className={"center_children"}>
                <div>
                    <div className="game_container player_list">
                        <PlayersList players={Object.values(ctx.state.players).map(player => player)} />
                    </div>
                </div>
            </div>
        </>
    )
}