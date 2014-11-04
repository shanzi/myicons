class CollectionController
  info: {}
  icons: []
  iconNames: {}
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
      @$rootScope.$broadcast '$collectionInfoUpdated'

  saveIconName: (icon) ->
    save = =>
      if icon.name and @iconNameChanged(icon)
        @iconNames[icon.id] = icon.name
        icon.$save()
    setTimeout save, 100

  iconNameChanged: (icon) ->
    oldName = @iconNames[icon.id]
    oldName != icon.name

  iconNameReset: (icon) ->
    icon.name = @iconNames[icon.id]

  deleteIcon: (icon) ->
    idx = @icons.indexOf(icon)
    @icons.splice(idx, 1)
    icon.$delete()
          

  unchanged: ->
    angular.equals @info, @_info
  
  constructor: (@$routeParams, @$rootScope, @$models) ->
    id = @$routeParams.id
    @_info = @$models.Collection.get {id: id}, (pack) =>
      @reset()
      @$rootScope.$broadcast '$reselectMenuItem'
    @icons = @$models.CollectionIcon.query 'collection': @info.id, (icons) =>
      @iconNames[icon.id] = icon.name for icon in icons


module.exports = CollectionController
