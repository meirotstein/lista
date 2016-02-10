angular.module('starter.controllers', [])
    .controller('CardsCtrl', function ($scope, $interval, $location, TDCardDelegate, Game, $rootScope) {

        var cardTypes = [
            {key: 1, text: 'All of the following were Beatles: Lennon, Ringo, Paul, Hans Solo ', answer: 0},
            {key: 2, text: 'Is Munich the capital city of Germany?', answer: 0},
            {key: 3, text: 'Steve Jobs dropped out of high school', answer: 0},
            {key: 4, text: 'The average human dream lasts only 2 to 3 seconds', answer: 1},
            {key: 5, text: 'CPU means Computer Parts Used', answer: 0},
            {key: 6, text: 'When an octopus gets angry, it shoots a stream of blue “ink”', answer: 0},
            {key: 7, text: 'SAP offers more than 25 industry-specific ERP solution', answer: 1},
            {key: 8, text: 'A pregnancy lasts 60 weeks', answer: 0},
            {key: 9, text: 'SAP servers more than 50 million cloud users', answer: 1},
            {key: 10, text: 'ROFL means "Rolling On Floor Liking"', answer: 0},
            {
                key: 11,
                text: 'Coughing can cause air to move through your windpipe faster than the speed of sound',
                answer: 1
            }


        ];
        $scope.index = 1;
        $scope.cards = Array.prototype.slice.call(cardTypes, 0);
        $scope.maxCards = $scope.cards.length;

        $scope.cardDestroyed = function (index) {
            $scope.cards.splice(index, 1);
            console.log('DESTROYED Card no.' + $scope.index);

            if ($scope.index == $scope.maxCards) {
                $scope.showCards = false;
                //$location.path('/results');
            }
            $scope.index++;
        };

        $scope.showCards = true;
        $scope.showTimmer = false;
        $scope.arc_intervals = 1;

        $scope.showTimer = function () {
            $scope.showTimmer = true;
            $scope.countdown = 30;
            stopTime = $interval(updateTime, 1000);

            function updateTime() {
                $scope.countdown--;
                $scope.arc_intervals = $scope.countdown / 30;
                if ($scope.countdown == 0) {
                    $interval.cancel(stopTime);
                    Game.end($rootScope.placeId);
                    //$location.path('/results');
                }
            }
        };
        $scope.showTimer();

        $scope.addCard = function () {
            var newCard = cardTypes[0];
            $scope.cards.push(angular.extend({}, newCard));

        };

        $scope.cardSwipedLeft = function (index, obj) {
            var key = 0;
            if (obj) {
                key = obj.key;
            }
            $scope.addCard();
        };
        $scope.cardSwipedRight = function (index, obj) {
            var key = 0;
            if (obj) key = obj.key;
            $scope.addCard();
        };

        $scope.cardAnswered = function () {
            return function (answer) {
                Game.sendAnswer($rootScope.placeId, $rootScope.currentUser, answer);
            }
        }
    })
    .controller('LoadingCtrl', function ($scope, $rootScope, $timeout, $location, Chat) {
        $scope.is_searching = true;
        $scope.location_found = false;
        $scope.myformShow = false;
        $scope.progressShow = true;
        $scope.street = ' ';
        $scope.city = ' ';
        $scope.myClass = '';
        $scope.myuser = '';
        $timeout(function () {
            $scope.is_searching = false;
        }, 2500, true);

        $timeout(function () {
            $scope.simulate(1);
        }, 3000, true);

        $scope.goToChat = function () {
            Chat.setUsername($scope.myuser);
            $rootScope.currentUser = $scope.myuser;
            $rootScope.place = $scope.street + ", " + $scope.city;
            Chat.setPlace($scope.placeId);
            $location.path('/chat');
        };

        $scope.userInputChange = function (val) {
            $scope.myuser = val;
        };
        $scope.simulate = function (val) {
            if (val == 1) {
                $scope.street = 'Hatidhar';
                $scope.city = 'Raanana';
                $scope.placeId = 'myplaceid';
                $scope.location_found = true;

                $scope.$apply();
            }
        }
    })

    .controller('CardCtrl', function ($scope, TDCardDelegate) {

    })

    .controller('ResultsCtrl', function ($scope, $location) {
        $scope.backToChat = function () {
            $location.path('/chat');
        }
    })


    .controller('ParentCtrl', function ($scope, $ionicLoading, $ionicPopup, Chat) {

        $scope.username = Chat.getUsername();

        $scope.showLoading = function () {
            $ionicLoading.show({
                noBackdrop: true,
                template: '<i class="favoriteModal ion-loading-c"></i>'
            });
        };

        $scope.hideLoading = function () {
            $ionicLoading.hide();
        };


        $scope.showUsernamePopup = function () {
            $scope.data = {};

            var myPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="data.username" autofocus>',
                title: 'Choose a username',
                scope: $scope,
                buttons: [
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.data.username) {
                                //don't allow the user to close unless he enters the username
                                e.preventDefault();
                            } else {
                                return $scope.data.username;
                            }
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                Chat.setUsername(res);
                $scope.username = res;
            });
        };

        if (!$scope.username) {
            $scope.showUsernamePopup();
        }

    })

    .controller('ChatCtrl', function ($scope, $ionicScrollDelegate, Chat, Notification) {
        var first_char = /\S/;
        function capitalize(s) {
            return s.replace(first_char, function(m) { return m.toUpperCase(); });
        }
        function showInfo(s) {
            //if (s) {
            //    for (var child = info.firstChild; child; child = child.nextSibling) {
            //        if (child.style) {
            //            child.style.display = child.id == s ? 'inline' : 'none';
            //        }
            //    }
            //    info.style.visibility = 'visible';
            //} else {
            //    info.style.visibility = 'hidden';
            //}
        }
        var start_img = {}; // TODO reference to the element of the mic image
        var ignore_onend;

        if (!('webkitSpeechRecognition' in window)) {
            alert('move to chrome!');
        } else {
            var recognizing = false;
            var recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = false;
            recognition.onstart = function() {
                recognizing = true;
                showInfo('info_speak_now');
                start_img.src = '/intl/en/chrome/assets/common/images/content/mic-animate.gif';
            };

            recognition.onerror = function(event) {
                if (event.error == 'no-speech') {
                    start_img.src = '/intl/en/chrome/assets/common/images/content/mic.gif';
                    showInfo('info_no_speech');
                    ignore_onend = true;
                }
                if (event.error == 'audio-capture') {
                    start_img.src = '/intl/en/chrome/assets/common/images/content/mic.gif';
                    showInfo('info_no_microphone');
                    ignore_onend = true;
                }
                if (event.error == 'not-allowed') {
                    if (event.timeStamp - start_timestamp < 100) {
                        showInfo('info_blocked');
                    } else {
                        showInfo('info_denied');
                    }
                    ignore_onend = true;
                }
                recognition.stop();
            };

            var final_transcript = '';

            recognition.onend = function() {

                recognizing = false;
                if (ignore_onend) {
                    return;
                }
                start_img.src = '/intl/en/chrome/assets/common/images/content/mic.gif';
                //if (!final_transcript) {
                //    showInfo('info_start');
                //    return;
                //}
                showInfo('');
                //if (window.getSelection) {
                //    window.getSelection().removeAllRanges();
                //    var range = document.createRange();
                //    range.selectNode(document.getElementById('final_span'));
                //    window.getSelection().addRange(range);
                //}

                console.log("ended: " + final_transcript);
                Chat.sendMessage(final_transcript);
                recognition.start();
                final_transcript = "";
            };

            recognition.onresult = function(event) {
                var interim_transcript = '';
                if (typeof(event.results) == 'undefined') {
                    recognition.onend = null;
                    recognition.stop();
                    upgrade();
                    return;
                }
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        final_transcript += event.results[i][0].transcript;
                    } else {
                        interim_transcript += event.results[i][0].transcript;
                    }
                }
                final_transcript = capitalize(final_transcript);
                if (interim_transcript) {
                    console.log("Says: " + interim_transcript);
                    Chat.sendMessage(interim_transcript);
                }
                recognition.stop();
            };

            recognition.lang = "en-GB";
            recognition.start();
        }

        $scope.messages = Chat.getMessages();

        Notification.hide();

        $ionicScrollDelegate.scrollBottom(true);

        $scope.$watch('newMessage', function (newValue) {
            if (typeof newValue != 'undefined') {
                if (newValue != '') {
                    Chat.typing();
                } else {
                    Chat.stopTyping();
                }
            }
        });

        $scope.sendMessage = function () {
            if ($scope.newMessage) {
                Chat.sendMessage($scope.newMessage);
                $scope.newMessage = '';
                $ionicScrollDelegate.scrollBottom(true);
            }
            else {
                console.log('Input is empty, nothing was sent');
            }
        };

        $scope.getTime = function (date) {
            return date.getHours() + ":" + date.getMinutes();
        }

        $scope.activeIndex = 0;
        $scope.users = [
            {
                title: 'Eitan',
                active: false,
                avatar: 'img/Avatar0.png',
            },
            {
                title: 'Meir',
                active: false,
                avatar: 'img/Avatar1.png'
            },
            {
                title: 'Clara',
                active: false,
                avatar: 'img/Avatar2.png'
            }
        ];

        $scope.setUsersStatus = function(index){
            $scope.users[0].active = false;
            $scope.users[1].active = false;
            $scope.users[2].active = false;

            $scope.users[$scope.activeIndex].active = true;

        };

        $scope.getAvatarForCurrentUser = function() {
            if($scope.messages.current) {
                var user = $scope.users.filter(function(u){return u.title === $scope.messages.current.username;});
                if(user.length) {
                    return user[0].avatar;
                }
            }
            return 'img/Avatar2.png'; //default...
        }






        $scope.items = ['Item 1', 'Item 2', 'Item 3'];

        $scope.addItem = function() {
            var newItemNo = $scope.items.length + 1;
            $scope.items.push('Item ' + newItemNo);
        };

        $scope.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };

    })

    .controller('PeopleCtrl', function ($scope, Chat) {
        $scope.showLoading();
        Chat.getUsernames().then(function (res) {
            $scope.people = res.data;
            $scope.numUsers = Object.keys(res.data).length;
            $scope.hideLoading();
        });
    })

    .controller('AccountCtrl', function ($scope, Chat) {
        $scope.username = Chat.getUsername();
    })

    .controller('GeneralCtrl', function ($scope, $rootScope, Game) {
        $scope.startGame = function () {
            Game.begin($rootScope.placeId);
        }
    });



