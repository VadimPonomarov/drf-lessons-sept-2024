from cryptography.fernet import Fernet
import os

# Ensure the key exists in the same directory as the script
def get_or_create_key():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    key_path = os.path.join(script_dir, "key.txt")

    try:
        with open(key_path, "rb") as key_file:
            return key_file.read()
    except FileNotFoundError:
        raise FileNotFoundError("Encryption key not found. Ensure 'key.txt' exists and matches the encryption service.")

# Decrypt a message
def decrypt_message(encrypted_message):
    key = get_or_create_key()
    fernet = Fernet(key)
    decrypted_message = fernet.decrypt(encrypted_message.encode()).decode()
    return decrypted_message

if __name__ == "__main__":
    try:
        # Prompt the user to input the encrypted object
        encrypted_input = input("Enter the encrypted object to decrypt: ")
        decrypted = decrypt_message(encrypted_input)
        print(f"Decrypted object: {decrypted}")
    except FileNotFoundError as e:
        print(str(e))
    except Exception as e:
        print(f"Failed to decrypt the object: {e}")
