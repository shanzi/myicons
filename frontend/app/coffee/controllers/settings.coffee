class SettingsController
  chpass:{}
  newuser: {}

  isAdmin: ->
    return @currentUser.is_superuser or @currentUser.is_staff

  actionDisabled: (user) ->
    if user.is_superuser
      return true
    if user.is_staff
      return not @currentUser.is_superuser
    return false

  reset: ->
    @currentUser = angular.copy @_currentUser
    @randomFactor = (new Date()).valueOf().toString(16)

  resetPass: ->
    @chpass =
      oldpassword: ''
      newpassword: ''
      repeat: ''

  update: ->
    @currentUser.$update =>
      angular.extend @_currentUser, @currentUser

  updatePass: ->
    user = angular.copy @currentUser
    angular.extend user, @chpass
    success = =>
      alert 'Password updated success!\n\nPlease log in again.'
      window.location = '/login'
    failed = =>
      @chpass.oldpassword = ''
      alert 'Password update failed!'
    user.$change_password success, failed

  fieldName: (prefix) ->
    return prefix + @randomFactor

  unchanged: ->
    angular.equals @currentUser, @_currentUser

  passUnchanged: ->
    angular.equals @chpass, {}

  passwordDisabled: ->
    if @chpass.oldpassword and @chpass.newpassword and @chpass.repeat
      return @chpass.newpassword != @chpass.repeat
    return true

  grantAdmin: (user) ->
    user.is_staff = true
    user.$update()

  cancelAdmin: (user) ->
    user.is_staff = false
    user.$update()

  resetPassword: (user) ->
    user.$reset_password()

  deleteUser: (user) ->
    if confirm("Are you sure to delete user '#{user.username}'?\nThis action can not be undo.")
      index = @users.indexOf user
      @users.splice(index, 1)
      user.$delete()

  addUser: ->
    success = (newuser) =>
      @newuser =
        username: ''
        email: ''
      @users.push newuser

    failed = =>
      alert 'Add user failed!'

    @$modelManager.addUser @newuser, success, failed

  addUserDisabled: ->
    not (@newuser.username and @newuser.email)

  constructor: (@$mdSidenav, @$modelManager) ->
    @$modelManager.ready =>
      @_currentUser = @$modelManager.currentUser
      @reset()
      @users = @$modelManager.getUsers() if @isAdmin()


module.exports = SettingsController
