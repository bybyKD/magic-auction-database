import os
files = sorted([f for f in os.listdir(".") if f.endswith(".png")])
for f in files[210:225]:
    print(f)
