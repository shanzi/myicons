module.exports = ($resource) ->
  'User':
    $resource '/accounts/users/:username/',
      {username: '@username'},
      current:
        method: 'GET'
        url: '/accounts/users/current/',

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

  'Label':
    $resource '/labels/:id/', {id: '@id'},
