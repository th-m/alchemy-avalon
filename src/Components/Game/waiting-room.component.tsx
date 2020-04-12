import React, { useContext } from 'react'
import { Paper, Button } from '@material-ui/core'
import { GameContext } from './provider'
import '../../App.css';


const PlayersList = ({ players }) => {
    return ((players.length > 0) ? (players.map(x => <Player name={x} />)) : <React.Fragment />);
}

const Player = ({ name }) => (
    <Paper elevation={4}>
        {name}
    </Paper>
)

export const WaitingRoom = () => {
    const ctx = useContext(GameContext);
    return (
        <>
            <Paper className="game_container" elevation={4}>
                <Button fullWidth onClick={() => console.log('start game')} disabled={(Object.keys(ctx.state.players).length >= 5 ? false : true)}>
                    Play Game
                </Button>
            </Paper>
            <h2 className="game_container">Players</h2>
            <div className="game_container player_list">
                <PlayersList players={Object.values(ctx.state.players).map(player => player.name)} />
            </div>
        </>
    )
}