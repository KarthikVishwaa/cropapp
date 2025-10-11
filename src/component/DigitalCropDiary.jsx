import React, { useState, useEffect } from "react";
import {
  NotebookPen,
  ImagePlus,
  Calendar,
  BarChart3,
  Leaf,
  Thermometer,
  Trash2,
  Search,
} from "lucide-react";

export default function DigitalCropDiary() {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("cropDiaryEntries");
    return saved ? JSON.parse(saved) : [];
  });
  const [note, setNote] = useState("");
  const [crop, setCrop] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [weather, setWeather] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [search, setSearch] = useState("");

  // Fetch simple weather info
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`
        );
        const data = await res.json();
        setWeather(data.current);
      } catch (err) {
        console.error("Weather fetch failed:", err);
      }
    });
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("cropDiaryEntries", JSON.stringify(entries));
  }, [entries]);

  // Handle image upload + preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const addEntry = () => {
    if (note.trim() === "" || !crop)
      return alert("Please add a note and select a crop type!");

    const newEntry = {
      id: Date.now(),
      note,
      crop,
      image: preview,
      weather: weather ? `${weather.temperature_2m}°C` : "Unavailable",
      date: new Date().toLocaleString(),
    };

    setEntries([newEntry, ...entries]);
    setNote("");
    setCrop("");
    setImage(null);
    setPreview(null);
  };

  const deleteEntry = (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setEntries(entries.filter((e) => e.id !== id));
    }
  };

  // Apply filters: search and date
  const filteredEntries = entries.filter((entry) => {
    const matchSearch =
      entry.note.toLowerCase().includes(search.toLowerCase()) ||
      entry.crop.toLowerCase().includes(search.toLowerCase());
    const matchDate = filterDate ? entry.date.startsWith(filterDate) : true;
    return matchSearch && matchDate;
  });

  // Crop stats summary
  const cropStats = entries.reduce((acc, e) => {
    acc[e.crop] = (acc[e.crop] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-lg mt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-2">
          <NotebookPen className="text-green-700 w-7 h-7" />
          <h2 className="text-2xl sm:text-3xl font-bold text-green-800">
            Digital Crop Diary
          </h2>
        </div>

        {/* Search Bar */}
        <div className="flex items-center border border-green-400 rounded-lg px-3 py-1 w-full sm:w-72">
          <Search className="text-green-600 w-4 h-4 mr-2" />
          <input
            type="text"
            placeholder="Search by note or crop..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-sm"
          />
        </div>
      </div>

      {/* Entry Form */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          placeholder="Note (e.g. Applied fertilizer)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="col-span-2 border border-green-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-600"
        />

        <select
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          className="border border-green-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-600"
        >
          <option value="">Select Crop</option>
          <option>Wheat</option>
          <option>Rice</option>
          <option>Maize</option>
          <option>Soybean</option>
          <option>Sugarcane</option>
        </select>

        <label className="flex items-center gap-2 border border-green-400 rounded-lg px-3 py-2 cursor-pointer hover:bg-green-50 transition">
          <ImagePlus className="text-green-600 w-5 h-5" />
          <span className="text-sm text-green-700">Upload Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Image Preview */}
      {preview && (
        <div className="flex justify-center mb-4">
          <img
            src={preview}
            alt="Preview"
            className="w-48 h-48 object-cover rounded-xl shadow-md border border-green-300"
          />
        </div>
      )}

      <button
        onClick={addEntry}
        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition w-full sm:w-auto"
      >
        Add Diary Entry
      </button>

      {/* Filters */}
      <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="text-green-700 w-5 h-5" />
          <label className="text-green-700 font-medium">Filter by Date:</label>
        </div>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border border-green-400 rounded-lg px-3 py-1"
        />
        <button
          onClick={() => setFilterDate("")}
          className="text-sm text-green-700 hover:underline"
        >
          Clear
        </button>
      </div>

      {/* Stats */}
      <div className="mt-6 bg-green-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="text-green-700 w-5 h-5" />
          <h3 className="text-lg font-semibold text-green-800">Summary</h3>
        </div>
        <p>Total Entries: {entries.length}</p>
        {Object.keys(cropStats).map((crop) => (
          <p key={crop}>
            {crop}: {cropStats[crop]} entries
          </p>
        ))}
      </div>

      {/* Entries List */}
      <div className="mt-8 space-y-4">
        {filteredEntries.length === 0 ? (
          <p className="text-center text-green-700">No entries found.</p>
        ) : (
          filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="flex items-center gap-2">
                  <Leaf className="text-green-700 w-5 h-5" />
                  <p className="text-green-900 font-semibold">{entry.crop}</p>
                </div>
                <p className="text-sm text-green-600">{entry.date}</p>
              </div>

              <p className="mt-2 text-green-800">{entry.note}</p>

              {entry.image && (
                <img
                  src={entry.image}
                  alt="Crop"
                  className="mt-3 w-full sm:w-64 h-40 object-cover rounded-lg border border-green-300"
                />
              )}

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3">
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <Thermometer className="w-4 h-4" />
                  <span>Weather: {entry.weather}</span>
                </div>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="mt-2 sm:mt-0 flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
