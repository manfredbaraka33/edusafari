import { useState } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import BackToTopButton from "../components/BackToTopButton";
import Footer from "../components/Footer";

export default function Layout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleToggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-tr from-yellow-200 via-indigo-100 to-pink-200 dark:from-gray-600 dark:via-gray-700 dark:to-gray-600">
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        <Topbar
          onToggleSidebar={handleToggleSidebar}
          isAuthenticated={isAuthenticated}
        />
        <main className="flex-1 overflow-y-auto p-0">
          <Outlet />
          <BackToTopButton />
          <Footer />

        </main>
      </div>
      
    </div>
  );
}
