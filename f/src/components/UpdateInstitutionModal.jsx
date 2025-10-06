import { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";


export default function UpdateInstitutionModal({ isOpen, onClose, institution, onUpdated,ownerId }) {
  const { patchData, getData } = useApi();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const { logo, banner, ...formWithoutFiles } = form;
 

   const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (institution) {
      setForm({
        ...institution,
        fee_min: institution.fee_min || 0,
        fee_max: institution.fee_max || 0,
        capacity: institution.academic_detail?.capacity || 0,
        age_range: institution.academic_detail?.age_range || "",
        grades_offered: institution.academic_detail?.grades_offered || "",
        student_population: institution.academic_detail?.student_population || 0,
        accreditation: institution.academic_detail?.accreditation || "",
      });
    }
  }, [institution]);

  if (!isOpen) return null;

 
  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;
    if (type === "select-multiple") {
      const values = Array.from(selectedOptions).map((opt) => parseInt(opt.value));
      setForm((prev) => ({ ...prev, [name]: values }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

 


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!institution) return;
    setLoading(true);

    try {

      const payload = {
        ...formWithoutFiles,
        stay:form.stay,
        gender:form.gender,
        owner: ownerId,
        academic_detail: {
          capacity: form.capacity,
          age_range: form.age_range,
          grades_offered: form.grades_offered,
          student_population: form.student_population,
          accreditation: form.accreditation,
        },
      };

      console.log("Here is the payload",payload);

      await patchData(`/institutions/update/${institution.id}/`, payload);
      setLoading(false);
      onClose();
      if (onUpdated) onUpdated();
      alert("Institution updated successfully!");
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Failed to update institution. Check console for details.");
    }
  };

  const typeSpecificFields = () => {
    switch (form.type) {
      case "daycare":
        return (
          <>
          <label className="text-indigo-400 font-semibold mt-3" htmlFor="capacity">Capacity</label>
            <input type="number" name="capacity" placeholder="Capacity" value={form.capacity} onChange={handleChange} className="border p-2 rounded w-full" />
            <input type="text" name="age_range" placeholder="Age Range in years" value={form.age_range} onChange={handleChange} className="border p-2 rounded w-full" />
          </>
        );
      case "primary":
      case "olevel":
        return (
          <>
          <label className="text-indigo-400 font-semibold mt-3" htmlFor="type">Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="boys">Boys</option>
            <option value="girls">Girls</option>
            <option value="mix">Mixture</option>
          </select>

          <label className="text-indigo-400 font-semibold mt-3" htmlFor="type">Stay type</label>
          <select name="stay" value={form.stay} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="day">Day</option>
            <option value="boarding">Boarding</option>
            <option value="all">All</option>
          </select>
          </>
        );
      case "advance":
        return (
          <>
          <label className="text-indigo-400 font-semibold mt-3" htmlFor="type">Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="boys">Boys</option>
            <option value="girls">Girls</option>
            <option value="mix">Mixture</option>
          </select>

          <label className="text-indigo-400 font-semibold mt-3" htmlFor="type">Stay type</label>
          <select name="stay" value={form.stay} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="day">Day</option>
            <option value="boarding">Boarding</option>
            <option value="all">All</option>
          </select>
          </>
        );
      case "college":
      case "university":
        return (
          <>
            <label className="text-indigo-400 font-semibold mt-3" htmlFor="student_population">Student population</label>
            <input type="number" name="student_population" placeholder="Student Population" value={form.student_population} onChange={handleChange} className="border p-2 rounded w-full" />
            <label className="text-indigo-400 font-semibold mt-3" htmlFor="accreditation">Accreditation</label>
            <input type="text" name="accreditation" placeholder="Accreditation" value={form.accreditation} onChange={handleChange} className="border p-2 rounded w-full" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-blue-300 dark:bg-gray-800 bg-opacity-10 flex justify-center items-center z-50" onClick={handleBackdropClick}>
      <div className="bg-white dark:bg-gray-700 dark:text-gray-200 p-6 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Update Institution</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          
            <h3 className="text-indigo-900 font-bold dark:text-blue-200 mt-3">Meta details</h3>
            <hr />
            <label className="text-indigo-400 font-semibold mt-0" htmlFor="name">Institution name</label>
          <input type="text" name="name" value={form.name || ""} onChange={handleChange} required className="border p-2 rounded w-full" />
          <label className="text-indigo-400 font-semibold mt-3" htmlFor="type">Institution type</label>
          <select name="type" value={form.type} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="daycare">Daycare</option>
            <option value="primary">Primary</option>
            <option value="olevel">Olevel</option>
            <option value="advance">Advance</option>
            <option value="college">College</option>
            <option value="university">University</option>
          </select>
          <label className="text-indigo-400 font-semibold mt-3" htmlFor="motto">Institution motto (optional)</label>
          <input type="text" name="motto" placeholder="Motto" value={form.motto} onChange={handleChange} className="border p-2 rounded w-full" />
          <label className="text-indigo-400 font-semibold mt-3" htmlFor="established_year">Established year</label>
          <input type="number" name="established_year" placeholder="Established Year" value={form.established_year} onChange={handleChange} className="border p-2 rounded w-full" />
          <label className="text-indigo-400 font-semibold mt-3" htmlFor="regno">Registration Number</label>
          <input type="text" name="regno" placeholder="Registration Number" value={form.regno} onChange={handleChange} className="border p-2 rounded w-full" />
          <br /><br />
          <h3 className="text-indigo-900 font-bold dark:text-blue-200 mt-3">Contact details</h3>
          <hr />
          <label className="text-indigo-400 font-semibold mt-0" htmlFor="address">Institution Address</label>
          <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} className="border p-2 rounded w-full" />
          <label className="text-indigo-400 font-semibold mt-3" htmlFor="contact_phone">Institution phone</label>
          <input type="text" name="contact_phone" placeholder="Phone number" value={form.contact_phone} onChange={handleChange} className="border p-2 rounded w-full" />
          <label className="text-indigo-400 font-semibold mt-3" htmlFor="email">Institution email</label>
          <input type="email" name="contact_email" placeholder="Email" value={form.contact_email} onChange={handleChange} className="border p-2 rounded w-full" />
          <label className="text-indigo-400 font-semibold mt-3" htmlFor="website">Institution website</label>
          <input type="url" name="website" placeholder="Website url (eg. https://gemini.google.com)" value={form.website} onChange={handleChange} className="border p-2 rounded w-full" />
         
         <label className="text-indigo-400 font-semibold mt-3" htmlFor="region">Region</label>
          <input type="text" name="region" placeholder="Region" value={form.region} onChange={handleChange} className="border p-2 rounded w-full" />
          <label className="text-indigo-400 font-semibold mt-3" htmlFor="district">District</label>
          <input type="text" name="district" placeholder="District" value={form.district} onChange={handleChange} className="border p-2 rounded w-full" />
          <label className="text-indigo-400 font-semibold mt-3" htmlFor="ward">Ward</label>
          <input type="text" name="ward" placeholder="Ward" value={form.ward} onChange={handleChange} className="border p-2 rounded w-full" />
           
        {typeSpecificFields()}

          {/* Fee details with flags */}
          <h3 className="text-indigo-900 font-bold dark:text-blue-200 mt-8">Fee Details</h3>
          <hr />
         
          <label className="text-indigo-400 font-semibold mt-0" htmlFor="name">Minimum Fee</label>
          <input
            type="number"
            name="fee_min"
            placeholder={"Minimum Fee"}
            value={form.fee_min}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <label className="text-indigo-400 font-semibold mt-0" htmlFor="name">Maximum Fee</label>
          <input
            type="number"
            name="fee_max"
            placeholder={"Maximum Fee in"}
            value={form.fee_max}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          /> <br /> <br />
          <label className="text-blue-200 font-semibold mt-3" htmlFor="name">About (Optional)</label>
          <textarea name="about" placeholder="About (optional)" value={form.about} onChange={handleChange} className="border p-2 rounded w-full" />

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="py-2 px-4 rounded bg-gray-300 text-gray-900 hover:bg-gray-400">Cancel</button>
            <button type="submit" disabled={loading} className="py-2 px-4 rounded bg-indigo-600 text-white hover:bg-indigo-700">
              {loading ? "Saving..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
