from PIL import Image
im=Image.open('public/images/garments/tshirt-front.png').convert('RGB')
w,h=im.size
pix=im.load()
coords=[]
for y in range(h):
    rowcount=0
    for x in range(w):
        r,g,b=pix[x,y]
        lum=(r+g+b)/3
        if 100<lum<220:
            rowcount+=1
            coords.append((x,y))
    if rowcount>10 and y%50==0:
        print('row',y,'count',rowcount)
print('size',w,h)
print('total',len(coords))
print('range',min(x for x,y in coords), max(x for x,y in coords), min(y for x,y in coords), max(y for x,y in coords))
