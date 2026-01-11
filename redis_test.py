# import redis

# try:
#     r = redis.Redis(host='localhost', port=6379)
#     r.set('test_connection', 'Success!')
#     print("✅ Connection works! Found in Redis:", r.get('test_connection'))
# except Exception as e:
#     print(f"❌ Connection failed: {e}")


import redis
# Use 127.0.0.1 to be very specific
r = redis.Redis(host='127.0.0.1', port=6379)
r.set("check_now", "I am in Docker!")
print("Sent to Redis")