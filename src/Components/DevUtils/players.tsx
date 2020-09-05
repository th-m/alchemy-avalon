import { Players } from '../../../../schemas/';
import { joinGame, joinGameDev, getCharacter } from '../../firebase/actions'
import { auth } from '../../firebase/connect.firebase'
import { to } from '../../utils';
const player1 = {
    displayName: "danny",
    email: "danny@p1.codes",
    photoURL: "https://images.unsplash.com/photo-1497752531616-c3afd9760a11?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
    uid: "1",
}
const player2 = {
    displayName: "ricky",
    email: "ricky@p2.codes",
    photoURL: "https://image.shutterstock.com/image-photo/elephant-on-sunset-national-park-260nw-1182593230.jpg",
    uid: "2",
}
const player3 = {
    displayName: "tommy",
    email: "tommy@p3.codes",
    photoURL: "https://cdn.vox-cdn.com/thumbor/6oEPJ9s5H9rzubYWS-LKBWhNE9k=/0x0:3000x2225/1200x800/filters:focal(1082x339:1562x819)/cdn.vox-cdn.com/uploads/chorus_image/image/66609943/GettyImages_137497593.0.jpg",
    uid: "3",
}
const player4 = {
    displayName: "abbey",
    email: "abbey@p4.codes",
    photoURL: "https://www.marylandzoo.org/wp-content/uploads/2018/04/lemuranimaheader3.jpg",
    uid: "4",
}
const player5 = {
    displayName: "milly",
    email: "milly@p5.codes",
    photoURL: "https://cdn.hswstatic.com/gif/animal-stereotype-orig.jpg",
    uid: "5",
}
const player6 = {
    displayName: "bethy",
    email: "bethy@p6.codes",
    photoURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQBPdFHPaGebRk1P-UaSRoamb_qhx-ajvqIKA&usqp=CAU",
    uid: "6",
}
const player7 = {
    displayName: "billy",
    email: "billy@p7.codes",
    photoURL: "https://media.cntraveler.com/photos/5d8132bab18b620008ca13a0/master/pass/Cape-Buffalo_GettyImages-508555262.jpg",
    uid: "7",
}
const player8 = {
    displayName: "sammy",
    email: "sammy@p8.codes",
    photoURL: "https://scx1.b-cdn.net/csz/news/800/2019/canwereallyk.jpg",
    uid: "8",
}

const players: Players = {
    1: player1,
    2: player2,
    3: player3,
    4: player4,
    5: player5,
    6: player6,
    7: player7,
    8: player8,
}

const testGame = "test_1"
const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const sendPlayerIn = player => {
    return sleep(1000).then(v => joinGameDev(testGame, player))
}

const havePlayersJoin = async () => {
    for (const player of Object.values(players)) {
        await sendPlayerIn(player)
        // console.log(player, "joined")
    }
}

const getChar = async (secret, uid) => {
    const characterData = await getCharacter(secret, uid);
    console.log({ characterData })
}

export const usePlayerUtils = () => {
    return {
        getCharacter: getChar,
        havePlayersJoin
    }
}