import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faSpinner, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

export default function TeamDetailsPage() {
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [championship, setChampionship] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);

        // Fetch team details with all related data
        const teamResponse = await axios.get(`http://127.0.0.1:8000/api/teams/${id}`);
        const teamData = teamResponse.data.data;

        setTeam(teamData);
        setPlayers(teamData.soccers || []);
        setMatches(teamData.games || []);
        setChampionship(teamData.championship || null);
      } catch (error) {
        console.error("Error fetching team data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [id]);

  // Calculate team statistics
  const calculateTeamStats = () => {
    if (!team || !matches) return null;

    const totalMatches = matches.length;
    const wins = matches.filter((match) => {
      if (match.team_1_id === parseInt(id)) {
        return match.home_team_score > match.away_team_score;
      } else if (match.team_2_id === parseInt(id)) {
        return match.away_team_score > match.home_team_score;
      }
      return false;
    }).length;

    const draws = matches.filter((match) => match.home_team_score === match.away_team_score).length;

    const losses = totalMatches - wins - draws;

    return {
      totalPlayers: players.length,
      totalMatches,
      wins,
      losses,
      draws,
    };
  };

  const stats = calculateTeamStats();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">Caricamento dettagli squadra...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-red-600">Squadra non trovata</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Team Information Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {team.logo && <img src={team.logo} alt={`${team.name} logo`} className="w-16 h-16 object-contain" />}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{team.name}</h1>
              <p className="text-lg text-gray-600">
                <span className="font-semibold">Città:</span> {team.city || "N/A"}
              </p>
              {championship && (
                <p className="text-lg text-gray-600">
                  <span className="font-semibold">Campionato:</span> {championship.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalPlayers}</div>
              <div className="text-sm text-gray-600">Giocatori</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalMatches}</div>
              <div className="text-sm text-gray-600">Partite</div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">{stats.wins}</div>
              <div className="text-sm text-gray-600">Vittorie</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.losses}</div>
              <div className="text-sm text-gray-600">Sconfitte</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.draws}</div>
              <div className="text-sm text-gray-600">Pareggi</div>
            </div>
          </div>
        )}
      </div>

      {/* Players Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Giocatori della Squadra</h2>
        {players.length > 0 ? (
          <div className="space-y-3">
            {players.map((player) => (
              <div key={player.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {player.photo && (
                      <img
                        src={player.photo}
                        alt={`${player.name} photo`}
                        className="w-12 h-12 object-cover rounded-lg border-2 border-gray-100"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/48x48/f3f4f6/9ca3af?text=Player";
                        }}
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-800">{player.name}</h3>
                      {player.position && <p className="text-sm text-gray-600">Ruolo: {player.position}</p>}
                      {player.age && <p className="text-sm text-gray-600">Età: {player.age} anni</p>}
                    </div>
                  </div>
                  <Link
                    to={`/player/${player.id}`}
                    className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 group"
                    aria-label={`Visualizza dettagli del giocatore ${player.name}`}
                  >
                    <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Nessun giocatore trovato per questa squadra.</p>
        )}
      </div>
    </div>
  );
}
