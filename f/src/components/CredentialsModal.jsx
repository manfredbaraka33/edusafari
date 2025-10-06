import { useState } from "react";
import { useApi } from "../hooks/useApi";

export default function CredentialsModal({ isOpen, onClose, username }) {
  const { patchData } = useApi();
  const [newUsername, setNewUsername] = useState(username);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

     const handleBackdropClick = (e) => {
    // Only close if clicked on the backdrop itself
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPass && newPass !== confirmPass) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        username: newUsername,
        old_password: oldPass,
        new_password: newPass,
      };
      await patchData("/me/update_credentials/", payload);
      onClose();
    } catch (err) {
      console.error("Error updating credentials:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-blue-300 bg-opacity-40 flex items-center justify-center z-50 dark:bg-gray-800" onClick={handleBackdropClick}>
      <div className="bg-white p-6 rounded-xl w-96 shadow dark:bg-gray-700 dark:text-gray-200">
        <h2 className="text-lg font-bold mb-4">Update Credentials</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Old Password</label>
            <input
              type="password"
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded dark:text-gray-800">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-500 text-white rounded"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
