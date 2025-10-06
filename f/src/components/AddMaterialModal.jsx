
import React,{useState} from 'react'
import { useApi } from '../hooks/useApi'

const AddMaterialModal = ({instId,fetchMaterials,setShowAddMaterial}) => {
  const {postData} = useApi();
  const [title,setTitle]=useState("");
  const [file, setFile] = useState(null);

  const sendMaterial = async(e)=>{
    e.preventDefault();
    const formData = new FormData();
    formData.append("material", file);        
    formData.append("title", title);
    formData.append("institution", instId);

    try {
      const res = await postData('/institutions/material/add/', formData, true); 
      setShowAddMaterial(false)
      // console.log("Feedback after sending material..", res);
      fetchMaterials();
      alert("Material submitted successfully!");
    } catch(err) {
      console.log(err);
      alert("An error occurred!");
    }
  }

  return (
    <div className='bg-gray-300 dark:bg-gray-700 p-2 rounded my-2'>
      <h3 className='text-gray-900 dark:text-gray-200 font-medium my-2'>Add material</h3>
      <form onSubmit={sendMaterial}>
        <div className="grid md:grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="File name e.g Joining Instructions"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="file"
            onChange={(e)=>setFile(e.target.files[0])}   // set file properly
            className="border p-2 rounded cursor-pointer"
            
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 mt-2 rounded">
          Add Material
        </button>
      </form>
    </div>
  )
}

export default AddMaterialModal
