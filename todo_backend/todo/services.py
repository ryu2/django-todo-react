import openai
from django.conf import settings
import json

openai.api_key = settings.OPENAI_API_KEY
client = openai.OpenAI()

def generate_text(prompt):

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are to summarize the contents of the following tasks."},
            {"role": "user", "content": "The tasks are: " + prompt}
        ]
    )   
    return response.choices[0].message.content.strip()

def convert_openai_response_to_json(openai_response):
    # the openai api wraps the string result with some further markers when requesting
    # a json result in the prompt.
    # i.e,  ```json [ {"title":"title1"}]```
    # Remove the wrapper markers.
    if openai_response.startswith("```json"):
        openai_response = openai_response[7:]
    if openai_response.endswith("```"):
        openai_response = openai_response[:-3].strip()

    print(openai_response)
    jsonResponse = json.loads(openai_response)
    return jsonResponse
