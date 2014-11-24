class CollectionController
  info: {}
  icons: []
  iconNames: {}
  revisions: []
  currentTab: 'icons'

  isTab: (name) -> name == @currentTab

  setTab: (name) ->
    @currentTab = name
    @refreshIcons() if @shouldRefreshIcons and @currentTab=='icons'
    @refreshRevisions() if @shouldRefreshRevisions and @currentTab=='revisions'

  reset: ->
    @info = angular.copy @_info
    @randomFactor = (new Date()).valueOf().toString(16)

  save: ->
    angular.extend @_info, @info
    @shouldRefreshRevisions = true
    @_info.$update => @reset()

  saveIconName: (icon) ->
    save = =>
      if icon.name and @iconNameChanged(icon)
        @iconNames[icon.id] = icon.name
        icon.$update =>
          @shouldRefreshRevisions = true
    setTimeout save, 100

  iconNameChanged: (icon) ->
    oldName = @iconNames[icon.id]
    oldName != icon.name

  iconNameReset: (icon) ->
    icon.name = @iconNames[icon.id]

  deleteIcon: (icon) ->
    idx = @icons.indexOf(icon)
    @icons.splice(idx, 1)
    icon.$delete =>
      @shouldRefreshRevisions = true

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

  refreshRevisions: ->
    @shouldRefreshRevisions = false
    @revisions = @$modelManager.getCollectionRevisions @_info

  refreshIcons: ->
    @shouldRefreshIcons = false
    @icons = @$modelManager.getCollectionIcons @_info
    @iconNames = {}
    @icons.$promise.then =>
      @iconNames[icon.id] = icon.name for icon in @icons

  restoreRevision: (revision) ->
    @shouldRefreshIcons = true
    revision.$restore => @refreshRevisions()
  
  constructor: (@$routeParams, @$rootScope, @$location, @$modelManager) ->
    id = parseInt @$routeParams.id
    @$modelManager.getCollection id, (collection, icons) =>
      @_info = collection
      @icons = icons
      @iconNames = {}
      @icons.$promise.then =>
        @iconNames[icon.id] = icon.name for icon in icons
      @reset()
      @shouldRefreshRevisions = true
      @$rootScope.$broadcast '$reselectMenuItem'


module.exports = CollectionController
