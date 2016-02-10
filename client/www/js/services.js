angular.module('socket-chat.services', ['ngSanitize'])

    .factory('Chat', function ($rootScope, $sce, $http, $ionicScrollDelegate, Notification , $location) {
        var socket = $rootScope.socket = io();
        var username;
        var placeId;
        var messages = [];
        var nextAvatarIdx = 0;
        var avatarMap = {};

        var baseUrl;

        if (window.location.origin.indexOf('localhost') == -1)
            baseUrl = 'https://limitless-tor-7276.herokuapp.com';
        else
            baseUrl = 'http://localhost:3000';


        var functions = {
            all: function () {
                return friends;
            },
            get: function (friendId) {
                return friends[friendId];
            },
            getMessages: function () {
                return messages;
            },
            sendMessage: function (msg) {
                var message = {
                    username: username,
                    content: msg,
                    place: placeId,
                    avatar: this.getAvatar(username)
                };
                socket.emit('chat message', message);
            },
            getUsername: function () {
                return username;
            },
            setUsername: function (newUsername) {
                username = newUsername;
                socket.emit('add user', username);
            },
            setPlace: function (_placeId) {
                placeId = _placeId;
                $rootScope.placeId = _placeId;
            },
            getUsernames: function () {
                return $http.get(baseUrl + '/usernames');
            },
            typing: function () {
                socket.emit('typing');
            },
            stopTyping: function () {
                socket.emit('stop typing');
            },
            getAvatar: function(user) {
                if(!avatarMap[user]) {
                    avatarMap[user] = "img/Avatar" + nextAvatarIdx + ".png";
                    nextAvatarIdx = ++nextAvatarIdx % 3;
                }
                return avatarMap[user];
            }
        };

        socket.on('user joined', function (data) {
            Notification.show(data.username + ' connected');
        });

        socket.on('chat message', function (msg) {
            $rootScope.$apply(function () {
                msg.avatar = functions.getAvatar(msg.username);
                if (placeId === msg.place) {
                    if(msg.content === "___startTrivia___") {
                        $location.path('/cards');
                    }else {
                        msg.content = $sce.trustAsHtml(msg.content);
                        msg.time = new Date();
                        if(messages.current) {
                            messages.unshift(messages.current);
                        }
                        messages.current = msg;
                        $.playSound("/sounds/knuckle");
                    }
                }
            });
        });

        socket.on('user left', function (data) {
            Notification.show(data.username + ' disconnected');
        });

        socket.on('typing', function (data) {
            console.log('typing');
            Notification.show(data.username + ' is typing');
        });

        socket.on('stop typing', function (data) {
            console.log('stop typing');
            Notification.hide();
        });

        socket.on('begin_game' , function(place){
            if(place === $rootScope.placeId){
                $location.path('/cards');
                $rootScope.$apply();
            }
        });

        socket.on('end_game', function(results){
            if(results.place ===  $rootScope.placeId) {
                $rootScope.winner = results.winner;
                $location.path('/results');
                $rootScope.$apply();
            }
        });

        return functions;

    })

    .factory('Game', function ($rootScope , $location) {
        var socket = $rootScope.socket;
        console.log(socket)
        return {
            begin: function (place) {
               socket.emit('game_begin' , place);
            },

            sendAnswer: function (place , user , answer) {
                socket.emit('game_answer' , {place:place , user:user , answer:answer});
            },

            end : function(place) {
                socket.emit('game_end' , place);
            }
        }

    })

    .factory('Notification', function ($timeout) {

        return {
            show: function (msg) {
                var $notificationDiv = angular.element(document.querySelector('.notification'));
                $notificationDiv.css('display', 'inherit');
                $notificationDiv.html(msg);
                if (msg.indexOf('typing') == -1) {
                    $timeout(function () {
                        $notificationDiv.css('display', 'none');
                    }, 5000);
                }
            },
            hide: function () {
                var $notificationDiv = angular.element(document.querySelector('.notification'));
                $notificationDiv.css('display', 'none');
            }
        }

    });