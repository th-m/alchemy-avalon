const rules = {
      player_number: {
        "5":{"good":3,"evil":2},
        "6":{"good":4,"evil":2},
        "7":{"good":4,"evil":3},
        "8":{"good":5,"evil":3},
        "9":{"good":6,"evil":3},
        "10":{"good":6,"evil":4},
      },
      characters: {
        "merlin":{"name":"merlin","alignment":"good","knownBy":['percival'], 'known':{} },
        "mordred":{"name":"mordred","alignment":"evil","knownBy":null, 'known':{} },
        "percival":{"name":"percival","alignment":"good","knownBy":null, 'known':{} },
        "oberon":{"name":"oberon","alignment":"evil","knownBy":['mordred'], 'known':{} },
        "morgana":{"name":"morgana","alignment":"evil","knownBy":['percival'], 'appearAs':'merlin', 'known':{} },
        "minion":{"name":"minion","alignment":"evil","knownBy":['mordred','merlin'], 'known':{} },
        "knight":{"name":"knight","alignment":"good","knownBy":null, 'known':{} }
      },
      characterList:{
        '1': ["merlin"],
        '2': ["merlin","minion"],
        '3': ["merlin","knight","mordred"],
        '4': ["merlin","knight","mordred","minion"],
        '5': ["merlin","knight","knight","mordred","minion"],
        '6': ["merlin","knight","knight","knight","mordred","minion"],
        '7': ["merlin","knight","knight","knight","mordred","minion","minion"],
        '8': ["merlin","percival","knight","knight","knight","mordred","minion","minion"],
        '9': ["merlin","percival","knight","knight","knight","knight","mordred","morgana","minion"],
        '10': ["merlin","percival","knight","knight","knight","knight","mordred","morgana","minion","minion"],
      }
    }

function shuffle(array) {
  if(!array)
    return false;
    
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


const game = {
  handleSecret: (secret) => {
    if(!game[secret]){
      game.addSecret(secret);
    }
    return true;
  },
  addSecret: (secret) => {
    game[secret] = {
      players: [],
      characters: {},
    }
  },
  addPlayer: (secret, playerName) => {
    if(game[secret].players.includes(playerName)) return false;
    game[secret].players.push(playerName);
    return true;
  },
  removePlayer: (secret, playerName) => {
    game[secret].players = game[secret].players.filter(p => p != playerName)
  },
  deleteGame: (secret) => {
    delete game[secret].characters;
    delete game[secret].players;
    delete game[secret];
  },
  assignCharacters: (secret) => {
    
    let characters = shuffle(rules.characterList[game[secret].players.length]);
    
    for (let i = 0; i <  characters.length; i++) {
      let  char = JSON.parse( JSON.stringify(rules.characters[characters[i]] ) );
      game[secret].characters[game[secret].players[i]] = char;
      
    }
    
    Object.entries(game[secret].characters).forEach(x=>{
        if(x[1].knownBy){
          x[1].knownBy.forEach( i =>{
            Object.keys(game[secret].characters).forEach(j =>{
              if(game[secret].characters[j].name === i ){
                let characterName = (x[1].appearAs ? x[1].appearAs : x[1].name);
                if( game[secret].characters[j].known[characterName] ){
                  game[secret].characters[j].known[characterName].push(x[0] )
                }else{
                  game[secret].characters[j].known = {[characterName] : [x[0]] };
                }
              }
            })
          })
        }
    })
    
    return game[secret].characters;
  
  },
  makeTest: () => {
    game.handleSecret('test');
    for (var i = 0; i < 10; i++) {
      game.addPlayer('test','a_'+i);
    }
  }
  
}
    
module.exports = {
  game
}