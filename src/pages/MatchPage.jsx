import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faSpinner, faExclamationTriangle, faSearch, faTrophy, faCalendar } from "@fortawesome/free-solid-svg-icons";

export default function MatchPage() {
  const [matches, setMatches] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/games")
      .then((response) => {
        console.log(response.data.data);
        setMatches(response.data.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching matches:", err);
        setError("Errore nel caricamento delle partite. Riprova più tardi.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Raggruppa le partite per campionato
  const groupedMatches = matches
    ? matches.reduce((acc, match) => {
        const championshipName = match.championship?.name || "Campionato Sconosciuto";
        if (!acc[championshipName]) {
          acc[championshipName] = [];
        }
        acc[championshipName].push(match);
        return acc;
      }, {})
    : {};

  // Filtra le partite basandosi sul termine di ricerca
  const filteredGroupedMatches = Object.keys(groupedMatches).reduce((acc, championship) => {
    const filteredMatches = groupedMatches[championship].filter(
      (match) =>
        match.home_team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.away_team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        championship.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredMatches.length > 0) {
      acc[championship] = filteredMatches;
    }
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600 text-lg">Caricamento partite...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
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
    <div className="bg-gray-50 py-8 h-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <p className="text-xl text-gray-600 mb-4">Scopri tutte le partite disponibili</p>

          {/* Barra di ricerca */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cerca partita per squadra o campionato..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>
          </div>
        </div>

        {matches && matches.length > 0 ? (
          Object.keys(filteredGroupedMatches).length > 0 ? (
            <div className="space-y-6 h-[500px] overflow-y-auto">
              {Object.entries(filteredGroupedMatches).map(([championship, championshipMatches]) => (
                <div key={championship} className="bg-white rounded-lg shadow-sm border border-gray-100">
                  {/* Header del campionato */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
                    <div className="flex items-center space-x-2">
                      <FontAwesomeIcon icon={faTrophy} className="w-5 h-5" />
                      <h2 className="text-lg font-bold">{championship}</h2>
                      <span className="bg-blue-500 text-xs px-2 py-1 rounded-full">{championshipMatches.length} partite</span>
                    </div>
                  </div>

                  {/* Lista delle partite */}
                  <div className="divide-y divide-gray-100">
                    {championshipMatches.map((match) => (
                      <div key={match.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-4">
                                <div className="text-center">
                                  <div className="font-semibold text-gray-900">{match.home_team.name}</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-blue-600">
                                    {match.home_team_score !== null && match.away_team_score !== null ? `${match.home_team_score} - ${match.away_team_score}` : "TBD"}
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="font-semibold text-gray-900">{match.away_team.name}</div>
                                </div>
                              </div>
                            </div>

                            {match.date && (
                              <div className="flex items-center text-sm text-gray-500">
                                <FontAwesomeIcon icon={faCalendar} className="w-4 h-4 mr-1" />
                                <span>{new Date(match.date).toLocaleDateString("it-IT")}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex-shrink-0 ml-4">
                            <a
                              href={`/match/${match.id}`}
                              className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 group"
                              aria-label={`Visualizza dettagli della partita ${match.home_team.name} vs ${match.away_team.name}`}
                            >
                              <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Nessun risultato trovato</h3>
                <p className="text-gray-600 mb-4">Non ci sono partite che corrispondono alla ricerca "{searchTerm}".</p>
                <button onClick={() => setSearchTerm("")} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Cancella ricerca
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Nessuna partita trovata</h3>
              <p className="text-gray-600">Al momento non ci sono partite disponibili.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
