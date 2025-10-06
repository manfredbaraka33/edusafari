import { useEffect, useState } from "react";
import InstitutionCard from "../components/InstitutionCard";
import { useApi } from "../hooks/useApi";
import { TZ_REGIONS } from "../constants";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import Footer from "../components/Footer";


const Home = () => {
  const { getData } = useApi();
  const {user}=useAuth();
  const [institutions, setInstitutions] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    type: "",
    region: "",
    gender:"",
    stay:"",
    fee_min: "",
    fee_max: "",
    sort: "",
  });

  const [offset, setOffset] = useState(0);
  const limit = 20;

  const fetchInstitutions = async (reset = false) => {
    try {
      if (reset) setOffset(0);

      const query = new URLSearchParams({
        ...filters,
        offset: reset ? 0 : offset,
        limit,
      }).toString();

      // console.log("Fetching with params:", query);
      const instData = await axios.get(`https://edusafari.onrender.com/api/institutions/fetch/?${query}`);
      // console.log("Backend returned:", instData.data);
      if (reset) setInstitutions(instData.data);
      else setInstitutions(prev => [...prev, ...instData.data]);

      setHasMore(instData.data.length === limit);
      if (!reset) setOffset(prev => prev + limit);
      if (reset) setOffset(limit);
    } catch (error) {
      console.error("Failed to fetch institutions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
     if(!user){
      setFavorites(new Set());
     }else{
      try {
        const favData = await getData("/favorites/");
        // console.log("Favorites:", favData);
        const favSet = new Set(favData.map(f => `${f.institution.level}-${f.institution.id}`));
        setFavorites(favSet);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      }
     }
      
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    fetchInstitutions(true);
  }, []);

  useEffect(() => {
    fetchInstitutions(true);
  }, [filters]);

  const handleLoadMore = () => {
    if (hasMore) fetchInstitutions();
  };

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };


  return (
    <div className="max-w-5xl container mx-auto my-6 px-4">
      {/* --- Filters --- */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 dark:bg-gray-800 dark:text-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleInputChange}
            className="border rounded-2xl px-3 py-2 w-full"
            placeholder="Search institutions..."
          />
          <select
            name="type"
            value={filters.type}
            onChange={handleInputChange}
            className="border rounded-2xl  px-3 py-2 w-full dark:bg-slate-800"
          >
            <option value="">All Types</option>
            <option value="daycare">Day Care</option>
            <option value="primary">Primary School</option>
            <option value="olevel">O-Level</option>
            <option value="advance">A-Level</option>
            <option value="college">College</option>
            <option value="university">University</option>
          </select>
          <select
            name="region"
            value={filters.region}
            onChange={handleInputChange}
            className="border rounded-2xl px-3 py-2 w-full  dark:bg-slate-800"
          >
            <option value="">All Regions</option>
            {TZ_REGIONS.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
          <select
            name="gender"
            value={filters.gender}
            onChange={handleInputChange}
            className="border rounded-2xl px-3 py-2 w-full dark:bg-slate-800"
          >
            <option value="">All Genders</option>
            <option value="boys">Boys</option>
            <option value="girls">Girls</option>
            <option value="mix">Mixture</option>
          </select>

          <select
            name="stay"
            value={filters.stay}
            onChange={handleInputChange}
            className="border rounded-2xl px-3 py-2 w-full dark:bg-slate-800"
          >
            <option value="">All Stays</option>
            <option value="boarding">Boarding</option>
            <option value="day">Day</option>
            <option value="all">All</option>
          </select>
          

          <input
            type="number"
            name="fee_min"
            value={filters.fee_min}
            onChange={handleInputChange}
            className="border rounded-2xl px-3 py-2 w-full  dark:bg-slate-800"
            placeholder="Min Fee"
          />
          <input
            type="number"
            name="fee_max"
            value={filters.fee_max}
            onChange={handleInputChange}
            className="border rounded-2xl px-3 py-2 w-full"
            placeholder="Max Fee"
          />
          <select
            name="sort"
            value={filters.sort}
            onChange={handleInputChange} 
            className="border rounded-2xl px-3 py-2 w-full  dark:bg-slate-800"
          >
            <option value="">Sort By</option>
            <option value="name">Name (A-Z)</option>
            <option value="-name">Name (Z-A)</option>
            <option value="fee_min">Fee ↑</option>
            <option value="-fee_min">Fee ↓</option>
          </select>
        </div>
      </div>

      {/* --- Institutions Grid --- */}
      {loading ? (
        <p className="text-center text-gray-500">Loading institutions...</p>
      ) : !institutions.length ? (
        <p className="text-center text-gray-500">No institutions found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {institutions.map(inst => (
            <InstitutionCard
              key={inst.id}
              institution={inst}
              favorites={favorites}
              setFavorites={setFavorites}
            />
          ))}
        </div>
      )}

      {/* --- Load More --- */}
      {hasMore && !loading && (
        <div className="text-center mt-6">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            onClick={handleLoadMore}
          >
            Load More
          </button>
         
        </div>
      )}
    </div>
  );
};

export default Home;
