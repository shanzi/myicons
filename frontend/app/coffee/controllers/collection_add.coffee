class CollectionAddController
  info: {}
  
  reset: ->
    @info = {}

  save: ->
    @$modelManager.addCollection @info, (collection) =>
      @reset()
      @$location.path "/collections/#{collection.id}"

  constructor: (@$location, @$modelManager) ->
    @reset()

module.exports = CollectionAddController
