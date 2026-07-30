import os

dir_path = "data/raw"
files = [f for f in os.listdir(dir_path) if f.endswith('.png')]
files.sort()

# indices 150 to 164 (inclusive) means 15 files: 150, 151, ..., 164
selected_files = files[150:165]
for i, f in enumerate(selected_files):
    print(f"{150 + i}: {f}")
