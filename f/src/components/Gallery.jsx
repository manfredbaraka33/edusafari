import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { TrashIcon, FullscreenIcon } from "lucide-react";

export default function Gallery({ instId,user,owner }) {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const {getData,postData,patchData,deleteData}=useApi();
  const [activeItem, setActiveItem] = useState(null);
  const [fullscreenItem, setFullscreenItem] = useState(null);


  const loadGallery=async()=>{
    try{
         const res = await getData(`/institutions/${instId}/gallery/`);
        //  console.log("Here is the data that we have for gallery....",res);
         setItems(res)
    }catch(e){
        console.log(e)
    }
  }

  // Load gallery items
  useEffect(() => {
   loadGallery()
      
  }, [instId]);

  // Add new image
  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);
    formData.append("institution", instId);

  //   console.log(formData);
  //    // 🔹 Debug FormData
  // for (let [key, value] of formData.entries()) {
  //   console.log(key, value);
  // }

    try{
        const res = await postData("/institutions/gallery/add/",formData);
    // console.log("Trying to add images")
    // const newItem = await res.json();
    // setItems([newItem, ...items]);
    setTitle("");
    setImage(null);
   
    }catch(err){
        alert("An error occured!")
        console.log(err)
        
    }finally{
         loadGallery();
    }
    
  };

  // Delete item
  const handleDelete = async (id) => {
    if(!confirm("Are you sure you want to delete this gallery item?")) return;
    try{
    await deleteData(`/gallery/${id}/delete/`);
    setItems(items.filter((item) => item.id !== id));
    alert("Gallery Item deleted!")
    }catch(e){
        console.log("An erro durong deleting..",e);
        alert("An error ocurred!")
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">Gallery</h2>

      {/* Add form */}
      <div>
        {owner === user &&
       <form onSubmit={handleAdd} className="mb-6">
        <div className="grid grid-cols-1 gap-3  md:grid-cols-2">
            <input
          type="text"
          value={title}
          placeholder="Title eg. On graduation day (optional)"
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded-lg  dark:bg-gray-700 dark:text-white w-full my-1"
        /> 
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="p-2 border rounded-lg dark:bg-gray-700 dark:text-white cursor-pointer w-full my-1"
        />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mt-3"
        >
          Upload
        </button>
      </form>
     }
      </div>
      {/* Gallery Grid */}
  
      {items.length > 0 ? (
              <div className="overflow-x-auto whitespace-nowrap py-3 px-2 h-96 hide-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative group bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden"
             onClick={() => setActiveItem(item.id === activeItem ? null : item.id)}
          >
            <img src={`https://edusafari.onrender.com${item.image}`} alt={item.title} className="w-full h-40 object-cover" />
            <div className="p-2">
              <p className="text-sm font-medium dark:text-gray-200">{item.title}</p>
            </div>

           {owner === user && (activeItem === item.id || window.innerWidth >= 640) && (
            <>
            <button
            onClick={(e) => {
                e.stopPropagation(); // prevent toggling again
                handleDelete(item.id);
            }}
            className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded transition"
            >
            <TrashIcon size={16} />
            </button>
            <button
                onClick={(e) => {
                e.stopPropagation();
                setFullscreenItem(item);
                }}
                className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded opacity-80 hover:opacity-100 transition"
            >
                <FullscreenIcon size={16} />
            </button>
            </>
        )}

          </div>
      ))}
      </div>
      </div>
      ):(
        <span>No gallery items added</span>
      )}

      {fullscreenItem && (
        <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={() => setFullscreenItem(null)}
        >
            <img
            src={`https://edusafari.onrender.com${fullscreenItem.image}`}
            alt={fullscreenItem.title}
            className="max-h-full max-w-full object-contain"
            />
            <button
            onClick={() => setFullscreenItem(null)}
            className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded"
            >
            Close
            </button>
        </div>
        )}

    </div>
  );
}
