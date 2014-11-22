class CollectionAddController
  info: {}
  
  reset: ->
    @info = {}
    @randomFactor = (new Date()).valueOf().toString(16)

  save: ->
    @$modelManager.addCollection @info, (collection) =>
      @reset()
      @$location.path "/collections/#{collection.id}"

  fieldName: (prefix) ->
    return prefix + @randomFactor

  constructor: (@$location, @$modelManager) ->
    @reset()

module.exports = CollectionAddController
