import { NavLink } from "react-router-dom";
import { Home, Heart, ToolCase, Laptop, MapPin, ShoppingCart, InfoIcon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar({ isOpen, onClose }) {
  const { isAuthenticated } = useAuth();


  const links = [
    { to: "/", label: "Home", icon: Home },
    { to: "/edutools", label: "EduTools", icon: ToolCase },
    { to: "/platforms", label: "Online Platforms", icon: Laptop },
    { to: "/centres", label: "Tuition Centers", icon: MapPin },
    { to: "/vendor-services", label: "Vendor Services", icon: ShoppingCart },
    ...(isAuthenticated
      ? [{ to: "/favorites", label: "Favorites", icon: Heart }]
      : []),
     { to: "/help", label: "Help/feedback", icon: InfoIcon }, 
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 z-20"
        ></div>
      )}
        
      <div
        className={`fixed top-0 left-0 h-screen w-56 bg-gradient-to-tr from-yellow-200 via-indigo-100 to-pink-200 text-gray-900 dark:text-gray-200 z-30 transform 
             dark:from-gray-700 dark:via-gray-800 dark:to-gray-700  ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        <div className="px-4 py-3 font-bold text-indigo-600 text-lg flex justify-between items-center">
          EduSafari
          <button onClick={onClose} className="text-red-500 rounded border px-2  hover:text-gray-800">
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-2 mt-4">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-yellow-600 ${
                    isActive ? "bg-yellow-600" : ""
                  }`
                }
                onClick={onClose} 
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
}
