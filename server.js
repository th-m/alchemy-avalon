const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');


const controller = require('./game.js');
const rooms = {};

const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'build')));
app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, 'build')));


io.on('connection', function (wsClient) {
  wsClient.on('message', function (data) {
    if (data) {

      let m = JSON.parse(data);
      if (!m.secret) return false;

      switch (m.step) {
        case 1:
          let joinedGame = controller.game.handleSecret(m.secret);
          if (wsClient.connected) {
            wsClient.send(JSON.stringify({ 'success': joinedGame, 'message': 'Joined game ready for step 2', 'step': 2 }));
          }
          break;

        case 2:
          let setName = controller.game.addPlayer(m.secret, m.name); // Here we need to store the client 
          if (setName) {
            if (!rooms[m.secret]) {
              rooms[m.secret] = [{ name: m.name, socket: wsClient }];
            } else {
              rooms[m.secret].push({ name: m.name, socket: wsClient });
            }
          }

          rooms[m.secret].forEach((player, i) => {
            if (!player.socket.connected) {
              rooms[m.secret].splice(i, 1);
            }
          });

          let message = { 'success': setName, players: rooms[m.secret].map(p => p.name) };

          rooms[m.secret].forEach((player) => {
            if (player.socket.connected) {
              player.socket.send(JSON.stringify(message));
            }
          });

          message['message'] = 'Joined game ready for step 2';
          message['step'] = 3;
          wsClient.send(JSON.stringify(message));
          break;

        case 3:
          playersInfo = controller.game.assignCharacters(m.secret);
          let res = { 'success': true, step: 4, 'message': "the game has begun" };
          rooms[m.secret].forEach(player => {
            res['character'] = playersInfo[player.name];
            player.socket.send(JSON.stringify(res));
          });

          controller.game.deleteGame(m.secret);
          delete rooms[m.secret];
          break;

        default:
          wsClient.send(JSON.stringify({ 'message': 'I don\'t know what you want...' }));
      }
    }
  })
})

server.listen(PORT);
