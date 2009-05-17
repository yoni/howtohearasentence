from django.contrib.auth.decorators import login_required

from django.template.loader import get_template
from django.template import Context
from django.http import HttpResponse

from hthas.sentences.models import Article, Sentence, Author
    
def getSentences(request):
    return HttpResponse(Sentence.objects.all());

def getArticle(request):
    #article = Atricle();
    return HttpResponse(article)