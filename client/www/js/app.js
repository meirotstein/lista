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

      $stateProvider.state('results', {
        url: '/results',
        templateUrl: "templates/results.html"
      });

      $stateProvider.state('chat', {
        url: '/chat',
        templateUrl: 'templates/chat.html',
        controller: 'ChatCtrl'

      });

      $stateProvider.state('triv', {
        url: '/triv',
        templateUrl: 'templates/start-game.html',
        controller: 'GeneralCtrl'

      });

      $stateProvider.state('anim', {
        url: '/anim',
        templateUrl: 'templates/anim.html',
        controller: 'GeneralCtrl'
      });
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
    }).directive('eqanim', function () {

  return {
    restrict: 'EA',
    template:
    '<div id="sound-on" ng-show="enable")>' +
    '<div class="animbar"></div>' +
    '<div class="animbar"></div>' +
    '<div class="animbar"></div>' +
    '</div>',
    scope: {
      enable: "=enable"
    },
    link: function (scope, element, attrs) {

      function enable() {
        //return;
        $("#sound-on .animbar:nth-child(3n)").animate({height: '60px'}, 100, enable);
        $("#sound-on .animbar:nth-child(3n + 1)").animate({height: '60px'}, 150);
        $("#sound-on .animbar:nth-child(3n + 2)").animate({height: '60px'}, 150);
        $("#sound-on .animbar:nth-child(3n)").animate({height: '50px'}, 150);
        $("#sound-on .animbar:nth-child(3n + 1)").animate({height: '60px'}, 150);
        $("#sound-on .animbar:nth-child(3n + 2)").animate({height: '40px'}, 150);
        $("#sound-on .animbar:nth-child(3n)").animate({height: '30px'}, 150);
        $("#sound-on .animbar:nth-child(3n + 1)").animate({height: '60px'}, 150);
        $("#sound-on .animbar:nth-child(3n + 2)").animate({height: '55px'}, 150);
        $("#sound-on .animbar:nth-child(3n)").animate({height: '60px'}, 150);
        $("#sound-on .animbar:nth-child(3n + 1)").animate({height: '20px'}, 150);
        $("#sound-on .animbar:nth-child(3n + 2)").animate({height: '60px'}, 150);
        $("#sound-on .animbar:nth-child(3n)").animate({height: '50px'}, 150);
        $("#sound-on .animbar:nth-child(3n + 1)").animate({height: '20px'}, 150);
        $("#sound-on .animbar:nth-child(3n + 2)").animate({height: '10px'}, 150);
        $("#sound-on .animbar:nth-child(3n)").animate({height: '50px'}, 150);
        $("#sound-on .animbar:nth-child(3n + 1)").animate({height: '40px'}, 150);
        $("#sound-on .animbar:nth-child(3n + 2)").animate({height: '55px'}, 150);
      }

      function stop() {
        $("#sound-on .animbar:nth-child(3n)").stop( true, true ).fadeOut();
        $("#sound-on .animbar:nth-child(3n + 1)").stop( true, true ).fadeOut();
        $("#sound-on .animbar:nth-child(3n + 2)").stop( true, true ).fadeOut();
      }

      scope.$watch(function(){ return element.attr('enable'); }, function(value){
        if (value) {
          enable();
        } else {
          stop();
        }
      });
    }
  }
});;




