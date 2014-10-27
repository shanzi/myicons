import re
import cssutils
import tempfile
import fontforge
from pyquery import PyQuery as pq

FONT_CONTENT_TYPE = (
        'image/svg+xml',
        'application/octet-stream',
        )

CSS_CONTENT_TYPE = (
        'text/css',
        )


BASE_ASCENT = 896
BASE_DESCENT = 128



def font(filepath):
    """Try to convert the contents of font file to json representation.

    :filepath: path to file
    :returns: dict

    """

    def is_glyph_valid(glyph):
        if glyph.unicode > 0:
            bbox = glyph.boundingBox()
            if abs(bbox[2] - bbox[0]) < 1.0 or abs(bbox[3] - bbox[1]) < 1.0: return False
            else: return True
        return False

    font = fontforge.open(filepath)

    ascent = font.ascent or BASE_ASCENT
    descent = font.descent or BASE_DESCENT

    scale = float(BASE_ASCENT) / ascent
    translateY = ascent / float(BASE_ASCENT/BASE_DESCENT) - descent

    trans = (scale, 0.0, 0.0, scale, 0.0, translateY * scale)
    font.ascent = BASE_ASCENT
    font.descent = BASE_DESCENT
    for glyph in font.glyphs():
        if not is_glyph_valid(glyph): glyph.clear()
        else:
            glyph.transform(trans)
            glyph.round()

    tf = tempfile.NamedTemporaryFile(suffix='.svg')
    font.generate(tf.name)
    raw_svg_font = tf.read()
    tf.close()

    raw_svg_font = re.sub(r'xmlns\s*=\s*["\'][^"\']+["\']', '', raw_svg_font)
    svgfont = pq(raw_svg_font)
    raw_glyphs = svgfont('glyph[d]')

    glyphs = []
    for glyph in raw_glyphs:
        d = glyph.attrib.get('d')
        name = glyph.attrib.get('glyph-name')
        unicode_as_int = ord(glyph.attrib.get('unicode'))
        width = glyph.attrib.get('horiz-adv-x')
        width = int(width) if width is not None else BASE_ASCENT
        glyphs.append({
            'name': name,
            'width': width,
            'unicode': unicode_as_int,
            'd': d
            })

    content = {
            'fontname': font.fontname,
            'ascent': font.ascent,
            'descent': font.descent,
            'width': font.ascent,
            'glyphs': glyphs,
            }

    font.close()
    return content


def css(filepath):
    """Convert css files into json representation

    :filepath: path to file
    :returns: dict
    """
    sheet = cssutils.parseFile(filepath)
    converted = []
    for rule in sheet:
        if rule.type == rule.STYLE_RULE:
            content = rule.style['content']
            selectorText = rule.selectorText.lower().strip()
            matched = re.match(r'\.(?P<name>[a-z0-9\-_]+)\s*:before', selectorText)
            if content:
                unicode_as_int = ord(content[1])
                name = matched.groupdict()['name']
                converted.append({
                    'name': name,
                    'unicode': unicode_as_int
                    })
    return converted


def icon(filepath):
    """Try to convert the contents of svg file to json representation of icon.

    :filepath: path to file
    :returns: dict

    """
    iconfile = open(filepath)
    origincontents = iconfile.read()
    iconfile.close()
    contents = re.sub(r'xmlns\s*=\s*["\'][^"\']+["\']', '', origincontents.lower())
    svgdom = pq(contents)
    svg = svgdom('svg')
    viewBox = (svg.attr('viewbox') or '').strip()
    matched = re.match(r',?\s*'.join((
        r'(?P<x>\d+(\.\d+)?)',
        r'(?P<y>\d+(\.\d+)?)',
        r'(?P<width>\d+(\.\d+)?)',
        r'(?P<height>\d+(\.\d+)?)')),
        viewBox)
    if matched:
        x = float(matched.groupdict()['x'])
        y = float(matched.groupdict()['y'])
        width = float(matched.groupdict()['width'])
        height = float(matched.groupdict()['height'])

        tempfont = fontforge.font()
        tempfont.ascent = BASE_ASCENT
        tempfont.descent = BASE_DESCENT
        tempfont.em = BASE_ASCENT + BASE_DESCENT
        glyph = tempfont.createChar(0xf000)
        try:
            tempiconfile = tempfile.NamedTemporaryFile(suffix='.svg')
            tempiconfile.write(origincontents)
            tempiconfile.flush()
            glyph.importOutlines(tempiconfile.name)
            bbox = glyph.boundingBox()
            if abs(bbox[2] - bbox[0]) < 1.0 or abs(bbox[3] - bbox[1]) < 1.0:
                return None
            glyph.transform((1, 0, 0, 1, -bbox[0], -bbox[1]))
            glyph.round()
            bbox = map(int, glyph.boundingBox())
            tempiconfile.close()
        except:
            return None
        
        tmpf = tempfile.NamedTemporaryFile(suffix='.svg')
        tempfont.generate(tmpf.name)
        tempfont.close()

        output = tmpf.read()
        tmpf.close()
        output = re.sub(r'xmlns\s*=\s*["\'][^"\']+["\']', '', output)
        fontquery = pq(output)
        glyph = fontquery('glyph').eq(0)
        d = glyph.attr('d')

        return {
            'viewBox': (0, 0,BASE_ASCENT, BASE_ASCENT),
            'boundingBox': bbox,
            'd': d
            }


def validate_font(filepath, filetype):
    """validate if the file is a valid font
    """
    if filetype in FONT_CONTENT_TYPE:
        try:
            f = fontforge.open(filepath)
            if f.glyphs().next():
                return True
        except EnvironmentError, e:
            pass
    return False


def validate_css(filepath, filetype):
    """Validate if the contents of file is a valid css file
    """
    if filetype in CSS_CONTENT_TYPE:
        sheet = cssutils.parseFile(filepath)
        if sheet.cssText.strip():
            return True
    return False

