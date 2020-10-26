var socketPath = window.location.pathname + "socket.io";
var socket = io({path: socketPath});

//Create a div element to store all UI elements
var ui = document.createElement("div");
ui.id = "ui";

var world = document.createElement("div");
world.id = "world";

var objects = document.createElement("div");
objects.id = "objects";

socket.on('newPositions', function(data){       //Create a listener for newPositions packages
    objects.remove();             //When package is recieved, clear the rectangle
    for(var i = 0; i < data.player.length; i++)     //Loop through all current players
    	document.createElement("Player")
        ctx.fillText(data.player[i].number,data.player[i].x,data.player[i].y);  //Create a number in the new x,y positions of current player
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