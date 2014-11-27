class PackIconDirective
  searchText: ''

  _renderIcon: (icon) ->
    """
    <div class="icon" data-icon-id="#{icon.id}">
      <svg viewBox="0 0 1024 1024">
        <path d="#{icon.svg_d}" transform="scale(1, -1) translate(#{ 512 - (icon.width || 1024)/2 }, -896)"></path>
      </svg>
    </div>
    """

  filterIcons: (icons) ->
    if @searchText
      return icons.filter (icon) => icon and icon.search_text.search(@searchText) >= 0
    else
      return icons

  renderIcons: ->
    icons = @filterIcons(@scope.icons)
    if icons
      @element.html (@_renderIcon(icon) for icon in icons).join('')
      @element.children().on 'click', (event) =>
        iconEle = angular.element event.currentTarget
        iconId = parseInt iconEle.attr 'data-icon-id'
        if iconId
          @iconClicked iconId
    else
      @element.html ''

  iconWithId: (id) ->
    for icon in @scope.icons
      return icon if icon.id == id

  iconClicked: (id) ->
    icon = @iconWithId id
    @scope.iconClick icon: icon

  constructor: (@scope, @element, @attrs) ->
    @renderIcons()
    @scope.$watchCollection 'icons', (value) => @renderIcons()
    @scope.$watch 'filter', (value) =>
      @searchText = value.trim()
      @renderIcons()
  

module.exports = ->
  restrict: 'E'
  scope:
    icons: '='
    filter: '='
    iconClick: '&'
  link: (scope, element, attrs) ->
    scope.packIconCtrl = new PackIconDirective(scope, element, attrs)
