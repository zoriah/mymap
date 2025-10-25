import {useState, useEffect} from 'react'
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from 'react-leaflet'
import L from 'leaflet';
import "./map.css"
import axios from "axios";
import markerIcon from '../assets/location.svg';

const calculateIconAnchor = (cityName) => {
  const baseOffset = 19; // 5 mm in Pixel (bei 96 DPI)
  const lengthFactor = cityName.length * 2; // Faktor basierend auf der Länge des Namens
  return [lengthFactor, baseOffset]; // [horizontal (x), vertikal (y)]
};
const location = (cityName) => new L.Icon({
  iconUrl: markerIcon,
  iconSize: new L.Point(25, 50),
  iconAnchor: calculateIconAnchor(cityName)
});

// const cities = [
//   { name: "berlin", lat: "52.520008", lon: "13.404954" },
//   { name: "london", lat: "51.507351", lon: "-0.127758" },
//   { name: "paris", lat: "48.856613", lon: "2.352222" },
//   { name: "washingtondc", lat: "38.892059", lon: "-77.019913" },
//   { name: "ankara", lat: "39.925533", lon: "32.866287" },
// ]

const APIKEY = import.meta.env.VITE_APIKEY;

const Map = () => {
  const [city, setCity] = useState([])
  const [center, setCenter] = useState([52.520008, 13.404954])
  const [selectedCity, setSelectedCity]=useState("berlin")
  
  // const wetherData = async () => {
  //   try {
  //     await axios.get()
  //       .then(res => {
  //         if (res.status === 200){
  //           setCity(res.data)
  //           console.log(res.data)
  //         }
  //       })     
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${APIKEY}&units=metric`
        );
        console.log(response.data)
        setCity(response.data);
        setCenter([response.data.coord.lat, response.data.coord.lon])
      } catch (error) {
        console.error(error);
      }
    };
    fetchCity()  
  }, [selectedCity]);

  // city.length === 0 ?
  //   null :
  //   console.log(city)

  return (
    <>      
      <h1 className='fontmed'> Das Wetter in</h1>
      <select id="selection" onChange={e => {
        console.log(e.target.value)
        setSelectedCity(e.target.value)        
      }} className='select' name="cities">
          <option value="berlin">Berlin</option>
          <option value="london">London</option>
          <option value="paris">Paris</option>
          <option value="ankara">Ankara</option>
      </select>        
      <h1 style={{marginLeft:"1rem"}} className='fontmed'>(Für Details klick das unten gezeigte Standortsymbol)</h1>
      {city.length === 0 ?
        (<p>Loading</p>):(
      <MapContainer className='container-map' center={center} zoom={13} key={JSON.stringify(center)}>
          <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        <Marker position={[city.coord.lat, city.coord.lon]} icon={location(selectedCity)}>
              <Popup>
                <h1>Atuell: { Math.trunc(city.main.temp)+"°C"}</h1>
                <h2>min: {Math.trunc(city.main.temp_min) + "°C"}</h2>
                <h2>max: { Math.trunc(city.main.temp_max)+"°C"}</h2>
              </Popup>
          </Marker>
        </MapContainer>
      )}
  </>
  )
}

export default Map

// `https://api.openweathermap.org/data/2.5/weather?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}`