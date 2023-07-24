from twocaptcha import TwoCaptcha
import sys
import time

captcha_path = sys.argv[1]

API_KEY = "1144a3bb407760eccceaaa69ad500751"
solver = TwoCaptcha(API_KEY)

id = solver.send(file=captcha_path)

time.sleep(20)

code = solver.get_result(id)

print(code)