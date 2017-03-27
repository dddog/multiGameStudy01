var Player = function(startX, startY, startFillStyle) {
    var x = startX,
        y = startY,
        fillStyle = startFillStyle,
        id;
    
    var getX = function() {
        return x;
    }
    
    var getY = function() {
        return y;
    }
    
    var getFillStyle = function() {
        return fillStyle;
    }
    
    var setX = function(newX) {
        x = newX;
    }
    
    var setY = function(newY) {
        y = newY;
    }
    
    var setFillStyle = function(newFillStyle) {
        fillStyle = newFillStyle;
    }
    
    return {
        getX: getX,
        getY: getY,
        getFillStyle: getFillStyle,
        setX: setX,
        setY: setY,
        setFillStyle: setFillStyle,
        id: id
    };
};

exports.Player = Player;