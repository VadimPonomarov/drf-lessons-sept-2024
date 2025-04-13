import os

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [(
                "localhost"
                if not os.environ.get("DOCKER", "False") == "True"
                else "redis", 6379
            )],
        }
    }
}
