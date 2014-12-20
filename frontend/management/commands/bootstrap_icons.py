from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):

    """This command will persist icons from the collection named `myicons` into frontend files.
    This collection contains the icons for this project itself. Normal user need not care about this.
    """
    def handle(self, *args, **kwargs):
        from iconcollections.models import Collection

        try:
            bs_collection = Collection.objects.get(build_name='myicons')
        except Collection.DoesNotExist:
            raise CommandError('Bootstraping icons collection not found')

        import os
        import zipfile
        from StringIO import StringIO

        from fontbuilder.serializers import CollectionSerializer
        from fontbuilder.renderers import ZIPPackRenderer

        path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../static'))

        serializer = CollectionSerializer(bs_collection)
        renderer = ZIPPackRenderer()
        zipcontent = StringIO(renderer.render(serializer.data))

        zipfileobj = zipfile.ZipFile(zipcontent)
        namelist = filter(lambda n: n not in ('cheatsheet.html', 'css/myicons.css'), zipfileobj.namelist())
        zipfileobj.extractall(path, namelist)

        print 'File extracted to %s' % path
