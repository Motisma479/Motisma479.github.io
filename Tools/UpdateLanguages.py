import json
import requests

with open("../data/projects.json") as f:
    data = json.load(f)

final = {}

for project in data:
    projectUrl = project["url"]
    apiUrl = "https://api.github.com/repos/" + projectUrl[19:] + "/languages"
    response = requests.get(apiUrl)
    if response.status_code == 200:
        l=response.json()
        total = 0
        result = []
        for key, value in l.items():
            total += value
            result.append({"name":key, "percentage":value})
        nTotal = 0
        for r in result:
            r["percentage"] = round( r["percentage"] / total * 100, 1)
            nTotal += r["percentage"]
        if nTotal != 100:
            greatest = 0
            for i in range(1, len(result)):
                if result[i]["percentage"] > result[greatest]["percentage"]:
                    greatest = i
            result[greatest]["percentage"] += 0.1
            
        final[projectUrl] = result
        
with open("../data/projectsLanguages.json", "w") as f:
    json.dump(final,f,indent=4)