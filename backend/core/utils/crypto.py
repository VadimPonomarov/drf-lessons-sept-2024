from cryptography.fernet import Fernet

cipher = Fernet('W6VeSdXNr0uMKyWh5wbYRqF44pp32r6CBVeljGoQs6A=')

# Ключ для шифрования
secret_key = "my-secret-api-key"
encrypted_key = cipher.encrypt(secret_key.encode())
print(f"Encrypted Key: {encrypted_key.decode()}")
print(cipher.decrypt(encrypted_key).decode())
