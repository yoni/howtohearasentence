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
        text = sentence['sentence']
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


# The rest of these views are simple experiments, and can probably be removed,

# simple page that uses the dojo js framework
def dojoHelloWorld(request):
    t = get_template('hthas/dojoHelloWorld.html')
    html = t.render(Context({}))
    return HttpResponse(html)

# from chapter 3 of the nltk book
def dostoevsky(request):
    url = "http://www.gutenberg.org/files/2554/2554.txt"
    raw = urlopen(url).read()
    html = raw[:75]
    tokens = nltk.word_tokenize(raw)
    tokens[:10]
    text = nltk.Text(tokens)
    type(text)
    text[1020:1060]
    text.collocations()
    raw.find("PART I")
    raw.rfind("End of Project Gutenberg's Crime")
    raw = raw[5303:1157681]
    return HttpResponse(raw.find("PART I"))

# from chapter 3 of the nltk book
def bbc(request):
    url = "http://news.bbc.co.uk/2/hi/health/2284783.stm"
    html = urlopen(url).read()
    return HttpResponse(html)

# recognizing an ajax request vs. a regular request
def thingsaregreat(request):
    if request.method == 'POST':
        article = glob + request.POST.__getitem__("phrase")
    if request.is_ajax():
        return HttpResponse(article)
    return HttpResponse("This page is meant to be called using AJAX")

#experimenting with grabbing a sentence from the request and doing some nlp with it
def histogram(request):
    html=""
    phrase=request.GET.__getitem__("phrase")
    phraseFDist=FreqDist()
    for word in nltk.tokenize.whitespace(phrase):
        phraseFDist.inc(word.lower())
    html+="For the phrase:" + str(phrase) + "<hr>"
    html+="  The total number of words that were included in the frequency distribution is: " + str(phraseFDist.B())
    html+="<br>"
    html+="  The total number of occurances of the word 'the' is: " + str(phraseFDist['the'])
    html+="<br>"
    html+="  The tagged parts of speech are:<br>"
    html+=str(pos_tag(word_tokenize(phrase)))
    return HttpResponse(html)
