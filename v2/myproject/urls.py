from django.conf.urls.defaults import *
from myproject.views import home, dostoevsky, bbc, thingsaregreat

from django.contrib import admin
admin.autodiscover()


# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Example:
    # (r'^myproject/', include('myproject.foo.urls')),

    # Uncomment the admin/doc line below and add 'django.contrib.admindocs' 
    # to INSTALLED_APPS to enable admin documentation:
    # (r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    (r'^admin/(.*)', admin.site.root),
    
    (r'^$', home),
    (r'^dostoevsky$', dostoevsky),
    (r'^bbc$', bbc),
    (r'^thingsaregreat$', thingsaregreat),
    #(r'^time/$', current_datetime),
    #(r'^time/plus/(\d{1,2})/$', hours_ahead),
)
