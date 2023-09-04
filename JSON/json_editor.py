import json
import random

f = open("Scenario3_bins.json","r")
data = f.read()

obj = json.loads(data)

for i in range(len(obj)):
    obj[i]["alert"]= False
    temp = random.randint(35,45)
    obj[i]["temperature"] = temp
    hum = random.randint(30,55)
    obj[i]["humidity"] = hum


with open('Scenario3_bins.json', 'w') as json_file:
  json.dump(obj, json_file, indent = 4, sort_keys=True)
