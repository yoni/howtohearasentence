#nltk
from __future__ import division
import nltk, re, pprint
from urllib import urlopen
#django
from django.template.loader import get_template
from django.template import Context
from django.http import HttpResponse

def home(request):
    t = get_template('hthas/home.html')
    html = t.render(Context({}))
    return HttpResponse(html)

def parser(request):
    url = "http://www.gutenberg.org/files/2554/2554.txt"
    #url = "http://nelephant.com/"
    raw = urlopen(url).read()
    #html = type(raw)
    #html = len(raw)
    html = raw[:75]
    tokens = nltk.word_tokenize(raw)
    #type(tokens)
    #len(tokens)
    tokens[:10]
    text = nltk.Text(tokens)
    type(text)
    return HttpResponse(text[1020:1060])