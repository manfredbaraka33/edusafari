import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { InfoIcon } from "lucide-react";

const steps = ["userType", "username", "password"];

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    user_type: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleNext = () => {
    setError("");
    // Validation per step
    if (currentStep === 0 && !formData.user_type) {
      setError("Please select a user type.");
      return;
    }
    if (currentStep === 1 && !formData.username) {
      setError("Username is required.");
      return;
    }
    if (
      currentStep === 2 &&
      (!formData.password || !formData.confirmPassword)
    ) {
      setError("Password and confirm password are required.");
      return;
    }
    if (
      currentStep === 2 &&
      formData.password !== formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    
  };

  const handleSubmit = async () => {
  
    if(formData.password.length < 6){
        setError("The password must be atleast 6 characters");
        return;
    }

    try {
      const payload = {
        user_type: formData.user_type,
        username: formData.username,
        password: formData.password,
      };
      const response = await axios.post(
        "https://edusafari.onrender.com/api/register/",
        payload
      );
      // Optional: auto-login
      login(response.data.user);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-tr from-orange-400 via-purple-300 to-green-300 p-2">
      <div className="w-full max-w-md relative">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="step1"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="bg-white p-6 rounded-lg shadow flex flex-col gap-4"
            >
              <h2 className="text-xl font-bold">Select User Type</h2>
              <div className="text-yellow-400 text-sm bg-black p-2 rounded-sm flex gap-1"><InfoIcon /><h3>  This selection can not be undone after registration!</h3>
             </div>
               <div className="flex gap-4">
                <button
                  onClick={() =>
                    setFormData({ ...formData, user_type: "regular_user" })
                  }
                  className={`flex-1 py-2 rounded-lg border ${
                    formData.user_type === "regular_user"
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  Regular User
                </button>
                <button
                  onClick={() =>
                    setFormData({ ...formData, user_type: "institution_user" })
                  }
                  className={`flex-1 py-2 rounded-lg border ${
                    formData.user_type === "institution_user"
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  Institution User
                </button>
                <button
                  onClick={() =>
                    setFormData({ ...formData, user_type: "vendor_user" })
                  }
                  className={`flex-1 py-2 rounded-lg border ${
                    formData.user_type === "vendor_user"
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  Vendor User
                </button>
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <div className="flex justify-between">
                <div></div>
                <button
                  onClick={handleNext}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                >
                  Next
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step2"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="bg-white p-6 rounded-lg shadow flex flex-col gap-4"
            >
              <h2 className="text-xl font-bold">Username</h2>
              <input
                type="text"
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              {error && <p className="text-red-500">{error}</p>}
              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                >
                  Next
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step3"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="bg-white p-6 rounded-lg shadow flex flex-col gap-4"
            >
              <h2 className="text-xl font-bold">Password</h2>
              <input
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              {error && <p className="text-red-500">{error}</p>}
              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                >
                  Register
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
