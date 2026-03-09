import { useState } from "react";
import {
  TrendingUp, TrendingDown, BarChart2,
  Download, ChevronUp, ChevronDown, ChevronsUpDown,
  Search, Wheat, Carrot, Coffee, Leaf, Sprout,
  RefreshCw, Award, AlertCircle
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine
} from "recharts";

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_KEY;

const CATEGORIES = [
  { id: "all",        label: "All Crops",          icon: Leaf    },
  { id: "grains",     label: "Grains",              icon: Wheat   },
  { id: "vegetables", label: "Vegetables & Fruits", icon: Carrot  },
  { id: "cash",       label: "Cash Crops",          icon: Coffee  },
];

const CATEGORY_PRESETS = {
  grains:     "Wheat, Rice, Barley, Maize, Jowar",
  vegetables: "Tomato, Potato, Onion, Carrot, Mango",
  cash:       "Sugarcane, Cotton, Soybean, Groundnut, Turmeric",
};

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12,
      padding: "10px 14px", fontSize: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
    }}>
      <p style={{ fontWeight: 800, marginBottom: 6, color: "#166534", fontSize: 13 }}>{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
          <span style={{ color: "#6b7280" }}>{p.name}:</span>
          <strong style={{ color: p.color }}>₹{Number(p.value).toFixed(0)}</strong>
          {p.payload?.forecast && <span style={{ fontSize: 10 }}>🔮</span>}
        </div>
      ))}
    </div>
  );
}

