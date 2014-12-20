#!/usr/bin/env python
# encoding: utf-8

"""
Translate ttf files to IE8 compatible EOT files.
Based on the implementation of ttf2eot in nodejs by fontello.
(https://github.com/fontello/ttf2eot/)
"""


import consts
from .bytebuffer import ByteBuffer

__all__ = ('ttf2eot', )


def strbuf(raw):
    b = ByteBuffer(bytearray(len(raw) + 4))
    b.setuint(16, 0, len(raw), True)

    for i in xrange(0, len(raw), 2):
        b1 = ord(raw[i])
        b2 = ord(raw[i + 1])
        val = (b1 << 8) + b2
        b.setuint(16, i + 2, val, True)

    b.setuint(16, len(raw) + 2, 0, True)
    return b.getvalue()


def ttf2eot(array):
    buf = ByteBuffer(array)
    out = ByteBuffer(bytearray(consts.SIZEOF.EOT_PREFIX))

    out.setuint(32, consts.EOT_OFFSET.FONT_LENGTH, len(array), True)
    out.setuint(32, consts.EOT_OFFSET.VERSION, consts.MAGIC.EOT_VERSION, True)
    out.setuint(8, consts.EOT_OFFSET.CHARSET, consts.MAGIC.EOT_CHARSET)
    out.setuint(16, consts.EOT_OFFSET.MAGIC, consts.MAGIC.EOT_MAGIC, True)

    familyName = []
    subfamilyName = []
    fullName = []
    versionString = []

    haveOS2 = False
    haveName = False
    haveHead = False

    numTables = buf.getuint(16, consts.SFNT_OFFSET.NUMTABLES)

    for i in xrange(numTables):
        start = consts.SIZEOF.SFNT_HEADER + i * consts.SIZEOF.SFNT_TABLE_ENTRY
        data = ByteBuffer(array[start:])
        tableEntryTag = data.readat(consts.SFNT_OFFSET.TABLE_TAG, 4)
        tableEntryOffset = data.getuint(32, consts.SFNT_OFFSET.TABLE_OFFSET)
        tableEntryLength = data.getuint(32, consts.SFNT_OFFSET.TABLE_LENGTH)
        table = ByteBuffer(array[tableEntryOffset: tableEntryOffset + tableEntryLength])

        if tableEntryTag == 'OS/2':
            haveOS2 = True

            for j in xrange(10):
                val = table.getuint(8, consts.SFNT_OFFSET.OS2_FONT_PANOSE + j)
                out.setuint(8, consts.EOT_OFFSET.FONT_PANOSE + j, val)

            fselection = table.getuint(16, consts.SFNT_OFFSET.OS2_FS_SELECTION)
            out.setuint(8, consts.EOT_OFFSET.ITALIC, fselection & 0x01)

            os2_weight = table.getuint(16, consts.SFNT_OFFSET.OS2_WEIGHT)
            out.setuint(32, consts.EOT_OFFSET.WEIGHT, os2_weight, True)

            for j in range(4):
                os2_unicode_range = table.getuint(32, consts.SFNT_OFFSET.OS2_UNICODE_RANGE + j * 4)
                out.setuint(32, consts.EOT_OFFSET.UNICODE_RANGE + j * 4, os2_unicode_range, True)

            for j in (0, 1):
                os2_codepage_range = table.getuint(32, consts.SFNT_OFFSET.OS2_CODEPAGE_RANGE + j * 4)
                out.setuint(32, consts.EOT_OFFSET.CODEPAGE_RANGE + j * 4, os2_codepage_range, True)

        elif tableEntryTag == 'head':
            haveHead = True
            head_checkssum_adjust = table.getuint(32, consts.SFNT_OFFSET.HEAD_CHECKSUM_ADJUSTMENT)
            out.setuint(32, consts.EOT_OFFSET.CHECKSUM_ADJUSTMENT, head_checkssum_adjust, True)

        elif tableEntryTag == 'name':
            haveName = True
            nameTableCount = table.getuint(16, consts.SFNT_OFFSET.NAMETABLE_COUNT)
            nameTableStringOffset = table.getuint(16, consts.SFNT_OFFSET.NAMETABLE_STRING_OFFSET)

            for j in xrange(nameTableCount):
                tableOffset = tableEntryOffset + consts.SIZEOF.SFNT_NAMETABLE + j * consts.SIZEOF.SFNT_NAMETABLE_ENTRY
                nameRecord = ByteBuffer(array[tableOffset:])
                namePID = nameRecord.getuint(16, consts.SFNT_OFFSET.NAME_PLATFORM_ID)
                nameEID = nameRecord.getuint(16, consts.SFNT_OFFSET.NAME_ENCODING_ID)
                nameLID = nameRecord.getuint(16, consts.SFNT_OFFSET.NAME_LANGUAGE_ID)
                nameID = nameRecord.getuint(16, consts.SFNT_OFFSET.NAME_NAME_ID)
                nameLength = nameRecord.getuint(16, consts.SFNT_OFFSET.NAME_LENGTH)
                nameOffset = nameRecord.getuint(16, consts.SFNT_OFFSET.NAME_OFFSET)

                if namePID == 3 and nameEID == 1 and nameLID == consts.MAGIC.LANGUAGE_ENGLISH:
                    tablevalue = table.getvalue()
                    strbufOffset = nameTableStringOffset + nameOffset
                    s = strbuf(tablevalue[strbufOffset: strbufOffset + nameLength])

                    if nameID == 1:
                        familyName = s
                    elif nameID == 2:
                        subfamilyName = s
                    elif nameID == 4:
                        fullName = s
                    elif nameID == 5:
                        versionString = s

        if haveOS2 and haveName and haveHead: break

    if not (haveOS2 and haveName and haveHead):
        raise Exception('Required section not found')

    outvalue = out.getvalue()
    bufvalue = buf.getvalue()
    finallen = sum((len(outvalue),
                    len(familyName),
                    len(subfamilyName),
                    len(versionString),
                    len(fullName),
                    len(bufvalue),
                    2))
    eot = ByteBuffer(bytearray(finallen))
    eot.write(outvalue)
    eot.write(familyName)
    eot.write(subfamilyName)
    eot.write(versionString)
    eot.write(fullName)
    eot.write(bytearray(2))
    eot.write(bufvalue)
    eot.setuint(32, consts.EOT_OFFSET.LENGTH, finallen, True)

    return eot.getvalue()
