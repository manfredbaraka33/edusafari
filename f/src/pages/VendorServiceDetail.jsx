import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ThumbsUp, MessageCircle, VerifiedIcon } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { format } from "timeago.js";

export default function VendorServiceDetail() {
  const { id } = useParams();
  const { getData, postData } = useApi();
  const [service, setService] = useState(null);
  const [comment, setComment] = useState("");

  const getService = async () => {
    try {
      const res = await getData(`/services/${id}/`);
      console.log("Here is the service;..", res);
      setService(res);
    } catch (err) {
      console.error("Error fetching service:", err);
    }
  };

  useEffect(() => { getService(); }, [id]);

  const handleVote = async () => {
    try {
      await postData(`/services/${id}/vote/`);
      getService();
    } catch (err) { console.error("Error voting:", err); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const newComment = await postData(`/services/${id}/comment/`, { text: comment });
      setService({ ...service, comments: [newComment, ...service.comments] });
      setComment("");
    } catch (err) { console.error("Error commenting:", err); }
  };

  if (!service) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={`http://localhost:8000${service.logo}` || "/def_logo.png"}
            alt={service.name}
            className="w-20 h-20 rounded-full border border-amber-500"
          />
          <div>
            <div className="flex gap-2">
              <h2 className="text-2xl font-bold dark:text-white">{service.name}</h2>
            {service.is_verified && 
            <VerifiedIcon className="text-blue-500" />
            }
            </div>
            <p className="text-gray-600 dark:text-gray-300">{service.category}</p>
          </div>
        </div>

        <p className="text-gray-700 dark:text-gray-200 mb-4">{service.description}</p>

        {service.website && (
          <a
            href={service.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-4"
          >
            Visit Website
          </a>
        )}

        {service.contact && (
          <p className="mb-4 text-gray-600 dark:text-gray-300">Contact: {service.contact}</p>
        )}

        {/* Images carousel */}
        {service.images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto mb-4">
            {service.images.map((img) => (
              <img
                key={img.id}
                src={`http://localhost:8000${img.image}`}
                alt="service"
                className="w-32 h-32 object-cover rounded-lg"
              />
            ))}
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <button
            onClick={handleVote}
            className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-500"
          >
            <ThumbsUp size={18} /> {service.votes_count || 0}
          </button>
          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
            <MessageCircle size={18} /> {service.comments.length}
          </span>
        </div>

        <form onSubmit={handleComment} className="mb-4 flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 border rounded-lg p-2 dark:bg-gray-700 dark:text-white w-full"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Post
          </button>
        </form>

        <div className="space-y-3">
          {service.comments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
          ) : (
            service.comments.map((c) => (
              <div key={c.id} className="border-b border-gray-200 dark:border-gray-700 pb-2">
                <p className="text-sm font-semibold dark:text-gray-200 flex gap-2 my-1">
                  <img
                    src={`http://localhost:8000${c.user.profile.profile_image}`}
                    alt="profile"
                    className="w-7 h-7 rounded-full"
                  />
                  {c.user.username}
                  <span className="text-xs text-gray-500 mx-2">{format(c.created)}</span>
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 px-2">{c.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
