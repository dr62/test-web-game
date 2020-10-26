console.log(window.location.pathname);
var socketPath = window.location.pathname + "socket.io";
var socket = io();

//Create a div element to store all UI elements
var ui = document.createElement("div");
ui.id = "ui";

var world = document.createElement("div");
world.id = "world";

var objects = document.createElement("div");
objects.id = "objects";

socket.on('newPositions', function(data){       //Create a listener for newPositions packages
    gamearea.remove();             //When package is recieved, clear the rectangle
	document.body.appendChild(gamearea);
	var gameWindow = new UiWindow("gamewindow", 0,0,"tl", 1000, 1000);
    for(var i = 0; i < data.player.length; i++)     //Loop through all current players
    	gameWindow.addObject(new UiLabel(data.player[i].number, data.player[i].x, data.player[i].y, "tl", "40px sans-serif")); 
	gamearea.appendChild(objects);
});

document.onkeydown = function(event) {      //When the following keys are pressed, send a package called keyPress 
    if(event.keyCode === 68)        //d     containing the direction and a var to change the state of the directional movement to true
        socket.emit('keyPress', {inputId:'right',state:true});
    else if (event.keyCode === 83)  //s
        socket.emit('keyPress', {inputId:'down',state:true});
    else if (event.keyCode === 65)  //a
        socket.emit('keyPress', {inputId:'left',state:true});
    else if (event.keyCode === 87)  //w
        socket.emit('keyPress', {inputId:'up',state:true});
}

document.onkeyup = function(event) {        //When the following keys are let go of, send a package called keyPress
    if(event.keyCode === 68)        //d     containing the direction and a var to change the state of the directional movement to false
        socket.emit('keyPress', {inputId:'right',state:false});
    else if (event.keyCode === 83)  //s
        socket.emit('keyPress', {inputId:'down',state:false});
    else if (event.keyCode === 65)  //a
        socket.emit('keyPress', {inputId:'left',state:false});
    else if (event.keyCode === 87)  //w
        socket.emit('keyPress', {inputId:'up',state:false});
}