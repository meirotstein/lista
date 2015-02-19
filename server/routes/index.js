var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('lodash');

function start(resourcesPath) {
    // map between place to number of connected users
    var places = {};
    app.get('/', function(req, res){
        res.sendFile(resourcesPath + 'index.html');
    });

    app.get(/\/(css|img|js|lib|templates|sounds)\/.*/, function(req, res){
        res.sendFile(resourcesPath + req.url);
    });


    io.on('connection', function(socket){
        console.log('a user connected with socket id ' + socket.id);
        var userPlace;
        var updatePlacesMap = _.once(function(place) {
            userPlace = place;
            places[place] |= 0;
            places[place]++;
            emitConnectedUsers(place);
        });
        socket.on('chat message', function(msg){
            updatePlacesMap(msg.place);
            console.warn('message: ' + JSON.stringify(msg));
            io.emit('chat message', msg);
        });
        socket.on('disconnect', function() {
            console.log('a user disconnected with socket id ' + socket.id);
            if (userPlace) {
                places[userPlace]--;
                emitConnectedUsers(userPlace);
            }
        });
    });
    function emitConnectedUsers(place) {
        var event = {place: place, connectedUsers: places[place]};
        io.emit('connected users', event);
        console.log("Sent event: " + JSON.stringify(event));
    }

    var port = process.env.PORT || 3000;

    http.listen(port, function(){
        console.log('listening on *:' + port);
    });
}

module.exports = {
    start : start
};


