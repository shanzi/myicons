models = require './models'

class ModelManger

  constructor: (@$resource, @$q) ->
    @$models = models(@$resource)
    @currentUser = @$models.User.current()
    @packs = @$models.Pack.query()
    @collections = @$models.Collection.query()

  ready: (callback) ->
    @$q.all @currentUser.$promise, @packs.$promise, @collections.promise
      .then callback

  getPack: (id, callback) ->
    @ready =>
      for pack in @packs
        if pack.id == id
          callback pack, @$models.PackIcon.query pack: pack.id
          return

  getCollection: (id, callback) ->
    @ready =>
      for collection in @collections
        if collection.id == id
          callback collection, @$models.CollectionIcon.query collection: collection.id
          return

  addPack: (pack, callback) ->
    # TODO: implement add pack
    #

  addCollection: (collection, callback) ->
    newCollection = new @$models.Collection collection
    newCollection.$save =>
      @collections.push newCollection
      callback newCollection if callback

  addCollectionIcon: (icon, callback) ->
    newIcon = new @$models.CollectionIcon icon
    newIcon.$save =>
      callback newIcon if callback

  deleteCollection: (col) ->
    idx = @collections.indexOf col
    @collections.splice(idx, 1)
    col.$delete()

module.exports = ($resource, $q) =>
  new ModelManger($resource, $q)
