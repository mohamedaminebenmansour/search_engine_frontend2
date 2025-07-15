import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Ensure useNavigate is imported here
import robotImage from '../assets/fonts/robot.png';
import Navbar from '../components/Navbar';

// Le composant InnerSearchComponent reste inchangé.
function InnerSearchComponent({ compact = false }) {
  const [query, setQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState("llama3");
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const navigate = useNavigate(); // useNavigate is also used here
  const queryRef = useRef(null);

  const isAuthenticated = !!localStorage.getItem("token");

  const dynamicPlaceholders = [
    "Que souhaitez-vous explorer aujourd'hui ?",
    "Je suis là pour vous aider...",
    "Posez-moi une question sur les tactiques d'affaires.",
    "Comment puis-je vous assister ?",
    "Entrez votre requête ici...",
  ];

  const modelOptions = isAuthenticated
    ? [
        { id: "llama2", name: "Llama 2", locked: false },
        { id: "gemma", name: "Gemma", locked: false },
        { id: "llama3", name: "Llama 3", locked: false },
        { id: "mistral", name: "Mistral", locked: false },
      ]
    : [
        { id: "llama3", name: "Llama 3", locked: false },
        { id: "mistral", name: "Mistral", locked: false },
        { id: "llama2", name: "Llama 2", locked: true },
        { id: "gemma", name: "Gemma", locked: true },
      ];

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && query.trim()) {
      e.preventDefault();
      navigate("/chat", {
        state: {
          query: query.trim(),
          model: selectedModel,
        },
      });
      setQuery("");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(
        (prevIndex) => (prevIndex + 1) % dynamicPlaceholders.length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={`bg-white rounded-2xl p-4 transition-all duration-300 ease-in-out ${compact ? 'shadow-md' : 'shadow-xl'}`}>
      <div
        className={`relative flex items-center transition-all duration-300 ease-in-out ${
          isFocused ? "ring-4 ring-indigo-200 rounded-xl" : ""
        }`}
      >
        <textarea
          ref={queryRef}
          placeholder={dynamicPlaceholders[placeholderIndex]}
          className={`w-full p-3 bg-gray-50 rounded-xl resize-none outline-none text-gray-800 placeholder-gray-400 border border-gray-200 focus:border-indigo-500 focus:ring-0 transition-all duration-200 ease-in-out font-medium
            ${compact ? 'h-24 text-base' : 'h-32 text-lg'}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={handleFocus}
          onBlur={handleBlur}
          rows={compact ? 3 : 4}
        />
        <div
          className={`absolute right-3 bottom-3 w-5 h-5 flex items-center justify-center transition-opacity duration-300 ${
            query.length > 0 ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex space-x-1">
            <span
              className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"
              style={{ animationDelay: "0s" }}
            ></span>
            <span
              className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></span>
            <span
              className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></span>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center flex-wrap gap-2 mt-4">
        {modelOptions.map((model) => (
          <button
            key={model.id}
            onClick={() => !model.locked && setSelectedModel(model.id)}
            className={`
              flex items-center px-3 py-1.5 rounded-full text-xs font-semibold
              transition-all duration-300 ease-in-out transform
              ${
                selectedModel === model.id
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-[1.02]"
              }
              ${
                model.locked
                  ? "opacity-50 cursor-not-allowed filter grayscale-[50%] relative"
                  : "cursor-pointer"
              }
            `}
            disabled={model.locked}
          >
            {model.locked && (
              <span className="absolute top-0 right-0 text-[0.5rem] bg-red-500 text-white rounded-full px-1 py-0.5 animate-pulse transform translate-x-1 -translate-y-1">
                PRO
              </span>
            )}
            {model.name}
            {selectedModel === model.id && (
              <svg
                className="ml-1 w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Le composant HomePage principal
export default function HomePage() {
  const navigate = useNavigate(); // Initialisez useNavigate here for HomePage

  return (
    // NOUVEAU: Dégradé de couleurs bleu ciel et bleu doux pour le fond
    <div className="relative flex flex-col min-w-0 h-dvh
                    bg-gradient-to-br from-[#E0FFFF] to-[#ADD8E6] text-white overflow-hidden">
      {/* Fenêtre du navigateur (simulée) - NOUVEAU: Couleur harmonisée avec le fond */}
      <div className="absolute inset-x-0 top-0 h-10 bg-[#E0FFFF] bg-opacity-80 rounded-t-xl flex items-center px-4 z-20">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        {/* NOUVEAU: Couleur du texte ajustée pour la lisibilité sur un fond bleu clair */}
        <div className="flex-1 text-center text-gray-700 text-sm font-medium">
          TacticFind - Talkinator
        </div>
      </div>

      {/* Main Navigation Bar (le composant Navbar) */}
      <Navbar />

      {/* Contenu principal de la couverture */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 pt-20 z-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full max-w-6xl">
          {/* Section de texte et barre de recherche à gauche */}
          <div className="text-left flex flex-col items-start">
            {/* NOUVEAU: Couleur du titre ajustée pour la lisibilité sur fond bleu clair */}
            <h1 className="text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg" style={{ color: '#2F4F4F' }}>
              Talkinator 
            </h1>
            {/* NOUVEAU: Couleur du paragraphe ajustée pour la lisibilité */}
            <p className="text-lg mb-8 max-w-md" style={{ color: '#4682B4' }}>
              A powerful AI assistant designed to provide accurate answers,
              generate creative content, and streamline your workflow.
              Get instant insights for your business strategies.
            </p>
            {/* MODIFICATION ICI : Ajout de l'onClick pour la navigation */}
            <button
              onClick={() => navigate("/read-more")} // This will navigate to the new page
              className="bg-red-600 text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-red-700 transition-colors shadow-lg mb-8"
            >
              READ MORE
            </button>
            
            {/* La barre de recherche "affinée" est ici */}
            <div className="w-full max-w-xl">
              <InnerSearchComponent compact={true} />
            </div>
            {/* NOUVEAU: Couleur du texte de pied de page ajustée */}
            <p className="text-xs mt-4 text-left w-full max-w-xl" style={{ color: '#4682B4' }}>
              By messaging TacticFind, you agree to our{" "}
              <a href="#" className="text-blue-800 hover:underline"> {/* NOUVEAU: Couleur du lien ajustée */}
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-800 hover:underline"> {/* NOUVEAU: Couleur du lien ajustée */}
                Privacy Policy
              </a>
              .
            </p>
          </div>

          {/* Section de l'image/robot à droite */}
          <div className="relative flex justify-center items-center">
            <div className="relative w-full h-full flex justify-center items-center">
              <img
                src={robotImage}
                alt="Chat bot on laptop"
                className="w-full max-w-md animate-float"
              />
              <div className="absolute top-1/4 left-1/4 bg-blue-400 text-white px-3 py-1 rounded-lg text-sm rotate-6 shadow-md">
                Hello!
              </div>
              <div className="absolute top-1/3 right-1/4 bg-green-400 text-white px-3 py-1 rounded-lg text-sm -rotate-3 shadow-md">
                How are you?
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}