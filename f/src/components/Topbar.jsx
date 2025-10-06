import { Bell, UserCircle, Menu, Lightbulb, Moon, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Link,useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useApi } from "../hooks/useApi";
import { useState,useEffect } from "react";

export default function Topbar({ onToggleSidebar }) {
  const { isAuthenticated, logout } = useAuth();
  const { getData } = useApi();
  const [user, setUser] = useState(null);
  const nav  = useNavigate();

  const fetchUser = async () => {
    try {
      const data = await getData("/me");
      setUser(data);
    } catch (err) {
      console.error(err);
      setUser(null);
      logout();
    } finally {
     
    }
  };

  useEffect(() => {
    if(isAuthenticated){
      fetchUser();
    }
  }, []);
       


  return (
    <div className="h-14 bg-gradient-to-r  from-gray-200 to-yellow-100 shadow flex items-center justify-between px-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-gray-600 dark:text-gray-300 hover:text-indigo-600"
        >
          <Menu className="w-6 h-6" />
        </button>
        <Link to='/'><h1 className="text-xl font-bold  dark:text-blue-600 text-indigo-600">EduSafari</h1></Link>
      </div>

      <div className="flex items-center gap-4 px-2">
        {isAuthenticated ? (
          <>
         
         <ThemeToggle />
            <button onClick={()=>nav('/profile')} className="flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-indigo-600">
              <img src={user?.profile_image || '/im.png'} className="rounded-full w-7 h-7" alt="profile" />
              <span className="hidden sm:inline">My Account</span>
            </button>
            <button
              onClick={logout}
              className="text-red-500 hover:text-red-700 px-1 py-1 rounded-md border border-red-300"
            >
             
              <span className="flex"><LogOut className="mx-1 text-xs" />  <span className="hidden sm:inline">Logout</span> </span>
            </button>
          </>
        ) : (
          <>
           <ThemeToggle />
            <Link
              to="/login"
              className="py-1  text-gray-700 dark:text-gray-200 rounded-md hover:bg-indigo-700"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className=" py-1 text-gray-700 dark:text-gray-200  rounded-md hover:bg-green-700"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
