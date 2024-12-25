import requests     
from django.http import JsonResponse
from requests import get
from json import loads

def get_weather(city,units="imperial", api_key='26631f0f41b95fb9f5ac0df9a8f43c92'):
    url = f'https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={api_key}&units={units}'
    r = requests.get(url)
    forecast = r.json()
    
    return (forecast)
    
