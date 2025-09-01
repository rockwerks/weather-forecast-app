import { useState } from "react";
import "./App.css";


export default function WeatherApp() {
  const [searchTerm, setSearchTerm] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("metric"); // "metric" for Celsius, "imperial" for Fahrenheit


  const API_KEY = "8988655eb4436fa6b5e8c84c7d52202d";
  const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

  const fetchWeatherData = async (cityName) => {
    setLoading(true);
    setError("");
    setWeatherData(null);

    try {
      // Build the API URL with dynamic units
      const url = `${BASE_URL}?q=${cityName}&appid=${API_KEY}&units=${unit}`;
      
      // Make the API call
      const response = await fetch(url);
      
      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`City not found or API error: ${response.status}`);
      }
      
      // Parse the JSON response
      const data = await response.json();
      setWeatherData(data);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      fetchWeatherData(searchTerm.trim());
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setWeatherData(null);
    setError("");
  };

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
    // If we have weather data, refetch it with the new unit
    if (weatherData) {
      fetchWeatherData(weatherData.name);
    }
  };

  const getTemperatureUnit = () => {
    return unit === "metric" ? "°C" : "°F";
  };

  const getWindSpeedUnit = () => {
    return unit === "metric" ? "m/s" : "mph";
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg" align="center">
      <h1 className="text-3xl font-bold underline mb-6">
        🌤️ Weather Forecast
      </h1>

      {/* Unit Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => handleUnitChange("metric")}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              unit === "metric" 
                ? "bg-blue-500 text-white shadow-md" 
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            °C
          </button>
          <button
            onClick={() => handleUnitChange("imperial")}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              unit === "imperial" 
                ? "bg-blue-500 text-white shadow-md" 
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            °F
          </button>
        </div>
      </div>
      
      {/* Search Section */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter city name with country code (e.g., London, UK, Richmond, US)..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
            disabled={loading}
          />
          
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          )}
        </div>
        
        <button
          type="button"
          onClick={handleSearch}
          disabled={!searchTerm.trim() || loading}
          className="bg-sky-500 hover:bg-sky-700-disabled:cursor-not-allowed transition-colors text-lg font-medium"
        >
          {loading ? "Getting Weather..." : "Get Weather"}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Fetching weather data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          <strong>Error:</strong> {error}
          <br />
          <small>Try checking the city name spelling or your internet connection.</small>
        </div>
      )}

      {/* Weather Results */}
      {weatherData && (
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 rounded-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">
              {weatherData.name}, {weatherData.sys.country}
            </h2>
            
            <div className="text-6xl font-bold mb-2">
              <p><b>Temperature:</b>{Math.round(weatherData.main.temp)}{getTemperatureUnit()}</p>
            </div>
            
            <p className="text-xl mb-4 capitalize">
              <b>Description:</b> {weatherData.weather[0].description}
            </p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white bg-opacity-20 p-3 rounded">
                <div className="font-medium"><b>Feels like:</b></div>
                <div className="text-lg">{Math.round(weatherData.main.feels_like)}{getTemperatureUnit()}</div>
              </div>
              
              <div className="bg-white bg-opacity-20 p-3 rounded">
                <div className="font-medium"><b>Humidity:</b></div>
                <div className="text-lg">{weatherData.main.humidity}%</div>
              </div>
              
              <div className="bg-white bg-opacity-20 p-3 rounded">
                <div className="font-medium"><b>Wind Speed</b></div>
                <div className="text-lg">{Math.round(weatherData.wind.speed)} {getWindSpeedUnit()}</div>
              </div>
              
              <div className="bg-white bg-opacity-20 p-3 rounded">
                <div className="font-medium"><b>Pressure</b></div>
                <div className="text-lg">{weatherData.main.pressure} hPa</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}