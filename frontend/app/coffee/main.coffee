# require all dependencies before doing anything
window.Hammer = require 'hammer'

require 'angular'
require 'angular.aria'
require 'angular.route'
require 'angular.animate'
require 'angular.material'

appCtrl = require('./controllers/app_controller')
menuCtrl = require('./controllers/menu_controller')

angular.module('myiconsApp', ['ngMaterial', 'ngRoute'])
  .controller('AppCtrl', ['$scope', appCtrl])
  .controller('MenuCtrl', ['$scope', '$rootScope', '$location', menuCtrl])


