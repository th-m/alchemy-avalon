import React, { Component, Fragment, useState } from "react"
import { usePlayerUtils } from './players'
import { getGame } from "../../firebase/actions";

export const DevUtils = () => {
    const { havePlayersJoin, getCharacter } = usePlayerUtils()
    const [uid, setUid] = useState("1");


    const getGameData = async (secret) => {
        const gameInfo = await getGame(secret);
        console.log({ gameInfo })
        console.log(JSON.stringify(gameInfo))
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

                <input type="text" value={uid} onChange={e => setUid(e.target.value)} />
                <button onClick={() => getGameData("test_1")}>
                    get Game
                </button>
            </div>
        </div>
    );
}



// VREPBESDUVXESwthMRF2osa028J3