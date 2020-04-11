import React, { useReducer, createContext, Dispatch } from "react";
import { OptionalCharacters, Character } from "../../game/models";

interface ContextState {
    optionalCharacters: OptionalCharacters[];
    selectedCharacters: OptionalCharacters[];
    name: string;
    secret: string;
    character: Character;
    players: string[];
    alert: string;
    animateCard: boolean;
    step: number;
}

interface ContextInterface {
    state: ContextState,
    dispatch: Dispatch<Actions>;
    startGame: () => void;
    handleInputChange: (event: any) => void,
    sendMessage: () => void,
}

enum ActionTypes {
    addCharacterToList = "ADD_CHARACTER_TO_LIST",
    setSecret = "SET_SECRET",
    setStep = "SET_STEP",
}

interface AddCharacterToList {
    type: ActionTypes.addCharacterToList
    payload: OptionalCharacters
}

type Actions = AddCharacterToList

function reducer(state: ContextState, action: Actions) {
    switch (action.type) {
        case ActionTypes.addCharacterToList:
            return { ...state };
        default:
            return state;
    }
}

const initState: ContextState = {
    optionalCharacters: [OptionalCharacters.merlin, OptionalCharacters.percival, OptionalCharacters.knight, OptionalCharacters.knight, OptionalCharacters.knight, OptionalCharacters.knight, OptionalCharacters.mordred, OptionalCharacters.morgana, OptionalCharacters.minion, OptionalCharacters.minion],
    selectedCharacters: [],
    name: '',
    secret: '',
    character: {
        name: '',
        alignment: '',
        known: '',
    },
    players: [],
    alert: '',
    animateCard: false,
    step: 1,
}

export const GameContext = createContext<ContextInterface>({
    state: { ...initState },
    dispatch: () => { return }, // This will be updated by the reducer
    startGame: () => { return },
    handleInputChange: (event) => { return },
    sendMessage: () => { return },
});

export const GameProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initState)
    const startGame = () => {
        // firebase action to start game
    }
    const handleInputChange = (event) => {

    }
    const sendMessage = () => {

    }
    return (
        <GameContext.Provider value={{ state, dispatch, startGame, handleInputChange, sendMessage }}>
            {children}
        </GameContext.Provider>
    )
}
