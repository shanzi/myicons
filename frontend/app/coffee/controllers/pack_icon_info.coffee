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


module.exports = PackIconInfoController
