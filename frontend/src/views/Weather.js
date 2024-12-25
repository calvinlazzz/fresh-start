import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Weather = ({ city }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/weather/${city}/`);
                setWeather(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchWeather();
    }, [city]);

    if (loading) return <div>Loading weather...</div>;
    if (error) return <div>Error fetching weather data</div>;

    return (
        <div>
            <span>{weather.city.name}: </span>
            <span>{weather.list[0].main.temp}°F</span>
            <span> {weather.list[0].weather[0].description}</span>
        </div>
    );
};

export default Weather;