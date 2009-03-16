from django.template.loader import get_template
from django.template import Context
from django.http import HttpResponse

def home(request):
    t = get_template('hthas/home.html')
    html = t.render(Context({}))
    return HttpResponse(html)