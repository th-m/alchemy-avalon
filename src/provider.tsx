import React, { useReducer, createContext, Dispatch, useEffect } from "react";
import { createGame, getGame, joinGame, listenForCharacter, listenForPlayers, getCharacter, listenForGameStatus, listenForCaptain, listenForRoundMissionMembers, listenForPlayerAction } from "./firebase/actions";
import firebase from "firebase";
import { Players, Player, Characters, Game, GameStatus, MissionStatuses, Alignments, KnownCharacter, PlayerAction } from "../../schemas";

interface Mission {
    membersCount?: number,
    members?: Players,
    number?: number,
    attempt?: number,
    status?: MissionStatuses | '',
}

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
    captain: string;
    mission: Mission
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
    payload: string;
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
    payload: Mission;
}

interface PlayerActoinInfo {
    type: "PLAYER_ACTION";
    payload: PlayerAction;
}

type Actions = AddCharacterToList | SetKeyString | SetCreator | SetPlayer | SetCharacter | AddPlayer | RemovePlayer | SetCaptain | UpdateMissionInfo | PlayerActoinInfo


const spreadPlayers = (playerState: Players, player: Player) => ({ ...playerState, ...{ [player.uid]: player } })
const removePlayer = (playerState: Players, player: Player) => Object.values(playerState)
    .reduce((acc, cur) => player.uid === cur.uid ? acc : spreadPlayers(acc, cur), {})


function reducer(state: ContextState, action: Actions) {
    switch (action.type) {
        case "ADD_CHARACTER_TO_LIST":
            return { ...state };
        case "SET_SECRET":
            return { ...state, secret: action.payload };
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
            return { ...state, mission: { ...state.mission, ...action.payload } };
        case "PLAYER_ACTION":
            return { ...state, action: action.payload };
        default:
            return state;
    }
}

const initState: ContextState = {
    secret: '',
    captain: '',
    action: '',
    players: {},
    setupStep: 1,
    mission: {
        status: '',
        number: 0,
        attempt: 0,
        membersCount: 0,
        members: {},
    }
}

export const GameContext = createContext<ContextInterface>({
    state: { ...initState },
    dispatch: () => { return }, // This will be updated by the reducer

});

export const GameProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initState)

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
    const checkSecret = async (secret) => {
        const gameData: Game = await getGame(secret);

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
        if (status === 'ended') {
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
            const gameStatusListener = listenForGameStatus({ gameKey: state.secret }, handleUpdateStatus);
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
            const { ref } = listenForPlayers({ gameKey: state.secret });
            ref.on("child_added", (snapshot) => handleAddPlayer(snapshot.val()))
            ref.on("child_removed", (snapshot) => handleRemovePlayer(snapshot.val()))
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

    const handleCaptainUpdate = (uuid: string) => {
        dispatch({ type: "SET_CAPTAIN", payload: uuid })
    }

    const handleRoundMembersUpdate = (membersCount) => {
        const m: Mission = { membersCount }
        dispatch({ type: "SET_UPDATE_MISSION", payload: m })
    }

    useEffect(() => {
        if (state.secret && state.setupStep >= 3) {
            const currentUser = firebase.auth().currentUser;
            if (state.secret && currentUser?.uid) {
                const characterListener = listenForCharacter({ gameKey: state.secret, uid: currentUser?.uid }, handleCharacterUpdate);
                const captainListener = listenForCaptain({ gameKey: state.secret }, handleCaptainUpdate);
                const missionMembersListener = listenForRoundMissionMembers({ gameKey: state.secret }, handleRoundMembersUpdate);

                return () => {
                    characterListener.off()
                    captainListener.off()
                    missionMembersListener.off()
                }
            }

        }
    }, [state.secret, state.setupStep])
    // END CHARACTER
    const handlePlayerAction = (action: PlayerAction) => {
        dispatch({ type: "PLAYER_ACTION", payload: action })
    }

    // PLAYER ACTION
    useEffect(() => {
        const currentUser = firebase.auth().currentUser;
        if (state.secret && currentUser?.uid) {
            const listen = listenForPlayerAction({ gameKey: state.secret, uid: currentUser?.uid }, handlePlayerAction);
            return () => {
                listen.off()
            }
        }
    }, [state.secret])
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
