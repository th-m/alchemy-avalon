import React, { useReducer, createContext, Dispatch, useEffect } from "react";
import { OptionalCharacters, Character, Player } from "../../game/models";
import { createGame, getGame, joinGame } from "../../firebase/actions";
import { to } from '../../utils';
import firebase from "firebase";
import { auth } from "../../firebase/connect.firebase";
interface ContextState {
    optionalCharacters: OptionalCharacters[];
    selectedCharacters: OptionalCharacters[];
    secret: string;
    character: Character;
    players: {
        [key: string]: Player;
    };
    step: number;
}

interface ContextInterface {
    state: ContextState,
    dispatch: Dispatch<Actions>;
}


interface AddCharacterToList {
    type: "ADD_CHARACTER_TO_LIST";
    payload: OptionalCharacters;
}
interface SetKeyString {
    type: "SET_SECRET";
    payload: string;
}

interface SetCreator {
    type: "SET_CREATOR";
    payload: true;
}

interface SetPlayer {
    type: "SET_STEP";
    payload: number;
}

type Actions = AddCharacterToList | SetKeyString | SetCreator | SetPlayer

function reducer(state: ContextState, action: Actions) {
    switch (action.type) {
        case "ADD_CHARACTER_TO_LIST":
            return { ...state };
        case "SET_SECRET":
            return { ...state, secret: action.payload };
        case "SET_CREATOR":
            return { ...state, isCreator: action.payload };
        case "SET_STEP":
            return { ...state, step: action.payload };
        default:
            return state;
    }
}

const initState: ContextState = {
    optionalCharacters: [OptionalCharacters.merlin, OptionalCharacters.percival, OptionalCharacters.knight, OptionalCharacters.knight, OptionalCharacters.knight, OptionalCharacters.knight, OptionalCharacters.mordred, OptionalCharacters.morgana, OptionalCharacters.minion, OptionalCharacters.minion],
    selectedCharacters: [],
    secret: '',
    character: {
        name: '',
        alignment: '',
        known: {}
    },
    players: {},
    step: 1,
}

export const GameContext = createContext<ContextInterface>({
    state: { ...initState },
    dispatch: () => { return }, // This will be updated by the reducer

});

export const GameProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initState)

    const checkSecret = async (secret) => {
        const gameData = await (await to(getGame(secret))).val();

        if (!gameData) {
            createGame(secret)
            dispatch({ type: "SET_CREATOR", payload: true })
            dispatch({ type: "SET_STEP", payload: 3 })
        }

        if (gameData && !gameData?.isActive) {
            joinGame(secret)
            dispatch({ type: "SET_STEP", payload: 3 })
        } else {
            console.log('game is already active');
        }

        // handle in case the game is active, get them back in
        if (gameData) {
            const playersIds = Object.keys(gameData.players);
            const currentUser = firebase.auth().currentUser;
            if (playersIds.length > 0 && currentUser && playersIds.includes(currentUser?.uid)) {
                dispatch({ type: "SET_STEP", payload: 3 })
            }
        }
    }

    useEffect(() => {
        if (state.secret) {
            checkSecret(state.secret)
        }
    }, [state.secret]);


    useEffect(() => {
        const currentUser = firebase.auth().currentUser;
        if (currentUser?.uid) {
            dispatch({ type: "SET_STEP", payload: 2 })
        }

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                dispatch({ type: "SET_STEP", payload: 2 })
            }
        });
    }, [])

    return (
        <GameContext.Provider value={{ state, dispatch }}>
            {children}
        </GameContext.Provider>
    )
}
