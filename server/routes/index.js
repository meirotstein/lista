var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('lodash');

function start(resourcesPath) {
    // map between place to number of connected users
    var places = {};
    var games = {};
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
        socket.on('game_begin', function(place) {
            if(!games[place]) {
                games[place] = {winner:{name:'',score:0},users:{}};
            }
            io.emit('begin_game',place);
        });
        socket.on('game_answer', function(ans) {
            var game = games[ans.place];
            if(game) {
                game[ans.user] |= 0;
                if(ans.answer){
                    game[ans.user]++;
                    if(game[ans.user] > game.winner.score) {
                        game.winner = {name: ans.user , score: game[ans.user]};
                    }
                }
            }
        });
        socket.on('game_end', function(place) {
            if(games[place]) {
                var winner = games[place].winner;
                games[place] = null;
                io.emit('end_game',{place:place , winner:winner.name});
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


