class PackIconInfoController
  sendto: (collection) ->
    newIconData =
      name: @icon.name
      packicon: @icon.id
      collection: collection.id

    @$modelManager.addCollectionIcon newIconData, =>
      @$mdBottomSheet.hide()

  constructor: (@$mdBottomSheet, @$modelManager, @icon) ->
    @collections = @$modelManager.collections


class PackController
  info: {}
  icons: []
  currentTab: 'icons'

  isTab: (name) -> name == @currentTab

  setTab: (name) -> @currentTab = name

  reset: ->
    @info = angular.copy @_info

  save: ->
    angular.extend @_info, @info
    @_info.$update()

  unchanged: ->
    angular.equals @info, @_info

  showIconInfo: (icon) ->
    @$mdBottomSheet.show
      controller: PackIconInfoController
      controllerAs: 'info'
      templateUrl: '/static/templates/pack_icon_info.html'
      locals:
        icon: icon
  
  constructor: (@$routeParams, @$rootScope, @$modelManager, @$mdBottomSheet) ->
    id = parseInt @$routeParams.id
    @$modelManager.getPack id, (pack, icons) =>
      @_info = pack
      @icons = icons
      @reset()
      @$rootScope.$broadcast '$reselectMenuItem'


module.exports = PackController