function LoadingAnimation() {
  return (
    <div style={{ padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:0.3;transform:scaleY(0.6)} 50%{opacity:1;transform:scaleY(1)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .bar1{animation:pulse 1s ease-in-out infinite;}
        .bar2{animation:pulse 1s ease-in-out 0.15s infinite;}
        .bar3{animation:pulse 1s ease-in-out 0.3s infinite;}
        .bar4{animation:pulse 1s ease-in-out 0.45s infinite;}
        .bar5{animation:pulse 1s ease-in-out 0.6s infinite;}
        .shimmer-line{
          background: linear-gradient(90deg,#dcfce7 25%,#bbf7d0 50%,#dcfce7 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }
      `}</style>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60 }}>
        {[40, 55, 35, 65, 45, 70, 50, 60, 42, 68].map((h, i) => (
          <div key={i} className={`bar${(i % 5) + 1}`} style={{
            width: 14, height: h, borderRadius: "4px 4px 0 0",
            background: `hsl(${130 + i * 8}, 60%, ${50 + i * 2}%)`
          }} />
        ))}
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "#f0fdf4", border: "1px solid #bbf7d0",
          borderRadius: 999, padding: "8px 18px", marginBottom: 12
        }}>
          <RefreshCw size={14} color="#16a34a" style={{ animation: "spin 1s linear infinite" }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#16a34a" }}>
            Fetching Data... this may take a few Second
          </span>
        </div>
        <p style={{ margin: 0, fontSize: 12, color: "#86efac" }}>
          Analysing mandi prices, trends & forecasts
        </p>
      </div>

      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
        {[90, 75, 85, 65, 80].map((w, i) => (
          <div key={i} className="shimmer-line" style={{
            height: 16, borderRadius: 8, width: `${w}%`
          }} />
        ))}
      </div>
    </div>
  );
}

export default function PriceForecastingModule() {
  const [cropInput, setCropInput]           = useState("");
  const [crops, setCrops]                   = useState([]);
  const [selected, setSelected]             = useState([]);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState("");
  const [sortKey, setSortKey]               = useState("name");
  const [sortAsc, setSortAsc]               = useState(true);
  const [activeTab, setActiveTab]           = useState("chart");
  const [activeCategory, setActiveCategory] = useState("all");

  const fetchCropData = async (overrideName) => {
    const raw = overrideName || cropInput;
    const names = raw.split(",").map((s) => s.trim()).filter(Boolean);
    if (!names.length) return;

    setLoading(true);
    setError("");
    setCrops([]);

    const prompt = `
You are an Indian agricultural market data expert specializing in mandi prices.
For each crop: ${names.join(", ")}

Return ONLY valid JSON (no markdown, no extra text):
{
  "crops": [
    {
      "id": "wheat",
      "name": "Wheat",
      "category": "grains",
      "color": "#f59e0b",
      "unit": "₹/quintal",
      "current": 2150,
      "prev": 1980,
      "yoy": 8.6,
      "accuracy": 87,
      "history": [
        {"year":"2018","price":1600},
        {"year":"2019","price":1735},
        {"year":"2020","price":1840},
        {"year":"2021","price":1975},
        {"year":"2022","price":2015},
        {"year":"2023","price":2125},
        {"year":"2024","price":1980},
        {"year":"2025","price":2150,"forecast":true},
        {"year":"2026","price":2300,"forecast":true},
        {"year":"2027","price":2480,"forecast":true},
        {"year":"2028","price":2650,"forecast":true}
      ]
    }
  ]
}

STRICT Rules:
- ALL prices must be in Indian Rupees (₹) reflecting real Indian mandi/market rates
- unit must be ₹/quintal for grains and cash crops, ₹/kg for vegetables and fruits
- category must be one of: grains, vegetables, cash
- Use accurate 2024 Indian mandi prices (e.g. Wheat ~₹2150/quintal, Tomato ~₹30/kg, Cotton ~₹6500/quintal)
- Assign a distinct vivid hex color per crop
- yoy = year-over-year % change as a number (no % sign)
- accuracy = forecast accuracy 80-95 as a number
- Exactly 11 history entries: 2018-2024 real prices, 2025-2028 forecast with "forecast":true
- Prices must grow realistically year over year based on Indian inflation and market trends
`;

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2,
        }),
      });

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      const start = content.indexOf("{");
      const end = content.lastIndexOf("}");
      const parsed = JSON.parse(content.slice(start, end + 1));
      const newCrops = parsed.crops;

      setCrops(newCrops);
      setSelected(newCrops.map((c) => c.id));
      setCropInput("");
      setActiveCategory("all");
    } catch {
      setError("Failed to fetch data. Please try again.");
    }

    setLoading(false);
  };

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    if (catId !== "all" && CATEGORY_PRESETS[catId]) {
      setCropInput(CATEGORY_PRESETS[catId]);
      fetchCropData(CATEGORY_PRESETS[catId]);
    }
  };

  const toggleCrop = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleSort = (key) => {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(true); }
  };

  const filteredCrops = activeCategory === "all"
    ? crops
    : crops.filter((c) => c.category === activeCategory);

  const selectedCrops = crops.filter((c) => selected.includes(c.id));

  const chartData = crops[0]?.history.map((h) => {
    const point = { year: h.year };
    selectedCrops.forEach((c) => {
      const match = c.history.find((x) => x.year === h.year);
      if (match) { point[c.id] = match.price; point.forecast = match.forecast || false; }
    });
    return point;
  }) || [];

  const topGainer = crops.length ? [...crops].sort((a, b) => b.yoy - a.yoy)[0] : null;
  const lowest    = crops.length ? [...crops].sort((a, b) => a.yoy - b.yoy)[0] : null;
  const avgYoy    = crops.length
    ? (crops.reduce((s, c) => s + c.yoy, 0) / crops.length).toFixed(1)
    : null;

  const sorted = [...filteredCrops].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    if (typeof av === "string") return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    return sortAsc ? av - bv : bv - av;
  });

  const exportCSV = () => {
    const rows = [["Crop", "Category", "Current Price", "Previous Year", "YoY Change", "Forecast Accuracy"]];
    crops.forEach((c) =>
      rows.push([c.name, c.category, `₹${c.current} ${c.unit}`, `₹${c.prev}`, `+${c.yoy}%`, `${c.accuracy}%`])
    );
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "india_price_forecast.csv"; a.click();
  };

  const SortIcon = ({ k }) => {
    if (sortKey !== k) return <ChevronsUpDown size={12} style={{ opacity: 0.4 }} />;
    return sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: "#f0fdf4", minHeight: "100vh",
      padding: "0 0 80px", maxWidth: 480, margin: "0 auto",
    }}>

      {/* ── Header ── */}
      <div style={{
        background: "#fff", padding: "18px 16px 14px",
        borderBottom: "1px solid #dcfce7",
        position: "sticky", top: 0, zIndex: 10,
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{
            background: "linear-gradient(135deg,#16a34a,#22c55e)",
            borderRadius: 12, padding: 9, display: "flex",
            boxShadow: "0 4px 12px rgba(22,163,74,0.3)"
          }}>
            <BarChart2 size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#14532d", letterSpacing: -0.5 }}>
              Price Forecasting
            </h1>
            <p style={{ margin: 0, fontSize: 11, color: "#86efac", fontWeight: 600 }}>
              AI-powered Indian mandi prices · 2018–2028
            </p>
          </div>
        </div>

        {/* Search */}
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={14} color="#9ca3af" style={{
              position: "absolute", left: 11, top: "50%",
              transform: "translateY(-50%)", pointerEvents: "none"
            }} />
            <input
              value={cropInput}
              onChange={(e) => setCropInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchCropData()}
              placeholder="e.g. Wheat, Rice, Tomato, Cotton..."
              style={{
                width: "100%", padding: "10px 10px 10px 32px",
                borderRadius: 12, border: "1.5px solid #dcfce7",
                fontSize: 13, outline: "none", boxSizing: "border-box",
                background: "#f9fffe", color: "#14532d", fontFamily: "inherit"
              }}
            />
          </div>
          <button
            onClick={() => fetchCropData()}
            disabled={loading || !cropInput.trim()}
            style={{
              background: loading ? "#86efac" : "linear-gradient(135deg,#16a34a,#22c55e)",
              color: "#fff", border: "none", borderRadius: 12,
              padding: "10px 18px", fontSize: 13, fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              whiteSpace: "nowrap", fontFamily: "inherit",
              boxShadow: loading ? "none" : "0 4px 12px rgba(22,163,74,0.3)"
            }}
          >
            {loading ? "..." : "Fetch"}
          </button>
        </div>

        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
            <AlertCircle size={13} color="#ef4444" />
            <p style={{ margin: 0, fontSize: 12, color: "#ef4444" }}>{error}</p>
          </div>
        )}
      </div>

      {/* ── Category Pills ── */}
      <div style={{
        display: "flex", gap: 8, padding: "12px 14px",
        overflowX: "auto", scrollbarWidth: "none"
      }}>
        {CATEGORIES.map(({ id, label, icon: Icon }) => {
          const active = activeCategory === id;
          return (
            <button key={id} onClick={() => handleCategoryClick(id)} style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "7px 14px", borderRadius: 999, border: "none",
              fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
              background: active ? "#16a34a" : "#fff",
              color: active ? "#fff" : "#166534",
              boxShadow: active ? "0 4px 12px rgba(22,163,74,0.3)" : "0 1px 4px rgba(0,0,0,0.08)",
              transition: "all 0.2s", fontFamily: "inherit"
            }}>
              <Icon size={13} />
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Empty State ── */}
      {!loading && crops.length === 0 && (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "50px 30px", textAlign: "center"
        }}>
          <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
          <div style={{ fontSize: 52, marginBottom: 20, animation: "float 3s ease-in-out infinite" }}>
            🌾
          </div>
          <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 900, color: "#14532d" }}>
            Enter crops to get started
          </h2>
          <p style={{ margin: "0 0 20px", fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
            Type crop names above and tap <strong>Fetch</strong>,<br />
            or tap a category pill to auto-load crops.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            {["🌾 Wheat", "🌽 Maize", "🍅 Tomato", "🌿 Cotton"].map((label) => (
              <span key={label} style={{
                background: "#fff", border: "1.5px solid #dcfce7",
                borderRadius: 999, padding: "6px 14px",
                fontSize: 12, fontWeight: 600, color: "#166534"
              }}>{label}</span>
            ))}
          </div>
        </div>
      )}

      {/* ── Loading ── */}
      {loading && <LoadingAnimation />}

      {/* ── Data ── */}
      {!loading && crops.length > 0 && (
        <>
          {/* Stat Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, padding: "4px 14px 0" }}>
            {[
              {
                label: "Avg. YoY", value: `${avgYoy}%`,
                sub: `${crops.length} crops`, accent: "#16a34a",
                icon: <TrendingUp size={16} color="#16a34a" />
              },
              {
                label: "Top Gainer", value: topGainer?.name,
                sub: `+${topGainer?.yoy}%`, accent: "#16a34a",
                icon: <Award size={16} color="#16a34a" />
              },
              {
                label: "Lowest", value: lowest?.name,
                sub: `+${lowest?.yoy}%`, accent: "#f97316",
                icon: <TrendingDown size={16} color="#f97316" />
              },
            ].map((s, i) => (
              <div key={i} style={{
                background: "#fff", borderRadius: 16, padding: "12px 10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                borderTop: `3px solid ${s.accent}`
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 9, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {s.label}
                  </span>
                  {s.icon}
                </div>
                <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 900, color: "#14532d", lineHeight: 1.2 }}>
                  {s.value}
                </p>
                <p style={{ margin: 0, fontSize: 10, color: s.accent, fontWeight: 700 }}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Tab Toggle */}
          <div style={{
            display: "flex", margin: "14px 14px 0",
            background: "#dcfce7", borderRadius: 14, padding: 4
          }}>
            {[{ id: "chart", label: " Chart" }, { id: "table", label: " Table" }].map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                flex: 1, padding: "9px 0", borderRadius: 11, border: "none",
                fontWeight: 800, fontSize: 13, cursor: "pointer",
                background: activeTab === t.id ? "#fff" : "transparent",
                color: activeTab === t.id ? "#16a34a" : "#4ade80",
                boxShadow: activeTab === t.id ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.2s", fontFamily: "inherit"
              }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Chart View ── */}
          {activeTab === "chart" && (
            <div style={{
              background: "#fff", margin: "12px 14px 0", borderRadius: 20,
              padding: "16px 10px 14px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
            }}>
              <h3 style={{ margin: "0 0 2px 8px", fontSize: 15, fontWeight: 900, color: "#14532d" }}>
                Price Trends & Forecast
              </h3>
              <p style={{ margin: "0 0 14px 8px", fontSize: 11, color: "#9ca3af" }}>
                Historical & projected Indian mandi prices (₹) · 🔮 = forecast
              </p>

              <ResponsiveContainer width="100%" height={230}>
                <LineChart data={chartData} margin={{ top: 5, right: 12, left: 5, bottom: 0 }}>
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false}
                    tickFormatter={(v) => `₹${v}`} width={55} />
                  <Tooltip content={<ChartTooltip />} />
                  <ReferenceLine x="2025" stroke="#e5e7eb" strokeDasharray="5 3"
                    label={{ value: "Forecast →", position: "insideTopRight", fontSize: 9, fill: "#9ca3af" }} />
                  {selectedCrops.map((c) => (
                    <Line key={c.id} type="monotone" dataKey={c.id} name={c.name}
                      stroke={c.color} strokeWidth={2.5}
                      dot={{ r: 3, fill: c.color, strokeWidth: 0 }}
                      activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                      connectNulls />
                  ))}
                </LineChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "8px 8px 0" }}>
                {selectedCrops.map((c) => (
                  <span key={c.id} style={{
                    display: "flex", alignItems: "center", gap: 5,
                    fontSize: 11, color: "#374151", fontWeight: 700,
                    background: "#f9fafb", borderRadius: 999, padding: "3px 10px"
                  }}>
                    <span style={{ width: 18, height: 3, background: c.color, borderRadius: 2, display: "inline-block" }} />
                    {c.name}
                  </span>
                ))}
              </div>

              {/* Compare toggles */}
              <div style={{ borderTop: "1px solid #f0fdf4", marginTop: 14, paddingTop: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, paddingLeft: 4 }}>
                  <Sprout size={13} color="#16a34a" />
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Compare Crops
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {crops.map((c) => {
                    const on = selected.includes(c.id);
                    return (
                      <button key={c.id} onClick={() => toggleCrop(c.id)} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "11px 13px", borderRadius: 14, border: "none",
                        background: on ? "#f0fdf4" : "#fafafa",
                        cursor: "pointer", transition: "all 0.15s",
                        outline: on ? `2px solid ${c.color}` : "2px solid transparent",
                        boxShadow: on ? `0 2px 8px ${c.color}30` : "none",
                        fontFamily: "inherit"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                          <div style={{
                            width: 12, height: 12, borderRadius: "50%", background: c.color,
                            boxShadow: `0 2px 6px ${c.color}60`
                          }} />
                          <div style={{ textAlign: "left" }}>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: "#14532d" }}>{c.name}</p>
                            <p style={{ margin: 0, fontSize: 10, color: "#9ca3af", textTransform: "capitalize" }}>
                              {c.category} · {c.unit}
                            </p>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>₹{c.current}</span>
                          <span style={{
                            fontSize: 11, fontWeight: 800, padding: "3px 8px",
                            borderRadius: 999, background: "#dcfce7", color: "#16a34a"
                          }}>+{c.yoy}%</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── Table View ── */}
          {activeTab === "table" && (
            <div style={{
              background: "#fff", margin: "12px 14px 0", borderRadius: 20,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden"
            }}>
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "flex-start", padding: "16px 16px 12px"
              }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: "#14532d" }}>
                    Detailed Price Data
                  </h3>
                  <p style={{ margin: "3px 0 0", fontSize: 11, color: "#9ca3af" }}>
                    Indian mandi rates · {sorted.length} crops
                  </p>
                </div>
                <button onClick={exportCSV} style={{
                  display: "flex", alignItems: "center", gap: 5,
                  background: "#f0fdf4", color: "#16a34a", border: "1.5px solid #dcfce7",
                  borderRadius: 10, padding: "7px 12px", fontSize: 12,
                  fontWeight: 800, cursor: "pointer", fontFamily: "inherit"
                }}>
                  <Download size={13} /> CSV
                </button>
              </div>

              {/* Header */}
              <div style={{
                display: "grid", gridTemplateColumns: "1.5fr 1fr 0.8fr 0.9fr",
                padding: "8px 16px", background: "#f8fafc",
                borderTop: "1px solid #f0f9f0", borderBottom: "1px solid #f0f9f0"
              }}>
                {[
                  { label: "Crop", key: "name" },
                  { label: "Price", key: "current" },
                  { label: "YoY", key: "yoy" },
                  { label: "Score", key: "accuracy" },
                ].map(({ label, key }) => (
                  <button key={key} onClick={() => handleSort(key)} style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 10, fontWeight: 800, color: "#9ca3af",
                    textTransform: "uppercase", letterSpacing: 0.5,
                    display: "flex", alignItems: "center", gap: 3,
                    padding: 0, fontFamily: "inherit"
                  }}>
                    {label} <SortIcon k={key} />
                  </button>
                ))}
              </div>

              {/* Rows */}
              {sorted.map((c, i) => (
                <div key={c.id} style={{
                  display: "grid", gridTemplateColumns: "1.5fr 1fr 0.8fr 0.9fr",
                  padding: "13px 16px", alignItems: "center",
                  borderBottom: i < sorted.length - 1 ? "1px solid #f8fafc" : "none",
                  background: i % 2 === 0 ? "#fff" : "#fafffe"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: "50%", background: c.color,
                      flexShrink: 0, boxShadow: `0 2px 6px ${c.color}50`
                    }} />
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: "#14532d" }}>{c.name}</p>
                      <p style={{ margin: 0, fontSize: 9, color: "#9ca3af", textTransform: "capitalize" }}>
                        {c.category}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: "#374151" }}>₹{c.current}</span>
                    <span style={{ fontSize: 9, color: "#9ca3af", marginLeft: 2 }}>{c.unit}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <TrendingUp size={11} color="#16a34a" />
                    <span style={{ fontSize: 12, fontWeight: 800, color: "#16a34a" }}>+{c.yoy}%</span>
                  </div>
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    padding: "4px 8px", borderRadius: 999,
                    background: c.accuracy >= 90 ? "#16a34a" : c.accuracy >= 85 ? "#22c55e" : "#86efac",
                    color: "#fff", fontSize: 11, fontWeight: 800, width: "fit-content"
                  }}>
                    {c.accuracy}%
                  </span>
                </div>
              ))}
            </div>
          )}

          <p style={{ textAlign: "center", fontSize: 10, color: "#86efac", marginTop: 20, fontWeight: 600 }}>
            🤖 AI-assisted estimates · Always verify with local market data
          </p>
        </>
      )}
    </div>
  );
}