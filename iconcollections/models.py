import uuid

from django.db import models


class Collection(models.Model):
    name = models.CharField(max_length=128, db_index=True)
    build_name = models.CharField(max_length=128, db_index=True)
    prefix = models.CharField(max_length=16, default="", blank=True)
    token = models.CharField(max_length=32, unique=True, editable=False, blank=True, default="")

    def save(self, *args, **kwargs):
        # generate token if absent
        if not self.token:
            self.token = uuid.uuid1().hex
        return models.Model.save(self, *args, **kwargs)


class CollectionIcon(models.Model):
    name = models.CharField(max_length=128, db_index=True, default="")
    svg_d = models.TextField(default="", blank=True)
    width = models.FloatField(default=1.0, blank=True)

    packicon = models.ForeignKey('iconpacks.PackIcon', related_name="collectionicons",
                                 null=True, blank=True, on_delete=models.SET_NULL)
    collection = models.ForeignKey(Collection, related_name="icons")

    def __unicode__(self):
        return unicode(self.name)

    def save(self, *args, **kwargs):
        # if packicon is present, use attributes of packicon to fill
        # the attributes in collectionicon
        if self.packicon:
            if not self.name.strip():
                self.name = self.packicon.name
            if not self.svg_d.strip():
                self.svg_d= self.packicon.svg_d
                self.width = self.packicon.width
        return models.Model.save(self, *args, **kwargs)
