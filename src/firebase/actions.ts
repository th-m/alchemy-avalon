import { auth, firebase } from './connect.firebase'
import { OptionalCharacters } from '../game/models';

export function createGame(gameKey: string) {
    if (auth.currentUser) {
        firebase.database().ref(`games/${gameKey}`).set({
            createdAt: (new Date()),
            isActive: false
        });
    }
}

export async function getGame(gameKey: string) {
    // if (auth.currentUser) {
    return firebase.database().ref(`games/${gameKey}`).once('value', snap => snap.val());
    // }
}

export function addUserToGame(gameKey: string) {
    if (auth.currentUser) {
        const { displayName, uid, photoURL } = auth.currentUser;
        firebase.database().ref(`games/${gameKey}/players`).set({
            displayName, uid, photoURL
        });
    }
}

export function startGame(gameKey: string) {
    if (auth.currentUser) {
        firebase.database().ref(`games/${gameKey}`).set({
            isActive: true
        });
    }
}

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