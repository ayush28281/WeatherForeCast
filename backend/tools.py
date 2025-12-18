import os
import requests
from langchain.tools import Tool
from typing import Optional


def get_weather(city: str) -> str:
    """
    Fetches current weather information for a given city.

    Args:
        city: Name of the city to get weather for

    Returns:
        Weather information as a formatted string
    """
    api_key = os.getenv("OPENWEATHER_API_KEY")

    if not api_key:
        return "Error: Weather API key not configured. Please set OPENWEATHER_API_KEY environment variable."

    try:
        base_url = "http://api.openweathermap.org/data/2.5/weather"
        params = {
            "q": city,
            "appid": api_key,
            "units": "metric"
        }

        response = requests.get(base_url, params=params, timeout=10)
        response.raise_for_status()

        data = response.json()

        weather_info = {
            "city": data["name"],
            "country": data["sys"]["country"],
            "temperature": data["main"]["temp"],
            "feels_like": data["main"]["feels_like"],
            "humidity": data["main"]["humidity"],
            "description": data["weather"][0]["description"],
            "wind_speed": data["wind"]["speed"],
        }

        result = (
            f"Weather in {weather_info['city']}, {weather_info['country']}:\n"
            f"Temperature: {weather_info['temperature']}°C (feels like {weather_info['feels_like']}°C)\n"
            f"Conditions: {weather_info['description'].capitalize()}\n"
            f"Humidity: {weather_info['humidity']}%\n"
            f"Wind Speed: {weather_info['wind_speed']} m/s"
        )

        return result

    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            return f"Error: City '{city}' not found. Please check the city name and try again."
        else:
            return f"Error: Unable to fetch weather data. Status code: {e.response.status_code}"

    except requests.exceptions.RequestException as e:
        return f"Error: Network error occurred while fetching weather data: {str(e)}"

    except Exception as e:
        return f"Error: An unexpected error occurred: {str(e)}"


weather_tool = Tool(
    name="get_weather",
    func=get_weather,
    description=(
        "Useful for getting current weather information for a city. "
        "Input should be the name of a city. "
        "Returns temperature, conditions, humidity, and wind speed."
    )
)
