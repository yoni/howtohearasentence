from django.shortcuts import render_to_response
import datetime

def current_datetime(request):
    current_date = datetime.datetime.now()
    return render_to_response('dateapp/current_datetime.html', locals())