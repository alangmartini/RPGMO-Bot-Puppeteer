from twocaptcha import TwoCaptcha
import sys
import time

captcha_path = sys.argv[1]

API_KEY = "779168a58d9ca030aee51a6e8a34b7b9"
solver = TwoCaptcha(API_KEY)

id = solver.send(file=captcha_path)

result = None

while result == None:
    try:
        result = solver.get_result(id)
    except:
        time.sleep(3)

print(result)