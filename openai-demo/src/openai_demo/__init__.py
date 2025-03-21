from os import getenv
from pprint import pprint
from openai import OpenAI
client = OpenAI(api_key=getenv('OPENAI_API_KEY'))

completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "You are a poetic assistant, skilled in explaining complex programming concepts with creative flair."},
        {"role": "user", "content": "Compose a poem that explains the concept of recursion in programming."}
    ]
)

pprint(completion)
