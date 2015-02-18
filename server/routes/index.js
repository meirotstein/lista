var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

function start(resourcesPath) {

    app.get('/', function(req, res){
        res.sendFile(resourcesPath + 'index.html');
    });

    app.get(/\/(css|img|js|lib|templates)\/.*/, function(req, res){
        res.sendFile(resourcesPath + req.url);
    });

    io.on('connection', function(socket){
        console.log('a user connected');
        socket.on('chat message', function(msg){
            console.warn('message: ' + JSON.stringify(msg));
            io.emit('chat message', msg);
        });
    });

    http.listen(3000, function(){
        console.log('listening on *:3000');
    });
}

module.exports = {
    start : start
};


