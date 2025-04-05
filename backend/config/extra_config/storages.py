import os

AWS_STORAGE_BUCKET_NAME = os.environ.get("AWS_STORAGE_BUCKET_NAME", "media-bucket")
AWS_S3_ENDPOINT_URL = os.environ.get("AWS_S3_ENDPOINT_URL", "http://localhost:9000")
AWS_S3_REGION_NAME = os.environ.get("AWS_S3_REGION_NAME", "us-east-1")

# MinIO Configuration
if bool(os.environ.get("DOCKER", False)) != True:
    MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "localhost:9000")
else:
    MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "minio:9000")
MINIO_EXTERNAL_ENDPOINT = "localhost:9000"
MINIO_EXTERNAL_ENDPOINT_USE_HTTPS = False
MINIO_ACCESS_KEY = os.getenv("MINIO_ROOT_USER", "root")
MINIO_SECRET_KEY = os.getenv("MINIO_ROOT_PASSWORD", "password")
MINIO_USE_HTTPS = False
MINIO_BUCKET_CHECK_ON_SAVE = True
MINIO_CONSISTENCY_CHECK_ON_START = False
MINIO_MEDIA_FILES_BUCKET = "media-bucket"

MINIO_PRIVATE_BUCKETS = []
MINIO_PUBLIC_BUCKETS = ["media-bucket", "static-bucket"]

MEDIA_URL = f"{MINIO_ENDPOINT}/{MINIO_MEDIA_FILES_BUCKET}/"

# Django Storage Backend Settings
STORAGES = {
    "default": {
        "BACKEND": "django_minio_backend.models.MinioBackend",
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
    "media": {
        "BACKEND": "django_minio_backend.models.MinioBackend",
    },
}
