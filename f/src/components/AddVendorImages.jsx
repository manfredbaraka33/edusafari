import { useState } from "react";
import { useApi } from "../hooks/useApi";

export default function AddVendorImages({ serviceId, onSuccess }) {
  const { postData } = useApi();
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Array.from(images).forEach((img) => data.append("image", img));
    try {
      await postData(`/services/${serviceId}/image/`, data, { headers: { "Content-Type": "multipart/form-data" } });
      onSuccess(); // refresh detail page
    } catch (err) {
      console.error("Error uploading images:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="file" multiple accept="image/*" onChange={handleChange} />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
        Upload Images
      </button>
    </form>
  );
}
