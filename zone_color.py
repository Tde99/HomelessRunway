from PIL import Image
from collections import Counter
im = Image.open('public/images/garments/tshirt-front.png').convert('RGB')
colors = Counter(im.getdata())
for count, color in colors.most_common(40):
    print(count, color)
