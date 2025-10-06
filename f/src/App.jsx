
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import InstitutionDetails from "./pages/InstitutionDetails";
import Favourites from "./pages/Favourites";
import Layout from "./Layouts/Layout";
import Home from "./pages/Home";
import { AuthProvider } from "./contexts/AuthContext";
import Profile from "./pages/Profile";
import BackToTopButton from "./components/BackToTopButton";
import ProtectedRoute from "./components/ProtectedRoutes";
import EduTools from "./pages/EduTools";
import EduToolDetail from "./pages/EduToolDetail";
import OnlinePlatforms from "./pages/OnlinePlatforms";
import PlatformDetail from "./pages/PlatformDetail";
import TuitionCentres from "./pages/TuitionCenters";
import TuitionCentreDetail from "./pages/TuitionCenterDetail";
import VendorServices from "./pages/VendorServices";
import VendorServiceDetail from "./pages/VendorServiceDetail";
import Help from "./pages/Help";
import Footer from "./components/Footer";

function App() {
  return (
    <AuthProvider>
      <>
        <Routes>
          {/* Public auth pages - no sidebar/topbar */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          

          {/* Pages with layout (Topbar + Sidebar) */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/edutools" element={<EduTools />} />
            <Route path="/help" element={<Help />} />
            <Route path="/edutools/detail/:id" element={<EduToolDetail />} />
            <Route path="/platforms" element={<OnlinePlatforms />} />
            <Route path="/platforms/detail/:id" element={<PlatformDetail />} />
            <Route path="/centres" element={<TuitionCentres />} />
            <Route path="/centres/detail/:id" element={<TuitionCentreDetail />} />
            <Route path="/vendor-services" element={<VendorServices />} />
            <Route path="/vendor-services/detail/:id" element={<VendorServiceDetail />} />
            <Route path="/inst_details/:instId" element={ <ProtectedRoute> <InstitutionDetails /> </ProtectedRoute>} />
            <Route path="/favorites" element={ <ProtectedRoute> <Favourites /></ProtectedRoute>} />
            <Route path="/profile" element={ <ProtectedRoute> <Profile /> </ProtectedRoute>}  />
          </Route>
        </Routes>
      </>
    </AuthProvider>
  );
}

export default App;
