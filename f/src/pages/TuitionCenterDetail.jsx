import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { format } from "timeago.js";

export default function TuitionCentreDetail() {
  const { id } = useParams();
  const { getData, postData } = useApi();
  const [centre, setCentre] = useState(null);
  const [comment, setComment] = useState("");

  const getCentre = async () => {
    try {
      const res = await getData(`/centres/${id}/`);
      setCentre(res);
    } catch (err) {
      console.error("Error fetching centre:", err);
    }
  };

  useEffect(() => {
    getCentre();
  }, [id]);

  const handleVote = async () => {
    try {
      await postData(`/centres/${id}/vote/`);
      getCentre();
    } catch (err) {
      console.error("Error voting:", err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const newComment = await postData(`/centres/${id}/comment/`, { text: comment });
      setCentre({ ...centre, comments: [newComment, ...centre.comments] });
      setComment("");
    } catch (err) {
      console.error("Error commenting:", err);
    }
  };

  console.log(centre)

  if (!centre) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={`https://edusafari.onrender.com${centre.logo}`}
            alt={centre.name}
            className="w-20 h-20 rounded-full border border-amber-500"
          />
          <div>
            <h2 className="text-2xl font-bold dark:text-white">{centre.name}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {centre.level} | {centre.location}
            </p>
          </div>
        </div>

        <p className="text-gray-700 dark:text-gray-200 mb-4">{centre.description}</p>

        {centre.website && (
          <a
            href={centre.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-4"
          >
            Visit Website
          </a>
        )}

        <div className="flex gap-4 mb-6">
          <button
            onClick={handleVote}
            className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-500"
          >
            <ThumbsUp size={18} /> {centre.votes_count}
          </button>
          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
            <MessageCircle size={18} /> {centre.comments.length}
          </span>
        </div>

        <form onSubmit={handleComment} className="mb-4 flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 border rounded-lg p-2 dark:bg-gray-700 dark:text-white"
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
          {centre.comments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
          ) : (
            centre.comments.map((c) => (
              <div key={c.id} className="border-b border-gray-200 dark:border-gray-700 pb-2">
                <p className="text-sm font-semibold dark:text-gray-200 flex gap-1 my-1">
                  <img
                    src={`https://edusafari.onrender.com${c.user.profile.profile_image}`}
                    alt="profile"
                    className="w-7 h-7 rounded-full"
                  />
                  {c.user.username}
                  <span className="text-xs text-gray-500 mx-2 my-1">{format(c.created)}</span>
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
