import React, { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import { TZ_REGIONS } from "../constants";


export default function AddInstitutionModal({ isOpen, onClose,user }) {
  const { postData, getData } = useApi();
 
  const [form, setForm] = useState({
    name: "",
    owner:user,
    slug: "",
    type: "",
    stay: "all",
    gender: "mix",
    address: "",
    contact_phone: "",
    contact_email: "",
    website: "",
    regno: "",
    region: "",
    district: "",
    ward: "",
    motto: "",
    about: "",
    established_year: "",
    fee_min: "",
    fee_max: "",
    currency: "USD",
    capacity: 0,
    age_range: "",
    grades_offered: "",
    student_population: 0,
    accreditation: "",
    curriculums: [],
    programs: [],
    services: [],
    subjects: [],
    combinations: []
  });
  const [loading, setLoading] = useState(false);
  // const [rates, setRates] = useState({});
  // const [lookupData, setLookupData] = useState({
  //   curriculums: [],
  //   programs: [],
  //   services: [],
  //   subjects: [],
  //   combinations: []
  // });

   const handleBackdropClick = (e) => {
    // Only close if clicked on the backdrop itself
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // useEffect(() => {
  //   if (!isOpen) return;

  //   async function fetchData() {
  //     try {
        // const [curriculums, programs, services, subjects, combinations] = await Promise.all([
        //   getData("/curriculums/"),
        //   getData("/courses/"),
        //   getData("/services/"),
        //   getData("/subjects/"),
        //   getData("/combinations/")
        // ]);
        // setLookupData({ curriculums, programs, services, subjects, combinations });

  //       const res = await fetch("https://open.er-api.com/v6/latest/USD");
  //       const data = await res.json();
  //       if (data.result === "success") setRates(data.rates);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }

  //   fetchData();
  // }, [isOpen]);

  if (!isOpen) return null;

  const generateSlug = (text) =>
    text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;
    if (type === "select-multiple") {
      const values = Array.from(selectedOptions).map((opt) => parseInt(opt.value));
      setForm((prev) => ({ ...prev, [name]: values }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "name" && { slug: generateSlug(value) })
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        academic_detail: {
          capacity: form.capacity,
          age_range: form.age_range,
          grades_offered: form.grades_offered,
          student_population: form.student_population,
          accreditation: form.accreditation
        }
      };

      await postData("/institutions/", payload);
      setLoading(false);
      onClose();
      alert("Institution added successfully!");
      setForm({
        name: "", slug: "", type: "daycare", stay: "day", gender: "mix",
        address: "", region: "", district: "", ward: "", motto: "", about: "",
        established_year: "", fee_min: "", fee_max: "", capacity: 0,
        age_range: "", grades_offered: "", student_population: "", accreditation: "",
        curriculums: [], programs: [], services: [], subjects: [], combinations: []
      });
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Failed to add institution. Check console for details.");
    }
  };

  return (
    <div className="fixed inset-0 bg-blue-300 bg-opacity-50 dark:bg-gray-800 flex justify-center items-center z-50"
      onClick={handleBackdropClick}>
      <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-lg dark:bg-gray-700 dark:text-gray-100">
        <h2 className="text-2xl font-bold mb-4">Add Institution</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <h3>Meta details</h3>
          <input type="text" name="name" placeholder="Name of an Institution" value={form.name || ""} onChange={handleChange} required className="border p-2 rounded w-full" />
         
          <select name="type" value={form.type} onChange={handleChange} className="border p-2 rounded w-full dark:bg-gray-800">
            <option value="">Select Institution type</option>
            <option value="daycare">Daycare</option>
            <option value="primary">Primary</option>
            <option value="olevel">Olevel</option>
            <option value="advance">Advance</option>
            <option value="college">College</option>
            <option value="university">University</option>
          </select>
            <input type="text" name="motto" placeholder="Motto" value={form.motto} onChange={handleChange} className="border p-2 rounded w-full" />
          <input type="number" name="established_year" placeholder="Established Year" value={form.established_year} onChange={handleChange} className="border p-2 rounded w-full" required/>
          <input type="text" name="regno" placeholder="Registration Number" value={form.regno} onChange={handleChange} className="border p-2 rounded w-full" />
          <br /><br />
          <h3>Contact details</h3>
          <hr />
          
          <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} className="border p-2 rounded w-full" required />
          <input type="text" name="contact_phone" placeholder="Phone number" value={form.contact_phone} onChange={handleChange} className="border p-2 rounded w-full" required />
          <input type="email" name="contact_email" placeholder="Email" value={form.contact_email} onChange={handleChange} className="border p-2 rounded w-full" required />
          <input type="url" name="website" placeholder="Website url (eg. https://gemini.google.com)" value={form.website} onChange={handleChange} className="border p-2 rounded w-full" />

         
         <select
            name="region"
            value={form.region}
            onChange={handleChange}
            className="border p-2 rounded w-full dark:bg-gray-800"
            required
          >
            <option value="">Select Region</option>
            {TZ_REGIONS.map(region => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
         <input type="text" name="district" placeholder="District" value={form.district} onChange={handleChange} className="border p-2 rounded w-full" required />
          <input type="text" name="ward" placeholder="Ward" value={form.ward} onChange={handleChange} className="border p-2 rounded w-full" required />
           <br /><br />
          <h3>Fee details (Tanzanian Shillings)</h3>
          <hr />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
            </div>
            <input
              type="number"
              name="fee_min"
              placeholder="Minimum fee (Shs)"
              value={form.fee_min}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="number"
              name="fee_max"
              placeholder="Maximum fee (Shs)"
              value={form.fee_max}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="py-2 px-4 rounded bg-gray-300 hover:bg-gray-400 dark:text-gray-700">Cancel</button>
            <button type="submit" disabled={loading} className="py-2 px-4 rounded bg-indigo-600 text-white hover:bg-indigo-700">
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
