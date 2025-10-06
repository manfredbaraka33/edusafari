import { useEffect, useState } from "react";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function OnlinePlatforms() {
  const [platforms, setPlatforms] = useState([]);
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sort: "",
  });

  const getPlatforms = async (reset = false) => {
    setLoading(true);
    try {
      if (reset) setOffset(0);
      const query = new URLSearchParams({
        ...filters,
        offset: reset ? 0 : offset,
        limit,
      }).toString();

      const res = await axios.get(`http://localhost:8000/api/platforms/?${query}`);
      if (reset) setPlatforms(res.data);
      else setPlatforms((prev) => [...prev, ...res.data]);

      setHasMore(res.data.length === limit);
      if (!reset) setOffset((prev) => prev + limit);
      if (reset) setOffset(limit);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (id) => {
    if (!isAuthenticated) {
      alert("Please log in to view details.");
      nav("/login");
      return;
    } else {
      nav(`/platforms/detail/${id}`);
    }
  };

  const handleLoadMore = () => {
    if (hasMore) getPlatforms();
  };

  useEffect(() => {
    getPlatforms(true);
  }, []);

  useEffect(() => {
    getPlatforms(true);
  }, [filters]);

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Online Platforms</h2>

      {/* --- Filters --- */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 dark:bg-gray-800 dark:text-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleInputChange}
            className="border rounded-2xl px-3 py-2 w-full dark:bg-slate-800"
            placeholder="Search platforms..."
          />
          <select
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="border rounded-2xl px-3 py-2 w-full dark:bg-slate-800"
          >
            <option value="">All Categories</option>
            <option value="elearning">E-Learning</option>
            <option value="tutoring">Tutoring</option>
            <option value="coding">Coding & Tech</option>
            <option value="language">Language Learning</option>
            <option value="exam_prep">Exam Prep</option>
            <option value="general">General Education</option>
          </select>

          <select
            name="sort"
            value={filters.sort}
            onChange={handleInputChange}
            className="border rounded-2xl px-3 py-2 w-full dark:bg-slate-800"
          >
            <option value="">Sort By</option>
            <option value="name">Name (A-Z)</option>
            <option value="-name">Name (Z-A)</option>
          </select>
        </div>
      </div>

      {/* --- Platforms Grid --- */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* --- Loading State (initial) --- */}
        {loading && platforms.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
            Loading platforms...
          </div>
        )}

        {/* --- No Results --- */}
        {!loading && platforms.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
            No platforms found. Try adjusting your filters.
          </div>
        )}

        {/* --- Platforms List --- */}
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col items-center cursor-pointer"
            onClick={() => handleCardClick(platform.id)}
          >
            <img
              src={`http://localhost:8000${platform.logo}`}
              alt={platform.name}
              className="w-20 h-20 mb-4 rounded-full"
            />
            <h3 className="text-lg font-semibold dark:text-gray-100">
              {platform.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-2">
              {platform.description}
            </p>
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              {platform.category}
            </span>

            <div className="flex gap-4">
              <button className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-500">
                <ThumbsUp size={16} /> {platform.votes_count}
              </button>
              <button className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-green-500">
                <MessageCircle size={16} /> {platform.comments.length}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- Load More --- */}
      {hasMore && !loading && platforms.length > 0 && (
        <div className="text-center mt-6">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            onClick={handleLoadMore}
          >
            Load More
          </button>
        </div>
      )}

      {/* --- Loading when fetching more --- */}
      {loading && platforms.length > 0 && (
        <div className="text-center mt-6 text-gray-500 dark:text-gray-400">
          Loading more platforms...
        </div>
      )}
    </div>
  );
}
