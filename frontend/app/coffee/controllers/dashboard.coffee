class DashboardController
  revisions: []
  
  refreshRevisions: ->
    delayed = =>
      @$modelManager.getRevisions (revisions) => @revisions = revisions
    setTimeout delayed, 1000

  restoreRevision: (revision) ->
    revision.$restore (rev) =>
      if rev.model == 'pack'
        @$modelManager.refreshPacks()
      else if rev.model == 'collection'
        @$modelManager.refreshCollections()
      @refreshRevisions()

  constructor: (@$mdSidenav, @$modelManager) ->
    @$modelManager.getRevisions (revisions) => @revisions = revisions


module.exports = DashboardController
