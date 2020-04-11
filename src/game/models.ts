// export type OptionalCharacters = "merlin" | "percival" | "knight" | "mordred" | "morgana" | "minion" | "minion";

export enum OptionalCharacters {
    merlin = "merlin",
    percival = "percival",
    knight = "knight",
    mordred = "mordred",
    morgana = "morgana",
    minion = "minion",
}

export interface Character {
    name: string;
    alignment: string;
    known: any;
}