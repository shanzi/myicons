PackIconInfoController = require './pack_icon_info'

class LabelController
  info: {}

  showIconInfo: (icon) ->
    @$mdBottomSheet.show
      controller: PackIconInfoController
      controllerAs: 'info'
      templateUrl: '/static/templates/pack_icon_info.html'
      locals:
        icon: icon

  constructor: (@$routeParams, @$rootScope, @$modelManager, @$mdBottomSheet) ->
    label = @$routeParams.id
    @$modelManager.getLabel label, (info) =>
      @info = info
      @$rootScope.$broadcast '$reselectMenuItem'


module.exports = LabelController
