#!/usr/bin/env python
# encoding: utf-8

import os
import cPickle

BASE_DIR = os.path.dirname(__file__)
PRESET_DIR = os.path.join(BASE_DIR, './presets')
OUTPUT_FILE = os.path.join(BASE_DIR, 'presets.pickle')

def main():
    label_dict = {}
    for path, _, names in os.walk(PRESET_DIR):
        for name in names:
            label, _ = os.path.splitext(name)
            filepath = os.path.join(path, name)
            label_set = set()
            with open(filepath) as f:
                for line in f.readlines():
                    w = line.strip()
                    if w: label_set.add(w)
            label_dict[label] = label_set

    with open(OUTPUT_FILE, 'w') as f:
        cPickle.dump(label_dict, f)


if __name__ == '__main__':
    main()
