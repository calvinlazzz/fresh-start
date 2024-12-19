from django.http import JsonResponse
from requests import get
from json import loads

def get_quote(request):
    response = get('http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en')
    quote_data = loads(response.text)
    quote_text = quote_data.get('quoteText', 'No quote available')
    quote_author = quote_data.get('quoteAuthor', 'Unknown')
    return JsonResponse({'quoteText': quote_text, 'quoteAuthor': quote_author})