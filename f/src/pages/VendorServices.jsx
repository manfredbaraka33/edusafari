import { useEffect, useState } from "react";
import { ThumbsUp, MessageCircle, VerifiedIcon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TZ_REGIONS } from "../constants";

export default function VendorServices() {
  const [services, setServices] = useState([]);
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    region:"",
    sort: "",
  });

  const getServices = async (reset = false) => {
    setLoading(true);
    try {
      if (reset) setOffset(0);
      const query = new URLSearchParams({
        ...filters,
        offset: reset ? 0 : offset,
        limit,
      }).toString();

      const res = await axios.get(`https://edusafari.onrender.com/api/services/?${query}`);
      console.log(res);
      if (reset) setServices(res.data);
      else setServices((prev) => [...prev, ...res.data]);

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
    }
    nav(`/vendor-services/detail/${id}`);
  };

  const handleLoadMore = () => {
    if (hasMore) getServices();
  };

  useEffect(() => { getServices(true); }, []);
  useEffect(() => { getServices(true); }, [filters]);

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Vendor Services</h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 dark:bg-gray-800 dark:text-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleInputChange}
            placeholder="Search services..."
            className="border rounded-2xl px-3 py-2 w-full dark:bg-slate-800"
          />
          <select
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="border rounded-2xl px-3 py-2 w-full dark:bg-slate-800"
          >
            <option value="">All Categories</option>
            <option value="stationery">Stationery</option>
            <option value="furniture">Furniture</option>
            <option value="food">Food & Catering</option>
            <option value="digital">Digital Services</option>
            <option value="other">Other</option>
          </select>

          <select
            name="region"
            value={filters.region}
            onChange={handleInputChange}
            className="border rounded-2xl px-3 py-2 w-full dark:bg-slate-800"
          >
            <option value="">All Regions</option>
             {TZ_REGIONS.map(region => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
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

      {/* Services Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading && services.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
            Loading services...
          </div>
        )}

        {!loading && services.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
            No services found.
          </div>
        )}

        {services.map((s) => (
          <div
            key={s.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col items-center cursor-pointer"
            onClick={() => handleCardClick(s.id)}
          >
            <img
              src={`https://edusafari.onrender.com${s.logo}` || "/def_logo.png"}
              alt={s.name}
              className="w-20 h-20 mb-4 rounded-full"
            />
           <div className="flex gap-2">
             <h3 className="text-lg font-semibold dark:text-gray-100">{s.name}</h3>
             {s.is_verified && 
             <VerifiedIcon className="text-blue-500" />
             }
           </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-2">
              {s.description}
            </p>
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-4">{s.category} | {s.region}-{s.district}</span>
            <div className="flex gap-4">
              <button className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-500">
                <ThumbsUp size={16} /> {s.votes_count || 0}
              </button>
              <button className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-green-500">
                <MessageCircle size={16} /> {s.comments.length}
              </button>
            </div>
          </div>
        ))}
      </div>

      {hasMore && !loading && services.length > 0 && (
        <div className="text-center mt-6">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            onClick={handleLoadMore}
          >
            Load More
          </button>
        </div>
      )}

      {loading && services.length > 0 && (
        <div className="text-center mt-6 text-gray-500 dark:text-gray-400">
          Loading more services...
        </div>
      )}
    </div>
  );
}
