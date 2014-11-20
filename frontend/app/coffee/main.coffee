# require all dependencies before doing anything
window.Hammer = require 'hammer'

require 'angular'
require 'angular.aria'
require 'angular.route'
require 'angular.animate'
require 'angular.resource'
require 'angular.material'

require 'angular.loadingbar'

# import controllers
appCtrl = require './controllers/app'
menuCtrl = require './controllers/menu'
packCtrl = require './controllers/pack'
collectionCtrl = require './controllers/collection'
settingsCtrl = require './controllers/settings'
dashboardCtrl = require './controllers/dashboard'

# import models
modelManager = require './modelmanager'

template = (name) -> "/static/templates/#{name}.html"

angular.module('myiconsApp', [
  'ngMaterial'
  'ngRoute'
  'ngResource'

  'angular-loading-bar'
  ])
  # config controlelrs
  .controller('appCtrl', appCtrl)
  .controller('menuCtrl', menuCtrl)
  .controller('packCtrl', packCtrl)
  .controller('collectionCtrl', collectionCtrl)
  .controller('DashboardCtrl', dashboardCtrl)
  .controller('SettingsCtrl', settingsCtrl)

  # config models
  .factory('$modelManager', modelManager)

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
        templateUrl: template('pack')
        controller: 'packCtrl'
        controllerAs: 'pack'
      .when '/collections/:id',
        templateUrl: template('collection')
        controller: 'collectionCtrl'
        controllerAs: 'collection'
      .otherwise
        redirectTo: '/home/dashboard'

    $resourceProvider.defaults.stripTrailingSlashes = false

  # config loading bar
  .config (cfpLoadingBarProvider) ->
    cfpLoadingBarProvider.includeSpinner = false

  # config CSRF
  .config ($httpProvider) ->
    csrf_token = document.querySelector('meta[name=csrf-token]').content
    $httpProvider.defaults.headers.common['X-CSRFToken'] = csrf_token
