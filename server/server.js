const express = require('express');
const app = express();
const serv = require('http').Server(app);

app.get('/',function(req, res) {          //DONT UNDERSTAND THIS
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

serv.listen(2000);      //Connect with port 2000
console.log("Server started.");     //Send a log to console to confirm connection

var SOCKET_LIST = {};   //Create an array of the current socket connections with users

app.get('/',function(req, res) {
    res.sendFile(path.join(__dirname, '../client/WebDevGame.html'));
});
app.use('/client',express.static(path.join(__dirname, '/../client')));

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