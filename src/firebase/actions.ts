import { auth, firebase } from './connect.firebase'
import { to } from '../utils';
import { Player, GamePaths, MissionMembersReq, GameStatus, PlayerVoteReq } from "../../../avalon-fire-functions/functions/src/connivance/schema";

// Not allowed in firebase paths
// ".", "#", "$", "[", or "]"
export const cleanString = (dirty: String) => {
    return dirty.replace(/[|&;$%@"#<>.()+,]/g, "");
}

export enum httpPaths {
    captain = '/captain',
    teamVote = '/vote/team',
    missionMembers = '/mission/members',
    missionVote = '/vote/mission',
}

const base = 'http://localhost:5001/alchemy-f82c5/us-central1'
const gameRoutes = '/connivance_api';

const urlBase = base + gameRoutes
export const setMissionMembers = async (opts: MissionMembersReq) => {
    const url = urlBase + httpPaths.missionMembers

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(opts),
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        if (response.status !== 201) {
            console.warn('something bad happened with the mission')
        }
    }).then(function (data) {
        console.log('set mission members response:', data);
    });
}
// PlayerVoteReq
export const testNextCaptain = () => {
    const url = urlBase + httpPaths.captain
    fetch(url, {
        method: 'POST',
        body: '',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        console.log(response)
        // return response?.json() ?? {};
    }).then(function (data) {
        console.log('set mission members response:', data);
    });
}

export const setTeamVote = (voteRequest: PlayerVoteReq) => {
    const url = urlBase + httpPaths.teamVote
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(voteRequest),
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        console.log(response)
        // return response?.json() ?? {};
    }).then(function (data) {
        console.log('set mission members response:', data);
    });
}

export const setMissionVote = (voteRequest: PlayerVoteReq) => {
    const url = urlBase + httpPaths.missionVote
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(voteRequest),
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        console.log(response)
        // return response?.json() ?? {};
    }).then(function (data) {
        console.log('set mission members response:', data);
    });
}

export const routes = (key: string) => typedPath<GamePaths>().games[key]

export const toRoute = (path: TypedPathWrapper<any>) => {
    return path.toString().split('.').join('/')
}

export async function dev_getCharacter(gameKey: string, uid: string) {
    const path = routes(gameKey).characters[uid].$path;
    return await getValue(path)
}

export async function dev_getGame(gameKey: string) {
    const path = routes(gameKey).$path
    return await getValue(path)
}

export function joinGame(gameKey: string) {
    if (auth.currentUser) {
        _joinGame(gameKey, auth.currentUser);
    }
}

function _joinGame(gameKey: string, player?: Player | firebase.User) {
    if (player) {
        const { displayName, uid, photoURL, email } = player;
        firebase.database().ref(`games/${gameKey}/players`).update({
            [uid]: { displayName, uid, photoURL, email }
        });

        firebase.database().ref(`usersGames/${uid}/`).update({
            gameID: gameKey, lastUpdated: (new Date).toISOString()
        });
    }
}

export function joinGameDev(gameKey: string, player: Player) {
    _joinGame(gameKey, player);
}

export function setGameDev(gameKey: string, d: Object) {
    firebase.database().ref(`games/${gameKey}`).update(d);
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

interface Listener {
    off: CleanUP;
}

function listen<T = any>(path: string, cb: (d: T) => void): Listener {
    const ref = firebase.database().ref(path);
    if (cb) {
        ref.on("value", (snapshot) => cb(snapshot.val()))
    }
    return {
        off: () => ref.off('value'),
    }
}

async function getValue<T = any>(path: string): Promise<T> {
    const p = firebase.database().ref(path).once('value', snap => snap)
    return (await to(p)).val()
}


const toStringMethods: (string | symbol | number)[] = [
    'toString',
    Symbol.toStringTag,
    'valueOf'
];

function pathToString(path: string[]): string {
    return path.reduce((current, next) => {
        if (+next === +next) {
            current += `[${next}]`;
        } else {
            current += current === '' ? `${next}` : `.${next}`;
        }

        return current;
    }, '');
}


export function typedPath<T>(path: string[] = []): TypedPathWrapper<T> {
    return <TypedPathWrapper<T>>new Proxy({}, {
        get(target: T, name: TypedPathKey) {
            if (name === '$path') {
                return pathToString(path).split('.').join('/')
            }

            if (name === '$raw') {
                return path;
            }

            if (name === '$listen') {
                const route = pathToString(path).split('.').join('/')
                return (cb: any) => listen<T>(route, cb);
            }

            if (name === '$value') {
                const route = pathToString(path).split('.').join('/')
                return getValue(route);
            }

            if (name === '$ref') {
                const route = pathToString(path).split('.').join('/')
                return firebase.database().ref(route);
            }

            if (toStringMethods.includes(name)) {
                return () => pathToString(path);
            }

            return typedPath([...path, name.toString()]);
        }
    });
}

type TypedPathKey = string | symbol | number;

type TypedPathNode<T> = {
    $path: string;
    $raw: TypedPathKey[];
    $listen: (cb: (d: T) => void) => Listener;
    $ref: firebase.database.Reference;
    $value: Promise<T>;
};

type TypedPathFunction<T> = (...args: any[]) => T;

export type TypedPathWrapper<T> = (T extends Array<infer Z>
    ? {
        [index: number]: TypedPathWrapper<Z>;
    }
    : T extends TypedPathFunction<infer RET>
    ? {
        (): TypedPathWrapper<RET>;
    } & {
        [P in keyof RET]: TypedPathWrapper<RET[P]>;
    }
    : {
        [P in keyof T]: TypedPathWrapper<T[P]>;
    }
) & TypedPathNode<T>;
