import { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Heart, HeartMinus, Verified } from "lucide-react";

export default function Favorites() {
  const { isAuthenticated } = useAuth();
  const { getData, error,postData } = useApi();
  const [favorites, setFavorites] = useState([]);
  const [loading,setLoading]=useState(false);
  const nav = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = async (instId) => {
    if (!isAuthenticated) {
      alert("Please log in to save favorites.");
      return;
    }

    const payload = {
      institution_id: instId,
    };

    console.log("Toggling favorite, payload:", payload);

    setLoading(true);
    try {
      // Call toggle endpoint
      const response = await postData("/favorites/toggle/", payload);
      fetchFavorites();
      // console.log("Backend response:", response);

      // Update local state based on backend response
      if (response.message === "Favorite added") {
        setIsFavorite(true);
      } else if (response.message === "Favorite removed") {
        setIsFavorite(false);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
      try {
        const data = await getData("/favorites/");
        // console.log("Favorites fetched:", data);
        setFavorites(data);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      }
    };




  useEffect(() => {
    if (!isAuthenticated) return;

    fetchFavorites();
  }, [isAuthenticated]);

  const toDetails=(instId)=>{
   nav(`/inst_details/${instId}`)
  };

  if (!isAuthenticated) {
    return <p className="p-6 text-gray-600">Please login to view your favorites.</p>;
  }

  if (loading) {
    return <p className="p-6 text-gray-600">Loading favorites...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-400">My Favorites</h1>
      
      
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {favorites.length === 0 ? (
        <p className="text-gray-500">You have no saved institutions yet.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {favorites.map((inst) => (
            <li key={inst.id} onClick={()=>toDetails(inst.institution.id)}  className="bg-white p-4 shadow rounded-lg  justify-between  dark:bg-gray-800 cursor-pointer">
             
             <div className="flex justify-between">
                  <div className="flex px-1"> 
              <img
                src={inst.institution.logo || "/def_logo.png"}
                className="rounded-full w-7 h-7 mx-2"
                alt=""
              />
              <h3 className="font-semibold dark:text-gray-200">{inst.institution.name|| "Unnamed Institution"} </h3>
             {inst.institution.is_verified === true && <span className="mx-1"> <Verified className="text-blue-600 font-extrabold" /> </span>}
             </div>
             <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(inst.institution.id);
                }}
                disabled={loading}
              >
                
                <HeartMinus
                  className="w-6 h-6 text-green-400 font-bold"
                />
              </button>
             </div>
           
              <div className="flex justify-between my-2">
                <span className="text-xs px-3 text-gray-500 dark:text-gray-300">{inst.institution.type}</span>
              
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-300">{inst.institution.region} - {inst.institution.district} - {inst.institution.ward}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
