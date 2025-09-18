import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";
import robotImage from '../../assets/fonts/robot.png';

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [companyId, setCompanyId] = useState("");
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch companies on component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await apiFetch("/auth/companies", {
          method: "GET",
        });
        setCompanies(response.companies || []);
        console.log("Fetched companies:", response.companies);
      } catch (err) {
        setError("Erreur lors du chargement des entreprises");
        console.error("Error fetching companies:", err);
      }
    };
    fetchCompanies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      console.log("Password mismatch");
      return;
    }
    
    try {
      const payload = {
        username,
        email,
        password,
        role,
        ...(role === "company_user" && companyId && { company_id: companyId }),
      };
      console.log("Submitting signup payload:", payload);

      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      console.log("Signup successful, navigating to login");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Une erreur s'est produite lors de l'inscription");
      console.error("Signup error:", err);
    }
  };

  const handleGoogleSignup = () => {
    console.log("Initiating Google signup");
    window.location.href = "http://localhost:5000/api/auth/google/login";
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center
                 bg-gradient-to-br from-[#E0FFFF] to-[#ADD8E6] text-gray-800"
    >
      <div className="flex w-full max-w-7xl h-[80vh] bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="w-1/2 flex items-center justify-center p-8 bg-[#E0FFFF] relative">
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
            hey ! Create Your Account
          </h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex space-x-4 mb-4">
              <button
                type="button"
                className={`flex-1 py-2 rounded-xl font-bold text-lg transition-all duration-300 ${
                  role === "user"
                    ? "bg-[#7FFFD4] text-[#2F4F4F]"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => {
                  setRole("user");
                  setCompanyId("");
                  console.log("Selected role: user");
                }}
              >
                User
              </button>
              <button
                type="button"
                className={`flex-1 py-2 rounded-xl font-bold text-lg transition-all duration-300 ${
                  role === "company_user"
                    ? "bg-[#7FFFD4] text-[#2F4F4F]"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => {
                  setRole("company_user");
                  console.log("Selected role: company_user");
                }}
              >
                Company User
              </button>
            </div>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-[#ADD8E6] transition-all duration-200"
              required
            />
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
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-[#ADD8E6] transition-all duration-200"
              required
            />

            {role === "company_user" && (
              <select
                value={companyId}
                onChange={(e) => {
                  setCompanyId(e.target.value);
                  console.log("Selected company_id:", e.target.value);
                }}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-[#ADD8E6] transition-all duration-200"
              >
                <option value="">Select an existing company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-[#7FFFD4] text-[#2F4F4F] rounded-xl font-bold text-lg
                         hover:bg-[#66CDAA] transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
            >
              Sign Up
            </button>
          </form>

          <button
            onClick={handleGoogleSignup}
            className="w-full py-4 mt-4 bg-[#4285F4] text-white rounded-xl font-bold text-lg
                       hover:bg-[#357AE8] transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
          >
            Sign Up with Google
          </button>

          <p className="text-base text-center mt-8 text-gray-700">
            Already have an account?{" "}
            <button
              onClick={() => {
                console.log("Navigating to login");
                navigate("/login");
              }}
              className="text-[#7FFFD4] hover:underline font-semibold"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}