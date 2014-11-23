from django.db import models

from jsonfield import JSONField

REVISION_ACTIONS = (
    ('create', 'Create a new record'),
    ('update', 'Update a existing record'),
    ('delete', 'Delete a record'),
    ('revert', 'Revert a record'),
)

REVISION_MODEL = (
    ('pack', 'Pack models'),
    ('collection', 'Collection models'),
    ('collectionicon', 'CollectionIcon models'),
)

REVISION_REF_MODEL = (
    ('pack', 'Pack models'),
    ('collection', 'Collection models'),
)

class Revision(models.Model):
    action = models.CharField(choices=REVISION_ACTIONS, max_length=6, db_index=True)
    model = models.CharField(choices=REVISION_MODEL, max_length=14, db_index=True)
    target_id = models.IntegerField(db_index=True)
    target_name = models.CharField(max_length=128)
    ref_model = models.CharField(choices=REVISION_REF_MODEL, max_length=10, db_index=True)
    ref_id = models.IntegerField(db_index=True)
    revertable = models.BooleanField(default=True)
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
        elif self.action == 'revert':
            self.revertable == False
        super(Revision, self).save(*args, **kwargs)

    def retrieve_model(self):
        if self.model == 'pack':
            from iconpacks.models import Pack
            return Pack
        if self.model == 'collection':
            from iconcollections.models import Collection
            return Collection
        if self.model == 'collectionicon':
            from iconcollections.models import CollectionIcon
            return CollectionIcon

    def retrieve_related_model(self):
        if self.model == 'pack':
            from iconpacks.models import PackIcon
            return PackIcon
        if self.model == 'collection':
            from iconcollections.models import CollectionIcon
            return CollectionIcon

    def revert(self):
        if self.action == 'revert' or self.revertable == False: return False
        if self.model == 'collectionicon':
            CollectionIcon = self.retrieve_model()
            to_revert = CollectionIcon(**self.snapshot)
            if self.action == 'delete':
                to_revert.save(force_insert=True)
                self.revertable = False
                self.save()
            else:
                to_revert.save()
        else:
            snapshot = self.snapshot
            RevertModel = self.retrieve_model()
            if self.action == 'delete':
                icons = snapshot['icons']
                del snapshot['icons']
                IconModel = self.retrieve_related_model()
                to_revert = RevertModel(**snapshot)
                revert_icons = [IconModel(**icon) for icon in icons]
                to_revert.save(force_insert=True)
                for icon in revert_icons: icon.save(force_insert=True)
                self.revertable = False
                self.save()
            else:
                del snapshot['icons']
                to_revert = RevertModel(**snapshot)
                to_revert.save()
        return True
