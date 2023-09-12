"""
Django settings for event_management project.

Generated by 'django-admin startproject' using Django 4.1.7.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""

from pathlib import Path
from datetime import timedelta
from decouple import config as conf
import os


def empty_fun(val):
    return val


def config(key, cast=empty_fun, default=None):
    envfile = conf(key, cast=cast, default=default)
    if envfile:
        return envfile

    value = os.getenv(key)
    if value is None:
        return default
    else:
        if callable(cast):
            try:
                return cast(value)
            except:
                return value
        else:
            value
    return default


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config(
    'SECRET_KEY', default='django-insecure-7!7*qbl(#kv!#e6!7n=&(56a-5wa2k!v-nz=f)5ush0+f4)b==')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', cast=bool, default=False)
SESSION_EXP_TIME = config('SESSION_EXP_TIME', cast=int,
                          default=1 * 24 * 60 * 60)

ALLOWED_HOSTS = ["*"]
CORS_ALLOW_ALL_ORIGINS = True
CSRF_TRUSTED_ORIGINS = config(
    'CSRF_TRUSTED_ORIGINS',
    cast=lambda x: x.split(','),
    default='http://localhost:8000/')


CORS_URLS_REGEX = r"^/api/.*"

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'whitenoise.runserver_nostatic',
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',
    'user',
    'debug_toolbar',
    'django_extensions',
    'event',
    'mail',
    'django_cleanup.apps.CleanupConfig',
    'adminpanel',
    'cloudinary_storage',
    'cloudinary'

]

SHELL_PLUS_PRE_IMPORTS = [('event_management.query_count', '*')]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware',
]

ROOT_URLCONF = 'event_management.urls'
AUTH_USER_MODEL = 'user.User'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'event_management.wsgi.application'

# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

if (config('MYSQL_DATABASE', cast=bool, default=False) and
    config('MYSQL_DATABASE_HOST', default=False) and
    config('MYSQL_DATABASE_PORT', default=False) and
    config('MYSQL_DATABASE_DATABASE', default=False) and
    config('MYSQL_DATABASE_USER', default=False) and
        config('MYSQL_DATABASE_PASSWORD', default=False)):
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'OPTIONS': {
                'host': config('MYSQL_DATABASE_HOST'),
                'port': config('MYSQL_DATABASE_PORT', cast=int, default=3600),
                'database': config('MYSQL_DATABASE_DATABASE'),
                'user': config('MYSQL_DATABASE_USER'),
                'password': config('MYSQL_DATABASE_PASSWORD'),
            }
        }
    }
elif (config('POSTGRES_DATABASE', cast=bool, default=False) and
      config('POSTGRES_DATABASE_HOST', default=False) and
      config('POSTGRES_DATABASE_PORT', default=False) and
      config('POSTGRES_DATABASE_DATABASE', default=False) and
      config('POSTGRES_DATABASE_USER', default=False) and
      config('POSTGRES_DATABASE_PASSWORD', default=False)):
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': config('POSTGRES_DATABASE_DATABASE'),
            'USER': config('POSTGRES_DATABASE_USER'),
            'PASSWORD': config('POSTGRES_DATABASE_PASSWORD'),
            'HOST': config('POSTGRES_DATABASE_HOST'),
            'PORT': config('POSTGRES_DATABASE_PORT', cast=int, default=5670),
        }
    }
else:

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = 'static/'
STATICFILES_DIRS = (os.path.join(BASE_DIR, 'static'),)
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"


# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Django rest framework
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated"
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        "rest_framework.authentication.SessionAuthentication",

    ),
    "DEFAULT_PAGINATION_CLASS": "event_management.pagination.CustomPagination",
    "PAGE_SIZE": 21,
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ]
}

SIMPLE_JWT = {
    "TOKEN_OBTAIN_SERIALIZER": "event_management.serializers.TokenObtain",
    "ACCESS_TOKEN_LIFETIME": timedelta(seconds=config('ACCESS_TOKEN_EXP_TIME', cast=int, default=15)),
    "REFRESH_TOKEN_LIFETIME": timedelta(seconds=config('REFRESH_TOKEN_EXP_TIME', cast=int, default=86400)),
    "UPDATE_LAST_LOGIN": True,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": config('JWT_SECRET_KEY', default=SECRET_KEY),
    "VERIFYING_KEY": "",
    "LEEWAY": timedelta(seconds=10)
}

# Email settings
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = config('EMAIL_HOST')
EMAIL_USE_TLS = config('EMAIL_USE_TLS')
EMAIL_PORT = config('EMAIL_PORT')
EMAIL_HOST_USER = config('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD')

OTP_VALIDITY_DURATION = 5 * 60  # in seconds

GIT_BUG_REPORT_API_KEY = config('GIT_BUG_REPORT_API_KEY', cast=str)


if config('ENABLE_CLOUD_STORAGE', cast=bool, default=False) is True:
    CLOUDINARY_STORAGE = {
        'CLOUD_NAME': config('CLOUD_NAME'),
        'API_KEY': config('API_KEY'),
        'API_SECRET': config('API_SECRET')
    }
    DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'


MEDIA_ROOT = BASE_DIR / 'media'
MEDIA_URL = '/media/'


CRON_SECRET=config('CRON_SECRET', default='')


# LOGGING = {
#     'version': 1,
#     'disable_existing_loggers': False,
#     'handlers': {
#         'file': {
#             'level': 'DEBUG',  # Set the desired logging level
#             'class': 'logging.FileHandler',
#             'filename': 'db_queries.log',  # Set the file path for logging
#         },
#     },
#     'loggers': {
#         'django.db.backends': {
#             'level': 'DEBUG',
#             'handlers': ['file'],
#             'propagate': False,
#         },
#     },
# }
