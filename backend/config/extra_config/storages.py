import os

# AWS S3/MinIO Configuration
AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID", "5wuOL0GWXiso5kwFPMjJ")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY",
                                       "rbT41u9MjKQ9a2S5B6kbOA0BMxBR1fEh7lwXIEcm")
AWS_STORAGE_BUCKET_NAME = os.environ.get("AWS_STORAGE_BUCKET_NAME", "static-bucket")
AWS_S3_ENDPOINT_URL = os.environ.get("AWS_S3_ENDPOINT_URL", "http://minio:9000")
AWS_S3_REGION_NAME = os.environ.get("AWS_S3_REGION_NAME", "us-east-1")

# MinIO Configuration
MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "minio:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ROOT_USER", "root")
MINIO_SECRET_KEY = os.getenv("MINIO_ROOT_PASSWORD", "password")
MINIO_MEDIA_FILES_BUCKET = AWS_STORAGE_BUCKET_NAME
MINIO_USE_HTTPS = False
MINIO_BUCKET_CHECK_ON_SAVE = True
MINIO_CONSISTENCY_CHECK_ON_START = True

MINIO_PRIVATE_BUCKETS = ["test-bucket"]
MINIO_PUBLIC_BUCKETS = []

MINIO_STATIC_FILES_BUCKET = "static-bucket"
MINIO_PUBLIC_BUCKETS.append(MINIO_STATIC_FILES_BUCKET)

# URL prefix for accessing media files
MEDIA_URL = f"{AWS_S3_ENDPOINT_URL}/{AWS_STORAGE_BUCKET_NAME}/"

# Django Storage Backend Settings
STORAGES = {
    "default": {
        "BACKEND": "django_minio_backend.models.MinioBackend",
    },
    "staticfiles": {
        "BACKEND": "django_minio_backend.models.MinioBackend",
    },
}
