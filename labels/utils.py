from preset_labels import PRESET_LABEL_DICT


def search_text_for(name):
    splited = name.split('-')
    if len(splited) >= 3:
        joined = '-'.join(splited[1:])
        splited.append(joined)
    splited_set = set(splited)
    for label, keywords in PRESET_LABEL_DICT.iteritems():
        if splited_set & keywords:
            splited.append(label)
    return ' '.join(splited).lower()
