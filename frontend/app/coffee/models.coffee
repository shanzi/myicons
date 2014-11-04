module.exports = ($resource) ->
  'User':
    $resource '/accounts/users/:username/',
      {username: '@username'},
      current:
        method: 'GET'
        url: '/accounts/users/current/',

  'Pack':
    $resource '/packs/:id/', {id: '@id'},
      save:
        method: 'PATCH'

  'PackIcon':
    $resource '/packicons/:id/', {id: '@id'},
      save:
        method: 'PATCH'

  'Collection':
    $resource '/collections/:id/', {id: '@id'},
      save:
        method: 'PATCH'

  'CollectionIcon':
    $resource '/collectionicons/:id/', {id: '@id'},
      save:
        method: 'PATCH'

