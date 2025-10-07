// import { useState } from "react";
// import { useApi } from "../hooks/useApi";
// import { useNavigate } from "react-router-dom";
// import { XIcon } from "lucide-react";
// import { TZ_REGIONS } from "../constants";

// export default function AddVendorService({isOpen,onClose}) {
//   const { postData } = useApi();
//   const nav = useNavigate();
//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     category: "",
//     contact: "",
//     website: "",
//     region:"",
//     district:"",
//     logo: null,
//   });

//   const handleChange = (e) => {
//     if (e.target.name === "logo") setForm({ ...form, logo: e.target.files[0] });
//     else setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const data = new FormData();
//     Object.keys(form).forEach((key) => data.append(key, form[key]));
//     try {
//       const res = await postData("/services/create/", data);
//       nav(`/vendor-services/detail/${res.id}`);
//       onClose();
//     } catch (err) {
//       alert("An error occured while creating service, please try again!")
//       console.error("Error creating service:", err);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-white dark:bg-gray-800 bg-opacity-40 flex items-center justify-center z-50">
//     <div className="max-w-md mx-auto p-6">
//       <div className="flex justify-between overflow-y-auto"><h2 className="text-2xl font-bold mb-6 dark:text-white">Add Vendor Service</h2>
//       <XIcon onClick={onClose} className="text-red-500 cursor-pointer" /></div>
//       <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow ">
//         <input
//           type="text"
//           name="name"
//           value={form.name}
//           onChange={handleChange}
//           placeholder="Service Name"
//           className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
//           required
//         />
//         <textarea
//           name="description"
//           value={form.description}
//           onChange={handleChange}
//           placeholder="Description"
//           className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
//           required
//         />
//         <select
//           name="category"
//           value={form.category}
//           onChange={handleChange}
//           className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
//           required
//         >
//           <option value="">Select Category</option>
//           <option value="stationery">Stationery</option>
//           <option value="furniture">Furniture</option>
//           <option value="food">Food & Catering</option>
//           <option value="digital">Digital Services</option>
//           <option value="other">Other</option>
//         </select>



//         <select
//           name="region"
//           value={form.region}
//           onChange={handleChange}
//           className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
//           required
//         >
//           <option value="">Select Region</option>
//            {TZ_REGIONS.map(region => (
//                         <option key={region} value={region}>
//                           {region}
//                         </option>
//                       ))}
//         </select>


//         <input
//           type="text"
//           name="district"
//           value={form.district}
//           onChange={handleChange}
//           placeholder="District"
//           className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
//           required
//         />


//         <input
//           type="text"
//           name="contact"
//           value={form.contact}
//           onChange={handleChange}
//           placeholder="Contact info"
//           className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
//           required
//         />
//         <input
//           type="url"
//           name="website"
//           value={form.website}
//           onChange={handleChange}
//           placeholder="Website URL"
//           className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
//         />
//         <br /><br />
//         <label className="text-gray-500 my-3">Business Logo: </label>
//         <input
//           type="file"
//           name="logo"
//           accept="image/*"
//           onChange={handleChange}
//           className="w-full border rounded px-3 py-2  dark:bg-gray-700 dark:text-white"
//           required
//         />
//         <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
//           Create Service
//         </button>
//       </form>
//     </div>
//     </div>
//   )
// }






export default function AddVendorService({ isOpen, onClose }) {
  const { postData } = useApi();
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    contact: "",
    website: "",
    region: "",
    district: "",
    logo: null,
  });

  const handleChange = (e) => {
    if (e.target.name === "logo")
      setForm({ ...form, logo: e.target.files[0] });
    else setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(form).forEach((key) => data.append(key, form[key]));
    try {
      const res = await postData("/services/create/", data);
      nav(`/vendor-services/detail/${res.id}`);
      onClose();
    } catch (err) {
      alert("An error occurred while creating the service. Please try again!");
      console.error("Error creating service:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md mx-auto my-10 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-white">
            Add Vendor Service
          </h2>
          <XIcon
            onClick={onClose}
            className="text-red-500 cursor-pointer hover:text-red-600"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* your input fields */}
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Service Name"
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
            required
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="">Select Category</option>
            <option value="stationery">Stationery</option>
            <option value="furniture">Furniture</option>
            <option value="food">Food & Catering</option>
            <option value="digital">Digital Services</option>
            <option value="other">Other</option>
          </select>

          <select
            name="region"
            value={form.region}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="">Select Region</option>
            {TZ_REGIONS.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="district"
            value={form.district}
            onChange={handleChange}
            placeholder="District"
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
            required
          />

          <input
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="Contact info"
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
            required
          />

          <input
            type="url"
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="Website URL"
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
          />

          <label className="block text-gray-500 dark:text-gray-300 mt-4">
            Business Logo:
          </label>
          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full"
          >
            Create Service
          </button>
        </form>
      </div>
    </div>
  );
}

