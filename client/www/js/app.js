// Ionic Starter App, v0.9.20

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionic.contrib.ui.tinderCards', 'socket-chat.services','starter.controllers','ngAnimate','angular-progress-arc'])


.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/loading');

  $stateProvider.state('loading', {
    url: '/loading',
    templateUrl: "templates/loading.html",
    controller: 'LoadingCtrl'
  });

  $stateProvider.state('cards', {
    url: '/cards',
    templateUrl: "templates/cards.html"
  });

  $stateProvider.state('chat', {
    url: '/chat',
    templateUrl: 'templates/chat.html',
    controller: 'ChatCtrl'

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
});




