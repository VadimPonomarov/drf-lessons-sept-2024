import secrets


def generate_secret_key():
    return "".join(
        secrets.choice("abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)")
        for _ in range(50)
    )


secret_key = generate_secret_key()
print(secret_key)

if __name__ == "__main__":
    generate_secret_key()
