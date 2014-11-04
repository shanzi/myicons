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
  
  constructor: (@$routeParams, @$rootScope, @$models) ->
    id = @$routeParams.id
    @_info = @$models.Pack.get {id: id}, (pack) =>
      @reset()
      @$rootScope.$broadcast '$reselectMenuItem'
    @icons = @$models.PackIcon.query 'pack': @info.id


module.exports = PackController
