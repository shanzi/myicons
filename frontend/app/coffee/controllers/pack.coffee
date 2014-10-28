class PackController
  data: {}
  constructor: (@$routeParams, @$models, $rootScope) ->
    id = @$routeParams.id
    @$models.Pack.get {id: id}, (pack) =>
      @data = pack
      $rootScope.$broadcast '$reselectMenuItem'


module.exports = PackController
