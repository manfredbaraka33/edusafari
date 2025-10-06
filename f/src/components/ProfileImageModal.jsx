import { useState } from "react";
import { useApi } from "../hooks/useApi";

export default function ProfileImageModal({ isOpen, onClose }) {
  const { patchData } = useApi();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("profile_image", file);
      await patchData("/me/update/", formData, true);
      onClose();
    } catch (err) {
      console.error("Error updating image:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-800 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-700 p-6 rounded-xl w-96 shadow dark:text-gray-100">
        <h2 className="text-lg font-bold mb-4">Update Profile Picture</h2>
        {preview && (
          <img src={preview} alt="Preview" className="w-24 h-24 rounded-full mx-auto mb-4" />
        )}
        <input type="file" accept="image/*" className="border-2 border-red-400 rounded p-2" onChange={handleFileChange} />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded text-gray-800">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-indigo-500 text-white rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
