export enum Characters {
    intelligencer = "intelligencer",
    confidant = "confidant",
    rebel = "rebel",
    chancellor = "chancellor",
    deepfake = "deepfake",
    renegade = "renegade",
    agent = "agent",
    assassin = "assassin",
    // vigilante = "vigilante",
}

export enum Alignments {
    good = "good",
    evil = "evil",
}

export interface Character {
    characterName: keyof typeof Characters,
    alignment: keyof typeof Alignments,
    knownBy: (keyof typeof Characters)[],
    appearsAs?: keyof typeof Characters
}

export interface KnownCharacter {
    characterName: keyof typeof Characters,
    alignment: keyof typeof Alignments,
    player: Player
}

export const CharactersAlignmentMap = {
    intelligencer: Alignments.good,
    confidant: Alignments.good,
    rebel: Alignments.good,
    chancellor: Alignments.evil,
    renegade: Alignments.evil,
    deepfake: Alignments.evil,
    agent: Alignments.evil,
    assassin: Alignments.evil,
}
export interface RoundMissionMembers {
    [n: number]: number
}

export interface Rules {
    player_number: {
        [k: number]: {
            teams: {
                [a in keyof typeof Alignments]: number
            }
            roundMissionMembers: RoundMissionMembers

        }
    }
    characters: {
        [b in keyof typeof Characters]: Character
    },
    characterList: {
        [c: number]: (keyof typeof Characters)[]
    }
}


export interface Player {
    displayName: string,
    email: string,
    photoURL: string,
    uid: string,
}

export interface AssignedCharacter {
    player: Player,
    characterName: keyof typeof Characters,
    alignment: keyof typeof Alignments;
}

export interface KnowledgeableCharacter {
    playerID: string,
    player: Player,
    characterName: keyof typeof Characters,
    alignment: keyof typeof Alignments,
    knows: AssignedCharacter[]
}

export interface KnowledgeableCharactersByPlayerId {
    [playerID: string]: KnowledgeableCharacter,
}


type DateString = string;
export interface PlayerVote {
    player: Player,
    vote: boolean
}

export interface PlayersVotes {
    [playerID: string]: PlayerVote
}
// type Rounds = 1 | 2 | 3 | 4 | 5 | 0;
// type MissionChances = 1 | 2 | 3 | 4 | 5 | 0;
export interface Players {
    [uid: string]: Player
}
export interface MissionTeam {
    members: Players,
    attempt: number,
    playerVotes: PlayersVotes,
}

export type MissionStatuses = 'planning' | 'voting' | 'in progress' | 'accessed';
export interface MissionsLog {
    captain: {
        [roundNumber: string]: Player;
    },
    attempt: number,
    team: {
        [roundNumber: string]: MissionTeam;
    },
    success: PlayersVotes,
    memberCount: number,
    // status: MissionStatuses,
    successEvaluated?: boolean,
}

export interface GameMissionInfo {
    memberCount: number,
    number: number,
    attempt: number,
    status: MissionStatuses,
}

export interface MissionSummary {
    success: boolean,
}


export type PlayerAction = 'vote' | 'run mission' | 'select team';
export interface PlayersActions {
    [uid: string]: PlayerAction
}

export type GameStatus = 'waiting' | 'active' | 'ended';

export type VoteOptions = 'accept' | 'reject';

export interface Game {
    createdAt: DateString,
    host: Player,
    players: Players,
    characters: KnowledgeableCharactersByPlayerId,
    status: GameStatus,
    captain: Player,
    captainOrder: { [num: number]: string },
    mission: GameMissionInfo,
    missionMembers: Players,
    missionsLogs: {
        [roundNumber: string]: MissionsLog;
    },
    missionSummaries: {
        [roundNumber: string]: boolean;
    }
    playersActions: PlayersActions,
}

export interface MissionMembersReq {
    gameKey: string,
    missionMembers: Players,
    captain: string,

}

export interface PlayerVoteReq {
    gameKey: string;
    mission: GameMissionInfo;
    player: Player;
    vote: boolean;
}

export interface GamePaths {
    games: {
        [gameKey: string]: Game
    }
}

export const httpPaths = {
    _captain: '/captain',
    voteTeam: '/vote/team',
    missionMembers: '/mission/members',
    voteMission: '/vote/mission'
} as const;


export type httpPath = (typeof httpPaths)[keyof typeof httpPaths];
// interface Handler {
//     path:string;
//     request?: any;
// }
// class CaptainHandler implements Handler{
//     path: httpPaths.captain;
// }

// class TeamVoteHandler implements Handler{
//     path: httpPaths.teamVote;
//     request: PlayerVoteReq;
// }

// class MissionMembersHandlers implements Handler{
//     path: httpPaths.missionMembers;
//     request: MissionMembersReq;
// }

