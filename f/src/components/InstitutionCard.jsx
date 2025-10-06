import { useEffect, useState } from "react";
import { Heart, Megaphone, Verified } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useApi } from "../hooks/useApi";
import { useNavigate } from "react-router-dom";


const InstitutionCard = ({ institution, favorites, setFavorites }) => {
  const { isAuthenticated } = useAuth();
  const { postData,getData } = useApi(); 
  const [loading, setLoading] = useState(false);
  const [len,setLen]=useState(0);
  const nav = useNavigate();

  const favKey = `${institution.level}-${institution.id}`;
  const isFavorite = favorites.has(favKey);


   const fetchNotices = async () => {
    try {
      const res = await getData(`/institution/${institution.id}/notices/`);
     console.log(res.length)
      setLen(res.length);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(()=>{
    fetchNotices()
  },[])


  const addView = async ()=>{
    try{
      const res = await postData(`/institution/${institution.id}/view/`)
      console.log("Response from adding view",res)

    }catch(err){
      console.log(err)
    }

    
  }
  

  const handleCardClick=()=>{
    if (!isAuthenticated) {
      alert("Please log in to view details.");
      nav('/login')
      return;
    }else{
      nav(`/inst_details/${institution.id}`);
      addView()
    }
  }

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      alert("Please log in to save favorites.");
      return;
    }

    setLoading(true);
    try {
      const response = await postData("/favorites/toggle/", { institution_id: institution.id });

      setFavorites(prev => {
        const updated = new Set(prev);
        if (response.message === "Favorite added") {
          updated.add(favKey);
        } else if (response.message === "Favorite removed") {
          updated.delete(favKey);
        }
        return updated;
      });
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setLoading(false);
    }
  };

  const base_url = "http://127.0.0.1:8000";
  let img_url=null;
  if(institution.logo != null){
     img_url = base_url + institution.logo;
  }
  
  

  return (
  <div
     className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4 cursor-pointer hover:shadow-lg transition flex flex-col"
  onClick={handleCardClick}
>
  <div className="flex justify-between items-start">
    <div className="flex">
      <img
        src={img_url || "/def_logo.png"}
        className="rounded-full w-7 h-7"
        alt=""
      />
      <h3 className="text-lg dark:text-gray-400 font-semibold mx-2">{institution.name}</h3>
      {institution.is_verified && (
        <Verified className="text-blue-500 font-bold mx-1" />
      )}
    </div>

    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite();
      }}
      disabled={loading}
    >
      <Heart
        className={`w-6 h-6 ${
          isFavorite ? "fill-green-400 text-green-400" : "text-gray-400"
        }`}
      />
    </button>
  </div>

  <p className="text-sm text-gray-600 my-3 dark:text-gray-400">{institution.type}</p>
  <p className="text-xs text-gray-400">
    {institution.region} - {institution.district} - {institution.ward}
  </p>

 
  <div className="text-xs flex justify-between text-gray-500 mt-3">
    <div className="flex gap-1" >
      
      <span>{institution.views_count === 0 && <span>No views</span>} {institution.views_count === 1 && <span>1 view</span>} {institution.views_count > 1 && <span>{institution.views_count} views</span>}</span>
      
    </div>
    {len > 0 && 
    <div className="flex gap-0.5 mx-4">
     <Megaphone className="" />
      <span className="text-gray-900 font-extrabold bg-amber-400 py-1 px-2 rounded-full">{len}</span>
    </div>
    }
  </div>
</div>
  );
};

export default InstitutionCard;


