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

visited = [[False]*w for _ in range(h)]
components = []
for y in range(h):
    for x in range(w):
        if mask[y][x] and not visited[y][x]:
            stack=[(x,y)]
            minx=maxx=x; miny=maxy=y; count=0
            while stack:
                cx,cy = stack.pop()
                if cx<0 or cy<0 or cx>=w or cy>=h: continue
                if visited[cy][cx] or not mask[cy][cx]: continue
                visited[cy][cx]=True
                count += 1
                minx = min(minx,cx); maxx = max(maxx,cx)
                miny = min(miny,cy); maxy = max(maxy,cy)
                for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
                    nx,ny = cx+dx, cy+dy
                    if 0<=nx<w and 0<=ny<h and mask[ny][nx] and not visited[ny][nx]:
                        stack.append((nx,ny))
            if count > 100:
                components.append((count,minx,maxx,miny,maxy))
components.sort(reverse=True)
for comp in components[:30]:
    print(comp)
