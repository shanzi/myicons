# require all dependencies before doing anything
window.Hammer = require 'hammer'

require 'angular'
require 'angular.aria'
require 'angular.route'
require 'angular.animate'
require 'angular.resource'
require 'angular.material'

# import controllers
appCtrl = require './controllers/app'
menuCtrl = require './controllers/menu'
packCtrl = require './controllers/pack'
settingsCtrl = require './controllers/settings'
dashboardCtrl = require './controllers/dashboard'

# import models
models = require './models'

template = (name) -> "/static/templates/#{name}.html"

angular.module('myiconsApp', ['ngMaterial', 'ngRoute', 'ngResource'])
  # config controlelrs
  .controller('AppCtrl', appCtrl)
  .controller('menuCtrl', menuCtrl)
  .controller('packCtrl', packCtrl)
  .controller('DashboardCtrl', dashboardCtrl)
  .controller('SettingsCtrl', settingsCtrl)

  # config models
  .factory('$models', models)

  # config routes and resource
  .config ($routeProvider, $resourceProvider) ->
    $routeProvider
      .when '/home/dashboard',
        templateUrl: template('dashboard')
        controller: 'DashboardCtrl'
      .when '/home/settings',
        templateUrl: template('settings')
        controller: 'SettingsCtrl'
      .when '/packs/:id',
        templateUrl: template('packs')
        controller: 'packCtrl'
        controllerAs: 'pack'
      .otherwise
        redirectTo: '/home/dashboard'

    $resourceProvider.defaults.stripTrailingSlashes = false
