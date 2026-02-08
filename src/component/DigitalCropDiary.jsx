import { useState, useEffect } from "react";
import {
  NotebookPen,
  ImagePlus,
  Calendar,
  BarChart3,
  Leaf,
  Thermometer,
  Trash2,
  Search,
  Info,
  X
} from "lucide-react";

export default function DigitalCropDiary() {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("cropDiaryEntries");
    return saved ? JSON.parse(saved) : [];
  });
  const [note, setNote] = useState("");
  const [crop, setCrop] = useState("");
  const [preview, setPreview] = useState(null);
  const [weather, setWeather] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [search, setSearch] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  /* -------- Weather -------- */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        const data = await res.json();
        setWeather(data.current_weather);
      } catch (err) {
        console.error("Weather fetch failed:", err);
      }
    });
  }, []);

  /* -------- Persist diary -------- */
  useEffect(() => {
    localStorage.setItem("cropDiaryEntries", JSON.stringify(entries));
  }, [entries]);

  /* -------- Image preview -------- */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const addEntry = () => {
    if (!note.trim() || !crop) {
      alert("Please add a note and select a crop type!");
      return;
    }

    const newEntry = {
      id: Date.now(),
      note,
      crop,
      image: preview,
      weather: weather ? `${weather.temperature}°C` : "Unavailable",
      date: new Date().toLocaleString()
    };

    setEntries([newEntry, ...entries]);
    setNote("");
    setCrop("");
    setPreview(null);
  };

  const deleteEntry = (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setEntries(entries.filter((e) => e.id !== id));
    }
  };

  const filteredEntries = entries.filter((entry) => {
    const matchSearch =
      entry.note.toLowerCase().includes(search.toLowerCase()) ||
      entry.crop.toLowerCase().includes(search.toLowerCase());
    const matchDate = filterDate
      ? entry.date.startsWith(filterDate)
      : true;
    return matchSearch && matchDate;
  });

  const cropStats = entries.reduce((acc, e) => {
    acc[e.crop] = (acc[e.crop] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto p-10 sm:p-6 bg-white rounded-2xl shadow-lg mt-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-2">
          <NotebookPen className="text-green-700 w-7 h-7" />
          <h2 className="text-2xl sm:text-3xl font-bold text-green-800">
            Digital Crop Diary
          </h2>
        </div>

        <button
          onClick={() => setShowInfo(true)}
          className="flex items-center gap-1 text-green-700 font-medium"
        >
          <Info className="w-5 h-5" />
          How to Use
        </button>

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

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl max-w-lg w-full relative">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-4 right-4 text-green-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-green-800 mb-3">
              How to Use
            </h3>
            <ul className="list-disc list-inside text-green-700 space-y-2">
              <li>Add notes for daily farm activities</li>
              <li>Select crop and upload optional image</li>
              <li>Search and filter entries anytime</li>
              <li>Diary is saved automatically</li>
            </ul>
          </div>
        </div>
      )}

      {/* Entry Form */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          placeholder="Note (e.g. Applied fertilizer)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="col-span-2 border border-green-400 rounded-lg px-4 py-2"
        />

        <select
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          className="border border-green-400 rounded-lg px-4 py-2"
        >
          <option value="">Select Crop</option>
          <option>Wheat</option>
          <option>Rice</option>
          <option>Maize</option>
          <option>Soybean</option>
          <option>Sugarcane</option>
        </select>

        <label className="flex items-center gap-2 border border-green-400 rounded-lg px-3 py-2 cursor-pointer">
          <ImagePlus className="text-green-600 w-5 h-5" />
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-48 h-48 object-cover rounded-xl mb-4"
        />
      )}

      <button
        onClick={addEntry}
        className="bg-green-600 text-white px-6 py-2 rounded-lg"
      >
        Add Diary Entry
      </button>

      {/* Stats */}
      <div className="mt-6 bg-green-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="text-green-700 w-5 h-5" />
          <h3 className="font-semibold">Summary</h3>
        </div>
        <p>Total Entries: {entries.length}</p>
        {Object.keys(cropStats).map((c) => (
          <p key={c}>{c}: {cropStats[c]}</p>
        ))}
      </div>

      {/* Entries */}
      <div className="mt-6 space-y-4">
        {filteredEntries.length === 0 ? (
          <p className="text-center text-green-700">No entries found.</p>
        ) : (
          filteredEntries.map((e) => (
            <div
              key={e.id}
              className="bg-green-50 border border-green-200 p-4 rounded-lg"
            >
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-700" />
                  <strong>{e.crop}</strong>
                </div>
                <span className="text-sm text-green-600">{e.date}</span>
              </div>

              <p className="mt-2">{e.note}</p>

              {e.image && (
                <img
                  src={e.image}
                  alt="Crop"
                  className="mt-2 w-64 h-40 object-cover rounded-lg"
                />
              )}

              <div className="flex justify-between mt-3 text-sm text-green-600">
                <div className="flex items-center gap-1">
                  <Thermometer className="w-4 h-4" />
                  {e.weather}
                </div>
                <button
                  onClick={() => deleteEntry(e.id)}
                  className="flex items-center gap-1 text-red-600"
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
