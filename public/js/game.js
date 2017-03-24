/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,			// Canvas DOM element
	ctx,			// Canvas rendering context
	keys,			// Keyboard input
	localPlayer,	// Local player
    remotePlayers,  // Remote Player
    socket;         // socket


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Declare the canvas and rendering context
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");

	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// Initialise keyboard controls
	keys = new Keys();

	// Calculate a random start position for the local player
	// The minus 5 (half a player size) stops the player being
	// placed right on the egde of the screen
	var startX = Math.round(Math.random()*(canvas.width-5)),
		startY = Math.round(Math.random()*(canvas.height-5));

	// Initialise the local player
	localPlayer = new Player(startX, startY);
    
    // 소켓 연결을 초기화
    // param1 : 서버 주소
    // param2 : port, WebSocket 연결
    socket = io();
    
    // remote players array init
    remotePlayers = [];
    
    
    // Start listening for events
	setEventHandlers();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Keyboard
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

	// Window resize
	window.addEventListener("resize", onResize, false);
    
    // 소켓 이벤트 수신하고 처리하는 핸들러 함수 설정
    socket.on("connect", onSocketConnected);
    socket.on("disconnect", onSocketDisconnect);
    socket.on("new player", onNewPlayer);
    socket.on("move player", onMovePlayer);
    socket.on("remove player", onRemovePlayer);
};

// Keyboard key down
function onKeydown(e) {
	if (localPlayer) {
		keys.onKeyDown(e);
	};
};

// Keyboard key up
function onKeyup(e) {
	if (localPlayer) {
		keys.onKeyUp(e);
	};
};

// Browser window resize
function onResize(e) {
	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

// 소켓 접속시
function onSocketConnected() {
    console.log("Connected to socket server");
    
    // 소켓 접속시 새로운 플레이어를 만들겠다고 이벤트 발생
    socket.emit("new player", {x: localPlayer.getX(), y: localPlayer.getY()});
};

// 소켓 disconnect
function onSocketDisconnect() {
    console.log("Disconnected from socket server");
};

// 새로운 플레이어 이벤트
function onNewPlayer(data) {
    console.log("New player connected: " + data.id);
    
    // 서버로 부터 새로운 플레이어 이벤트 발생하면 리모트플레이어배열에 추가
    var newPlayer = new Player(data.x, data.y);
    newPlayer.id = data.id;
    remotePlayers.push(newPlayer);
};

// 플레이어 Move 이벤트
function onMovePlayer(data) {
    var movePlayer = playerById(data.id);
    
    if(!movePlayer) {
        console.log("Player not found: "+data.id);
        return;
    }
    
    movePlayer.setX(data.x);
    movePlayer.setY(data.y);
};

// 플레이어 remove 
function onRemovePlayer(data) {
    var removePlayer = playerById(data.id);
    
    if ( !removePlayer ) {
        console.log("Player not found: "+data.id);
        return;
    }
    
    remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
    
    
};


/**************************************************
** GAME ANIMATION LOOP
**************************************************/
function animate() {
	update();
	draw();

	// Request a new animation frame using Paul Irish's shim
	window.requestAnimFrame(animate);
};


/**************************************************
** GAME UPDATE
**************************************************/
function update() {
	
    // 플레이어의 위치가 변경된다면 서버에 move player 이벤트 발생
    if (localPlayer.update(keys)) {
        socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY()});
    }
};


/**************************************************
** GAME DRAW
**************************************************/
function draw() {
	// Wipe the canvas clean
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw the local player
	localPlayer.draw(ctx);
    
    // Remote Player Draw
    var i;
    for (i = 0; i < remotePlayers.length; i++) {
        remotePlayers[i].draw(ctx);
    }
};


// get playerById
function playerById(id) {
    var i;
    for ( i = 0; i < remotePlayers.length; i++) {
        if ( remotePlayers[i].id == id ) {
            return remotePlayers[i];
        }
    }
    
    return false;
};