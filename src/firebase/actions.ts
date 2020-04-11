import { auth, firebase } from './connect.firebase'
import { OptionalCharacters } from '../game/models';

export function createGame(gameKey: string) {
    if (auth.currentUser) {
        const { displayName, uid, photoURL } = auth.currentUser;
        firebase.database().ref(`games/${gameKey}`).set({
            createdAt: (new Date())
        });
    }
}
export function addUserToGame(gameKey: string) {
    if (auth.currentUser) {
        const { displayName, uid, photoURL } = auth.currentUser;
        firebase.database().ref(`games/${gameKey}/players`).set({
            displayName, uid, photoURL
        });
    }
}

// type Setup = {
//     goodPlayersCount: number;
//     badPlayersCount: number;
// }
interface Options {
    optionalCharacters?: OptionalCharacters[];
}

export function updateOptions(gameKey: string, options: Options) {
    if (auth.currentUser) {
        firebase.database().ref(`games/${gameKey}/options`).set({
            ...options
        });
    }
}