import random
import string

from wheezy.captcha.image import captcha
from wheezy.captcha.image import background
from wheezy.captcha.image import curve
from wheezy.captcha.image import noise
from wheezy.captcha.image import smooth
from wheezy.captcha.image import text
from wheezy.captcha.image import offset
from wheezy.captcha.image import rotate
from wheezy.captcha.image import warp
import os


def getNewCaptcha():
    captcha_image = captcha(drawings=[
       background(),
       text(fonts=[
          os.path.join(os.path.dirname(os.path.dirname(__file__)), 'fonts/CourierNew-Bold.ttf'),
          os.path.join(os.path.dirname(os.path.dirname(__file__)), 'fonts/LiberationMono-Bold.ttf')],
        drawings=[
            warp(),
            rotate(),
            offset()
        ]),
        curve(),
        noise(),
        smooth()
    ])

    rand_string = random.sample(string.uppercase + string.digits, 4)
    print(rand_string)
    image = captcha_image(rand_string)

    return ''.join(rand_string), image
