class PackController
  info: {}
  icons: []
  currentTab: 'icons'

  isTab: (name) -> name == @currentTab

  setTab: (name) -> @currentTab = name

  _renderIcon: (icon) ->
    offsetX = 512 - (icon.width || 1024)/2
    """
    <div class="icon">
      <svg viewBox="0 0 1024 1024">
        <path d="#{icon.svg_d}" transform="scale(1, -1) translate(#{offsetX}, -896)"></path>
      </svg>
    </div>
    """

  renderIcons: -> @$sce.trustAsHtml((@_renderIcon(icon) for icon in @icons).join(''))

  
  constructor: (@$routeParams, @$rootScope, @$sce, @$models) ->
    id = @$routeParams.id
    @info = @$models.Pack.get {id: id}, (pack) =>
      $rootScope.$broadcast '$reselectMenuItem'
      @$models.PackIcon.query 'pack': @info.id, (icons) =>
        @icons = icons
        @iconsHtml = @renderIcons()


module.exports = PackController
