
class MenuController
  currentSection: null
  currentItem: null
  sections:[
    {name: 'home', isExpand: false}
    {name: 'packs', isExpand: false}
    {name: 'collections', isExpand: false}
    {name: 'labels', isExpand: false}
  ]

  selectSection: (section) ->
    @currentSection = section

  selectItem: (section, item) ->
    @selectSection(section)
    @currentItem = item

  isSelectedSection: (section) ->
    section == @currentSection and !section.isExpand

  isSelectedItem: (section, item) ->
    item == @currentItem and section.isExpand

  toggleExpand: (section) ->
    section.isExpand = !section.isExpand

  constructor: (@$scope, @$rootScope, @$location) ->
    for section in @sections
      section.items = [
        {name: 'Test Item 1'}
        {name: 'Test Item 2'}
        {name: 'Test Item 3'}
      ]
    @$rootScope.$on '$locationChangeSuccess', =>
      path = $location.path()
      for section in @sections
        if section.items
          for item in section.items
            if path == item.url
              @currentItem = item
              @currentSection = section
      if @currentSection == null
        @selectSection @sections[0]

    @$scope.menu = this



module.exports = ($scope, $rootScope, $location) =>
  new MenuController($scope, $rootScope, $location)
