class PackIconInfoController
  sendto: (collection) ->
    newIconData =
      name: @icon.name
      packicon: @icon.id
      collection: collection.id

    newIcon = new @$models.CollectionIcon(newIconData)
    newIcon.$create =>
      @$mdBottomSheet.hide()

  constructor: (@$mdBottomSheet, @$models, @icon) ->
    @collections = @$models.Collection.query()


class PackController
  info: {}
  icons: []
  currentTab: 'icons'

  isTab: (name) -> name == @currentTab

  setTab: (name) -> @currentTab = name

  reset: ->
    @info = angular.copy @_info

  save: ->
    @_info = @info
    @_info.$save (pack) =>
      @_info = pack
      @reset()
      @$rootScope.$broadcast '$packInfoUpdated'

  unchanged: ->
    angular.equals @info, @_info

  showIconInfo: (icon) ->
    console.log icon
    @$mdBottomSheet.show
      controller: PackIconInfoController
      controllerAs: 'info'
      templateUrl: '/static/templates/pack_icon_info.html'
      locals:
        icon: icon
  
  constructor: (@$routeParams, @$rootScope, @$models, @$mdBottomSheet) ->
    id = @$routeParams.id
    @_info = @$models.Pack.get {id: id}, (pack) =>
      @reset()
      @$rootScope.$broadcast '$reselectMenuItem'
    @icons = @$models.PackIcon.query 'pack': @info.id


module.exports = PackController
