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
cols = [sum(mask[y][x] for y in range(h)) for x in range(w)]
print('col count sorted descending')
for x,count in sorted(enumerate(cols), key=lambda p: p[1], reverse=True)[:40]:
    print(x, count)
print('some mid cols')
for x in range(500, 630):
    if cols[x] > 40:
        print(x, cols[x])
