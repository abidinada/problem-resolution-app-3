"""
WSGI config for problem_resolution project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'problem_resolution.settings')

application = get_wsgi_application()

