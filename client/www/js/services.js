angular.module('socket-chat.services', [])

    .factory('Chat', function ($rootScope, $http, $ionicScrollDelegate, Notification) {

        var username;
        var placeId;
        var messages = [];

        var baseUrl, socket;

        if (window.location.origin.indexOf('localhost') == -1)
            baseUrl = 'https://socket-chat-server.com:443';
        else
            baseUrl = 'http://localhost:3000';

        socket = io();

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
                    place: placeId
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
            },
            getUsernames: function () {
                return $http.get(baseUrl + '/usernames');
            },
            typing: function () {
                socket.emit('typing');
            },
            stopTyping: function () {
                socket.emit('stop typing');
            }
        };

        socket.on('user joined', function (data) {
            Notification.show(data.username + ' connected');
        });

        socket.on('chat message', function (msg) {
            $rootScope.$apply(function () {
                if (placeId === msg.place) {
                    msg.time = new Date();
                    messages.push(msg);
                    $ionicScrollDelegate.scrollBottom(true);
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

        return functions;

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