class CollectionController
  info: {}
  icons: []
  iconNames: {}
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

  saveIconName: (icon) ->
    save = =>
      if icon.name and @iconNameChanged(icon)
        @iconNames[icon.id] = icon.name
        icon.$update()
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

  liveURL: ->
    "#{window.location.origin}/build/livetesting/#{@info.token}.css"

  retoken: ->
    @info.$retoken (info) =>
      @_info.token = info.token
      @info.token = info.token

  delete: ->
    ok = confirm 'Are you sure?'
    if ok
      @$modelManager.deleteCollection @_info
      @$location.path('#/home/dashboard')

  fieldName: (prefix) ->
    return prefix + @randomFactor
  
  constructor: (@$routeParams, @$rootScope, @$location, @$modelManager) ->
    id = parseInt @$routeParams.id
    @$modelManager.getCollection id, (collection, icons, revisions) =>
      @_info = collection
      @icons = icons
      @revisions = revisions
      @iconNames = {}
      @icons.$promise.then =>
        @iconNames[icon.id] = icon.name for icon in icons
      @reset()
      @$rootScope.$broadcast '$reselectMenuItem'


module.exports = CollectionController
