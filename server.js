const express = require('express');
const app = express();
const serv = require('http').Server(app);
const path = require('path');

app.get('/',function(req, res) {          //DONT UNDERSTAND THIS
    res.sendFile(path.resolve(__dirname + '/client/index.html'));
});
app.use('/client',express.static(__dirname + '/client'));

serv.listen(2000);      //Connect with port 2000
console.log("Server started.");     //Send a log to console to confirm connection

var SOCKET_LIST = {};   //Create an array of the current socket connections with users

var Entity = function() {
    var self = {        //Each entity has a var called self
            x:250,      //intiate x and y coords at start
            y:250,
            spdX:0,     //initial x and y speeds
            spdY:0,
            id:"",      //Create and empty id
        }
        self.update = function() {  //when update is called on a subclass of entity
            self.updatePosition();  //call update position method
        }
        self.updatePosition = function() {  //increase the x and y coords of entity by the corresponding x and y speeds
            self.x += self.spdX;
            self.y += self.spdY;
        }
        return self;        //return initialize self to entity var
}

var Player = function(id) {     //Create a class for the players, pass in the id from Player.onConnect
    var self = Entity();        //This will be a subclass of the Entity superclass
    self.id = id;               //set the instance id to the one passed in
    self.number = "" + Math.floor(10 * Math.random());  //assign a random number to the instance
    self.pressingRight = false; //set the directional booleans to false initailly
    self.pressingLeft = false;
    self.pressingUp = false;
    self.pressingDown = false;
    self.maxSpd = 10;           //set a maximum speed for the player

    var super_update = self.update;    //Store the method of the update superclass method in a var 
    self.update = function() {  //set a method to update this instance of player
        self.updateSpd();   //update the current speed of the player
        super_update();     //call the superclass method of self.update() which updates player position
    }
    
    self.updateSpd = function() {       //Create a method to update the speed of this instance of player
        if(self.pressingRight)          //If this player is pressing d key
            self.spdX = self.maxSpd;    //set the current user X axis speed to the max player speed, which is 10
        else if(self.pressingLeft)      //If the player is pressing a key
            self.spdX = -self.maxSpd;   //set the current user speed to the max player speed, since the player 
        else                            //should be moving to the negative on the x axis, set to the negative of the max user speed 
            self.spdX = 0;              //If the user isn't moving right or left, set the X axis speed to 0

        if(self.pressingUp)             //If this player is pressing the w key
            self.spdY = -self.maxSpd;   //set the current user Y axis speed to the negative of the maximum Y speed DONT KNOW WHY THIS IS, THOUGHT IT SHOULD BE THE OTHER WAY AROUND
        else if(self.pressingDown)      //If the player is pressing the s key
            self.spdY = self.maxSpd;    //Set the current user Y axis speed to the maximum Y speed for a player
        else                            //If the user isn't moving up or down
            self.spdY = 0;              //set the Y axis speed to 0
    }
    Player.list[id] = self;             //Update the Player.list information of this instance
    return self;                        //return this instance to the Player var
}

Player.list = {};                       //Create a list of players
Player.onConnect = function(socket){    //When the user connects to the game...
    var player = Player(socket.id);     //Create an instance of the player class linked to this socket
    socket.on('keyPress', function(data) {  //Create a listener for packages called keyPress
        if(data.inputId === 'left')         //match the input id in the package to a direction
            player.pressingLeft = data.state;      //change the state of what is being pressed/not pressed
        else if(data.inputId === 'right')           //based on the state var in the package
            player.pressingRight = data.state;
        else if(data.inputId === 'down')
            player.pressingDown = data.state;
        else if(data.inputId === 'up')
            player.pressingUp = data.state;
    });
}
Player.onDisconnect = function(socket){     //When the player disconnects
    delete Player.list[socket.id];      //Remove the player linked to the given socket from the player list
}
Player.update = function() {        //Create an update method for the overall player class
    var pack = [];              //Create a stack for the packages the server is going to send to the player
    for(var i in Player.list){      //For each player in player.list
        var player = Player.list[i];    //Set the current player in the list to a local var
        player.update();    //call the instance based version of update for the current player
        pack.push({     //This will return the new position for the given player
            x:player.x,     //add the new x and y coords to the package to be returned to the client
            y:player.y,
            number:player.number    //DONT KNOW WHAT THIS DOES
        });
    }
    return pack;    //return the compiled package to...
}







var io = require('socket.io') (serv,{});        //create a var for the socket?
io.sockets.on('connection', function(socket){   //Create some kind of listener?
    socket.id = Math.random();      //Assign a random socket id
    SOCKET_LIST[socket.id] = socket;    //Add this socket id to the SOCKET_LIST

    Player.onConnect(socket);   //Call the onConnect method on this current socket, to initialize player

    socket.on('disconnect',function() { //if the user disconnects
        delete SOCKET_LIST[socket.id];     //delete the current socket connection
        Player.onDisconnect(socket);       //call the onDisconnect method on the current socket, this removes the player from the player list aswell
    });
});
    
setInterval(function() {        //create a function to set the frame rate and call updates between frames
   var pack = {    //Create a package that calls the class update method for each instance of player and bullet
       player: Player.update(),    
   }
            
   for(var i in SOCKET_LIST){      //return the package containing updated entity positions to all clients connected to the server
        var socket = SOCKET_LIST[i];
        socket.emit('newPositions', pack);
    };
},1000/25); //set frame rate to 24fps