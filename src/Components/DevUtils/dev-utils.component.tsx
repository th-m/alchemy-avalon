import React, { Component, Fragment, useContext, useState } from "react"
import { usePlayerUtils } from './players'
import { dev_getGame, setGameDev, testNextCaptain, setPlayerVote } from "../../firebase/actions";
import stubGame from './stub.game.json'
import { GameContext } from "../../provider";

export const DevUtils = () => {
    const ctx = useContext(GameContext);
    const { havePlayersJoin, getCharacter } = usePlayerUtils()
    const [uid, setUid] = useState("1");


    const getGameData = async (secret: string) => {
        const gameInfo = await dev_getGame(secret);
        console.log({ gameInfo })
        console.log(JSON.stringify(gameInfo))
    }

    const setGame = async (secret: string) => {
        setGameDev(secret, stubGame);
    }

    const setPlayerVotes = async () => {
        Object.values(ctx.state.players).forEach((player) => {
            setPlayerVote({ player, mission: ctx.state.mission, gameKey: ctx.state.secret, vote: !!Math.floor(Math.random()) })
        })
    }
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: "space-around",
        }}>
            <div>

                <button onClick={havePlayersJoin}>
                    add players
                </button>
            </div>
            <div>

                <input type="text" value={uid} onChange={e => setUid(e.target.value)} />
                <button onClick={() => getCharacter("test_1", uid)}>
                    get character
                </button>
            </div>
            <div>
                <button onClick={() => getGameData("test_1")}>
                    get Game
                </button>
            </div>
            <div>
                <button onClick={() => setGame("test_1")}>
                    set Game
                </button>
            </div>
            <div>
                <button onClick={() => testNextCaptain()}>
                    next captain
                </button>
            </div>
            <div>
                <button onClick={() => setPlayerVotes()}>
                    set player votes
                </button>
            </div>
        </div>
    );
}



// VREPBESDUVXESwthMRF2osa028J3