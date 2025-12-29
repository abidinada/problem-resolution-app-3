from django.http import JsonResponse

def home(request):
    """Page d'accueil simple pour l'API"""
    return JsonResponse({
        'message': 'Bienvenue sur l\'API Problem Resolution',
        'version': '1.0',
        'endpoints': {
            'admin': '/admin/',
            'api': '/api/',
            'users': '/api/users/',
            'problems': '/api/problems/',
            'teams': '/api/teams/',
            'login': '/api/login/',
        }
    })

