from PIL import Image
im = Image.open('public/images/garments/tshirt-front.png').convert('RGB')
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
print('top rows with edges:')
for y, v in sorted(enumerate(rows), key=lambda iv: iv[1], reverse=True)[:30]:
    print(y, v)
print('top cols with edges:')
for x, v in sorted(enumerate(cols), key=lambda iv: iv[1], reverse=True)[:30]:
    print(x, v)
