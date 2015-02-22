angular.module('starter.controllers',  [])
.controller('CardsCtrl', function($scope, $location, $interval, $location, TDCardDelegate , Game , $rootScope) {

  var cardTypes = [
     {key:1,text: 'All of the following were Beatles: Lennon, Ringo, Paul, Hans Solo ',answer:0},
     {key:2,text: 'Is Munich the capital city of Germany?',answer:0},
     {key:3,text: 'Steve Jobs dropped out of high school',answer:0},
     {key:4,text: 'The average human dream lasts only 2 to 3 seconds',answer:1},
     {key:5,text: 'CPU means Computer Parts Used',answer:0},
     {key:6,text: 'When an octopus gets angry, it shoots a stream of blue “ink”',answer:0},
     {key:7,text: 'SAP offers more than 25 industry-specific ERP solution',answer:1},
     {key:8,text: 'A pregnancy lasts 60 weeks',answer:0},
     {key:9,text: 'SAP servers more than 50 million cloud users',answer:1},
     {key:10,text: 'ROFL means "Rolling On Floor Liking"',answer:0},
     {key:11,text: 'Coughing can cause air to move through your windpipe faster than the speed of sound',answer:1},


  ];
  $scope.index = 1;
  $scope.cards = Array.prototype.slice.call(cardTypes, 0);
  $scope.maxCards = $scope.cards.length;

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
    console.log('DESTROYED Card no.'+$scope.index);
  
    if($scope.index == $scope.maxCards) { 
      $scope.showCards=false;
      //$location.path('/results');
    }
    $scope.index++;
  };

  $scope.showCards=true;
  $scope.showTimmer = false;  
  $scope.arc_intervals = 1;

  $scope.showTimer = function(){
      $scope.showTimmer = true;
      $scope.countdown = 30;
      stopTime = $interval(updateTime, 1000);

      function updateTime(){
        $scope.countdown--;
        $scope.arc_intervals = $scope.countdown/30;
        if($scope.countdown == 0) {
          $interval.cancel(stopTime);
          Game.end($rootScope.placeId);
          //$location.path('/results');
        }
      }
  };
  $scope.showTimer();

  $scope.addCard = function() {
    var newCard = cardTypes[0];
    $scope.cards.push(angular.extend({}, newCard));

  };

  $scope.cardSwipedLeft = function(index,obj) {
    var key = 0;
    if (obj) {key = obj.key;}
    $scope.addCard();
  };
  $scope.cardSwipedRight = function(index,obj) {
    var key = 0;
    if (obj) key = obj.key;
    $scope.addCard();
  };

  $scope.cardAnswered = function() {
    return function(answer) {
      Game.sendAnswer($rootScope.placeId , $rootScope.currentUser , answer);
    }
  }
})
.controller('LoadingCtrl', function($scope, $rootScope , $timeout, $location, Chat) {
  $scope.is_searching = true;
  $scope.location_found = false;  
  $scope.myformShow = false;
  $scope.progressShow = true;
  $scope.street = ' ';
  $scope.city = ' ';
  $scope.myClass = '';
  $scope.myuser = '';  
    $timeout(function() {
        $scope.is_searching = false;
    }, 2500, true);

    $timeout(function() {
        $scope.simulate(1);
    }, 3000, true);    

  $scope.goToChat = function (){
    Chat.setUsername($scope.myuser);
    $rootScope.currentUser = $scope.myuser;
    $rootScope.place = $scope.street + ", " + $scope.city;
    Chat.setPlace($scope.placeId);
    $location.path('/chat');
  };

  $scope.userInputChange = function(val) {
    $scope.myuser = val;
  };
$scope.simulate = function (val) {
    if (val == 1) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function showPosition(position) {
                var pyrmont = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                var request = {
                    location: pyrmont,
                    radius: 100,
                    rankby: google.maps.places.RankBy.DISTANCE,
                    keyword: '*'
                    //types: ['store']
                };
                var service = new google.maps.places.PlacesService(document.getElementById('map-canvas'));
                service.nearbySearch(request, function (results, status) {
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            $scope.street = "SAP Labs Israel Ltd.";//results[0].name;
                            $scope.city = "Ha-Tidhar Street 15, Ra'anana"; //results[0].vicinity;
                            $scope.placeId = 7;//results[0].id;
                            $scope.location_found = true;

                            $scope.$apply();
                        }else { //fallback for zero results
                          $scope.street = 'street';
                          $scope.city = 'Raanana';
                          $scope.placeId = 'myplaceid';
                          $scope.location_found = true;

                          $scope.$apply();
                        }
                    }
                );
                }
            );
        } else {
            $scope.street = "Geolocation is not supported by this browser.";
        }
    } 
  }
})

.controller('CardCtrl', function($scope, TDCardDelegate) {

})

.controller('ResultsCtrl', function($scope, $location) {
  //$scope.winner = "איתן"
  $scope.backToChat = function(){
    $location.path('/chat');
  }
})


.controller('ParentCtrl', function($scope, $ionicLoading, $ionicPopup, Chat) {

  $scope.username = Chat.getUsername();

  $scope.showLoading = function(){
    $ionicLoading.show({
      noBackdrop: true,
      template: '<i class="favoriteModal ion-loading-c"></i>'
    });
  };

  $scope.hideLoading = function(){
    $ionicLoading.hide();
  };


  $scope.showUsernamePopup = function() {
    $scope.data = {};

    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.username" autofocus>',
      title: 'Choose a username',
      scope: $scope,
      buttons: [
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
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
    myPopup.then(function(res) {
      Chat.setUsername(res);
      $scope.username = res;
    });
  };

  if(!$scope.username){
    $scope.showUsernamePopup();
  }

})

.controller('ChatCtrl', function($scope,$ionicScrollDelegate,Chat,Notification) {

  $scope.messages = Chat.getMessages();

  Notification.hide();

  $ionicScrollDelegate.scrollBottom(true);

  $scope.$watch('newMessage', function(newValue, oldValue) {
    if(typeof newValue != 'undefined'){
      if(newValue != ''){
        Chat.typing();
      }
      else{
        Chat.stopTyping();
      }
    }
  });

  $scope.sendMessage = function() {
    if($scope.newMessage){
      Chat.sendMessage($scope.newMessage);
      $scope.newMessage = '';
      $ionicScrollDelegate.scrollBottom(true);
    }
    else{
      console.log('Input is empty, nothing was sent');
    }
  };

  $scope.getTime = function(date) {
    return date.getHours() + ":" + date.getMinutes();
  }

})

.controller('PeopleCtrl', function($scope, Chat) {
  $scope.showLoading();
  Chat.getUsernames().then(function(res){
    $scope.people  = res.data;
    $scope.numUsers = Object.keys(res.data).length;
    $scope.hideLoading();
  });
})

.controller('AccountCtrl', function($scope,Chat) {
  $scope.username = Chat.getUsername();
})

.controller('GeneralCtrl', function($scope,$rootScope,Game) {
  $scope.startGame = function() {
    Game.begin($rootScope.placeId);
  }
});



