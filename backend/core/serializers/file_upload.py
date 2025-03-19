import imghdr  # Ensure this is imported for file type validation

from django.core.exceptions import ValidationError
from django.core.files.storage import default_storage
from rest_framework import serializers


# Validation function for file size
def validate_file_size(file):
    max_size_kb = 1024  # Maximum file size in KB (e.g., 1024 KB = 1 MB)
    if file.size > max_size_kb * 1024:
        raise ValidationError(f"File size exceeds {max_size_kb} KB.")


# Validation function for file type (uses imghdr)
def validate_file_type(file):
    allowed_types = ['jpeg', 'png', 'gif', 'pdf', 'docx']  # Allowed file types
    file_type = imghdr.what(file)  # Check the file type using imghdr
    if file_type not in allowed_types:
        raise ValidationError(
            f"Unsupported file type. Allowed types: {', '.join(allowed_types)}."
        )


# Validation function for file extension
def validate_file_extension(file):
    allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'docx']
    file_extension = file.name.split('.')[-1].lower()  # Extract file extension
    if file_extension not in allowed_extensions:
        raise ValidationError(
            f"Unsupported file extension. Allowed extensions: {', '.join(allowed_extensions)}."
        )


# Serializer for file upload
class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

    # Validate file size using settings
    def validate_file(self, value):
        validate_file_size(value)
        validate_file_type(value)
        validate_file_extension(value)
        return value

    # Save method for handling the uploaded file
    def save(self):
        uploaded_file = self.validated_data['file']
        file_path = default_storage.save(uploaded_file.name, uploaded_file)
        return {"file_url": default_storage.url(file_path)}
