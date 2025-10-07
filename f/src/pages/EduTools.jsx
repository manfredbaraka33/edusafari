import { useEffect, useState } from "react";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function EduTools() {
  const [tools, setTools] = useState([]);
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    level: "",
    category: "",
    sort: "",
  });

  const getTools = async (reset = false) => {
    setLoading(true);
    try {
      if (reset) setOffset(0);
      const query = new URLSearchParams({
        ...filters,
        offset: reset ? 0 : offset,
        limit,
      }).toString();

      const res = await axios.get(`https://edusafari.onrender.com/api/edutools/?${query}`);
      if (reset) setTools(res.data);
      else setTools((prev) => [...prev, ...res.data]);

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
      nav(`/edutools/detail/${id}`);
    }
  };

  const handleLoadMore = () => {
    if (hasMore) getTools();
  };

  useEffect(() => {
    getTools(true);
  }, []);

  useEffect(() => {
    getTools(true);
  }, [filters]);

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">EduTools</h2>

      {/* --- Filters --- */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 dark:bg-gray-800 dark:text-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleInputChange}
            className="border rounded-2xl px-3 py-2 w-full dark:bg-slate-800"
            placeholder="Search tools..."
          />
          <select
            name="level"
            value={filters.level}
            onChange={handleInputChange}
            className="border rounded-2xl px-3 py-2 w-full dark:bg-slate-800"
          >
            <option value="">All levels</option>
            <option value="daycare">Day Care</option>
            <option value="primary">Primary School</option>
            <option value="olevel">O-Level</option>
            <option value="advance">A-Level</option>
            <option value="college">College</option>
            <option value="university">University</option>
          </select>
          <select
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="border rounded-2xl px-3 py-2 w-full dark:bg-slate-800"
          >
            <option value="">All Categories</option>
            <option value="study">Study & Notes</option>
            <option value="productivity">Productivity</option>
            <option value="career">Career & Skills</option>
            <option value="teacher">Teacher Tools</option>
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

      {/* --- Tools Grid --- */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* --- Loading State (initial) --- */}
        {loading && tools.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
            Loading tools...
          </div>
        )}

        {/* --- No Results --- */}
        {!loading && tools.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
            No tools found. Try adjusting your filters.
          </div>
        )}

        {/* --- Tools List --- */}
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col items-center cursor-pointer"
            onClick={() => handleCardClick(tool.id)}
          >
            {/* <img
              src={`https://edusafari.onrender.com${tool.logo}`}
              alt={tool.name}
              className="w-20 h-20 mb-4 rounded-full"
            /> */}
            <img
              src={
                tool?.logo
                  ? `https://edusafari.onrender.com${tool.logo}`
                  : "/def_logo.png"
              }
              alt={tool?.name || "Tool"}
              className="w-20 h-20 rounded-full border border-amber-500"
              onError={(e) => (e.currentTarget.src = "/def_logo.png")} 
            />

            <h3 className="text-lg font-semibold dark:text-gray-100">
              {tool.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-2">
              {tool.description}
            </p>
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              {tool.level} | {tool.category}
            </span>

            <div className="flex gap-4">
              <button className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-500">
                <ThumbsUp size={16} /> {tool.votes_count}
              </button>
              <button className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-green-500">
                <MessageCircle size={16} /> {tool.comments.length}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- Load More --- */}
      {hasMore && !loading && tools.length > 0 && (
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
      {loading && tools.length > 0 && (
        <div className="text-center mt-6 text-gray-500 dark:text-gray-400">
          Loading more tools...
        </div>
      )}
    </div>
  );
}
