import os
import dj_database_url

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# Parse database configuration from $DATABASE_URL
DATABASES = {}
DATABASES['default'] =  dj_database_url.config()

# Turn off debug
DEBUG = False
TEMPLATE_DEBUG = DEBUG
ALLOWED_HOSTS = ['*', ]

# security
SECRET_KEY = 'rqq8u0tzl)l5t!@*h)@y$rm92g!u$m)pg5urv4f=dq_p5%l!77'

# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Static asset configuration
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
