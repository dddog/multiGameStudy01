// Placeholder file for Node.js game server
var express = require('express');
var app = express();
var http = require('http').Server(app);

var util = require('util'),
    io = require('socket.io')(http),
    Player = require('./Player.js').Player;

var socket,
    players;

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendfile('public/index.html');
});


// 초기화 함수
function init() {
    players = [];    // 플레이어 빈 배열로 설정
    
    // 소켓 서버를 3000 포트로 가져온다
    http.listen(3000, function() {
        console.log('listening on : 3000');
    });
    
    setEventHandlers();
}



var setEventHandlers = function() {
    // Socket.IO에 대한 새 연결이 있다면 onSocketConnection 콜백함수가 수행
    io.on('connection', onSocketConnection);
};

function onSocketConnection(client) {
    util.log('New player has connected: ' + client.id);
    client.on('disconnect', onClientDisconnect);
    client.on('new player', onNewPlayer);
    client.on('move player', onMovePlayer);
}

function onClientDisconnect() {
    util.log('Player has disconnected: ' + this.id);
    
    var removePlayer = playerById(this.id);

	// Player not found
	if (!removePlayer) {
		util.log("Player not found: "+this.id);
		return;
	};
    
    // 각 플레이어에게 접속해제한 플레이어 정보 이벤트 발생
    players.splice(players.indexOf(removePlayer), 1);
    this.broadcast.emit("remove player", {id: this.id});
}

function onNewPlayer(data) {
    
    // 새로운 플레이어 생성
    var newPlayer = new Player(data.x, data.y, data.fillStyle);
    newPlayer.id = this.id;
    
    // 새 플레이어가 생성되면 연결된 다른 플레이어에게 알림
    this.broadcast.emit('new player', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY(), fillStyle: newPlayer.getFillStyle()});
    
    
    // 기존에 있던 플레이어 정보를 새로 접속한 플레이어에게 전달
    var i, existingPlayer;
    for (i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        console.log('emit[new player]: '+existingPlayer.id);
        this.emit('new player', {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY(), fillStyle: existingPlayer.getFillStyle()});
    };
    
    // 새 플레이어가 나중에 액세스시 처리 될 수 있게 플레이어 리스트에 추가한다.
    players.push(newPlayer);
}

function onMovePlayer(data) {
    var movePlayer = playerById(this.id);
    
    if(!movePlayer) {
        util.log("Player not found: "+this.id);
        return;
    }
    
    movePlayer.setX(data.x);
    movePlayer.setY(data.y);
    movePlayer.setFillStyle(data.fillStyle);
    
    this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY(), fillStyle: movePlayer.getFillStyle()});
}


// playerById
// param : id
function playerById(id) {
    var i;
    for (i = 0; i < players.length; i++) {
        if ( players[i].id == id ) {
            return players[i];
        }
    }
    return false;
}


// RUN THE GAME
init();







//// 소켓이 WebSocket
//socket.configure(function() {
//    socket.set('transports', ['websocket']);
//    socket.set('log level', 2);
//});