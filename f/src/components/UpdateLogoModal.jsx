import { useState } from "react";
import { useApi } from "../hooks/useApi";

export default function UpdateLogoModal({ isOpen, onClose, onUpdated, instId }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const {patchData} = useApi();

  const handleUpload = async () => {
    if (!file) return;
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("logo", file);

      const response = await patchData(`/institutions/update/${instId}/`,formData);
      console.log(response); 
      onUpdated(); // refresh institution details
      onClose();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to update logo.");
    } finally {
      setIsUploading(false);
    }
  };

   const handleBackdropClick = (e) => {
    // Only close if clicked on the backdrop itself
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-blue-300 bg-opacity-40 flex items-center justify-center dark:bg-gray-800 z-50" onClick={handleBackdropClick}>
      <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg max-w-sm w-full">
        <h2 className="text-lg dark:text-gray-200 font-semibold mb-4">Update Institution Logo</h2>
        
       
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4 bg-gray-100 rounded p-3 border-gray-500 border-2 cursor-pointer"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
