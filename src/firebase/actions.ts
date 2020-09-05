import { auth, firebase } from './connect.firebase'
import { to } from '../utils';
import { Players, Player, Characters, Game, SetMissionMembersReq, GameStatus, MissionStatuses, Alignments, KnownCharacter, PlayerAction } from "../../../schemas";
import { Character } from '../provider';

// Not allowed in firebase paths
// ".", "#", "$", "[", or "]"
export const cleanString = (dirty: String) => {
    return dirty.replace(/[|&;$%@"#<>.()+,]/g, "");
}

export const setMissionMembers = (opts: SetMissionMembersReq) => {
    const url = 'http://localhost:5001/alchemy-f82c5/us-central1/setMissionMembers'
    fetch(url, {
        method: 'post',
        body: JSON.stringify(opts)
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log('set mission members response:', data);
    });
}

type UID = string;
interface ListenKeys {
    [key: string]: string;
}

type ListenCallBack<T> = (t: T) => void;
export function listenForCharacter({ gameKey, uid }: ListenKeys, cb: ListenCallBack<Character>) {
    return listen(`games/${gameKey}/characters/${uid}`, cb)
}

export function listenForPlayerAction({ gameKey, uid }: ListenKeys, cb: ListenCallBack<PlayerAction>) {
    return listen(`games/${gameKey}/playerActions/${uid}`, cb)
}

export function listenForCaptain({ gameKey }: ListenKeys, cb: ListenCallBack<UID>) {
    return listen(`games/${gameKey}/currentCaptain`, cb)
}
export function listenForRoundMissionMembers({ gameKey }: ListenKeys, cb: ListenCallBack<any>) {
    return listen(`games/${gameKey}/mission`, cb);
}

export function listenForPlayers({ gameKey }: ListenKeys, cb?: ListenCallBack<Players>) {
    return listen(`games/${gameKey}/players`, cb);
}
export function listenForGameStatus({ gameKey }: ListenKeys, cb: ListenCallBack<GameStatus>) {
    return listen(`games/${gameKey}/status`, cb);
}

export async function getCharacter(gameKey, uid) {
    return await getValue(`games/${gameKey}/characters/${uid}`)
}

export async function getGame(gameKey) {
    return await getValue(`games/${gameKey}`)
}

export async function getUsersGame(uid: string) {
    return await getValue(`usersGames/${uid}`)
}

export function joinGame(gameKey: string) {
    if (auth.currentUser) {
        _joinGame(gameKey, auth.currentUser);
    }
}

function _joinGame(gameKey, player) {
    const { displayName, uid, photoURL, email } = player;
    firebase.database().ref(`games/${gameKey}/players`).update({
        [uid]: { displayName, uid, photoURL, email }
    });

    firebase.database().ref(`usersGames/${uid}/`).update({
        gameID: gameKey, lastUpdated: (new Date).toISOString()
    });
}

export function joinGameDev(gameKey: string, player) {
    _joinGame(gameKey, player);
}

export function startGame(gameKey: string) {
    const status: GameStatus = "active";
    firebase.database().ref(`games/${gameKey}`).update({
        createdAt: (new Date()).toISOString(),
        status: status,
    });
}
export function createGame(gameKey: string) {
    if (auth.currentUser) {
        const { displayName, uid, photoURL, email } = auth.currentUser;
        const status: GameStatus = "waiting";
        firebase.database().ref(`games/${gameKey}`).set({
            createdAt: (new Date()).toISOString(),
            status: status,
            creatorUid: uid,
            players: {
                [uid]: { displayName, uid, photoURL, email }
            }
        });

        firebase.database().ref(`usersGames/${uid}/`).update({
            gameID: gameKey, lastUpdated: (new Date).toISOString()
        });
    }
}

type CleanUP = () => void;

function listen(s: string, cb?: (d: any) => void): { off: CleanUP, ref: firebase.database.Reference } {
    const ref = firebase.database().ref(s);
    if (cb) {
        ref.on("value", (snapshot) => cb(snapshot.val()))
    }
    return {
        off: () => ref.off('value'),
        ref: ref,
    }
}

async function getValue(s: string) {
    const p = firebase.database().ref(s).once('value', snap => snap)
    return (await to(p)).val()
}