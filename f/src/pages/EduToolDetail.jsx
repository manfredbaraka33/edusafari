import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ThumbsUp, MessageCircle, Loader2 } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { format } from "timeago.js";

export default function EduToolDetail() {
  const { id } = useParams();
  const { getData, postData } = useApi();
  const [tool, setTool] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [voting, setVoting] = useState(false);

  // Fetch tool details
  const getTool = async () => {
    try {
      setLoading(true);
      const res = await getData(`/edutools/${id}/`);
      setTool(res);
    } catch (err) {
      console.error("Error fetching tool:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTool();
  }, [id]);

  // Handle vote
  const handleVote = async () => {
    try {
      setVoting(true);
      await postData(`/edutools/${id}/vote/`);
      getTool();
    } catch (err) {
      console.error("Error voting:", err);
    } finally {
      setVoting(false);
    }
  };

  // Handle comment submit
  const handleComment = async (e) => {
    e.preventDefault();
    try {
      setPosting(true);
      const newComment = await postData(`/edutools/${id}/comment/`, {
        text: comment,
      });
      setTool({
        ...tool,
        comments: [newComment, ...tool.comments],
      });
      setComment("");
    } catch (err) {
      console.error("Error commenting:", err);
    } finally {
      setPosting(false);
    }
  };

  console.log(tool)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-indigo-600" />
      </div>
    );
  }

  

  if (!tool) return <p className="text-center text-gray-500 p-30">Tool not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        {/* Logo & name */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src={tool.logo ? `https://edusafari.onrender.com${tool.logo}` : "/def_logo.png"}
            alt={tool.name}
            className="w-20 h-20 rounded-full border border-amber-500"
          />
          <div>
            <h2 className="text-2xl font-bold dark:text-white">{tool.name}</h2>
            <p className="text-gray-600 dark:text-gray-300">{tool.category} | {tool.level}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-200 mb-4">{tool.description}</p>

        {/* Link */}
        <a
          href={tool.is_affiliate ? tool.affiliate_link : tool.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-4"
        >
          Visit Tool
        </a>

        {/* Actions */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleVote}
            disabled={voting}
            className={`flex items-center gap-1 text-gray-600 dark:text-gray-300 ${
              voting ? "opacity-50 cursor-not-allowed" : "hover:text-blue-500"
            }`}
          >
            {voting ? <Loader2 className="animate-spin w-4 h-4" /> : <ThumbsUp size={18} />}
            {tool.votes_count || 0}
          </button>
          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
            <MessageCircle size={18} /> {tool.comments.length}
          </span>
        </div>

        {/* Comment form */}
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
            disabled={posting}
            className={`bg-green-600 text-white px-4 py-2 rounded-lg transition ${
              posting ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
            }`}
          >
            {posting ? (
              <div className="flex items-center gap-1">
                <Loader2 className="animate-spin w-4 h-4" /> 
              </div>
            ) : (
              "Post"
            )}
          </button>
        </form>

        {/* Comments */}
        <div className="space-y-3">
          {tool.comments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
          ) : (
            tool.comments.map((c) => (
              <div
                key={c.id}
                className="border-b border-gray-200 dark:border-gray-700 pb-2"
              >
                <p className="text-sm font-semibold dark:text-gray-200 flex gap-2 my-1 items-center">
                  <img
                    src={
                      c.user?.profile?.profile_image
                        ? `https://edusafari.onrender.com${c.user.profile.profile_image}`
                        : "/im.png"
                    }
                    onError={(e) => (e.target.src = "/im.png")}
                    alt="profile"
                    className="w-7 h-7 rounded-full object-cover"
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

