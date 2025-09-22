import { Link } from "react-router-dom";
export default function Jumbotron() {
  return (
    <div className="relative w-full h-50 bg-gradient-to-br from-green-600 via-green-700 to-green-800 overflow-hidden py-4">
      {/* Football field pattern overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-12"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-white rounded-full opacity-30"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white opacity-40"></div>
        <div className="absolute top-1/2 left-0 w-full h-1 bg-white opacity-40 transform -translate-y-1/2"></div>
      </div>

      {/* Floating football icons */}
      {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-white text-4xl opacity-30 animate-bounce">⚽</div>
        <div className="absolute top-20 right-16 text-white text-3xl opacity-25 animate-pulse">⚽</div>
        <div className="absolute bottom-16 left-20 text-white text-2xl opacity-20 animate-bounce delay-1000">⚽</div>
        <div className="absolute bottom-20 right-10 text-white text-3xl opacity-30 animate-pulse delay-500">⚽</div>
      </div> */}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center h-full text-center px-4">
        <div className="mb-6">
          <p className="text-xl md:text-2xl text-green-100 font-light max-w-2xl leading-relaxed drop-shadow-lg hidden md:block">
            Vivi l'emozione del calcio più puro. Segui le tue squadre del cuore, scopri i migliori giocatori e resta aggiornato su tutti i risultati.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link
            to="/standings"
            className="bg-yellow-500 hover:bg-yellow-400 text-green-900 font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            🏆 Classifiche
          </Link>
          {/* <button className="bg-white hover:bg-gray-100 text-green-800 font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            📊 Statistiche
          </button> */}
        </div>
      </div>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10"></div>
    </div>
  );
}
