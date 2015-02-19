angular.module('starter.controllers',  [])
.controller('CardsCtrl', function($scope, $location, $interval, $location, TDCardDelegate) {

  var cardTypes = [
     {key:1,text: 'Has Bjorn visited Raanana?',answer:1},
     {key:2,text: 'Is Munich the capital of Germany?',answer:0}
  ];
  $scope.index = 1;
  $scope.cards = Array.prototype.slice.call(cardTypes, 0);
  $scope.maxCards = $scope.cards.length;

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
    console.log('DESTROYED Card no.'+$scope.index);
  
    if($scope.index == $scope.maxCards) { 
      $scope.showCards=false;
      $location.path('/results');
    }
    $scope.index++;
  };

  $scope.showCards=true;
  $scope.showTimmer = false;  
  $scope.arc_intervals = 1;
  $scope.countdown = 30;
  $scope.showTimer = function(){
      $scope.showTimmer = true;
      stopTime = $interval(updateTime, 1000);

      function updateTime(){
        $scope.countdown--;
        $scope.arc_intervals = $scope.countdown/30;
        if($scope.countdown == 0) {
          $interval.cancel(stopTime);
          $location.path('/results');
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
        $scope.simulate(1);
        $scope.location_found = true;
    }, 2500, true);

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
                            $scope.street = results[0].name;
                            $scope.city = results[0].vicinity;
                            $scope.placeId = results[0].id;
                            $scope.$apply();
                        }
                    }
                );
                }
            );
        } else {
            $scope.street = "Geolocation is not supported by this browser.";
        }

        $scope.circleAnim = '';
        $scope.circleAnim2 = '';
    } else if (val == 2) {
        $scope.myformShow = true;
        $scope.progressShow = false;
        $scope.myClass = 'progressShow';
    }
  }
})

.controller('CardCtrl', function($scope, TDCardDelegate) {

})

.controller('ResultsCtrl', function($scope, $location) {
  $scope.winner = "איתן"
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

.controller('GeneralCtrl', function($scope,Chat) {
  $scope.startGame = function() {
    Chat.sendMessage("___startTrivia___");
  }
});



