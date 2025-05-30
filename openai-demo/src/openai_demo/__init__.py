from os import getenv
from pprint import pprint
from openai import OpenAI

# base64
# b'c2stN2dDajlzRzFMTEZMdUNSbHBlN1dUM0JsYmtGSmtpUEhzY3BvVzdzR0ZSNjJlWml2'
# b'c2stTE9Pcnp1bno5YzcwWnFlR0IwZDRUM0JsYmtGSlNYcTNoZHRzb0t0R1ZjdHVEeEJL'

client = OpenAI(api_key=getenv('OPENAI_API_KEY'))

completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "You are a poetic assistant, skilled in explaining complex programming concepts with creative flair."},
        {"role": "user", "content": "Compose a poem that explains the concept of recursion in programming."}
    ]
)

pprint(completion)
