# require all dependencies before doing anything
window.Hammer = require 'hammer'

require 'angular'
require 'angular.aria'
require 'angular.route'
require 'angular.animate'
require 'angular.material'



angular.module('myiconsApp', ['ngMaterial', 'ngRoute'])
  .controller('AppCtrl', ['$scope',
    ($scope) ->
      $scope.sections = [
        {name: 'Home'},
        {name: 'Packs'},
        {name: 'Collections'},
        {name: 'Labels'},
      ]
  ])

