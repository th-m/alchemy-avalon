import { auth, firebase } from './connect.firebase'
import { OptionalCharacters } from '../game/models';

export function listenForCharacter(gameKey, uid) {
    return firebase.database().ref(`games/${gameKey}/characters/${uid}`);
}

export async function getGame(gameKey: string) {
    return firebase.database().ref(`games/${gameKey}`).once('value', snap => snap.val());
}

export function joinGame(gameKey: string) {
    if (auth.currentUser) {
        const { displayName, uid, photoURL, email } = auth.currentUser;
        firebase.database().ref(`games/${gameKey}/players`).set({
            [uid]: { displayName, uid, photoURL, email }
        });
    }
}

export function createGame(gameKey: string) {
    if (auth.currentUser) {
        const { displayName, uid, photoURL, email } = auth.currentUser;
        firebase.database().ref(`games/${gameKey}`).set({
            createdAt: (new Date()).toISOString(),
            isActive: false,
            players: {
                [uid]: { displayName, uid, photoURL, email }
            }
        });
    }
}

interface Options {
    optionalCharacters?: OptionalCharacters[];
}

export function updateOptions(gameKey: string, options: Options) {
    firebase.database().ref(`games/${gameKey}/options`).set({
        ...options
    });
}