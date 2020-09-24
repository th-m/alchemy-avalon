import React, { useReducer, createContext, Dispatch, useEffect } from "react";
import { createGame, joinGame, TypedPathWrapper, typedPath } from "./firebase/actions";
import firebase from "firebase";
import { Players, Player, Characters, Game, GameStatus, Alignments, KnownCharacter, PlayerAction, GameMissionInfo, GamePaths, MissionsLog } from "./schema";

export interface Character {
    characterName: keyof typeof Characters,
    alignment: keyof typeof Alignments,
    knows: KnownCharacter[],
    player: Player,
    playerID: string,
}

interface ContextState {
    secret: string;
    action: PlayerAction | ''
    character?: Character;
    players: Players;
    setupStep: number;
    captain: Player;
    mission: GameMissionInfo;
    missionSummaries: {
        [roundNumber: string]: boolean;
    }
    missionMembers: Players;
    activeMission: number;
    db: TypedPathWrapper<Game>;
}

interface ContextInterface {
    state: ContextState,
    dispatch: Dispatch<Actions>;
}


interface AddCharacterToList {
    type: "ADD_CHARACTER_TO_LIST";
    payload: keyof typeof Characters;
}

interface SetKeyString {
    type: "SET_SECRET";
    payload: string;
}

interface SetCaptain {
    type: "SET_CAPTAIN";
    payload: Player;
}

interface SetCreator {
    type: "SET_CREATOR";
    payload: true;
}

interface SetPlayer {
    type: "SET_SETUP_STEP";
    payload: number;
}
interface SetCharacter {
    type: "SET_CHARACTER";
    payload: Character;
}

interface AddPlayer {
    type: "ADD_PLAYER";
    payload: Player;
}
interface RemovePlayer {
    type: "REMOVE_PLAYER";
    payload: Player;
}

interface UpdateMissionInfo {
    type: "SET_UPDATE_MISSION";
    payload: GameMissionInfo;
}

interface PlayerActionInfo {
    type: "PLAYER_ACTION";
    payload: PlayerAction;
}

interface AddMissionMember {
    type: "SET_MISSION_MEMBERS";
    payload: Players;
}
interface MissionSummaries {
    type: "MISSION_SUMMARIES";
    payload: {
        [roundNumber: string]: boolean;
    };
}


type Actions = AddCharacterToList | SetKeyString | SetCreator | SetPlayer | SetCharacter | AddPlayer | RemovePlayer | SetCaptain | UpdateMissionInfo | PlayerActionInfo | AddMissionMember | MissionSummaries

const spreadPlayers = (playerState: Players, player: Player) => ({ ...playerState, ...{ [player.uid]: player } })
const removePlayer = (playerState: Players, player: Player) => Object.values(playerState)
    .reduce((acc, cur) => player.uid === cur.uid ? acc : spreadPlayers(acc, cur), {})


function reducer(state: ContextState, action: Actions) {
    switch (action.type) {
        case "ADD_CHARACTER_TO_LIST":
            return { ...state };
        case "SET_SECRET":
            return { ...state, secret: action.payload, db: typedPath<GamePaths>().games[action.payload] };
        case "SET_CREATOR":
            return { ...state, isCreator: action.payload };
        case "SET_SETUP_STEP":
            // 1 authenticate
            // 2 enter secret
            // 3 waiting room
            // 4 in game
            return { ...state, setupStep: action.payload };
        case "SET_CHARACTER":
            return { ...state, character: action.payload };
        case "ADD_PLAYER":
            return { ...state, players: spreadPlayers(state.players, action.payload) };
        case "REMOVE_PLAYER":
            return { ...state, players: removePlayer(state.players, action.payload) };
        case "SET_CAPTAIN":
            return { ...state, captain: action.payload };
        case "SET_UPDATE_MISSION":
            return { ...state, mission: action.payload };
        case "SET_MISSION_MEMBERS":
            return { ...state, missionMembers: action.payload };
        case "PLAYER_ACTION":
            return { ...state, action: action.payload };
        case "MISSION_SUMMARIES":
            return { ...state, missionSummaries: action.payload };
        default:
            return state;
    }
}

const initState: ContextState = {
    secret: '',
    captain: {
        displayName: '',
        email: '',
        photoURL: '',
        uid: '',
    },
    action: '',
    players: {},
    setupStep: 1,
    mission: {
        status: 'planning',
        number: 0,
        attempt: 0,
        memberCount: 0,
    },
    missionMembers: {},
    missionSummaries: {},
    activeMission: 0,
    db: typedPath<GamePaths>().games['']
}

export const GameContext = createContext<ContextInterface>({
    state: { ...initState },
    dispatch: () => { return }, // This will be updated by the reducer

});

