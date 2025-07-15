import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";
import robotImage from '../../assets/fonts/robot.png';

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      });
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Une erreur s'est produite lors de l'inscription");
    }
  };

  const handleGoogleSignup = () => {
    // Redirect to Flask backend's Google login endpoint (same as login, handles signup)
    window.location.href = "http://localhost:5000/api/auth/google/login";
  };

  return (
    // Conteneur principal avec le dégradé bleu de la HomePage (pour la cohérence globale)
    <div
      className="min-h-screen flex items-center justify-center
                 bg-gradient-to-br from-[#E0FFFF] to-[#ADD8E6] text-gray-800"
    >
      <div className="flex w-full max-w-7xl h-[80vh] bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Partie gauche : Image du robot avec fond vert aqua/menthe */}
        <div className="w-1/2 flex items-center justify-center p-8 bg-[#E0FFFF] relative"> {/* NOUVEAU: Fond vert aqua très clair pour la section image */}
          <img
            src={robotImage}
            alt="Robot Assistant"
            className="max-h-full w-auto object-contain animate-float"
          />
          {/* Les bulles de dialogue peuvent rester les mêmes ou être ajustées si vous voulez un vert/bleu plus doux */}
          <div className="absolute top-1/4 left-1/4 bg-blue-400 text-white px-3 py-1 rounded-lg text-sm rotate-6 shadow-md">
            Hello!
          </div>
          <div className="absolute top-1/3 right-1/4 bg-green-400 text-white px-3 py-1 rounded-lg text-sm -rotate-3 shadow-md">
            How are you?
          </div>
        </div>

        {/* Partie droite : Formulaire d'inscription */}
        <div className="w-1/2 p-12 flex flex-col justify-center bg-white">
          <h2 className="text-4xl font-extrabold text-center text-[#2F4F4F] mb-8">
            hey ! Create Your Account
          </h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-[#ADD8E6] transition-all duration-200" // Reste bleu pour la cohérence des inputs
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-[#ADD8E6] transition-all duration-200" // Reste bleu pour la cohérence des inputs
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-[#ADD8E6] transition-all duration-200" // Reste bleu pour la cohérence des inputs
              required
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-[#ADD8E6] transition-all duration-200" // Reste bleu pour la cohérence des inputs
              required
            />
            <button
              type="submit"
              className="w-full py-4 bg-[#7FFFD4] text-[#2F4F4F] rounded-xl font-bold text-lg
                         hover:bg-[#66CDAA] transition-all duration-300 transform hover:-translate-y-1 shadow-lg" // NOUVEAU: Bouton vert aqua avec texte sombre
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
              onClick={() => navigate("/login")}
              className="text-[#7FFFD4] hover:underline font-semibold" // NOUVEAU: Lien vert aqua
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}