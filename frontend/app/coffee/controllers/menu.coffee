class MenuSection
  sectionIcon: ''

  isExpanded: false

  addItemUrl: null

  constructor: (@name, @sectionIcon, @items) ->

  pathForItem: (item) -> "/#{@name}/#{item.id}"

  toggleExpand: -> @isExpanded = !@isExpanded
  

class MenuController
  sections: []
  currentSection: null
  currentItem: null

  isSelectedSection: (section) ->
    section == @currentSection and !section.isExpanded

  isSelectedItem: (section, item) ->
    item == @currentItem and section.isExpanded

  goto: (section, item) ->
    @$location.path(section.pathForItem(item))

  selectItem: ->
    path = @$location.path()
    for section in @sections
      for item in section.items
        if section.pathForItem(item) == path
          @currentSection = section
          @currentItem = item
          @currentSection.isExpanded = true
          return
    @currentSection = null
    @currentItem = null

  constructor: (@$rootScope, @$location, @$modelManager) ->
    @home = new MenuSection 'home', 'icon-home', [
      {id: 'dashboard', name: 'Dashboard'},
      {id: 'settings', name: 'Settings'}
    ]
    @packs = new MenuSection 'packs', 'icon-packs', @$modelManager.packs
    @collections = new MenuSection 'collections', 'icon-collections', @$modelManager.collections
    @labels = new MenuSection 'labels', 'icon-labels', @$modelManager.labels

    @packs.addItemUrl = '#/packs/add'
    @collections.addItemUrl = '#/collections/add'

    @sections = [@home, @packs, @collections, @labels]

    @$rootScope.$on '$reselectMenuItem', => @selectItem()
    @$rootScope.$on '$locationChangeSuccess', => @selectItem()
  

module.exports = MenuController
