class DashboardController
  revisionPage: {}
  
  refreshRevisions: ->
    @revisionPage.$get()

  restoreRevision: (revision) ->
    @$modelManager.restoreRevision revision, (rev) =>
      if rev.model == 'pack'
        @$modelManager.refreshPacks()
      else if rev.model == 'collection'
        @$modelManager.refreshCollections()
      @refreshRevisions()

  loadMoreRevisions: ->
    @$modelManager.getNextRevisionPage @revisionPage

  constructor: (@$mdSidenav, @$modelManager) ->
    @revisionPage = @$modelManager.getRevisionPage()


module.exports = DashboardController
