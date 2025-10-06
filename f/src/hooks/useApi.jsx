import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getAccessToken = () => localStorage.getItem("access_token");

  const getHeaders = (customHeaders = {}) => {
    const token = getAccessToken();
    if (!token) {
      // No token, redirect to login immediately
      navigate("/login");
    }
    return {
      Authorization: token ? `Bearer ${token}` : "",
      ...customHeaders,
    };
  };

  const handleRequest = async (method, url, data = null, headers = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios({
        method,
        url: `${API_BASE}${url}`,
        data,
        headers: getHeaders(headers),
        withCredentials: true,
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);

      if (err.response?.status === 401) {
        // Unauthorized – redirect to login
        navigate("/login");
        setError({ detail: "Unauthorized. Please login again." });
      } else {
        setError(err.response?.data || err.message);
      }

      throw err;
    }
  };

  const getData = (url, headers) => handleRequest("GET", url, null, headers);
  const postData = (url, data, headers) => handleRequest("POST", url, data, headers);
  const patchData = (url, data, headers) => handleRequest("PATCH", url, data, headers);
  const putData = (url, data, headers) => handleRequest("PUT", url, data, headers);
 const deleteData = (url, data = {}, headers) => handleRequest("DELETE", url, data, headers);


  return { loading, error, getData, postData, patchData, putData, deleteData };
};
