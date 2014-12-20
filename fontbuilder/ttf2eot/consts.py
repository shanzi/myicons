from utils import ConstHelper as c

# offsets in EOT file structure.
EOT_OFFSET = c({
    'LENGTH': 0,
    'FONT_LENGTH': 4,
    'VERSION': 8,
    'CHARSET': 26,
    'MAGIC': 34,
    'FONT_PANOSE': 16,
    'ITALIC': 27,
    'WEIGHT': 28,
    'UNICODE_RANGE': 36,
    'CODEPAGE_RANGE': 52,
    'CHECKSUM_ADJUSTMENT': 60,
})


#  Offsets in different SFNT (TTF) structures.
SFNT_OFFSET = c({
    # sfntHeader:
    'NUMTABLES': 4,

    # TableDirectoryEntry
    'TABLE_TAG': 0,
    'TABLE_OFFSET': 8,
    'TABLE_LENGTH': 12,

    # OS2Table
    'OS2_WEIGHT': 4,
    'OS2_FONT_PANOSE': 32,
    'OS2_UNICODE_RANGE': 42,
    'OS2_FS_SELECTION': 62,
    'OS2_CODEPAGE_RANGE': 78,

    # headTable
    'HEAD_CHECKSUM_ADJUSTMENT': 8,

    # nameTable
    'NAMETABLE_FORMAT': 0,
    'NAMETABLE_COUNT': 2,
    'NAMETABLE_STRING_OFFSET': 4,

    # nameRecord
    'NAME_PLATFORM_ID': 0,
    'NAME_ENCODING_ID': 2,
    'NAME_LANGUAGE_ID': 4,
    'NAME_NAME_ID': 6,
    'NAME_LENGTH': 8,
    'NAME_OFFSET': 10,
})


#  Sizes of structures
SIZEOF = c({
    'SFNT_TABLE_ENTRY': 16,
    'SFNT_HEADER': 12,
    'SFNT_NAMETABLE': 6,
    'SFNT_NAMETABLE_ENTRY': 12,
    'EOT_PREFIX': 82,
})


#  Magic numbers
MAGIC = c({
    'EOT_VERSION': 0x00020001,
    'EOT_MAGIC': 0x504c,
    'EOT_CHARSET': 1,
    'LANGUAGE_ENGLISH': 0x0409,
})
