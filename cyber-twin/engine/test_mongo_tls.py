
from pymongo import MongoClient

host = "ac-adod5d0-shard-00-00.imwfhep.mongodb.net"
uri = f"mongodb://{host}:27017/?tls=true"

client = MongoClient(
    uri,
    serverSelectionTimeoutMS=8000,
)

try:
    print(client.admin.command("ping"))
except Exception as error:
    print(type(error).__name__)
    print(str(error)[:1500])
finally:
    client.close()
    