import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faExclamationTriangle, faTrophy, faSort, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";

export default function StandingDetailsPage() {
  const { id } = useParams();
  const [standings, setStandings] = useState(null);
  const [championship, setChampionship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState("points");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    const fetchStandings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/standings/${id}`);
        console.log("Standings data:", response.data.data);

        if (response.data.data) {
          setStandings(response.data.data.standings);
          setChampionship(response.data.data);
        } else {
          setError("Nessun dato di classifica disponibile per questo campionato.");
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching standings:", err);
        setError("Errore nel caricamento della classifica. Riprova più tardi.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStandings();
    }
  }, [id]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <FontAwesomeIcon icon={faSort} className="text-gray-400" />;
    }
    return sortDirection === "asc" ? <FontAwesomeIcon icon={faSortUp} className="text-blue-600" /> : <FontAwesomeIcon icon={faSortDown} className="text-blue-600" />;
  };

  const sortedStandings = standings
    ? [...standings].sort((a, b) => {
        const aValue = a[sortField] || 0;
        const bValue = b[sortField] || 0;

        if (sortDirection === "asc") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      })
    : [];

  const getPositionIcon = (position) => {
    if (position === 1) {
      return <FontAwesomeIcon icon={faTrophy} className="text-yellow-500" />;
    } else if (position <= 3) {
      return <FontAwesomeIcon icon={faTrophy} className="text-gray-400" />;
    }
    return null;
  };

  //   const getFormIndicator = (form) => {
  //     if (!form || form.length === 0) return null;

  //     return (
  //       <div className="flex space-x-1">
  //         {form.slice(-5).map((result, index) => (
  //           <span
  //             key={index}
  //             className={`w-2 h-2 rounded-full ${result === "W" ? "bg-green-500" : result === "D" ? "bg-yellow-500" : result === "L" ? "bg-red-500" : "bg-gray-300"}`}
  //             title={result === "W" ? "Vittoria" : result === "D" ? "Pareggio" : result === "L" ? "Sconfitta" : "N/A"}
  //           />
  //         ))}
  //       </div>
  //     );
  //   };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600 text-lg">Caricamento classifica...</p>
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
  console.log("standings:", standings);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xl text-gray-600">
            Classifica aggiornata del campionato {championship.name} - {championship.year}
          </p>
        </div>

        {/* Standings Table */}
        {standings && standings.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("position")}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Pos</span>
                        {getSortIcon("position")}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Squadra</th>
                    <th
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("played")}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span>PG</span>
                        {getSortIcon("played")}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("won")}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span>V</span>
                        {getSortIcon("won")}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("drawn")}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span>N</span>
                        {getSortIcon("drawn")}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("lost")}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span>P</span>
                        {getSortIcon("lost")}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("goals_for")}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span>GF</span>
                        {getSortIcon("goals_for")}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("goals_against")}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span>GS</span>
                        {getSortIcon("goals_against")}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("goal_difference")}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span>DR</span>
                        {getSortIcon("goal_difference")}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("points")}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span>Punti</span>
                        {getSortIcon("points")}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedStandings.map((team, index) => (
                    <tr key={team.id || index} className={`hover:bg-gray-50 transition-colors ${team.position <= 3 ? "bg-yellow-50" : team.position <= 6 ? "bg-blue-50" : ""}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-bold ${team.position <= 3 ? "text-yellow-600" : team.position <= 6 ? "text-blue-600" : "text-gray-900"}`}>{team.position || index + 1}</span>
                          {getPositionIcon(team.position || index + 1)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          {/* <div className="flex-shrink-0">
                            <img
                              src={team.logo || team.team_logo || "https://via.placeholder.com/32x32/f3f4f6/9ca3af?text=Logo"}
                              alt={`Logo ${team.name || team.team_name}`}
                              className="w-8 h-8 object-cover rounded-full border border-gray-200"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/32x32/f3f4f6/9ca3af?text=Logo";
                              }}
                            />
                          </div> */}
                          <div className="text-sm font-medium text-gray-900">{team.name || team.team_name || "Squadra"}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{team.matches || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{team.wins || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{team.draws || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{team.loses || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{team.goals_for || team.goals_scored || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{team.goals_against || team.goals_conceded || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        <span className={`font-medium ${(team.goals_difference || 0) > 0 ? "text-green-600" : (team.goals_difference || 0) < 0 ? "text-red-600" : "text-gray-600"}`}>
                          {(team.goals_difference || 0) > 0 ? "+" : ""}
                          {team.goals_difference || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm font-bold text-blue-600">{team.points || 0}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Nessuna classifica disponibile</h3>
              <p className="text-gray-600">Al momento non ci sono dati di classifica per questo campionato.</p>
            </div>
          </div>
        )}

        {/* Legend */}
        {standings && standings.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Legenda</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-100 rounded"></div>
                <span className="text-gray-600">Posizioni 1-3: Qualificazione Champions League</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-100 rounded"></div>
                <span className="text-gray-600">Posizioni 4-6: Qualificazione Europa League</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
