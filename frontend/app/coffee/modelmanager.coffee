models = require './models'

class ModelManger

  ready: (callback) ->
    @$q.all @currentUser.$promise, @packs.$promise, @collections.$promise
      .then => callback()

  getPack: (id, callback) ->
    @ready =>
      for pack in @packs
        if pack.id == id
          icons = @$models.PackIcon.query pack: pack.id
          revisions = @$models.Revision.query ref_model:'pack', ref_id:pack.id
          callback pack, icons, revisions
          return

  getCollection: (id, callback) ->
    @ready =>
      for collection in @collections
        if collection.id == id
          icons = @$models.CollectionIcon.query collection: collection.id
          revisions = @$models.Revision.query ref_model:'collection', ref_id:collection.id
          callback collection, icons, revisions
          return

  addPack: (pack, callback) ->
    newPack = new @$models.Pack pack
    newPack.$save =>
      @packs.push newPack
      callback newPack if callback

  deletePack: (pack) ->
    idx = @packs.indexOf pack
    @packs.splice(idx, 1)
    pack.$delete()

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

  constructor: (@$resource, @$q) ->
    @$models = models(@$resource)
    @currentUser = @$models.User.current()
    @packs = @$models.Pack.query()
    @collections = @$models.Collection.query()


module.exports = ($resource, $q) =>
  new ModelManger($resource, $q)
