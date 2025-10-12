import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Info, X } from "lucide-react";

// Default pin icon
const pinIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Live location pin (blue)
const liveIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

function MapClickHandler({ addPin }) {
  useMapEvents({
    click(e) {
      addPin({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function FlyToLocation({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 15, { duration: 1.2 });
  }, [center, map]);
  return null;
}

export default function FarmLocationMapping() {
  const [pins, setPins] = useState([]);
  const [savedFarms, setSavedFarms] = useState([]);
  const [center, setCenter] = useState([20.5937, 78.9629]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [farmName, setFarmName] = useState("");
  const [copiedCoord, setCopiedCoord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [locationMode, setLocationMode] = useState("auto"); // auto or manual
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [manualName, setManualName] = useState("");
  const [liveLocation, setLiveLocation] = useState(null);
  const mapRef = useRef(null);

  // Load saved farms and detect live location
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("farmPolygons")) || [];
    setSavedFarms(saved);

    if (locationMode === "auto" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setCenter(coords);
          setLiveLocation(coords);
          setIsLoading(false);
        },
        () => setIsLoading(false)
      );
    } else {
      setIsLoading(false);
    }
  }, [locationMode]);

  const addPin = ({ lat, lng, name = "" }) => {
    if (pins.length >= 10) return alert("Maximum 10 pins allowed.");
    setPins([...pins, { lat, lng, name }]);
  };

  const clearPins = () => {
    setPins([]);
    setEditingIndex(null);
    setFarmName("");
    setManualLat("");
    setManualLng("");
    setManualName("");
  };

  const saveFarm = () => {
    if (pins.length < 3) return alert("At least 3 pins are required.");
    if (!farmName.trim()) return alert("Please enter a farm name.");

    const newFarm = {
      id: Date.now(),
      name: farmName.trim(),
      coordinates: pins,
    };

    const updated =
      editingIndex !== null
        ? savedFarms.map((f, i) => (i === editingIndex ? newFarm : f))
        : [...savedFarms, newFarm];

    setSavedFarms(updated);
    localStorage.setItem("farmPolygons", JSON.stringify(updated));
    clearPins();
  };

  const editFarm = (index) => {
    setPins(savedFarms[index].coordinates);
    setFarmName(savedFarms[index].name);
    setEditingIndex(index);
  };

  const deleteFarm = (index) => {
    const updated = savedFarms.filter((_, i) => i !== index);
    setSavedFarms(updated);
    localStorage.setItem("farmPolygons", JSON.stringify(updated));
  };

  const copyCoordinates = (lat, lng) => {
    const coordText = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    navigator.clipboard.writeText(coordText);
    setCopiedCoord(coordText);
    setTimeout(() => setCopiedCoord(null), 2000);
  };

  const handleManualAdd = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (!manualName.trim()) return alert("Please enter a location name!");
    if (isNaN(lat) || isNaN(lng)) return alert("Enter valid coordinates.");
    addPin({ lat, lng, name: manualName });
    setManualLat("");
    setManualLng("");
    setManualName("");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px] bg-gradient-to-br from-green-50 to-white rounded-xl shadow-inner mt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg border border-green-100 mt-28 p-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-green-800 text-center flex-1">
          Farm Location Mapping
        </h2>
        <button
          onClick={() => setShowInfo(true)}
          className="flex items-center gap-1 text-green-700 font-medium hover:text-green-900 transition"
        >
          <Info className="w-5 h-5" /> How to Use
        </button>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl relative z-[10000]">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-4 right-4 text-green-700 hover:text-green-900"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-green-800 mb-4">
              How to Use Farm Location Mapping
            </h3>
            <ul className="list-disc list-inside text-green-700 space-y-2">
              <li>Click on the map to add pins marking your farm boundary.</li>
              <li>You need at least 3 pins to define a farm polygon.</li>
              <li>Enter a farm name before saving the farm.</li>
              <li>Click "Save Farm" to store it locally.</li>
              <li>Use "Edit" to modify a saved farm or "Delete" to remove it.</li>
              <li>Click on a pin to view its coordinates and copy them.</li>
              <li>Clear pins to start a new farm mapping.</li>
              <li>Switch between automatic GPS and manual coordinate entry.</li>
              <li>Manual mode requires a location name along with latitude/longitude.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Location Mode Selector */}
      <div className="flex gap-4 mb-4 items-center">
        <label className="flex items-center gap-1 text-green-700 font-medium">
          <input
            type="radio"
            name="locationMode"
            value="auto"
            checked={locationMode === "auto"}
            onChange={() => setLocationMode("auto")}
          />
          Auto (GPS)
        </label>
        <label className="flex items-center gap-1 text-green-700 font-medium">
          <input
            type="radio"
            name="locationMode"
            value="manual"
            checked={locationMode === "manual"}
            onChange={() => setLocationMode("manual")}
          />
          Manual
        </label>
      </div>

      {/* Manual Input */}
      {locationMode === "manual" && (
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            placeholder="Location Name"
            value={manualName}
            onChange={(e) => setManualName(e.target.value)}
            className="border border-green-300 rounded-lg px-3 py-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="number"
            placeholder="Latitude"
            value={manualLat}
            onChange={(e) => setManualLat(e.target.value)}
            className="border border-green-300 rounded-lg px-3 py-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="number"
            placeholder="Longitude"
            value={manualLng}
            onChange={(e) => setManualLng(e.target.value)}
            className="border border-green-300 rounded-lg px-3 py-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleManualAdd}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Add
          </button>
        </div>
      )}

      {/* Map */}
      <div className="h-[400px] w-full rounded-xl overflow-hidden border border-green-200 mb-4">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          />
          <MapClickHandler addPin={addPin} />
          <FlyToLocation center={center} />

          {/* Live Location */}
          {liveLocation && locationMode === "auto" && (
            <Marker position={liveLocation} icon={liveIcon}>
              <Popup>Your current location</Popup>
            </Marker>
          )}

          {/* Pins */}
          {pins.map((p, i) => (
            <Marker key={i} position={[p.lat, p.lng]} icon={pinIcon}>
              <Popup>
                <div className="text-sm">
                  {p.name && (
                    <p>
                      <strong>Name:</strong> {p.name} <br />
                    </p>
                  )}
                  <p>
                    <strong>Lat:</strong> {p.lat.toFixed(6)} <br />
                    <strong>Lng:</strong> {p.lng.toFixed(6)}
                  </p>
                  <button
                    onClick={() => copyCoordinates(p.lat, p.lng)}
                    className="mt-2 bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700"
                  >
                    Copy
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Farm polygons */}
          {pins.length >= 3 && <Polygon positions={pins.map(p => [p.lat,p.lng])} color="green" opacity={0.6} />}
          {savedFarms.map((farm) => (
            <Polygon key={farm.id} positions={farm.coordinates.map(p => [p.lat,p.lng])} color="blue" opacity={0.4}>
              <Popup>{farm.name}</Popup>
            </Polygon>
          ))}
        </MapContainer>
      </div>

      {/* Farm Name Input + Controls */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
        <input
          type="text"
          placeholder="Enter farm name"
          value={farmName}
          onChange={(e) => setFarmName(e.target.value)}
          className="border border-green-300 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={saveFarm}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          {editingIndex !== null ? "Update Farm" : "Save Farm"}
        </button>
        <button
          onClick={clearPins}
          className="bg-gray-200 text-green-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Clear Pins
        </button>
      </div>

      {/* Saved Farms */}
      {savedFarms.length > 0 && (
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Saved Farms</h3>
          <ul className="space-y-2">
            {savedFarms.map((farm, i) => (
              <li
                key={farm.id}
                className="flex justify-between items-center bg-white shadow-sm p-2 rounded-lg border-l-4 border-green-500"
              >
                <p className="text-green-700 font-medium">
                  {farm.name} (#{i + 1})
                </p>
                <div className="space-x-3">
                  <button onClick={() => editFarm(i)} className="text-blue-600 hover:text-blue-800 font-medium">
                    Edit
                  </button>
                  <button onClick={() => deleteFarm(i)} className="text-red-600 hover:text-red-800 font-medium">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {copiedCoord && (
        <div className="mt-4 text-center text-green-700 font-medium">
          Copied: {copiedCoord}
        </div>
      )}
    </div>
  );
}
