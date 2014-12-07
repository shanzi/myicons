import tempfile
import zipfile
import fontforge

from django.template.loader import render_to_string

from rest_framework import renderers

from .utils import minify_css

class FontCSSRenderer(renderers.BaseRenderer):
    media_type = 'text/css'
    format = 'css'
    charset = 'utf8'
    production = False

    def render(self, data, media_type=None, render_context=None):
        if render_context and render_context.get('response').status_code != 200: return ''
        data['production'] = self.production
        icons = data['icons']
        data['classnames'] = ', '.join('.' + icon['classname'] for icon in icons)
        return render_to_string('fontcss.css', data)

class FontCheatSheetRenderer(renderers.BaseRenderer):
    media_type = 'text/html'
    format = 'html'
    charset = 'utf8'
    production = False

    def render(self, data, media_type=None, render_context=None):
        if render_context and render_context.get('response').status_code != 200: return ''
        data['production'] = self.production
        return render_to_string('fontcheatsheet.html', data)


class SVGFontRenderer(renderers.BaseRenderer):
    media_type = 'text/svg+xml'
    format = 'svg'
    
    def render(self, data, media_type=None, render_context=None):
        if render_context and render_context.get('response').status_code != 200: return ''
        return render_to_string('svgfont.svg', data)


class BinaryFontRenderer(SVGFontRenderer):
    media_type = 'application/octet-stream'
    charset = None
    render_style = 'binary'
    svgfile = None
    
    def get_svgfile(self, data):
        if self.svgfile: return self.svgfile
        svgtext = SVGFontRenderer.render(self, data)

        svgfile = tempfile.NamedTemporaryFile(suffix='.svg')
        svgfile.write(svgtext)
        svgfile.flush()

        self.svgfile = svgfile
        return self.svgfile

    def gen_binaryfont(self, fileformat, font):
        fontdata = ''
        tempfontfile = tempfile.NamedTemporaryFile(suffix=('.' + fileformat))
        with tempfontfile:
            font.generate(tempfontfile.name)
            fontdata = tempfontfile.read()
        return fontdata

    def render(self, data, media_type=None, render_context=None):
        if render_context and render_context.get('response').status_code != 200: return ''
        svgfile = self.get_svgfile(data)
        font = fontforge.open(svgfile.name)
        fontdata = self.gen_binaryfont(self.format, font)
        font.close()
        svgfile.close()
        return fontdata


class WOFFRenderer(BinaryFontRenderer):
    format = 'woff'


class ZIPPackRenderer(BinaryFontRenderer, FontCSSRenderer, FontCheatSheetRenderer):
    media_type = 'application/zip'
    charset = None
    render_style = 'binary'
    format = 'zip'
    production = True

    def render(self, data, media_type=None, render_context=None):
        if render_context and render_context.get('response').status_code != 200: return ''
        svgfile = self.get_svgfile(data)
        font = fontforge.open(svgfile.name)

        ttf = self.gen_binaryfont('ttf', font)
        woff = self.gen_binaryfont('woff', font)
        eot = self.gen_binaryfont('eot', font)

        packfile = tempfile.TemporaryFile()
        pack = zipfile.ZipFile(packfile, 'w')

        build_name = data['build_name']

        pack.writestr(('fonts/%s.ttf' % build_name), ttf)
        pack.writestr(('fonts/%s.woff' % build_name), woff)
        pack.writestr(('fonts/%s.eot' % build_name), eot)
        pack.write(svgfile.name, ('fonts/%s.svg' % build_name))

        css = FontCSSRenderer.render(self, data, media_type, render_context)
        cheatsheet = FontCheatSheetRenderer.render(self, data, media_type, render_context)

        pack.writestr(('css/%s.css' % build_name), css)
        pack.writestr(('css/%s.min.css' % build_name), minify_css(css))
        pack.writestr('cheatsheet.html', cheatsheet)

        pack.close()
        packfile.seek(0)
        ret = packfile.read()
        
        packfile.close()
        return ret
