import React, { useContext, useState } from "react"
import { usePlayerUtils } from './players'
import { dev_getGame, setGameDev, testNextCaptain, setTeamVote, setMissionVote, setMissionMembers } from "../../firebase/actions";
import stubGame from './stub.game.json'
import { GameContext } from "../../provider";
import { MissionMembersReq } from "../../../../avalon-fire-functions/functions/src/connivance/schema";

export const DevUtils = () => {
    const ctx = useContext(GameContext);
    const { havePlayersJoin, getCharacter } = usePlayerUtils()
    // const [uid, setUid] = useState("1");


    const getGameData = async (secret: string) => {
        const gameInfo = await dev_getGame(secret);
        console.log({ gameInfo })
        console.log(JSON.stringify(gameInfo))
    }

    const setGame = async (secret: string) => {
        setGameDev(secret, stubGame);
    }

    const setTeam = async () => {
        const c = ctx.state.mission.memberCount;
        const p = Object?.values(ctx.state?.players) ?? [];
        const req: MissionMembersReq = {
            gameKey: ctx.state.secret,
            missionMembers: {},
            captain: ctx.state.captain.uid,
        }
        // gameKey: string,
        // missionMembers: Players,
        // captain: string,
        for (let index = 0; index < c; index++) {
            // const element = array[index];
            req.missionMembers[p[index].uid] = p[index]

        }

        setMissionMembers(req)
        // setGameDev(secret, stubGame);
    }

    const setPlayerVotes = async (vote: boolean) => {
        Object.values(ctx.state?.players ?? {}).forEach((player) => {
            setTeamVote({ player, mission: ctx.state.mission, gameKey: ctx.state.secret, vote })
        })
    }

    const setMissionVotes = async (vote: boolean) => {
        Object.values(ctx.state?.missionMembers ?? {}).forEach((player) => {
            setMissionVote({ player, mission: ctx.state.mission, gameKey: ctx.state.secret, vote })
        })
    }
    return (
        <div style={{
            position: 'fixed',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: "space-around",
            right: 0,
            left: 0,
            bottom: 0,
            zIndex: 99999,
        }}>
            <div>

                <button onClick={havePlayersJoin}>
                    add players
                </button>
            </div>
            {/* <div>

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
            </div> */}
            <div>
                <button onClick={() => testNextCaptain()}>
                    next captain
                </button>
            </div>
            <div>
                <button onClick={() => setTeam()}>
                    set team
                </button>
            </div>
            <div>
                <button onClick={() => setPlayerVotes(false)}>
                    fail team
                </button>
                <button onClick={() => setPlayerVotes(true)}>
                    pass team
                </button>
            </div>
            <div>
                <button onClick={() => setMissionVotes(true)}>
                    pass mission votes
                </button>
                <button onClick={() => setMissionVotes(false)}>
                    fail mission votes
                </button>
            </div>
        </div>
    );
}