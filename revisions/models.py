from django.db import models

from jsonfield import JSONField

REVISION_ACTIONS = (
    ('create', 'Create a new record'),
    ('update', 'Update a existing record'),
    ('delete', 'Delete a record'),
)

REVISION_MODEL = (
    ('pack', 'Pack models'),
    ('collection', 'Collection models'),
    ('collectionicon', 'CollectionIcon models'),
)

class Revision(models.Model):
    action = models.CharField(choices=REVISION_ACTIONS, max_length=6, db_index=True)
    model = models.CharField(choices=REVISION_MODEL, max_length=14, db_index=True)
    target_id = models.IntegerField(db_index=True)
    target_name = models.CharField(max_length=128)
    user = JSONField(default={})
    snapshot = JSONField(default={})
    diff = JSONField(default={})
    created_at = models.DateTimeField(db_index=True, auto_now_add=True)

    @property
    def previous_revision(self):
        revisions = Revision.objects.filter(
            model=self.model,
            target_id=self.target_id
        ).order_by('-id').all()[:1]
        if len(revisions) == 1:
            return revisions[0]
        return None

    def _diff(self, old, new):
        diff = {}
        for key in new:
            oldval = old.get(key)
            newval = new.get(key)
            if oldval != newval:
                diff[key] = {'old': oldval, 'new':newval}
        return diff

    def save(self, *args, **kwargs):
        if self.action == 'update':
            prev = self.previous_revision
            if prev:
                oldsnapshot = prev.snapshot
                newsnapshot = self.snapshot
                self.diff = self._diff(oldsnapshot, newsnapshot)
        super(Revision, self).save(*args, **kwargs)
