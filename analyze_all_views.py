from PIL import Image
import glob
for path in ['public/images/garments/tshirt-front.png','public/images/garments/tshirt-back.png','public/images/garments/tshirt-left.png','public/images/garments/tshirt-right.png']:
    im = Image.open(path).convert('RGB')
    w,h = im.size
    mask = [[False]*w for _ in range(h)]
    for y in range(1,h-1):
        for x in range(1,w-1):
            c = im.getpixel((x,y))
            diffs = []
            for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
                n = im.getpixel((x+dx,y+dy))
                diffs.append(abs(c[0]-n[0]) + abs(c[1]-n[1]) + abs(c[2]-n[2]))
            if max(diffs) > 80:
                mask[y][x] = True
    rows = [sum(mask[y][x] for x in range(w)) for y in range(h)]
    cols = [sum(mask[y][x] for y in range(h)) for x in range(w)]
    print(path)
    print('size', w, h)
    for y,v in enumerate(rows):
        if v > 200:
            print('row', y, v)
    for x,v in enumerate(cols):
        if v > 200:
            print('col', x, v)
    print('---')
