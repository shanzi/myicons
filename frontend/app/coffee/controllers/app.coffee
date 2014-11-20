md5 = require '../deps/md5.js'

class AppController
  theme: 'mydark'
  currentUser: null

  gravatar: (email, size=100) ->
    if email
      return "https://secure.gravatar.com/avatar/#{ md5(email) }?s=#{size}&d=mm"

  openMenu: ->
    @$mdSidenav('left').open()

  constructor: (@$mdSidenav, @$modelManager) ->
    @currentUser = @$modelManager.currentUser
    @$modelManager.ready =>
      console.log 'models ready'

module.exports = AppController
