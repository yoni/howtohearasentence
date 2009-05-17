from django.conf.urls.defaults import *
from hthas.views import home, dostoevsky, bbc, thingsaregreat, histogram, dojoHelloWorld, partsofspeechtagger, posTaggerPage, tagsentences
from django.contrib import admin
admin.autodiscover()


# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Example:
    # (r'^hthas/', include('hthas.foo.urls')),

    # Uncomment the admin/doc line below and add 'django.contrib.admindocs' 
    # to INSTALLED_APPS to enable admin documentation:
    # (r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    (r'^admin/(.*)', admin.site.root),
    #(r'^accounts/login/$', 'django.contrib.auth.views.login'),
    
    (r'^$', home),
    (r'^tagger$', posTaggerPage),
    (r'^partsofspeechtagger$', partsofspeechtagger),
    (r'^tagsentences$', tagsentences),
)
