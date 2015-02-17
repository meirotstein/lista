// Ionic Starter App, v0.9.20

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionic.contrib.ui.tinderCards', 'socket-chat.services'])


.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/help')

  $stateProvider.state('home', {
    url: '/home',
    views: {
      home: {
        templateUrl: 'home.html'
      }
    }
  })

  $stateProvider.state('help', {
    url: '/help',
    views: {
      help: {
        templateUrl: 'help.html',
        controller: 'ChatCtrl'

      }
    }
  })
})


.directive('noScroll', function($document) {

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

      $document.on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  }
})

.controller('CardsCtrl', function($scope, $location, TDCardDelegate) {
  console.log('CARDS CTRL');
  // var cardTypes = [
  //   { image: 'max.jpg' },
  //   { image: 'ben.png' },
  //   { image: 'perry.jpg' },
  // ];

  // var cardTypes = [
  //    {text: 'Do you like dogs?'},
  //    {text: 'Do you eat bananas?'} ,
  //    {text: 'Do you play an instrument?'},
  // ];

  var cardTypes = [
     {key:1,text: 'Do you like dogs?'},
     {key:2,text: 'Do you eat bananas?'} ,
    //  {key:3,text: 'Do you play an instrument?'},
    // {key:4,text: 'Are you a developer?'},
    //  {key:5,text: 'Do you enjoy DKOM?'} ,
    //  {key:6,text: 'Is this red?'},     
  ];
  $scope.showCards=true;
  $scope.index = 1;
  $scope.cards = Array.prototype.slice.call(cardTypes, 0);
  $scope.maxCards = $scope.cards.length;

    console.log('after slice ', $scope.cards)

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
    console.log('DESTROYED Card no.'+$scope.index);
    if($scope.index == $scope.maxCards) {
      //alert('done')
      $scope.showCards=false;
      $location.path('/help' );
    }
    $scope.index++;
  };


  $scope.addCard = function() {
    //var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    //newCard.id = Math.random();
    var newCard = cardTypes[0];
    $scope.cards.push(angular.extend({}, newCard));

  }

  $scope.cardSwipedLeft = function(index,obj) {
    console.log('LEFT CARD');
    var key = 0;
    if (obj) key = obj.key;
    $scope.addCard();
  };
  $scope.cardSwipedRight = function(index,obj) {
    var key = 0;
    if (obj) key = obj.key;
    $scope.addCard();
  };
})

.controller('CardCtrl', function($scope, TDCardDelegate) {

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
    $scope.data = {}

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
          },
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
      alert('Can\'t be empty');
    }
  };

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
});




