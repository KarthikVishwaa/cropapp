import { useEffect, useState } from "react";
import { Newspaper, Search, Globe, Clock, Loader2 } from "lucide-react";

export default function DailyFarmingNews() {
  const [news, setNews] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = "73481fcf9b1442599fd38102cd685c31";
  const API_URL = `https://newsapi.org/v2/everything?q=farming&language=en&sortBy=publishedAt&apiKey=${API_KEY}`;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(API_URL);
        const data = await res.json();

        if (Array.isArray(data.articles)) {
          setNews(
            data.articles.map((n) => ({
              title: n.title,
              description: n.description,
              url: n.url,
              image: n.urlToImage || null,
              publishedAt: n.publishedAt,
              source: { name: n.source?.name || "Unknown" }
            }))
          );
        } else {
          setNews([]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load news.");
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [API_URL]); // ✅ ESLint satisfied

  const filteredNews = news.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-10 sm:p-6 bg-white rounded-2xl shadow-lg mt-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex items-center gap-2">
          <Newspaper className="text-green-700 w-7 h-7" />
          <h2 className="text-2xl sm:text-3xl font-bold text-green-800">
            Daily Farming News
          </h2>
        </div>

        <div className="flex items-center border border-green-400 rounded-lg px-3 py-1 w-full sm:w-72">
          <Search className="text-green-600 w-4 h-4 mr-2" />
          <input
            type="text"
            placeholder="Search news..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-sm"
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-green-600 w-8 h-8" />
        </div>
      )}

      {error && (
        <p className="text-center text-red-600 mb-4">{error}</p>
      )}

      {/* News Grid */}
      {!loading && filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((a, i) => (
            <div
              key={i}
              className="border border-green-200 bg-green-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
            >
              {a.image && (
                <img
                  src={a.image}
                  alt={a.title}
                  className="w-full h-44 object-cover"
                />
              )}

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-green-800 mb-2 line-clamp-2">
                  {a.title}
                </h3>

                <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                  {a.description}
                </p>

                <div className="mt-auto flex justify-between items-center text-sm text-green-700">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {a.publishedAt
                      ? new Date(a.publishedAt).toLocaleDateString()
                      : "-"}
                  </div>

                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-green-600 hover:text-green-800 font-medium"
                  >
                    <Globe className="w-4 h-4" />
                    Read
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <p className="text-center text-green-700 mt-4">
            No news found for your search.
          </p>
        )
      )}
    </div>
  );
}
