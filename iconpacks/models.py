from django.db import models



class Pack(models.Model):
    name = models.CharField(max_length=128, db_index=True)
    prefix = models.CharField(max_length=16, blank=True, default="")
    author = models.CharField(max_length=128)
    author_email = models.EmailField()
    website = models.URLField()
    github = models.URLField(blank=True)
    cdn = models.URLField(blank=True)
    license = models.CharField(max_length=64)
    license_fulltext = models.TextField(blank=True, default="")


class PackIcon(models.Model):
    name = models.CharField(max_length=128, db_index=True)
    svg_d = models.TextField()
    svg_unicode = models.IntegerField()
    width = models.FloatField(default=1.0)
    tagnames = models.TextField(blank=True, default="")

    pack = models.ForeignKey(Pack, null=True, blank=True, related_name="icons")

    def __unicode__(self):
        return unicode(self.name)
