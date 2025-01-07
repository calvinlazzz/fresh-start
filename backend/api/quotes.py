from django.http import JsonResponse
from requests import get
from json import loads

def get_quote(request):
    response = get('https://favqs.com/api/qotd')
    quote_data = loads(response.text)
    quote = quote_data.get('quote', {})
    quote_text = quote.get('body', 'No quote available')
    quote_author = quote.get('author', 'Unknown')
    return JsonResponse({'body': quote_text, 'author': quote_author})