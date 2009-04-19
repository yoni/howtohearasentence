#nltk
from __future__ import division
import nltk, re, pprint
from urllib import urlopen
# blogs
# import feedparser
#django
from django.template.loader import get_template
from django.template import Context
from django.http import HttpResponse

import os

def home(request):
    t = get_template('hthas/home.html')
    html = t.render(Context({}))
    return HttpResponse(html)

def dostoevsky(request):
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
    text[1020:1060]
    text.collocations()
    raw.find("PART I")
    raw.rfind("End of Project Gutenberg's Crime")
    raw = raw[5303:1157681]
    raw.find("PART I")
    return HttpResponse(raw.find("PART I"))

def bbc(request):
    url = "http://news.bbc.co.uk/2/hi/health/2284783.stm"
    html = urlopen(url).read()
    return HttpResponse(html)

def thingsaregreat(request):
    url = "http://text.omnib.in/thingsaregreat"
    html = urlopen(url).read()
    return HttpResponse(html)
