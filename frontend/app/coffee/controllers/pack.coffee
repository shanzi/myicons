PackIconInfoController = require './pack_icon_info'

class PackController
  info: {}
  icons: []
  revisions: []
  currentTab: 'icons'
  searchText: ''

  isTab: (name) -> name == @currentTab

  setTab: (name) ->
    @currentTab = name
    @refreshRevisions() if @shouldRefreshRevisions

  reset: ->
    @info = angular.copy @_info
    @randomFactor = (new Date()).valueOf().toString(16)

  save: ->
    angular.extend @_info, @info
    @shouldRefreshRevisions = true
    @_info.$update => @reset()

  unchanged: ->
    angular.equals @info, @_info

  showIconInfo: (icon) ->
    @$mdBottomSheet.show
      controller: PackIconInfoController
      controllerAs: 'info'
      templateUrl: '/static/templates/pack_icon_info.html'
      locals:
        icon: icon

  delete: ->
    ok = confirm 'Are you sure?'
    if ok
      @$modelManager.deletePack @_info
      @$location.path "/home/dashboard"

  fieldName: (prefix) ->
    return prefix + @randomFactor

  refreshRevisions: ->
    @shouldRefreshRevisions = false
    @revisions = @$modelManager.getPackRevisions @_info
  
  constructor: (@$routeParams, @$rootScope, @$location, @$modelManager, @$mdBottomSheet) ->
    id = parseInt @$routeParams.id
    @$modelManager.getPack id, (pack, icons) =>
      @_info = pack
      @icons = icons
      @reset()
      @shouldRefreshRevisions = true
      @$rootScope.$broadcast '$reselectMenuItem'


module.exports = PackController
