# import redis
# from datetime import timedelta
# from flask_jwt_extended import JWTManager

# # Δημιουργούμε global Redis client
# redis_client = redis.StrictRedis(
#     host="localhost", 
#     port=6379,
#     db=0,
#     decode_responses=True
# )

# # Χρόνος που το token παραμένει στη blocklist (π.χ. όσο ζει το JWT)
# BLOCKLIST_EXPIRATION = timedelta(hours=1)


# def init_jwt_blocklist(app, jwt: JWTManager):
#     """
#     Συνδέει το Redis με το Flask-JWT-Extended για έλεγχο revoked tokens.
#     """

#     @jwt.token_in_blocklist_loader
#     def check_if_token_revoked(jwt_header, jwt_payload):
#         print("\033[91mChecking if token is revoked in blocklist loader...\033[0m")
#         jti = jwt_payload["jti"]
#         entry = redis_client.get(jti)
#         return entry == "revoked"

#     @jwt.revoked_token_loader
#     def revoked_token_response(jwt_header, jwt_payload):
#         print("\033[91mChecking if revoken token is revoked...\033[0m")
#         return {"error": "Token has been revoked."}, 401

#     app.logger.info("✅ Redis blocklist system initialized.")
