md5 = require '../deps/md5.js'

class AppController
  sections: [
    {name: 'Home'},
    {name: 'Packs'},
    {name: 'Collections'},
    {name: 'Labels'},
  ]

  gravatar: (email, size=100) ->
    return "https://secure.gravatar.com/avatar/#{ md5(email) }?s=#{size}&d=mm"

  constructor: ($scope) ->
    $scope.app = this

module.exports = (args...) =>
  new AppController(args...)
