from django.shortcuts import render

from django.contrib.auth.decorators import login_required
from django.conf import settings

@login_required
def index(request):
    bootstrap_token = None
    if settings.DEBUG:
        from iconcollections.models import Collection
        collections = Collection.objects.filter(build_name="myicons").values_list('token', flat=True)
        if collections:
            bootstrap_token = collections[0]
    return render(request, 'index.html', {'bootstrap': bootstrap_token})
