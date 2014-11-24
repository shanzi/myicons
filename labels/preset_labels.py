import os
import cPickle

BASE_DIR = os.path.dirname(__file__)
INPUT_FILE = os.path.join(BASE_DIR, 'presets.pickle')

with open(INPUT_FILE) as f:
    PRESET_LABEL_DICT = cPickle.load(f)
    PRESET_LABELS = [{'name': key} for key in PRESET_LABEL_DICT.keys()]

__all__ = ('PRESET_LABELS', 'PRESET_LABEL_DICT')
