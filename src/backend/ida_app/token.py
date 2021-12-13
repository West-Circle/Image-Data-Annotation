from itsdangerous import TimedSerializer
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer

SECRET_KEY = "yxy"

def create_token(api_user):
    s = Serializer(SECRET_KEY, expires_in=3600)
    token = s.dumps({"id" : api_user})
    token = token.decode()
    return token

def verify_token(token):
    token1 = str(token)
    s = Serializer(SECRET_KEY)
    try:
        data = s.loads(token1)
    except Exception :
        return None 
    id = data["id"]
    print(id)
    return id