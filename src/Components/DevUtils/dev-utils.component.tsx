import React, { Component, Fragment, useState } from "react"
import { usePlayerUtils } from './players'
import { getGame, setGameDev, testNextCaptain } from "../../firebase/actions";
import stubGame from './stub.game.json'

export const DevUtils = () => {
    const { havePlayersJoin, getCharacter } = usePlayerUtils()
    const [uid, setUid] = useState("1");


    const getGameData = async (secret) => {
        const gameInfo = await getGame(secret);
        console.log({ gameInfo })
        console.log(JSON.stringify(gameInfo))
    }

    const setGame = async (secret) => {
        setGameDev(secret, stubGame);
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
        </div>
    );
}



// VREPBESDUVXESwthMRF2osa028J3