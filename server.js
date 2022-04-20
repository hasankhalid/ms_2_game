let express = require('express'); //require express to run the application

let app = express(); //create an express app
let server = app.listen(3000); //listen at port 3000

app.use(express.static('public')); //run the files in the public folder

console.log("server is running"); //console.log server status to confirm its running

let socket = require('socket.io'); 

let io = socket(server); //create a socket connection

io.sockets.on('connection', newConnection); //run newConnection function when connection event happens

function newConnection(socket) {
    console.log('new connection: ' + socket.id); 

    socket.on('createAudience', createAudience);  //run function computePosition on position event. 
    function createAudience(data) {
        let sendData = data;
        sendData.id = socket.id;
        socket.broadcast.emit('createAudience', sendData); //broadcast the same message received and send it outward 
    }

    socket.on('position', computePosition);  //run function computePosition on position event. 
    //Position event is the event being created by the socket client
    function computePosition(data) {
        let sendData = data;
        sendData.id = socket.id;
        socket.broadcast.emit('position', sendData); //broadcast the same message received and send it outward
    }
}