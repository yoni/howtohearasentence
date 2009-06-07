#the following two lines are assumed to be included by te nltk book:
from __future__ import division
import nltk, re, pprint

from urllib import urlopen

from nltk.probability import *
from nltk.tokenize import *
#tagger
from nltk import pos_tag, word_tokenize

#django
from django.template.loader import get_template
from django.template import Context
from django.http import HttpResponse

# Retreives a phrase from the request and tags the parts of speech,
# returning an html page with the results.
def partsofspeechtagger(request):
    html=""
    for phrase in request.GET.iteritems():
        html+="For phrase: " + str(phrase)
        html+="  The tagged parts of speech are:<br>"
        html+=str(pos_tag(word_tokenize(phrase[1]))) +"<hr>"
    return HttpResponse(html)

# Retreives a JSON-coded set of sentences from the request and tags their parts of speech,
# returning an html page with the results.
def tagsentences(request):
    json_sentences = request.GET.__getitem__("sentences")
    import simplejson as json
    sentences = json.loads(json_sentences)
    html=""
    for sentence in sentences:
        text = sentence['text']
        html+="For sentence: <br><a class='rawSent'>" + text + "</a><br>"
        html+="  The tagged parts of speech are:<br><a class='taggedSent'>" + str(pos_tag(word_tokenize(text)))+"</a>"
        html+="<hr>"
    return HttpResponse(html)

# Returns a page that loads the sentences, sends them to the partsofspeechtagger
# and puts the result in a div.
def posTaggerPage(request):
    t = get_template('hthas/partsOfSpeechTagging.html')
    html = t.render(Context({}))
    return HttpResponse(html)

# Returns our current project home page
def home(request):
    t = get_template('hthas/home.html')
    html = t.render(Context({}))
    return HttpResponse(html)
