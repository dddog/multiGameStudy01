/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY, startFillStyle) {
	var x = startX,
		y = startY,
        id,
        fillStyle = startFillStyle,
		moveAmount = 2;
    
    var getX = function() {
        return x;
    };
    var getY = function() {
        return y;
    };
    var getFillStyle = function() {
        return fillStyle;
    };
    var setX = function(newX) {
        x = newX;
    };
    var setY = function(newY) {
        y = newY;
    };
    var setFillStyle = function(newFillStyle) {
        fillStyle = newFillStyle;
    };

	var update = function(keys) {
        
        var prevX = x;
        var prevY = y;
        
		// Up key takes priority over down
		if (keys.up) {
			y -= moveAmount;
		} else if (keys.down) {
			y += moveAmount;
		};

		// Left key takes priority over right
		if (keys.left) {
			x -= moveAmount;
		} else if (keys.right) {
			x += moveAmount;
		};
        
        // 위치가 변경되었다면 true, 변경안되면 false
        return (prevX != x || prevY != y) ? true : false;
	};

	var draw = function(ctx) {
        ctx.fillStyle = fillStyle;
		ctx.fillRect(x-5, y-5, 10, 10);
	};

	return {
        getX: getX,
        getY: getY,
        getFillStyle: getFillStyle,
        setX: setX,
        setY: setY,
        setFillStyle: setFillStyle,
		update: update,
		draw: draw
	}
};