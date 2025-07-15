import { useState, useRef } from "react";
import { FaUser, FaCrown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const navTimeoutRef = useRef(null);

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleMouseEnter = () => {
    if (navTimeoutRef.current) {
      clearTimeout(navTimeoutRef.current);
    }
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    navTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 500); // Délai de 500ms avant de disparaître
  };

  return (
    <div
      className="absolute top-10 left-0 right-0 h-20 z-30 transition-all duration-300 ease-in-out"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <nav
        className={`absolute inset-0 px-10 flex justify-between items-center
                    bg-gradient-to-r from-[#87CEEB] to-[#4682B4] backdrop-blur-lg bg-opacity-70 // NOUVEAU: Couleurs bleues et opacité ajustées
                    text-white shadow-xl rounded-b-2xl border-b border-white/10
                    transform transition-all duration-300 ease-in-out
                    ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
        style={{ height: 'calc(100% - 10px)' }}
      >
        {/* Section du logo TacticFind */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <FaCrown className="w-10 h-10 text-yellow-300 drop-shadow-md transform transition-transform duration-300 hover:scale-110" />
          <span className="text-3xl font-extrabold text-white tracking-wider leading-none">TacticFind</span>
        </div>

        {/* Boutons Sign Up et Sign In */}
        <div className="flex items-center gap-x-4">
          <button
            onClick={handleSignUp}
            className="flex items-center px-6 py-3 bg-white text-[#2F4F4F] rounded-full font-bold // NOUVEAU: Texte du bouton Sign Up en gris foncé pour le contraste
                       hover:bg-blue-100 transition-all duration-300 ease-in-out
                       transform hover:-translate-y-0.5 shadow-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            <FaUser className="mr-2 text-lg" />
            Sign Up
          </button>

          <button
            onClick={handleSignIn}
            className="px-6 py-3 bg-black text-white rounded-full font-bold
                       hover:bg-gray-800 transition-all duration-300 ease-in-out
                       transform hover:-translate-y-0.5 shadow-lg
                       focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
          >
            Sign In
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;