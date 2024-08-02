from rest_framework import authentication 

class CsrfExemptSessionAuthentication(authentication.SessionAuthentication):

    def enforce_csrf(self, request):
        return  # To not perform the csrf check previously happening