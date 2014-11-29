module.exports = ($resource) ->
  'User':
    $resource '/accounts/users/:username/',
      {username: '@username'},
      current:
        method: 'GET'
        url: '/accounts/users/current/'
      save:
        method: 'POST'
        url: '/accounts/users/'
      update:
        method: 'PATCH'
      change_password:
        method: 'PATCH'
        url: '/accounts/users/:username/change_password/'
      reset_password:
        method: 'PATCH'
        url: '/accounts/users/:username/reset_password/'

  'Pack':
    $resource '/packs/:id/', {id: '@id'},
      update:
        method: 'PATCH'

  'PackIcon':
    $resource '/packicons/:id/', {id: '@id'},
      update:
        method: 'PATCH'

  'Collection':
    $resource '/collections/:id/', {id: '@id'},
      update:
        method: 'PATCH'
      retoken:
        url: '/collections/:id/retoken/'
        params: {id: '@id'}
        method: 'POST'

  'CollectionIcon':
    $resource '/collectionicons/:id/', {id: '@id'},
      update:
        method: 'PATCH'

  'Revision':
    $resource '/revisions/:id/', {id: '@id'},
      restore:
        url: '/revisions/:id/restore/'
        params: {id: '@id'}
        method: 'POST'

  'RevisionPage':
    $resource '/revisions/', {page_size: 30},

  'Label':
    $resource '/labels/:id/', {id: '@id'},
