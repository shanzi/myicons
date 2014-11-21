class PackAddController
  info: {}

  fontStatus: ''
  cssStatus: ''

  icons: []
  iconNames: []

  reset: ->
    @info = {}
    @icons = []
    @iconNames = []
    @fontStatus = ''
    @cssStatus = ''

  fontFileSelected: (files) ->
    if files.length and @fontStatus!='processing'
      fontfile = files[0]
      if not fontfile.name.match /\.(ttf|woff|eot|svg)$/
        @fontStatus = 'error'
      else
        @fontStatus = 'processing'
        @$upload.upload url: '/convert/font/', file: fontfile
          .success (data) =>
            @icons = data.content.glyphs
            @fontStatus = 'success'
            @info.name = data.content.fontname
          .error =>
            @fontStatus = 'error'

  cssFileSelected: (files) ->
    if files.length and @cssStatus!='processing'
      cssfile = files[0]
      if not cssfile.name.match /\.css$/
        @cssStatus = 'error'
      else
        @cssStatus = 'processing'
        @$upload.upload url: '/convert/css', file: cssfile
          .success (data) =>
            @iconNames = data.content
            @cssStatus = 'success'
          .error =>
            @cssStatus = 'error'

  fontInfo: ->
    if @fontStatus=='error'
      return 'Invalid font file!'
    else if @fontStatus=='success'
      return "#{@icons.length} icons detected"
    else if @fontStatus=='processing'
      return 'Processing'
    else
      'Drag font(.ttf, .eot, .woff, .svg) file here to retrive all icons\' shape.'

  cssInfo: ->
    if @cssStatus=='error'
      return 'Invalid css file!'
    else if @cssStatus=='success'
      return "#{@iconNames.length} icon names detected"
    else if @cssStatus=='processing'
      return 'Processing'
    else
      'Drag StyleSheet(.css) file here to retrive all icon names.'

  iconsInvalid: ->
    not (@cssStatus == @fontStatus == 'success')

  pairIcons: ->
    glyphDict = {}
    glyphDict[glyph.svg_unicode] = glyph for glyph in @icons
    icons = []
    for namepair in @iconNames
      glyph = glyphDict[namepair.unicode]
      if glyph
        icon = angular.copy glyph
        icon.name = namepair.name
        icons.push icon
    return icons

  save: ->
    icons = @pairIcons()
    if not icons.length > 0
      alert 'Unmatched font and css, please upload the correct file!'
    else
      info = angular.copy @info
      info.icons = icons
      @$modelManager.addPack info, (pack) =>
        @$location.path "/pack/#{pack.id}"

  constructor: (@$location, @$modelManager, @$upload) ->

module.exports = PackAddController
