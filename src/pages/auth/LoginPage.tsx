import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiFetch, setToken } from "../../utils/api";
import robotImage from '../../assets/fonts/robot.png';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (!data.user || !data.user.id || !data.user.role) {
        throw new Error("Invalid response from server: Missing user data");
      }
      setToken(data.token);
      localStorage.setItem("token", data.token);
      const userData = {
        user_id: data.user.id,
        username: data.user.username,
        role: data.user.role,
        company_id: data.user.company_id,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      console.log("User data stored in localStorage:", userData);
      console.log("Attempting navigation with role:", userData.role);
      if (userData.role === "user") {
        console.log("Navigating to /chat");
        navigate("/chat");
      } else if (userData.role === "company_admin") {
        console.log("Navigating to /company-admin");
        navigate("/company-admin");
      } else if (userData.role === "website_admin") {
        console.log("Navigating to /website-admin");
        navigate("/website-admin");
      } else {
        console.error("Unknown role:", userData.role);
        setError("Rôle utilisateur non reconnu");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Email ou mot de passe incorrect");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google/login";
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center
                 bg-gradient-to-br from-[#E0FFFF] to-[#ADD8E6] text-gray-800"
    >
      <div className="flex w-full max-w-7xl h-[80vh] bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="w-1/2 flex items-center justify-center p-8 bg-[#ADD8E6] relative">
          <img
            src={robotImage}
            alt="Robot Assistant"
            className="max-h-full w-auto object-contain animate-float"
          />
          <div className="absolute top-1/4 left-1/4 bg-blue-400 text-white px-3 py-1 rounded-lg text-sm rotate-6 shadow-md">
            Hello!
          </div>
          <div className="absolute top-1/3 right-1/4 bg-green-400 text-white px-3 py-1 rounded-lg text-sm -rotate-3 shadow-md">
            How are you?
          </div>
        </div>

        <div className="w-1/2 p-12 flex flex-col justify-center bg-white">
          <h2 className="text-4xl font-extrabold text-center text-[#2F4F4F] mb-8">
            Welcome Back!
          </h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-[#ADD8E6] transition-all duration-200"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-[#ADD8E6] transition-all duration-200"
              required
            />
            <button
              type="submit"
              className="w-full py-4 bg-[#4682B4] text-white rounded-xl font-bold text-lg
                         hover:bg-[#34658A] transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
            >
              Sign In
            </button>
          </form>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-4 mt-4 bg-[#4285F4] text-white rounded-xl font-bold text-lg
                       hover:bg-[#357AE8] transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
          >
            Login with Google
          </button>

          <p className="text-base text-center mt-4 text-gray-700">
            Forgot your password?{" "}
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-[#4682B4] hover:underline font-semibold"
            >
              Reset Password
            </button>
          </p>

          <p className="text-base text-center mt-4 text-gray-700">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-[#4682B4] hover:underline font-semibold"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}