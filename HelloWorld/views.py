from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse,HttpResponseRedirect
from django.http.response import JsonResponse

#k(_{?&Mi#>Pl3|4dZi*55<G>W1M19R57nk&ogXae
def index(request):
    return render(request,'info.json')
def pt(request):
    context={}
    context["version"]="1.0.3"
    context['SB']="python-tool"
    context['tmd']="仍在开发中"
    context['repositories']="Github"
    return render(request, 'python-tool.html',context)

def page_not_found(request,exception):
    return HttpResponse(request,"404.html",status=404)
