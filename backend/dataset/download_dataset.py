from datasets import load_dataset
import os
from PIL import Image

# Load dataset from Hugging Face
dataset = load_dataset("garythung/trashnet")

base_dir = os.path.join(os.path.dirname(__file__), "../../data")
base_dir = os.path.abspath(base_dir)
split = 'train'

# Save images 
for idx, item in enumerate(dataset[split]):
    label_name = dataset[split].features['label'].int2str(item['label'])  
    save_dir = os.path.join(base_dir, split, label_name)
    os.makedirs(save_dir, exist_ok=True)

    image = item['image']
    image_path = os.path.join(save_dir, f"{idx}.jpg")
    image.save(image_path)

