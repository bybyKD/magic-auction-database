import os
files = [f for f in os.listdir('.') if f.endswith('.png')]
files.sort()
with open('file_list.txt', 'w') as out:
    for i, f in enumerate(files[195:210]):
        out.write(f"{i+195}: {f}\n")
