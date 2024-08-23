from django.http import JsonResponse, HttpResponse
def http404(request,exception=None):
    return HttpResponse(request,"404.html",status=404)