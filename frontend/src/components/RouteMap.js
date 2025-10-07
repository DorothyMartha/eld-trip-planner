import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import styled from 'styled-components';
import { MapPin, Clock, Truck, Fuel, Package } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MapWrapper = styled.div`
  height: 500px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(226, 232, 240, 0.6);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
    pointer-events: none;
  }
`;

const PopupContent = styled.div`
  padding: 1rem;
  min-width: 220px;
  font-family: inherit;
`;

const PopupTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PopupDetails = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  background: ${props => {
    switch (props.status) {
      case 'driving': return '#fef3c7';
      case 'rest': return '#dbeafe';
      case 'pickup': return '#dcfce7';
      case 'dropoff': return '#fce7f3';
      case 'fuel': return '#f97316';
      default: return '#f1f5f9';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'driving': return '#92400e';
      case 'rest': return '#1e40af';
      case 'pickup': return '#166534';
      case 'dropoff': return '#be185d';
      case 'fuel': return '#ffffff';
      default: return '#475569';
    }
  }};
`;

// Create custom map markers with professional design
const createCustomIcon = (color, iconType, label) => {
  let html;
  let iconSize;
  let iconAnchor;
  
  switch (iconType) {
    case 'current':
      // Current location marker with pulsing animation
      html = `
        <div class="uber-marker current-marker" style="
          position: relative;
          width: 40px;
          height: 56px;
        ">
          <div class="ripple-1" style="
            position: absolute;
            bottom: -5px;
            left: 50%;
            transform: translateX(-50%);
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: ${color};
            opacity: 0;
            animation: ripple 2s infinite;
          "></div>
          <div class="ripple-2" style="
            position: absolute;
            bottom: -5px;
            left: 50%;
            transform: translateX(-50%);
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: ${color};
            opacity: 0;
            animation: ripple 2s infinite 0.7s;
          "></div>
          
          <div class="pin-container" style="
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
          ">
            <div style="
              position: absolute;
              bottom: -5px;
              left: 50%;
              transform: translateX(-50%);
              width: 12px;
              height: 4px;
              background: rgba(0,0,0,0.3);
              border-radius: 50%;
              filter: blur(2px);
            "></div>
            
            <div style="
              position: relative;
              width: 32px;
              height: 50px;
              background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 3px solid white;
              box-shadow: 0 4px 12px rgba(0,0,0,0.25), inset 0 -2px 6px rgba(0,0,0,0.1);
            ">
              <div style="
                position: absolute;
                top: 6px;
                left: 6px;
                width: 14px;
                height: 14px;
                background: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transform: rotate(45deg);
              ">
                <div style="
                  width: 8px;
                  height: 8px;
                  background: ${color};
                  border-radius: 50%;
                  animation: pulse-dot 1.5s infinite;
                "></div>
              </div>
            </div>
          </div>
        </div>
      `;
      iconSize = [40, 56];
      iconAnchor = [20, 50];
      break;
      
    case 'pickup':
      // Pickup marker
      html = `
        <div class="uber-marker pickup-marker" style="
          position: relative;
          width: 36px;
          height: 52px;
        ">
          <div style="
            position: absolute;
            bottom: -3px;
            left: 50%;
            transform: translateX(-50%);
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: ${color};
            opacity: 0.2;
            filter: blur(6px);
          "></div>
          
          <div class="pin-container" style="
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
          ">
            <div style="
              position: absolute;
              bottom: -4px;
              left: 50%;
              transform: translateX(-50%);
              width: 10px;
              height: 3px;
              background: rgba(0,0,0,0.4);
              border-radius: 50%;
              filter: blur(2px);
            "></div>
            
            <div style="
              position: relative;
              width: 28px;
              height: 44px;
              background: linear-gradient(135deg, ${color} 0%, ${color}cc 100%);
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 2.5px solid white;
              box-shadow: 0 3px 10px rgba(0,0,0,0.2), inset 0 -1px 4px rgba(0,0,0,0.15);
            ">
              <div style="
                position: absolute;
                top: 4px;
                left: 4px;
                width: 10px;
                height: 10px;
                background: rgba(255,255,255,0.4);
                border-radius: 50%;
              "></div>
              
              <div style="
                position: absolute;
                top: 5px;
                left: 5px;
                width: 12px;
                height: 12px;
                background: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transform: rotate(45deg);
                font-size: 11px;
                font-weight: 900;
                color: ${color};
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              ">P</div>
            </div>
          </div>
        </div>
      `;
      iconSize = [36, 52];
      iconAnchor = [18, 46];       break;
      
    case 'dropoff':
      // Dropoff marker
      html = `
        <div class="uber-marker dropoff-marker" style="
          position: relative;
          width: 36px;
          height: 52px;
        ">
          <!-- Glow effect -->
          <div style="
            position: absolute;
            bottom: -3px;
            left: 50%;
            transform: translateX(-50%);
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: ${color};
            opacity: 0.2;
            filter: blur(6px);
          "></div>
          
          <div class="pin-container" style="
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
          ">
            <!-- Shadow -->
            <div style="
              position: absolute;
              bottom: -4px;
              left: 50%;
              transform: translateX(-50%);
              width: 10px;
              height: 3px;
              background: rgba(0,0,0,0.4);
              border-radius: 50%;
              filter: blur(2px);
            "></div>
            
            <!-- Pin with gradient -->
            <div style="
              position: relative;
              width: 28px;
              height: 44px;
              background: linear-gradient(135deg, ${color} 0%, ${color}cc 100%);
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 2.5px solid white;
              box-shadow: 0 3px 10px rgba(0,0,0,0.2), inset 0 -1px 4px rgba(0,0,0,0.15);
            ">
              <!-- Gloss -->
              <div style="
                position: absolute;
                top: 4px;
                left: 4px;
                width: 10px;
                height: 10px;
                background: rgba(255,255,255,0.4);
                border-radius: 50%;
              "></div>
              
              <!-- Label -->
              <div style="
                position: absolute;
                top: 5px;
                left: 5px;
                width: 12px;
                height: 12px;
                background: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transform: rotate(45deg);
                font-size: 11px;
                font-weight: 900;
                color: ${color};
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              ">D</div>
            </div>
          </div>
        </div>
      `;
      iconSize = [36, 52];
      iconAnchor = [18, 46];       break;
      
    case 'fuel':
    case 'rest':
    default:
      // Intermediate stop markers
      const emoji = iconType === 'fuel' ? '⛽' : iconType === 'rest' ? '💤' : '📍';
      html = `
        <div class="uber-marker stop-marker" style="
          position: relative;
          width: 28px;
          height: 42px;
        ">
          <!-- Subtle glow -->
          <div style="
            position: absolute;
            bottom: -2px;
            left: 50%;
            transform: translateX(-50%);
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: ${color};
            opacity: 0.15;
            filter: blur(4px);
          "></div>
          
          <div class="pin-container" style="
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
          ">
            <!-- Shadow -->
            <div style="
              position: absolute;
              bottom: -3px;
              left: 50%;
              transform: translateX(-50%);
              width: 8px;
              height: 2px;
              background: rgba(0,0,0,0.3);
              border-radius: 50%;
              filter: blur(1.5px);
            "></div>
            
            <!-- Pin with gradient -->
            <div style="
              position: relative;
              width: 22px;
              height: 36px;
              background: linear-gradient(135deg, ${color} 0%, ${color}bb 100%);
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 2px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2), inset 0 -1px 3px rgba(0,0,0,0.1);
            ">
              <!-- Gloss highlight -->
              <div style="
                position: absolute;
                top: 3px;
                left: 3px;
                width: 7px;
                height: 7px;
                background: rgba(255,255,255,0.5);
                border-radius: 50%;
              "></div>
              
              <!-- Icon -->
              <div style="
                position: absolute;
                top: 4px;
                left: 4px;
                width: 10px;
                height: 10px;
                background: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transform: rotate(45deg);
                font-size: 8px;
              ">${emoji}</div>
            </div>
          </div>
        </div>
      `;
      iconSize = [28, 42];
      iconAnchor = [14, 38];   }
  
  return L.divIcon({
    html: html,
    iconSize: iconSize,
    iconAnchor: iconAnchor,
    popupAnchor: [0, -46],
    className: 'custom-marker-icon'
  });
};

// Component to auto-fit map bounds
const MapBoundsController = ({ markers }) => {
  const map = useMap();
  
  useEffect(() => {
    if (markers && markers.length > 0) {
      const positions = markers.map(m => m.position);
      if (positions.length === 1) {
        // If only one marker (current location), zoom to it
        map.setView(positions[0], 12);
      } else if (positions.length > 1) {
        // If multiple markers, fit all of them with padding
        const bounds = positions;
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [markers, map]);
  
  return null;
};

const RouteMap = ({ tripData }) => {
  const [mapCenter, setMapCenter] = useState([0.3476, 32.5825]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    if (tripData?.map_data) {
      console.log('Trip data received:', tripData.map_data);
      
      // Build complete route with all waypoints
      const { coordinates, routeMarkers } = buildCompleteRoute(tripData);
      
      console.log('Route coordinates:', coordinates);
      console.log('Route markers:', routeMarkers);
      
      setRouteCoordinates(coordinates);
      setMarkers(routeMarkers);
      
      if (coordinates.length > 0) {
        const currentLocation = coordinates[0];
        console.log('Centering map on current location:', currentLocation);
        setMapCenter(currentLocation);
      }
      
      setMapKey(prev => prev + 1);
    }
  }, [tripData]);

  // City coordinate database
  const getCityCoordinates = () => {
    return {
      // North America
      'new_york': [40.7128, -74.0060],
      'newyork': [40.7128, -74.0060],
      'nyc': [40.7128, -74.0060],
      'chicago': [41.8781, -87.6298],
      'los_angeles': [34.0522, -118.2437],
      'losangeles': [34.0522, -118.2437],
      'la': [34.0522, -118.2437],
      'miami': [25.7617, -80.1918],
      'dallas': [32.7767, -96.7970],
      'denver': [39.7392, -104.9903],
      'atlanta': [33.7490, -84.3880],
      'phoenix': [33.4484, -112.0740],
      'seattle': [47.6062, -122.3321],
      'boston': [42.3601, -71.0589],
      'houston': [29.7604, -95.3698],
      'philadelphia': [39.9526, -75.1652],
      'san_antonio': [29.4241, -98.4936],
      'sanantonio': [29.4241, -98.4936],
      'san_diego': [32.7157, -117.1611],
      'sandiego': [32.7157, -117.1611],
      'detroit': [42.3314, -83.0458],
      'minneapolis': [44.9778, -93.2650],
      'tampa': [27.9506, -82.4572],
      'orlando': [28.5383, -81.3792],
      'las_vegas': [36.1699, -115.1398],
      'lasvegas': [36.1699, -115.1398],
      'nashville': [36.1627, -86.7816],
      'portland': [45.5152, -122.6784],
      'memphis': [35.1495, -90.0490],
      'louisville': [38.2527, -85.7585],
      'baltimore': [39.2904, -76.6122],
      'milwaukee': [43.0389, -87.9065],
      'albuquerque': [35.0844, -106.6504],
      'tucson': [32.2226, -110.9747],
      'fresno': [36.7378, -119.7871],
      'sacramento': [38.5816, -121.4944],
      'kansas_city': [39.0997, -94.5786],
      'kansascity': [39.0997, -94.5786],
      'cleveland': [41.4993, -81.6944],
      'indianapolis': [39.7684, -86.1581],
      'columbus': [39.9612, -82.9988],
      'charlotte': [35.2271, -80.8431],
      'san_francisco': [37.7749, -122.4194],
      'sanfrancisco': [37.7749, -122.4194],
      'sf': [37.7749, -122.4194],
      'washington': [38.9072, -77.0369],
      'washington_dc': [38.9072, -77.0369],
      'dc': [38.9072, -77.0369],
      
      'toronto': [43.6532, -79.3832],
      'vancouver': [49.2827, -123.1207],
      'montreal': [45.5017, -73.5673],
      'calgary': [51.0447, -114.0719],
      'ottawa': [45.4215, -75.6972],
      'edmonton': [53.5461, -113.4938],
      'winnipeg': [49.8951, -97.1384],
      'quebec': [46.8139, -71.2080],
      'quebec_city': [46.8139, -71.2080],
      'halifax': [44.6488, -63.5752],
      
      'mexico_city': [19.4326, -99.1332],
      'mexicocity': [19.4326, -99.1332],
      'guadalajara': [20.6597, -103.3496],
      'monterrey': [25.6866, -100.3161],
      'cancun': [21.1619, -86.8515],
      'tijuana': [32.5149, -117.0382],
      'merida': [20.9674, -89.5926],
      
      'buenos_aires': [-34.6037, -58.3816],
      'buenosaires': [-34.6037, -58.3816],
      'sao_paulo': [-23.5505, -46.6333],
      'saopaulo': [-23.5505, -46.6333],
      'rio_de_janeiro': [-22.9068, -43.1729],
      'riodejaneiro': [-22.9068, -43.1729],
      'rio': [-22.9068, -43.1729],
      'lima': [-12.0464, -77.0428],
      'bogota': [4.7110, -74.0721],
      'santiago': [-33.4489, -70.6693],
      'caracas': [10.4806, -66.9036],
      'quito': [-0.1807, -78.4678],
      'montevideo': [-34.9011, -56.1645],
      'brasilia': [-15.8267, -47.9218],
      'medellin': [6.2476, -75.5658],
      'cartagena': [10.3910, -75.4794],
      
      // ============== EUROPE ==============
      
      // Western Europe
      'london': [51.5074, -0.1278],
      'paris': [48.8566, 2.3522],
      'berlin': [52.5200, 13.4050],
      'madrid': [40.4168, -3.7038],
      'rome': [41.9028, 12.4964],
      'amsterdam': [52.3676, 4.9041],
      'brussels': [50.8503, 4.3517],
      'vienna': [48.2082, 16.3738],
      'lisbon': [38.7223, -9.1393],
      'dublin': [53.3498, -6.2603],
      'zurich': [47.3769, 8.5417],
      'geneva': [46.2044, 6.1432],
      'barcelona': [41.3851, 2.1734],
      'milan': [45.4642, 9.1900],
      'munich': [48.1351, 11.5820],
      'hamburg': [53.5511, 9.9937],
      'copenhagen': [55.6761, 12.5683],
      'stockholm': [59.3293, 18.0686],
      'oslo': [59.9139, 10.7522],
      'helsinki': [60.1699, 24.9384],
      'athens': [37.9838, 23.7275],
      
      // Eastern Europe
      'moscow': [55.7558, 37.6173],
      'warsaw': [52.2297, 21.0122],
      'prague': [50.0755, 14.4378],
      'budapest': [47.4979, 19.0402],
      'bucharest': [44.4268, 26.1025],
      'kiev': [50.4501, 30.5234],
      'kyiv': [50.4501, 30.5234],
      'istanbul': [41.0082, 28.9784],
      'st_petersburg': [59.9311, 30.3609],
      'stpetersburg': [59.9311, 30.3609],
      
      // ============== AFRICA ==============
      
      'cairo': [30.0444, 31.2357],
      'lagos': [6.5244, 3.3792],
      'johannesburg': [-26.2041, 28.0473],
      'nairobi': [-1.2921, 36.8219],
      'casablanca': [33.5731, -7.5898],
      'cape_town': [-33.9249, 18.4241],
      'capetown': [-33.9249, 18.4241],
      'accra': [5.6037, -0.1870],
      'addis_ababa': [9.0320, 38.7469],
      'addisababa': [9.0320, 38.7469],
      'dar_es_salaam': [-6.7924, 39.2083],
      'daressalaam': [-6.7924, 39.2083],
      'algiers': [36.7538, 3.0588],
      'tunis': [36.8065, 10.1815],
      'khartoum': [15.5007, 32.5599],
      'lusaka': [-15.3875, 28.3228],
      'harare': [-17.8252, 31.0335],
      
      // Uganda
      'kampala': [0.3476, 32.5825],
      'uganda': [0.3476, 32.5825],
      
      'entebbe': [0.0560, 32.4795],
      'wakiso': [0.4044, 32.4598],
      'mpigi': [0.2250, 32.3136],
      'mukono': [0.3532, 32.7554],
      'luweero': [0.8492, 32.4734],
      'luwero': [0.8492, 32.4734],
      'mityana': [0.4175, 32.0223],
      'mubende': [0.5585, 31.3949],
      'kiboga': [0.9169, 31.7742],
      'nakaseke': [0.7863, 32.0815],
      'nakasongola': [1.3101, 32.4524],
      'kayunga': [0.7027, 32.8889],
      'buikwe': [0.3167, 33.0167],
      'buvuma': [-0.3833, 33.2667],
      'kalangala': [-0.3122, 32.2306],
      'masaka': [-0.3375, 31.7340],
      'rakai': [-0.7333, 31.4167],
      'lyantonde': [-0.4081, 31.1522],
      'sembabule': [-0.1167, 31.4500],
      'gomba': [0.2089, 31.6906],
      'butambala': [0.1889, 32.0794],
      'kalungu': [-0.1000, 31.7667],
      
      'jinja': [0.4244, 33.2041],
      'mbale': [1.0821, 34.1751],
      'tororo': [0.6930, 34.1808],
      'soroti': [1.7145, 33.6111],
      'iganga': [0.6089, 33.4689],
      'kamuli': [0.9472, 33.1197],
      'pallisa': [1.1451, 33.7094],
      'kumi': [1.4613, 33.9366],
      'busia': [0.4656, 34.0920],
      'bugiri': [0.5714, 33.7421],
      'mayuge': [0.4500, 33.4833],
      'namutumba': [0.8472, 33.6833],
      'butaleja': [0.9167, 33.8167],
      'budaka': [1.0667, 34.0167],
      'manafwa': [0.9167, 34.3500],
      'sironko': [1.2264, 34.2522],
      'bududa': [1.0092, 34.3292],
      'kapchorwa': [1.3959, 34.4513],
      'bukwa': [1.2833, 34.7167],
      'kween': [1.4333, 34.5833],
      'bukedea': [1.3333, 33.9667],
      'kaliro': [1.0167, 33.5167],
      'buyende': [1.1667, 33.1667],
      'luuka': [0.7167, 33.2833],
      'namayingo': [0.2333, 33.7167],
      'kibuku': [1.0333, 33.7833],
      'serere': [1.5000, 33.5500],
      'ngora': [1.4667, 33.7500],
      'katakwi': [1.8833, 34.0667],
      'amuria': [2.0333, 33.6333],
      'kaberamaido': [1.7167, 33.1667],
      
      'gulu': [2.7747, 32.2989],
      'lira': [2.2399, 32.8987],
      'kitgum': [3.2817, 32.8864],
      'arua': [3.0197, 30.9111],
      'nebbi': [2.4778, 31.0886],
      'yumbe': [3.4656, 31.2472],
      'moyo': [3.6611, 31.7186],
      'adjumani': [3.3778, 31.7908],
      'pader': [2.8500, 33.0000],
      'agago': [3.0667, 33.3167],
      'lamwo': [3.6167, 32.7333],
      'kotido': [2.9797, 34.1333],
      'moroto': [2.5350, 34.6664],
      'kaabong': [3.5167, 34.1167],
      'abim': [2.7167, 33.6667],
      'amudat': [1.9500, 34.9500],
      'nakapiripirit': [1.8833, 34.7167],
      'napak': [2.3500, 34.2000],
      'oyam': [2.2333, 32.3833],
      'apac': [1.9753, 32.5383],
      'kole': [2.4000, 32.8000],
      'alebtong': [2.2500, 33.2833],
      'dokolo': [1.9167, 33.1667],
      'amolatar': [1.6167, 32.6667],
      'otuke': [2.5167, 33.3667],
      'nwoya': [2.6667, 31.9000],
      'zombo': [2.5167, 30.9167],
      'koboko': [3.4147, 30.9628],
      'maracha': [3.2333, 30.8667],
      
      'mbarara': [-0.6031, 30.6584],
      'fort_portal': [0.6710, 30.2748],
      'fortportal': [0.6710, 30.2748],
      'kasese': [0.1833, 30.0833],
      'hoima': [1.4331, 31.3522],
      'masindi': [1.6743, 31.7150],
      'bundibugyo': [0.7086, 30.0647],
      'ntoroko': [1.0667, 30.4000],
      'kibaale': [0.7833, 31.0833],
      'kyenjojo': [0.6333, 30.6333],
      'kamwenge': [0.1889, 30.4544],
      'kyegegwa': [0.4833, 31.0500],
      'bushenyi': [-0.5442, 30.1864],
      'sheema': [-0.5500, 30.3833],
      'buhweju': [-0.3167, 30.3000],
      'rubirizi': [-0.2789, 30.0819],
      'mitooma': [-0.6167, 30.0167],
      'ntungamo': [-0.8794, 30.2642],
      'isingiro': [-0.8667, 30.8167],
      'kiruhura': [-0.1833, 30.8167],
      'ibanda': [-0.1333, 30.4833],
      'kabarole': [0.6710, 30.2748],
      'bunyangabu': [0.5167, 30.2000],
      'rukungiri': [-0.7880, 29.9194],
      'kanungu': [-0.9167, 29.7333],
      'kabale': [-1.2486, 29.9894],
      'rubanda': [-1.1667, 29.8333],
      'kisoro': [-1.2858, 29.6859],
      
      // Asia
      'tokyo': [35.6762, 139.6503],
      'beijing': [39.9042, 116.4074],
      'shanghai': [31.2304, 121.4737],
      'seoul': [37.5665, 126.9780],
      'hong_kong': [22.3193, 114.1694],
      'hongkong': [22.3193, 114.1694],
      'taipei': [25.0330, 121.5654],
      'osaka': [34.6937, 135.5023],
      'shenzhen': [22.5431, 114.0579],
      'guangzhou': [23.1291, 113.2644],
      
      'delhi': [28.7041, 77.1025],
      'new_delhi': [28.6139, 77.2090],
      'newdelhi': [28.6139, 77.2090],
      'mumbai': [19.0760, 72.8777],
      'bangalore': [12.9716, 77.5946],
      'bengaluru': [12.9716, 77.5946],
      'chennai': [13.0827, 80.2707],
      'kolkata': [22.5726, 88.3639],
      'hyderabad': [17.3850, 78.4867],
      'pune': [18.5204, 73.8567],
      'karachi': [24.8607, 67.0011],
      'lahore': [31.5497, 74.3436],
      'islamabad': [33.6844, 73.0479],
      'dhaka': [23.8103, 90.4125],
      'colombo': [6.9271, 79.8612],
      'kathmandu': [27.7172, 85.3240],
      
      'singapore': [1.3521, 103.8198],
      'bangkok': [13.7563, 100.5018],
      'kuala_lumpur': [3.1390, 101.6869],
      'kualalumpur': [3.1390, 101.6869],
      'jakarta': [-6.2088, 106.8456],
      'manila': [14.5995, 120.9842],
      'ho_chi_minh': [10.8231, 106.6297],
      'hochiminh': [10.8231, 106.6297],
      'hanoi': [21.0285, 105.8542],
      'phnom_penh': [11.5564, 104.9282],
      'phnompenh': [11.5564, 104.9282],
      'yangon': [16.8661, 96.1951],
      'vientiane': [17.9757, 102.6331],
      
      'dubai': [25.2048, 55.2708],
      'abu_dhabi': [24.4539, 54.3773],
      'abudhabi': [24.4539, 54.3773],
      'riyadh': [24.7136, 46.6753],
      'jeddah': [21.2854, 39.2376],
      'doha': [25.2854, 51.5310],
      'tel_aviv': [32.0853, 34.7818],
      'telaviv': [32.0853, 34.7818],
      'jerusalem': [31.7683, 35.2137],
      'beirut': [33.8886, 35.4955],
      'amman': [31.9454, 35.9284],
      'tehran': [35.6892, 51.3890],
      'baghdad': [33.3152, 44.3661],
      'kuwait': [29.3759, 47.9774],
      'kuwait_city': [29.3759, 47.9774],
      'muscat': [23.5880, 58.3829],
      
      // Oceania
      'sydney': [-33.8688, 151.2093],
      'melbourne': [-37.8136, 144.9631],
      'brisbane': [-27.4698, 153.0251],
      'perth': [-31.9505, 115.8605],
      'adelaide': [-34.9285, 138.6007],
      'auckland': [-36.8485, 174.7633],
      'wellington': [-41.2865, 174.7762],
      'christchurch': [-43.5321, 172.6362],
      'canberra': [-35.2809, 149.1300],
      'gold_coast': [-28.0167, 153.4000],
      'goldcoast': [-28.0167, 153.4000],
      'fiji': [-17.7134, 178.0650],
      'suva': [-18.1416, 178.4415],
      'port_moresby': [-9.4438, 147.1803],
      'portmoresby': [-9.4438, 147.1803],
      
      // Central America & Caribbean
      'panama_city': [8.9824, -79.5199],
      'panamacity': [8.9824, -79.5199],
      'san_jose': [9.9281, -84.0907],
      'sanjose_cr': [9.9281, -84.0907],
      'guatemala_city': [14.6349, -90.5069],
      'guatemalacity': [14.6349, -90.5069],
      'havana': [23.1136, -82.3666],
      'kingston': [17.9714, -76.7931],
      'santo_domingo': [18.4861, -69.9312],
      'santodomingo': [18.4861, -69.9312],
      'port_au_prince': [18.5944, -72.3074],
      'portauprince': [18.5944, -72.3074],
      'san_juan': [18.4655, -66.1057],
      'sanjuan': [18.4655, -66.1057],
    };
  };

  const normalizeLocationName = (location) => {
    if (!location) return '';
    return location
      .toLowerCase()
      .replace(/[,\s]+/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '');
  };

  const getCoordinatesForLocation = (location) => {
    const cityCoords = getCityCoordinates();
    const normalized = normalizeLocationName(location);
    
    console.log(`Looking up: "${location}" -> "${normalized}"`);
    
    // Try exact match
    if (cityCoords[normalized]) {
      console.log(`Found coordinates for ${location}:`, cityCoords[normalized]);
      return cityCoords[normalized];
    }
    
    // Try to find partial match
    for (const [city, coords] of Object.entries(cityCoords)) {
      if (normalized.includes(city) || city.includes(normalized)) {
        console.log(`Found partial match for ${location}: ${city}`, coords);
        return coords;
      }
    }
    
    console.log(`No coordinates found for ${location}, using default`);
    return null;
  };

  const buildCompleteRoute = (tripData) => {
    const coordinates = [];
    const routeMarkers = [];
    const mapData = tripData.map_data;
    const segments = tripData.route_segments || [];

    console.log('Building route with:', {
      current: mapData.current_location,
      pickup: mapData.pickup_location,
      dropoff: mapData.dropoff_location
    });

    // Add starting location marker
    const startCoords = getCoordinatesForLocation(mapData.current_location);
    console.log('🔍 Current location lookup:', {
      input: mapData.current_location,
      found: startCoords,
      latitude: startCoords ? startCoords[0] : null,
      longitude: startCoords ? startCoords[1] : null
    });
    
    if (startCoords) {
      const currentCoords = [startCoords[0], startCoords[1]];
      coordinates.push(currentCoords);
      routeMarkers.push({
        id: 'current-location',
        position: currentCoords,
        type: 'current',
        data: {
          end_location: mapData.current_location,
          start_time: new Date().toISOString(),
          duration_hours: 0,
          distance_miles: 0,
          duty_status: 'off_duty',
          is_current_location: true
        }
      });
      console.log('✓ Added CURRENT LOCATION marker:', {
        id: 'current-location',
        type: 'current',
        position: currentCoords,
        locationName: mapData.current_location
      });
    } else {
      console.error('❌ Could not find coordinates for current location:', mapData.current_location);
      console.log('Available Uganda cities:', Object.keys(getCityCoordinates()).filter(k => k.includes('ug') || k.includes('kampala') || k.includes('entebbe')));
    }

    // Add pickup location if different
    const normalizedCurrent = normalizeLocationName(mapData.current_location);
    const normalizedPickup = normalizeLocationName(mapData.pickup_location);
    
    if (mapData.pickup_location && normalizedPickup !== normalizedCurrent) {
      const pickupCoords = getCoordinatesForLocation(mapData.pickup_location);
      console.log('Pickup location coords:', pickupCoords);
      
      if (pickupCoords) {
        coordinates.push(pickupCoords);
        
        const pickupSegment = segments.find(s => s.type === 'pickup');
        routeMarkers.push({
          id: 'pickup-location',
          position: pickupCoords,
          type: 'pickup',
          data: pickupSegment || {
            end_location: mapData.pickup_location,
            start_time: new Date().toISOString(),
            duration_hours: 1,
            distance_miles: 0,
            duty_status: 'on_duty'
          }
        });
        console.log('✓ Added pickup marker at:', pickupCoords);
      }
    } else {
      console.log('ℹ️ Pickup location same as current, showing only current location marker');
    }

    // Add intermediate stops
    let addedLocations = new Set([
      normalizeLocationName(mapData.current_location),
      normalizeLocationName(mapData.pickup_location),
      normalizeLocationName(mapData.dropoff_location)
    ]);

    segments.forEach((segment, index) => {
      if (segment.type === 'fuel' || segment.type === 'rest') {
        const normalized = normalizeLocationName(segment.end_location);
        
        if (!addedLocations.has(normalized)) {
          const coords = getCoordinatesForLocation(segment.end_location);
          if (coords) {
            coordinates.push(coords);
            routeMarkers.push({
              id: `segment-${index}`,
              position: coords,
              type: segment.type,
              data: segment
            });
            addedLocations.add(normalized);
          }
        }
      }
    });

    // Add dropoff location
    const dropoffCoords = getCoordinatesForLocation(mapData.dropoff_location);
    console.log('Dropoff location coords:', dropoffCoords);
    
    if (dropoffCoords) {
      coordinates.push(dropoffCoords);
      
      const dropoffSegment = segments.find(s => s.type === 'dropoff');
      routeMarkers.push({
        id: 'dropoff-location',
        position: dropoffCoords,
        type: 'dropoff',
        data: dropoffSegment || {
          end_location: mapData.dropoff_location,
          start_time: new Date().toISOString(),
          duration_hours: 1,
          distance_miles: 0,
          duty_status: 'on_duty'
        }
      });
      console.log('✓ Added dropoff marker at:', dropoffCoords);
    } else {
      console.warn('⚠️ Could not find coordinates for dropoff location:', mapData.dropoff_location);
    }

    console.log('Final route:', {
      totalCoordinates: coordinates.length,
      totalMarkers: routeMarkers.length,
      coordinates: coordinates,
      markers: routeMarkers.map(m => ({ id: m.id, type: m.type, position: m.position }))
    });

    return { coordinates, routeMarkers };
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'current':
        return createCustomIcon('#0ea5e9', 'current'); // Bright blue pulsing "You Are Here" marker
      case 'start':
        return createCustomIcon('#22c55e', 'pickup'); // Green for start
      case 'pickup':
        return createCustomIcon('#10b981', 'pickup'); // Green for pickup
      case 'dropoff':
        return createCustomIcon('#ef4444', 'dropoff'); // Red for dropoff
      case 'fuel':
        return createCustomIcon('#3b82f6', 'fuel'); // Blue for fuel
      case 'rest':
        return createCustomIcon('#8b5cf6', 'rest'); // Purple for rest
      case 'driving':
        return createCustomIcon('#f59e0b', 'default'); // Orange for driving
      default:
        return createCustomIcon('#6b7280', 'default');
    }
  };

  if (!tripData) {
    return (
      <MapWrapper>
        <div style={{
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          color: '#64748b',
          background: '#f8fafc',
          borderRadius: '8px',
          border: '2px dashed #e2e8f0'
        }}>
          <MapPin size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: '600' }}>
            Route Map
          </h3>
          <p style={{ margin: 0, fontSize: '0.875rem', textAlign: 'center' }}>
            Enter trip details to see the interactive route map with stops and rest locations
          </p>
        </div>
      </MapWrapper>
    );
  }

  return (
    <MapWrapper>
      <MapContainer
        key={mapKey}
        center={mapCenter}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapBoundsController markers={markers} />
        
        {routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates}
            pathOptions={{ color: '#f97316', weight: 4, opacity: 0.8 }}
          />
        )}

        {markers.map((marker) => {
          console.log(`Rendering marker:`, {
            id: marker.id,
            type: marker.type,
            position: marker.position,
            location: marker.data.end_location
          });
          
          return (
            <Marker
              key={marker.id}
              position={marker.position}
              icon={getIconForType(marker.type)}
            >
            <Popup>
              <PopupContent>
                <PopupTitle>
                  {marker.type === 'current' && <Truck size={16} />}
                  {marker.type === 'start' && <MapPin size={16} />}
                  {marker.type === 'pickup' && <Package size={16} />}
                  {marker.type === 'dropoff' && <Package size={16} />}
                  {marker.type === 'fuel' && <Fuel size={16} />}
                  {marker.type === 'rest' && <Clock size={16} />}
                  {marker.type === 'driving' && <Truck size={16} />}
                  {marker.type === 'current' ? '📍 You Are Here' : 
                   marker.type === 'start' ? 'Starting Location' : 
                   marker.type.charAt(0).toUpperCase() + marker.type.slice(1)}
                </PopupTitle>
                <PopupDetails>
                  <div><strong>Location:</strong> {marker.data.end_location}</div>
                  {marker.type === 'current' && (
                    <div style={{ 
                      background: '#dbeafe', 
                      color: '#1e40af', 
                      padding: '0.5rem', 
                      borderRadius: '4px',
                      marginTop: '0.5rem',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      ✓ Current Location - Trip starts here
                    </div>
                  )}
                  {marker.data.start_time && marker.type !== 'current' && (
                    <div><strong>Time:</strong> {formatTime(marker.data.start_time)}</div>
                  )}
                  {marker.data.duration_hours > 0 && (
                    <div><strong>Duration:</strong> {marker.data.duration_hours?.toFixed(1)} hours</div>
                  )}
                  {marker.data.distance_miles > 0 && (
                    <div><strong>Distance:</strong> {marker.data.distance_miles.toFixed(0)} miles</div>
                  )}
                  {marker.data.duty_status && marker.type !== 'current' && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <StatusBadge status={marker.data.duty_status}>
                        {marker.data.duty_status?.replace('_', ' ') || 'N/A'}
                      </StatusBadge>
                    </div>
                  )}
                </PopupDetails>
              </PopupContent>
            </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </MapWrapper>
  );
};

export default RouteMap;
