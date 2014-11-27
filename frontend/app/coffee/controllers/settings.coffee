class SettingsController
  chpass:{}

  reset: ->
    @currentUser = angular.copy @_currentUser
    @randomFactor = (new Date()).valueOf().toString(16)

  resetPass: ->
    @chpass = {}

  update: ->
    @currentUser.$update =>
      angular.extend @_currentUser, @currentUser

  updatePass: ->
    user = angular.copy @currentUser
    angular.extend user, @chpass
    user.$change_password => @resetPass()

  fieldName: (prefix) ->
    return prefix + @randomFactor

  unchanged: ->
    angular.equals @currentUser, @_currentUser

  passUnchanged: ->
    angular.equals @chpass, {}

  passUnmatched: ->
    @chpass.newpassword != @chpass.repeat

  constructor: (@$mdSidenav, @$modelManager) ->
    @$modelManager.ready =>
      @_currentUser = @$modelManager.currentUser
      @reset()





module.exports = SettingsController
