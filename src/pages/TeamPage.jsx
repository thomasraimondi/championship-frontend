import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faSpinner, faExclamationTriangle, faSearch } from "@fortawesome/free-solid-svg-icons";

export default function TeamPage() {
  const [teams, setTeams] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/teams")
      .then((response) => {
        console.log(response.data.data);
        setTeams(response.data.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching teams:", err);
        setError("Errore nel caricamento delle squadre. Riprova più tardi.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filtra i team basandosi sul termine di ricerca
  const filteredTeams = teams ? teams.filter((team) => team.name.toLowerCase().includes(searchTerm.toLowerCase())) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600 text-lg">Caricamento squadre...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Oops! Qualcosa è andato storto</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          {/* <h1 className="text-4xl font-bold text-gray-900 mb-4">Squadre</h1> */}
          <p className="text-xl text-gray-600 mb-8">Scopri tutte le squadre disponibili</p>

          {/* Barra di ricerca */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cerca squadra per nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>
          </div>
        </div>

        {teams && teams.length > 0 ? (
          filteredTeams.length > 0 ? (
            <div className="space-y-3 h-[400px] overflow-y-auto">
              {filteredTeams.map((team) => (
                <div key={team.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200">
                  <div className="p-2 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {team.image !== null && (
                        <div className="flex-shrink-0">
                          <img
                            src={team.image}
                            alt={`Logo ${team.name}`}
                            className="w-12 h-12 object-cover rounded-lg border-2 border-gray-100"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/64x64/f3f4f6/9ca3af?text=Logo";
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 flex">
                        <h2 className="text-lg font-bold text-gray-900 mb-1">{team.name}</h2>
                      </div>
                    </div>

                    <div className="flex-shrink-0 ml-3">
                      <a
                        href={`/team/${team.id}`}
                        className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 group"
                        aria-label={`Visualizza dettagli della squadra ${team.name}`}
                      >
                        <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                      </a>
                    </div>
                  </div>

                  {team.players_count && (
                    <div className="px-4 pb-3">
                      <div className="flex items-center text-xs text-gray-500">
                        <span>{team.players_count} giocatori</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Nessun risultato trovato</h3>
                <p className="text-gray-600 mb-4">Non ci sono squadre che corrispondono alla ricerca "{searchTerm}".</p>
                <button onClick={() => setSearchTerm("")} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Cancella ricerca
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Nessuna squadra trovata</h3>
              <p className="text-gray-600">Al momento non ci sono squadre disponibili.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
