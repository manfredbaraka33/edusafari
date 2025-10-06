import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useApi } from "../hooks/useApi";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { postData, loading, error } = useApi();
  const [message,setMessage]=useState();
  const [err,setErr]=useState();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await postData("/token/", form);
      console.log("Here is the feedback",data);
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      login(data);
      navigate("/"); 
    } catch (err) {
      console.error("Errorss herr",err.message);
      setErr(err.message);
      console.error("Errorss herr",err.response.data.detail);
      setMessage(err.response.data.detail);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-400 via-yellow-200 to-green-300">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
         EduSafari Login
        </h2>

        {message ? (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
           {message}
          </div>
        ):(
          <>{err && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
           {err}
          </div>}</>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-indigo-600 hover:underline">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
