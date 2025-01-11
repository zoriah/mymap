import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { ClipLoader } from "react-spinners";
import Leaflet from "leaflet";
import axios from "axios";
import markerIcon from "../assets/location.svg";
import cities from "./cities";
import "./map.css";

const APIKEY = import.meta.env.VITE_APIKEY;

const location = (cityName) =>
  new Leaflet.Icon({
    iconUrl: markerIcon,
    iconSize: [30, 50],
    iconAnchor: [cityName.length * 2, 0],
  });

const ChangeView = ({ center }) => {
  const map = useMap();
  map.setView(center, 13);
  return null;
};

export default function Map() {
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("Berlin");
  const [center, setCenter] = useState([52.520008, 13.404954]);
  const [windDeg, setWindDeg] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [selectedCity, setSelectedCity] = useState("Berlin");

  useEffect(() => {
    const fetchCity = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${APIKEY}&units=metric`
        );
        const data = response.data;
        setCity(data.name);
        setCenter([data.coord.lat, data.coord.lon]);
        setWindDeg(data.wind.deg + 180);
        setTemperature(data.main);
      } catch (error) {
        console.error("Error fetching city data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCity();
  }, [selectedCity]);

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  return (
    <>
      <header>
        <h1>Select your Location</h1>

        <select id="selection" onChange={handleCityChange} className="select">
          {cities.map((city, index) => (
            <option key={index} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </header>
      <p className="tip">Click on the location icon for weather data.</p>

      {loading ? (
        <ClipLoader />
      ) : (
        <MapContainer className="container-map" center={center} zoom={13}>
          <ChangeView center={center} />
          <TileLayer
            attribution='&copy; 
            <a href="https://www.openstreetmap.org/copyright">
              // OpenStreetMap //
            </a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={center} icon={location(selectedCity)}>
            <Popup>
              <div className="weatherData">
                <div>Current: {Math.floor(temperature.temp)}°C</div>
                <div>Min: {Math.floor(temperature.temp_min)}°C</div>
                <div>Max: {Math.floor(temperature.temp_max)}°C</div>
                <div
                  className="windDeg"
                  style={{ "--rotation": windDeg + "deg" }}
                >
                  Wind:
                </div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </>
  );
}
