import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0'}

search_url = "https://onepiece.fandom.com/api.php?action=query&list=search&srsearch=Straw%20Hat%20Jolly%20Roger%20filetype:png|svg&format=json"
req = urllib.request.Request(search_url, headers=headers)
with urllib.request.urlopen(req, context=ctx) as response:
    data = json.loads(response.read())
    results = data.get('query', {}).get('search', [])
    for res in results:
        print(f"Result: {res['title']}")

