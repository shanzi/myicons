class MenuSection
  isExpanded: false

  constructor: (@name, @items) ->

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

  constructor: (@$rootScope, @$location, @$models) ->
    @home = new MenuSection 'home', [
      {id: 'dashboard', name: 'Dashboard'},
      {id: 'settings', name: 'Settings'}
    ]
    @packs = new MenuSection 'packs', @$models.Pack.query()
    @collections = new MenuSection 'collections', @$models.Collection.query()

    @sections = [@home, @packs, @collections]

    @$rootScope.$on '$locationChangeSuccess', => @selectItem()
    @$rootScope.$on '$reselectMenuItem', => @selectItem()
  

module.exports = MenuController
