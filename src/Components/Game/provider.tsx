import React, { useReducer, createContext, Dispatch, useEffect } from "react";
import { OptionalCharacters, Character, Player } from "../../game/models";
import { createGame, getGame } from "../../firebase/actions";
import { to } from '../../utils';
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

type Actions = AddCharacterToList | SetKeyString | SetCreator

function reducer(state: ContextState, action: Actions) {
    switch (action.type) {
        case "ADD_CHARACTER_TO_LIST":
            return { ...state };
        case "SET_SECRET":
            return { ...state, secret: action.payload };
        case "SET_SECRET":
            return { ...state, isCreator: action.payload };
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

    const asyncGetGame = async () => {
        const gameData = await (await to(getGame(state.secret))).val();
        if (!gameData) {
            dispatch({ type: "SET_CREATOR", payload: true })
        }
        if (gameData?.isActive) {
            console.log('game is already active');
        }
        // console.log(gameData);
    }

    useEffect(() => {
        asyncGetGame()
    }, [state.secret]);
    console.log(state);
    return (
        <GameContext.Provider value={{ state, dispatch }}>
            {children}
        </GameContext.Provider>
    )
}
