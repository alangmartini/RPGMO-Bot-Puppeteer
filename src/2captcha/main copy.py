from twocaptcha import TwoCaptcha
import sys
import time

captcha_path = r'C:\Users\alanm\OneDrive\Documentos\Projetos\rpgmobot\captchas\captcha103.jpeg'

# You api key from 2captcha
API_KEY = 
solver = TwoCaptcha(API_KEY)

id = solver.send(file=captcha_path)

result = None

while result == None:
    try:
        result = solver.get_result(id)
    except:
        time.sleep(3)

print(result)