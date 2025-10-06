import { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";

export default function NoticeModal({
  notices,
  fetchNotices,
  open,
  onClose,
  onSuccess,
  institutionId,
  owner,      
  username,   
}) {
  
  const [selectedNotice, setSelectedNotice] = useState(null);
  const {getData,postData,deleteData,patchData}=useApi();
  const [formData, setFormData] = useState({
    institution_id:institutionId,
    title: "",
    content: "",
    start_date: "",
    end_date: "",
  });

  const isOwner = username === owner;


  useEffect(() => {
    if (open) fetchNotices();
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedNotice) {
        await patchData(`/notices/${selectedNotice.id}/`, {
          ...formData,
          institution: institutionId,
        });
      } else {
        await postData("/notices/", {
          ...formData,
          institution: institutionId,
        });
      }
      fetchNotices();
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this notice?")) {
      await deleteData(`/notices/${id}/`);
      fetchNotices();
      onSuccess?.();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-amber-200 dark:bg-black bg-opacity-40 flex items-center justify-center ">
      <div className="bg-white dark:bg-gray-800 max-h-130 overflow-y-auto dark:text-gray-300 rounded-lg p-7 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Institution Notices</h2>

        {/* Owner can create/edit */}
        {isOwner && (
          <form onSubmit={handleSubmit} className="space-y-3 mb-6">
            <input
              type="text"
              placeholder="Title"
              className="w-full border rounded p-2"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Content"
              className="w-full border rounded p-2"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
            <label htmlFor="">Notice apears from: </label>
            <input
              type="datetime-local"
              className="w-full border rounded p-2"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              required
            />
             <label htmlFor="">To: </label>
            <input
              type="datetime-local"
              className="w-full border rounded p-2"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              required
            />
            <button className="bg-green-600 text-white px-4 py-2 rounded">
              {selectedNotice ? "Update Notice" : "Create Notice"}
            </button>
          </form>
        )}
    
        {/* List Notices */}
        <div className="space-y-3 max-h-64 overflow-y-auto p-4">
          {notices?.map((n) => (
            <div key={n.id} className="border p-3 rounded shadow">
              <h3 className="font-bold">{n.title}</h3>
              <p>{n.content}</p>
              <p className="text-xs text-gray-500">
                {new Date(n.start_date).toLocaleString()} →{" "}
                {new Date(n.end_date).toLocaleString()}
              </p>

              {isOwner && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      setSelectedNotice(n);
                      setFormData({
                        title: n.title,
                        content: n.content,
                        start_date: n.start_date,
                        end_date: n.end_date,
                      });
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <button onClick={onClose} className="mt-4 w-full bg-gray-700 text-white py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
}
