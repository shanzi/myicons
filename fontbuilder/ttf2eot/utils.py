
class ConstHelper(object):
    def __init__(self, dict):
        self._dict = dict;

    def __getitem__(self, key):
        return self._dict.get(key)

    def __getattr__(self, key):
        return self._dict.get(key)

