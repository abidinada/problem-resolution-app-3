"""
ASGI config for problem_resolution project.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'problem_resolution.settings')

application = get_asgi_application()

