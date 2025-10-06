import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useApi } from "../hooks/useApi";
import AddInstitutionModal from "../components/AddInstitutionModal";
import ProfileImageModal from "../components/ProfileImageModal";
import CredentialsModal from "../components/CredentialsModal";
import { Pencil } from "lucide-react";
import AddVendorService from "../components/AddVendorService";

export default function Profile() {
  const { logout, isAuthenticated } = useAuth();
  const { getData } = useApi();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInstModalOpen, setIsInstModalOpen] = useState(false);
  const [isServiceModalOpen, setServiceModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isCredsModalOpen, setIsCredsModalOpen] = useState(false);

  const fetchUser = async () => {
    try {
      const data = await getData("/me");
      setUser(data);
    } catch (err) {
      console.error(err);
      setUser(null);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <p className="p-6 text-gray-600">Loading profile...</p>;
  if (!isAuthenticated)
    return <p className="p-6 text-gray-600">Please login to view your profile.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 ">
      <div className="bg-white shadow rounded-xl p-6 dark:bg-gray-800 flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Profile Image with overlay icon */}
        <div className="relative w-32 h-32">
          <img
            src={user?.profile_image || "/im.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-400"
          />
          <button
            onClick={() => setIsImageModalOpen(true)}
            className="absolute top-0  right-0 bg-indigo-500 hover:bg-indigo-600 text-white p-1 rounded-full shadow"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>

        {/* User info */}
        <div className="flex-1 flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-indigo-600">
            {user.username || "N/A"}
          </h2>
          <p className="text-gray-600 dark:text-gray-200">
            <span className="font-semibold">User Type:</span>{" "}
            {user.user_type?.replace("_", " ") || "N/A"}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-4 md:mt-0 flex flex-col gap-2">
          {user.user_type === "institution_user" && (
            <button
              onClick={() => setIsInstModalOpen(true)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded transition"
            >
              Add Institution
            </button>
          )}
          {user.user_type === "vendor_user" && (
            <button
              onClick={() => setServiceModalOpen(true)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded transition"
            >
              Add Service
            </button>
          )}
          <button
            onClick={() => setIsCredsModalOpen(true)}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition"
          >
            Update Credentials
          </button>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Modals */}
      <AddInstitutionModal
        isOpen={isInstModalOpen}
        user={user.id}
        onClose={() => {
          setIsInstModalOpen(false);
          fetchUser();
        }}
      />

      <AddVendorService
      isOpen={isServiceModalOpen}
      setServiceModalOpen={setServiceModalOpen}
      onClose={()=>{
      setServiceModalOpen(false)
      }}
      />

      <ProfileImageModal
        isOpen={isImageModalOpen}
        onClose={() => {
          setIsImageModalOpen(false);
          fetchUser();
        }}
      />

      <CredentialsModal
        isOpen={isCredsModalOpen}
        username={user.username}
        onClose={() => {
          setIsCredsModalOpen(false);
          fetchUser();
        }}
      />
    </div>
  );
}
