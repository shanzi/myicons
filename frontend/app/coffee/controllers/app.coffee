md5 = require '../deps/md5.js'

class AppController
  currentUser: null

  gravatar: (email, size=100) ->
    if email
      return "https://secure.gravatar.com/avatar/#{ md5(email) }?s=#{size}&d=mm"

  openMenu: ->
    @$mdSidenav('left').open()

  getCurrentUser: ->
    @$models.User.current (user) => @currentUser = user

  constructor: (@$mdSidenav, @$models) ->
    @getCurrentUser()

module.exports = AppController
