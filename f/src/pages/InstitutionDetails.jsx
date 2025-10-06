import { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import { useParams } from "react-router-dom";
import UpdateInstitutionModal from "../components/UpdateInstitutionModal";
import { COMBINATIONS } from "../constants";
import { 
  PanelBottomClose, 
  PanelBottomOpen, 
  Verified, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  GraduationCap, 
  Users, 
  Edit,
  PlusCircle,
  EyeOffIcon,
  XIcon,
  EyeIcon,
  BookAIcon,
  PlusIcon,
  DownloadIcon,
  Trash2Icon,
  Megaphone
} from "lucide-react";
import UpdateLogoModal from "../components/UpdateLogoModal";
import Events from "../components/Events";
import AddMaterialModal from "../components/AddMaterialModal";
import Gallery from "../components/Gallery";
import NoticeModal from "../components/NoticeModal";



export default function InstitutionDetails() {
  const [isLoading, setIsLoading] = useState(false);
  const { getData,postData,deleteData,patchData } = useApi();
  const { instId } = useParams();
  const [inst, setInst] = useState({});
  const [progs, setProgs] = useState([]);
  const [combs, setCombs] = useState([]);
  const [subs, setSubs] = useState([]);
  const [acs, setAcs] = useState({});
  const [showp, setShowp] = useState(false);
  const [openNoticeModal, setOpenNoticeModal] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLogoModalOpen, setLogoModalOpen] = useState(false);
  const [selectedCombinations, setSelectedCombinations] = useState([]);
  const [showAddMaterial,setShowAddMaterial]=useState(false);
  const [newProgramForm,setNewProgramForm]=useState({
    institution:instId,
    name:'',
    duration:'',
    fee:'',
    type:'',
    delivery_mode:'',
    description:''
  });
const [isNewProgFormOpen,setNewProgFormOpen]=useState(false);
const [isNewCombsFormOpen,setNewCombsFormOpen]=useState(false);
const [editModalOpen, setEditModalOpen] = useState(false);
const [editingProgram, setEditingProgram] = useState(null); 
const [materials,setMaterials]=useState([]);
const [notices, setNotices] = useState([]);
const [editForm, setEditForm] = useState({
  name: "",
  duration: "",
  fee: "",
  type: "",
  delivery_mode: "",
  description: "",
});

const toggleAddMaterial=()=>{
  if(showAddMaterial){
    setShowAddMaterial(false)
  }else{
    setShowAddMaterial(true);
  }
}

const fetchMaterials = async () => {
    try {
      const res = await getData(`/institutions/${instId}/materials/`);
      // console.log("Materials here.....",res);
      setMaterials(res);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };


const handleSubmitCombs=async(e)=>{
   e.preventDefault();

    if (selectedCombinations.length === 0) {
      alert("Select at least one combination");
      return;
    }

    const data = {
      institution: instId,
      combinations: selectedCombinations
    };

    try{
      const res = await postData('/combinations/',data);
      getCombs();
      alert('Combination(s) added successfully!');

    }catch(e){
      console.log(e);
      alert("An error ocurred!")
    }finally{
      setNewCombsFormOpen(false);
    }
}

const handleEditProgram = (program) => {
  setEditingProgram(program);
  setEditForm({
    name: program.name,
    duration: program.duration,
    fee: program.fee,
    type: program.type,
    delivery_mode: program.delivery_mode,
    description: program.description || "",
  });
  setEditModalOpen(true); 
};

const handleEditChange = (e) => {
  const { name, value } = e.target;
  setEditForm((prev) => ({ ...prev, [name]: value }));
};

const handleEditSubmit = async (e) => {
  e.preventDefault();
  try {
    await patchData(`/programmes/${editingProgram.id}/update/`, editForm); 
    alert("Programme updated successfully!");
    setEditModalOpen(false);
    getProgrammes(); // refresh list
  } catch (err) {
    console.error(err);
    alert("Failed to update programme.");
  }
};


const toggleNewProgForm=()=>{
  if(isNewProgFormOpen === true){
    setNewProgFormOpen(false)
  }
  else{
    setNewProgFormOpen(true);
  }
}

const toggleNewCombForm=()=>{
  if(isNewCombsFormOpen === true){
    setNewCombsFormOpen(false)
  }
  else{
    setNewCombsFormOpen(true);
  }
}


const handleChange=(e)=>{
  const {name,value} = e.target;
  setNewProgramForm((prevData)=>({
    ...prevData,
    [name]:value
  }));
} 



const handleSubmit=async(e)=>{
  e.preventDefault();
  // console.log('Form submitted:',newProgramForm);
  try{
   const res = await postData("/programmes/",newProgramForm);
  //  console.log("Here is the res after submitting",res)
  getAll()
   alert("Programme added Successfully!")
  }catch(e){
    console.log(e);
    alert("Something went wrong..")
    
  }
  finally{
    setNewProgFormOpen(false);
  }
  
}


  const handleShowp = () => setShowp(!showp);

   const fetchUser = async () => {
    try {
      const data = await getData("/me");
      // console.log('Here is the user data',data);
      setUser(data);
    } catch (err) {
      console.error(err);
    } finally {
      
    }
  };

// console.log("Progs in state",progs);
  const getProgrammes = async () => {
    try { const res = await getData(`/programmes/${instId}/list/`);
     setProgs(res);
    //  console.log('Here is the res..',res)
    }
      catch(e){ 
        console.log(e);
       }
  }

   const getCombs = async () => {
    try {
    const res = await getData(`/combinations/${instId}/`); 
    // console.log("Nested....",res)
    setCombs(res);
   } 
    catch(e){ 
      console.log(e); }
  }

  const getAcDetails = async () => {
    try { const res = await getData(`/inst/ac_details/${instId}/`); setAcs(res[0]); } catch(e){ console.log(e); }
  }
 
  const getSubs = async () => {
    try { const res = await getData(`/inst/subs/${instId}/`); setSubs(res); } catch(e){ console.log(e); }
  }
  const getDetails = async () => {
    try { setIsLoading(true); const res = await getData(`/inst_details/${instId}/`);setInst(res); } catch(e){ console.log(e) } finally { setIsLoading(false); }
  }


const getAll = () => {
    fetchUser();
    getDetails();
    getProgrammes();
    getAcDetails();
    getCombs();
    getSubs();
    fetchMaterials();
    fetchNotices();
  }

  const handleDeleteProgram = async (programId) => {
  if (!confirm("Are you sure you want to delete this programme?")) return;

  try {
    await deleteData (`/programmes/${programId}/delete/`); 
    alert("Programme deleted successfully!");
    getProgrammes(); // Refresh the list
  } catch (err) {
    console.error(err);
    alert("Failed to delete programme.");
  }
};



const handleDeleteMteral = async (materialId) => {
  if (!confirm("Are you sure you want to delete this Material?")) return;
  try {
    await deleteData (`/materials/${materialId}/delete/`); 
    alert("Material deleted successfully!");
    fetchMaterials(); 
  } catch (err) {
    console.error(err);
    alert("Failed to delete material.");
  }
};


const fetchNotices = async () => {
    try {
      const res = await getData(`/institution/${instId}/notices/`);
     console.log(res)
      setNotices(res);
    } catch (err) {
      console.error(err);
    }
  };




const handleDeleteComb = async (combId) => {
  if (!confirm("Are you sure you want to delete this combination?")) return;

  try {
    await deleteData (`/combinations/${combId}/delete/`); 
    alert("Combination deleted successfully!");
    getCombs(); // Refresh the list
  } catch (err) {
    console.error(err);
    alert("Failed to delete combination.");
  }
};


 
  const formatNumber = (num) => {
    if (!num && num !== 0) return "N/A";
    return Number(num).toLocaleString();
  }

  const dict1 = {
    "all":"Day and Boarding",
    "day":"Day only",
    "boarding":"Boarding only"
  }

  const dict2 = {
    "mix":"Mixture (boys and girls)",
    "boys":"Boys only",
    "girls":"Girls only"
  }

  useEffect(() => { getAll() }, []);

  

  if (isLoading) return <p className="p-6 text-gray-600 dark:text-gray-100">Loading institution details...</p>;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white shadow-xl rounded-2xl p-8 max-w-4xl mx-auto dark:from-slate-800 dark:to-slate-600 my-2">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="relative">
          <img 
            src={inst.logo || "/def_logo.png"} 
            alt="Logo"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-500 shadow-md"
          />

          {user?.username === inst?.owner && (
            <button
              title="Edit logo"
              onClick={() => setLogoModalOpen(true)}
              className="absolute top-1 right-1 bg-indigo-600 text-white p-1.5 rounded-full shadow hover:bg-indigo-700"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
        </div>

        <UpdateLogoModal
          isOpen={isLogoModalOpen}
          onClose={() => setLogoModalOpen(false)}
          instId={instId}
          onUpdated={getAll}
        />


        <div className="flex items-center gap-2 mt-4">
          <h2 className="text-3xl font-extrabold text-gray-800  dark:text-gray-300">{inst.name}</h2>
          
           
          {inst.is_verified && <Verified className="text-blue-500 w-6 h-6" />}
        </div>
        <span className="text-sm text-gray-500  dark:text-gray-200 italic">({inst.type})</span>
        {inst.motto && <p className="text-indigo-600  dark:text-yellow-300 font-medium mt-2">“{inst.motto}”</p>}
      </div>


      {/* Core info */}
      <div className="flex justify-self-end">
        
          {user?.username === inst?.owner && 
              <button
        onClick={() => setModalOpen(true)}
        className="mt-2 p-2 bg-indigo-600 text-white rounded flex justify-between"
      >
        <Edit /> <span className="mx-1">Edit</span>
      </button>
          }
      </div>
      <div className="grid md:grid-cols-2 gap-6 text-gray-700  dark:text-gray-400 mt-6">
        <div className="space-y-2">
          <p><strong>Reg. Number:</strong> {<span className="text-gray-900  dark:text-gray-100">{inst.regno}</span> || <span className="text-gray-400  dark:text-gray-200">Not available</span>}</p>
          <p><strong>Established:</strong> { <span className="text-gray-900  dark:text-gray-100">{inst.established_year}</span> || <span className="text-gray-400  dark:text-gray-200">Not available</span>}</p>
          {(inst.type === 'collge' || inst.type === 'university') && 
          <p><strong>Population:</strong> { <span className="text-gray-900  dark:text-gray-100">{acs?.student_population}</span> || <span className="text-gray-400  dark:text-gray-200">Not available</span>}</p>
          }
          {(inst.type === 'primary' || inst.type ==='olevel' || inst.type === 'advance') && 
          <>
            <p><strong>Stay:</strong> <span className="text-gray-900  dark:text-gray-100">{dict1[inst.stay]}</span></p>
            <p><strong>Gender:</strong> <span className="text-gray-900  dark:text-gray-100">{dict2[inst.gender]}</span> </p>
          </>
          }        
          <p>
            {inst.fee_min === inst.fee_max ? (
              <>
                <strong>Fee: </strong> <span  className="text-yellow-800 font-bold text-l  dark:text-yellow-300">{ formatNumber(inst.fee_min) }</span>
              </>
            ):(
              <>
                <strong>Fee range:</strong> <span  className="text-yellow-800 font-bold text-l  dark:text-yellow-300">{ formatNumber(inst.fee_min) } - {formatNumber(inst.fee_max) }</span>

              </>
            )}
            <span className="text-green-700 font-bold mx-1 text-l">Tshs</span>
          </p>
  

          {/* Button to open Notice Modal */}
        <button
          onClick={() => setOpenNoticeModal(true)}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded flex gap-1"
        >
          <span className="hidden sm:inline">Notices</span>
          <Megaphone /> 
          <span className="text-gray-900 font-extrabold bg-amber-400 rounded-full px-2">{notices.length}</span>
        </button>

        </div>
        <div className="space-y-2  bg-indigo-50 dark:bg-gray-800 rounded-xl shadow-inner p-4">
          <h4 className="text-indigo-800 dark:text-gray-300 font-semibold">Contact Information</h4>
          <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-rose-500"/> {inst.region}, {inst.district} – {inst.ward}</p>
          <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-green-600"/> {inst.contact_phone || <span className="text-gray-400">Not available</span>}</p>
          <p className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-pink-600" />
            {inst.contact_email ? (
              <a href={`mailto:${inst.contact_email}`} className="text-pink-600 hover:underline">{inst.contact_email}</a>
            ) : <span className="text-gray-400">Not available</span>}
          </p>
          <p className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            {inst.website ? (
              <a href={inst.website.startsWith("http") ? inst.website : `https://${inst.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{inst.website}</a>
            ) : <span className="text-gray-400">Not available</span>}
          </p>
          <p className="items-center mt-3 "><span className="font-semibold text-indigo-600">Address</span> <br /> <span> {inst.address || <span className="text-gray-400">Not available</span>}</span></p>
        </div>
      </div>

          <NoticeModal
          notices={notices}
          fetchNotices={fetchNotices}
              open={openNoticeModal}
              onClose={() => setOpenNoticeModal(false)}
              onSuccess={getAll}
              institutionId={instId}
              owner={inst?.owner}
              username={user?.username}
            />


      
      

      {/* Academic details */}
        
        {inst.type !== 'advance' &&      
         <div className="mt-8 bg-indigo-50 dark:bg-gray-800 rounded-xl p-4 shadow-inner">
        <h3 className="text-lg font-semibold text-indigo-800 dark:text-gray-300 mb-3 flex items-center gap-2"><GraduationCap className="w-5 h-5"/> Other Information</h3>
        {inst.type === "daycare" && (
          <div className="space-y-1">
            <p className="dark:text-gray-300">Age range (years): {acs?.age_range || <span className="text-gray-400">Not available</span>}</p>
            <p className="dark:text-gray-300">Capacity: {acs?.capacity || <span className="text-gray-400">Not available</span>}</p>
          </div>
        )}
        {inst.type === "primary" && (
          <p className="dark:text-gray-100">Grades offered: {acs?.grades_offered || <span className="text-gray-400">Not available</span>}</p>
        )}
        {(inst.type === "college" || inst.type === "university") && (
          <div className="space-y-1 dark:text-gray-400">
            {/* <p className="flex items-center gap-2"><Users className="w-4 h-4 text-indigo-600"/> Population: {acs?.student_population || <span className="text-gray-400">Not available</span>}</p> */}
            <p className="flex items-center gap-2"><span><BookAIcon  className="w-4 h-4 text-indigo-600" /></span>Accreditation: {acs?.accreditation || <span className="text-gray-400">Not available</span>}</p>
          </div>
        )}
      </div>}

      {/* Programmes / Combinations / Subjects */}
      <div className="mt-8">
        {(inst.type === "college" || inst.type === "university") && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button onClick={handleShowp} className="flex items-center gap-2  dark:hover:text-amber-200 text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 font-medium">
              {showp ? <>Hide programmes <EyeOffIcon className="w-4 h-4"/> </> : <>Show programmes <EyeIcon className="w-4 h-4"/>(<span className="text-blue-400">{progs.length}</span>) </>}
            </button>
            {user?.username === inst.owner &&
            <button onClick={toggleNewProgForm} className="flex gap-2 border border-gray-500 rounded p-2 hover:bg-blue-600 hover:text-gray-100 dark:text-gray-200">
              {isNewProgFormOpen ? (<><XIcon /> Hide form</>):(
                <>
                  <PlusCircle />
              <span>Add Programe</span>
                </>
              )}
            </button>
            }
            </div>
            {isNewProgFormOpen  && <div className="bg-gray-100 dark:bg-gray-800 dark:text-gray-200 rounded w-full p-3 mt-2"> 
              <form onSubmit={handleSubmit} >
                <h3 className="text-gray-400 font-bold text-2xl">New Programme</h3>
                <input type="text" name="name" value={newProgramForm.name} placeholder="Programme name" className="w-full mt-2 border border-blue-600 rounded p-2 mb-2" onChange={handleChange} required />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">

                  <input type="number" name="duration" value={newProgramForm.duration} placeholder="Duration in years" className="border rounded p-2 border-blue-600 w-full" onChange={handleChange} required />
                  <input type="number" name="fee" value={newProgramForm.fee} placeholder="Tution fee in Tshs per year" className="border rounded p-2 border-blue-600 w-full" onChange={handleChange} required />
                  
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  
                  <select name="type" value={newProgramForm.type} onChange={handleChange} 
                  className="border border-blue-600 rounded p-2  dark:bg-gray-800 w-full" required>
                    <option value="">Select programme type</option>
                    <option value="certificate">Certificate</option>
                    <option value="diploma">Diploma</option>
                    <option value="bachelor">Bachelor</option>
                    <option value="master">Master</option>
                    <option value="phd">PhD</option>
                  </select>

                   <select name="delivery_mode" value={newProgramForm.delivery_mode} onChange={handleChange} required
                    className="border border-blue-600 rounded p-2  dark:bg-gray-800 w-full">
                  <option value="">Select delivery mode</option>
                  <option value="on_campus">On Campus</option>
                  <option value="online">Online</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                                  
                </div>
                <div className="my-3">
                  <textarea name="description" value={newProgramForm.description} 
                  onChange={handleChange}
                  className="border dark:text-gray-200 border-blue-600 rounded p-2  dark:bg-gray-800 w-full" 
                  placeholder="More description about the program (Optional)">
                  </textarea>
                </div>
                <button type="submit"  className="text-gray-100 bg-blue-700 rounded p-2 flex justify-self-end">Submit</button>
              </form>
            </div>}
            {showp && (
                <>
                <h3 className="text-2xl text-gray-500 font-semibold">Programmes Offered ({progs.length})</h3>
                <div className="mt-6 space-y-4 max-h-60 p-3 overflow-y-auto">
                  {progs.length === 0 ? (
                    <p className="text-center text-gray-400 dark:text-gray-500">No programmes available.</p>
                  ) : (
                    progs.map((p, index) => (
                      <div
                        key={p.id}
                        className="bg-white dark:bg-gray-800 shadow rounded-lg 
                        p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between 
                        gap-2 md:gap-0"
                      >
                        {/* Left info */}
                        <div className="flex-1 space-y-1">
                          <p className="text-gray-700 dark:text-gray-200 font-medium">
                            <span className="font-semibold">#{index + 1}</span> {p.name}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>Type: {p.type}</span>
                            <span>Duration: {p.duration} yrs</span>
                            <span>Fee: {p.fee.toLocaleString()} Tshs</span>
                            <span>Mode: {p.delivery_mode?.replace("_", " ") || "Not provided"}</span>
                          </div>
                          {p.description && (
                            <p className="text-gray-600 dark:text-gray-300 truncate md:truncate-none">
                              {p.description}
                            </p>
                          )}
                       </div>

                      {/* Actions */}
                      {user.username === inst.owner &&
                        <div className="flex gap-2 mt-2 md:mt-0">
                        <button
                          onClick={() => handleEditProgram(p)}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProgram(p.id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded"
                          title="Delete"
                        >
                          <XIcon className="w-5 h-5" />
                        </button>
                      </div>
                          }
                    </div>
                  ))
                )}
              </div>
                </>
            )}
          </div>
        )}

        {inst.type === "advance" && (
          <div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <button onClick={handleShowp} className="flex items-center gap-2  dark:hover:text-amber-200 dark:text-indigo-300 text-indigo-600 hover:text-indigo-800 font-medium">
                    {showp ? <>Hide combinations <PanelBottomOpen className="w-4 h-4"/> </> : <>Show combinations <PanelBottomClose className="w-4 h-4"/> </>}
                  </button>
                </div>
                {user?.username === inst.owner && 
                <div>
                  <button onClick={toggleNewCombForm} className="flex gap-2 border border-gray-500 rounded p-2
                   hover:bg-blue-600 hover:text-gray-100 dark:text-gray-200">
                    {isNewCombsFormOpen ? (<><XIcon /> Hide form</>):(
                      <>
                        <PlusCircle />
                    <span>Add Combinations</span>
                      </>
                    )}
                  </button>

                </div>
                }
                
               </div>
              {isNewCombsFormOpen && <div>
                <form onSubmit={handleSubmitCombs} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 text-gray-700">Add Combinations</h2>
                  <div className="mb-4">
                    <label className="block text-gray-600 font-medium mb-2">Combinations:</label>
                    <select
                      multiple
                      value={selectedCombinations}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, opt => opt.value);
                        setSelectedCombinations(selected);
                      }}
                      className="w-full border border-gray-300 rounded-md p-2 h-32
                       focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                       overflow-x-scroll
                       "
                    >
                      {COMBINATIONS.map(c => (
                        <option key={c} value={c} className="p-1">{c}</option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-400 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple.</p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                  >
                    Add Combinations
                  </button>
                </form>

               </div>
                
                }
            {showp && (
              <>
                <div className="max-w-4xl mx-auto p-4">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Combinations</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
                    {combs?.map((comb, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-800  border border-gray-200 rounded-lg shadow-sm p-4 flex items-center justify-between hover:shadow-lg transition-shadow duration-200"
                      >
                        <span className="text-gray-800 dark:text-gray-200 font-medium">{comb.combination}</span>
                        {user.username === inst.owner && 
                        <button
                          onClick={() => handleDeleteComb(comb.id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded justify-self-end"
                          title="Delete"
                        >
                          <XIcon className="w-5 h-5" />
                        </button>
                        }
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {(inst.type === "primary" || inst.type === "olevel") && (
          <div>
            <button onClick={handleShowp} className="flex items-center gap-2 dark:text-indigo-300 dark:hover:text-amber-200 text-indigo-600 hover:text-indigo-800 font-medium">
              {showp ? <>Hide subjects <PanelBottomOpen className="w-4 h-4"/> </> : <>Show subjects <PanelBottomClose className="w-4 h-4"/> </>}
            </button>
            {showp && (
              <ul className="mt-3 space-y-2 list-disc list-inside text-gray-700">
                {subs.map(p => <li key={p.subject.id}>{p.subject.name}</li>)}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* About */}
      <div className="mt-10 bg-gray-50 rounded-xl p-6 shadow-sm dark:bg-gray-800">
        <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-300 mb-3">About Us</h4>
        <p className="text-gray-600 leading-relaxed">{inst.about || "No description available."}</p>
      </div>

      {/* Events */}
      <div className="mt-10 bg-gray-50 rounded-xl p-2 shadow-sm dark:bg-gray-800">
        <Events instId={instId} username={user?.username} owner={inst?.owner} />
      </div>

      {/* DOwnload materials */}
      <div className="mt-10 bg-gray-50 rounded-xl p-3 shadow-sm dark:bg-gray-800 dark:text-gray-200">
        <div className="flex justify-between"> 
          <h3 className="text-gray-900  dark:text-gray-100 text-xl font-bold">Official Documents</h3>
          {user?.username === inst?.owner &&
            <button onClick={toggleAddMaterial} className=" flex gap-1 border border-gray-400 rounded px-2 py-1">
            {showAddMaterial ? <XIcon /> : <PlusIcon />}
            <span className="hidden sm:inline">{showAddMaterial ? "Close form":"Add material"}</span>
          </button>
          }
        </div>
        {showAddMaterial && 
         <AddMaterialModal instId={instId}  fetchMaterials={fetchMaterials}  setShowAddMaterial={setShowAddMaterial}/>
        }
      {materials.length > 0 ? (
      <div className="space-y-3 my-3">
        {materials.map((m) => (
          <div
            key={m.id}
            className="p-4 bg-white dark:bg-gray-700 rounded-xl shadow hover:shadow-md transition flex justify-between items-center"
          >
            {/* Download Link */}
            <a
              href={m.material}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-950 dark:text-blue-200 font-medium hover:underline"
            >
              {m.name || "Untitled Material"}
            </a>

           <div className="flex justify-between">
             
            <a
              href={m.material}
              download
              className="text-white px-3 py-1.5 rounded-lg transition"
            >
              <DownloadIcon className="dark:text-blue-300 text-blue-950"/>
            </a>
            {inst?.owner === user?.username && 
                <button className="text-red-500" onClick={()=>handleDeleteMteral(m.id)}><Trash2Icon /></button>
            }
           </div>
          </div>
        ))}
      </div>
      ):(
        <span>No materials added</span>
      )}

      {/* Gallery */}
      <div className="mt-10 bg-gray-50 rounded-xl p-2 shadow-sm dark:bg-gray-800">
        <Gallery instId={instId} owner={inst?.owner} user={user?.username}/>
      </div>

      </div>

      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md dark:text-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Edit Programme</h3>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <label htmlFor="">Name</label>
              <input type="text" name="name" value={editForm.name} onChange={handleEditChange} className="w-full border rounded p-2" required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div><label className="mx-2" htmlFor="Duration">Duration</label>
                <input type="number" name="duration" value={editForm.duration} onChange={handleEditChange} className="border rounded p-2" required />
               </div>
                <div>
                  <label className="mx-2" htmlFor="">Fee</label>
                <input type="number" name="fee" value={editForm.fee} onChange={handleEditChange} className="border rounded p-2" required />
                </div>
                </div>
              <div className="grid grid-cols-2 gap-3">
                <select name="type" value={editForm.type} onChange={handleEditChange} className="border rounded p-2 dark:bg-gray-800" required>
                  <option value="">Select type</option>
                  <option value="certificate">Certificate</option>
                  <option value="diploma">Diploma</option>
                  <option value="bachelor">Bachelor</option>
                  <option value="master">Master</option>
                  <option value="phd">PhD</option>
                </select>
                <select name="delivery_mode" value={editForm.delivery_mode} onChange={handleEditChange} className="border rounded dark:bg-gray-800 p-2" required>
                  <option value="">Select mode</option>
                  <option value="on_campus">On Campus</option>
                  <option value="online">Online</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <textarea name="description" value={editForm.description} onChange={handleEditChange} className="border rounded p-2 w-full" placeholder="Description"></textarea>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setEditModalOpen(false)} className="px-4 py-2 rounded border">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Update Modal */}
      <UpdateInstitutionModal
        isOpen={isModalOpen}
        ownerId={user?.id}
        onClose={() => setModalOpen(false)}
        institution={inst}
        onUpdated={getAll} 
      />
    </div>
  );
}
