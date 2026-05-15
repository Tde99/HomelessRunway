from PIL import Image
im = Image.open('public/images/garments/tshirt-front.png').convert('RGB')
w,h = im.size
red_pixels = [(x,y) for y in range(h) for x in range(w) if im.getpixel((x,y))[0] > 180 and im.getpixel((x,y))[1] < 80 and im.getpixel((x,y))[2] < 80]
print('red pixel count', len(red_pixels))
if red_pixels:
    xs = [x for x,_ in red_pixels]
    ys = [y for _,y in red_pixels]
    print(min(xs), max(xs), min(ys), max(ys))
    # also print clusters by row
    rows = {}
    for x,y in red_pixels:
        rows.setdefault(y,[]).append(x)
    for y in range(min(ys), max(ys)+1):
        if y in rows and len(rows[y])>30:
            print(y, min(rows[y]), max(rows[y]), len(rows[y]))
