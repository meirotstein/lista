var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('lodash');

function start(resourcesPath) {
    app.get('/', function(req, res){
        res.sendFile(resourcesPath + 'index.html');
    });
    // added by EK to load the dashboard
    app.get('/dashboard', function(req, res){
        res.sendFile(resourcesPath + 'dashboard.html');
    });

    app.get(/\/(css|img|js|lib|templates|sounds)\/.*/, function(req, res){
        res.sendFile(resourcesPath + req.url);
    });


    io.on('connection', function(socket){
        console.log('a user connected with socket id ' + socket.id);

        socket.on('chat message', function(msg){
            //updatePlacesMap(msg.place);
            console.warn('message: ' + JSON.stringify(msg));
            io.emit('chat message', msg);
        });
        socket.on('disconnect', function() {
            console.log('a user disconnected with socket id ' + socket.id);
        });
    });

    var port = process.env.PORT || 3000;

    http.listen(port, function(){
        console.log('listening on *:' + port);
    });
}

module.exports = {
    start : start
};