interface Props {
    children: JSX.Element[]
}
export const GameProvider = ({ children }: Props) => {
    const [state, dispatch] = useReducer(reducer, initState)
    const { db } = state;
    // AUTH
    useEffect(() => {
        const currentUser = firebase.auth().currentUser;
        if (currentUser?.uid) {
            dispatch({ type: "SET_SETUP_STEP", payload: 2 })
        }

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                dispatch({ type: "SET_SETUP_STEP", payload: 2 })
            }
        });
    }, [])
    // END AUTH

    // SECRET
    const checkSecret = async (secret: string) => {
        const gameData: Game = await db.$value;
        if (!gameData) {
            createGame(secret)
            dispatch({ type: "SET_CREATOR", payload: true })
            dispatch({ type: "SET_SETUP_STEP", payload: 3 })
        }

        if (gameData && gameData?.status === "waiting") {
            joinGame(secret)
            dispatch({ type: "SET_SETUP_STEP", payload: 3 })
        } else {
            console.log('game is already active');
        }

        // handle in case the game is active and user needs to get back in
        if (gameData) {
            const playersIds = Object.keys(gameData.players);
            const currentUser = firebase.auth().currentUser;
            if (playersIds.length > 0 && currentUser && playersIds.includes(currentUser?.uid)) {
                dispatch({ type: "SET_SETUP_STEP", payload: 3 })
            }
        }

    }

    const handleUpdateStatus = (status: GameStatus) => {
        if (status === "ended") {
            const currentUser = firebase.auth().currentUser;
            if (currentUser?.uid) {
                dispatch({ type: "SET_SETUP_STEP", payload: 2 })
            } else {
                dispatch({ type: "SET_SETUP_STEP", payload: 1 })
            }
        }
    }

    useEffect(() => {
        if (state.secret) {
            checkSecret(state.secret)
            const gameStatusListener = db.status.$listen(handleUpdateStatus)
            return () => {
                gameStatusListener.off()
            }
        }
    }, [state.secret]);
    // END SECRET

    // PLAYER
    const handleAddPlayer = (player: Player) => {
        dispatch({ type: "ADD_PLAYER", payload: player })
    }

    const handleRemovePlayer = (player: Player) => {
        dispatch({ type: "REMOVE_PLAYER", payload: player })
    }

    useEffect(() => {
        if (state.secret) {
            const ref = db.players.$ref;
            ref.on("child_added", (snapshot: any) => handleAddPlayer(snapshot.val()))
            ref.on("child_removed", (snapshot: any) => handleRemovePlayer(snapshot.val()))
            return () => {
                ref.off("child_added")
                ref.off("child_removed")
            }
        }
    }, [state.secret])
    // END PLAYER


    // CHARACTER
    const handleCharacterUpdate = (characterSnapshot: Character) => {
        if (characterSnapshot && characterSnapshot?.playerID === firebase.auth().currentUser?.uid) {
            dispatch({ type: "SET_CHARACTER", payload: characterSnapshot })
            dispatch({ type: "SET_SETUP_STEP", payload: 4 })
        }
    }

    const handleCaptainUpdate = (player: Player) => {
        dispatch({ type: "SET_CAPTAIN", payload: player })
    }

    const handleMissionUpdate = (missionInfo: GameMissionInfo) => {
        dispatch({ type: "SET_UPDATE_MISSION", payload: missionInfo })
    }

    const handleMissionMembersUpdate = (missionMembers: Players) => {
        dispatch({ type: "SET_MISSION_MEMBERS", payload: missionMembers })
    }

    const handlePlayerAction = (action: PlayerAction) => {
        dispatch({ type: "PLAYER_ACTION", payload: action })
    }

    const handleMissionSummaries = (action: {
        [roundNumber: string]: boolean;
    }) => {
        dispatch({ type: "MISSION_SUMMARIES", payload: action })
    }

    useEffect(() => {
        if (state.secret && state.setupStep >= 3) {
            const currentUser = firebase.auth().currentUser;
            if (state.secret && currentUser?.uid) {
                const characterListener = db.characters[currentUser.uid].$listen(handleCharacterUpdate)

                const captainListener = db.captain.$listen(handleCaptainUpdate)
                const missionListener = db.mission.$listen(handleMissionUpdate)
                const missionMembersListener = db.missionMembers.$listen(handleMissionMembersUpdate);
                const playerActionListener = db.playersActions[currentUser.uid].$listen(handlePlayerAction)
                const missionSummaries = db.missionSummaries.$listen(handleMissionSummaries)

                return () => {
                    characterListener.off()
                    captainListener.off()
                    missionListener.off()
                    missionMembersListener.off()
                    playerActionListener.off()
                }
            }

        }
    }, [state.secret, state.setupStep])

    // END CHARACTER

    // // PLAYER ACTION
    // useEffect(() => {
    //     const currentUser = firebase.auth().currentUser;
    //     if (state.secret && currentUser?.uid) {

    //         // const listen = listenForPlayerAction({ gameKey: state.secret, uid: currentUser?.uid }, handlePlayerAction);
    //         return () => {
    //         }
    //     }
    // }, [state.secret])
    // END PLAYER ACTION
    // Allows for plugging in secret after game has ended
    useEffect(() => {
        if (state.setupStep === 2) {
            dispatch({ type: "SET_SECRET", payload: "" })
        }
    }, [state.setupStep])
    return (
        <GameContext.Provider value={{ state, dispatch }}>
            {children}
        </GameContext.Provider>
    )
}
