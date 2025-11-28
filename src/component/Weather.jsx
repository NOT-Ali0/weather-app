import { useState } from 'react'
import './Weather.css'
import search from '../assets/search.png'
import clear from '../assets/clear.png'
import cloud from '../assets/cloud.png'
import drizzle from '../assets/drizzle.png'
import humidity from '../assets/humidity.png'
import rain from '../assets/rain.png'
import snow from '../assets/snow.png'
import wind from '../assets/wind.png'
const Weather = () => {
  const [Weather, setWeather] = useState(null)
  const [loading, setloading] = useState(false)
  const [city, setCity] = useState("")

  const getWeatherIcon = (code) => {
    if (code === 0) return clear;
    if (code >= 1 && code <= 3) return cloud;
    if (code >= 61 && code <= 67) return rain;
    if (code >= 80 && code <= 82) return rain;
    if (code === 95 || code === 96 || code === 99) return snow;
  }
  const SearchRes = async function () {
    if (!city) { return }

    setWeather(null)

    try {
      const GeoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      )
      const GeoData = await GeoRes.json()
      const { latitude, longitude } = GeoData.results[0]
      const WeatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m,windspeed_10m`
      );
      const WeatherData = await WeatherRes.json()
      const temp = WeatherData.current_weather.temperature
      const wind = WeatherData.current_weather.windspeed
      const humidity = WeatherData.hourly.relativehumidity_2m[0]
      const code = WeatherData.current_weather.weathercode
      setWeather({ temp, city, wind, humidity, code })



    } catch (error) {
      console.log(`someting went wrong ${error}`)
    }

  }



  return (
    <div className='weather'>
      <div className='search-bar'>
        <input
          className='input'
          value={city}
          onChange={(e) => { setCity(e.target.value) }}
          type="text"
          placeholder='City name...'
        />
        <button className='button'
          onClick={SearchRes}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg>
        </button>

      </div>

      {
        Weather && (
          <>
            <img src={getWeatherIcon(Weather.code)} className='weather-icon' />
            <p className='temp'>{Weather.temp}°C</p>
            <p className='location'>{Weather.city}</p>
            <div className="weather-data">
              <div className='col'>
                <img src={humidity} alt="humidity" />
                <div>
                  <p>{Weather.humidity}</p>
                  <span>Humidity</span>
                </div>
              </div>
              <div className='col'>
                <img src={wind} alt="wind" />
                <div>
                  <p>{Weather.wind}km/h</p>
                  <span>wind speed</span>
                </div>
              </div>
            </div>
          </>
        )
      }
    </div >
  )
}

export default Weather