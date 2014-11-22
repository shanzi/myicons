class PackIconInfoController
  sendto: (collection) ->
    newIconData =
      name: @icon.name
      packicon: @icon.id
      collection: collection.id

    @$modelManager.addCollectionIcon newIconData, =>
      @$mdBottomSheet.hide()

  constructor: (@$rootScope, @$mdBottomSheet, @$modelManager, @icon) ->
    @collections = @$modelManager.collections
    @$rootScope.$on '$locationChangeStart', => @$mdBottomSheet.hide()


class PackController
  info: {}
  icons: []
  currentTab: 'icons'

  isTab: (name) -> name == @currentTab

  setTab: (name) -> @currentTab = name

  reset: ->
    @info = angular.copy @_info
    @randomFactor = (new Date()).valueOf().toString(16)

  save: ->
    angular.extend @_info, @info
    @_info.$update()
    @randomFactor = (new Date()).valueOf().toString(16)

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
  
  constructor: (@$routeParams, @$rootScope, @$location, @$modelManager, @$mdBottomSheet) ->
    id = parseInt @$routeParams.id
    @$modelManager.getPack id, (pack, icons) =>
      @_info = pack
      @icons = icons
      @reset()
      @$rootScope.$broadcast '$reselectMenuItem'


module.exports = PackController
