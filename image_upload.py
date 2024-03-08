import base64
import requests
import sys

file_path = sys.argv[1]
file_name = file_path.split('/')[-1]

file_encoded = None
str_file = ''
with open(file_path, "rb") as image_file:
	file_encoded = base64.b64encode(image_file.read()).decode('utf-8')
print(file_encoded)
r_json = { 'name': file_name, 'type': 'image', 'isPublic': True, 'data': file_encoded, 'parentId': sys.argv[3] }
r_headers = { 'X-Token': sys.argv[2] }

r = requests.post("http://0.0.0.0:6000/files", json=r_json, headers=r_headers)
print(r.json())
