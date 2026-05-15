from PIL import Image, ImageDraw
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
line_rows = [y for y,v in enumerate(rows) if v > 250]
line_cols = [x for x,v in enumerate(cols) if v > 250]
overlay = Image.new('RGBA', (w,h), (0,0,0,0))
d = ImageDraw.Draw(overlay)
for y in range(h):
    for x in range(w):
        if mask[y][x]:
            overlay.putpixel((x,y),(255,0,0,180))
for y in line_rows:
    d.line((0,y,w,y), fill=(0,255,0,255))
for x in line_cols:
    d.line((x,0,x,h), fill=(0,0,255,255))
result = Image.alpha_composite(im.convert('RGBA'), overlay)
result.save('debug-front-edges.png')
print('saved debug-front-edges.png')
