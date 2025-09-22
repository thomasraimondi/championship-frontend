import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ChampionshipDetailsPage() {
  const [championship, setChampionship] = useState(null);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchChampionshipData = async () => {
      try {
        setLoading(true);

        const championshipResponse = await axios.get(`http://127.0.0.1:8000/api/championships/${id}`);
        const championshipData = championshipResponse.data.data;

        setChampionship(championshipData);

        setTeams(championshipData.teams || []);
        setMatches(championshipData.games || []);
      } catch (error) {
        console.error("Error fetching championship data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChampionshipData();
  }, [id]);

  const calculateStats = () => {
    if (!championship || !matches.length) return null;

    const totalMatches = matches.length;
    const homeWins = matches.filter((match) => match.home_team_score > match.away_team_score).length;
    const draws = matches.filter((match) => match.home_team_score === match.away_team_score).length;
    const awayWins = matches.filter((match) => match.away_team_score > match.home_team_score).length;

    return {
      totalTeams: teams.length,
      totalMatches,
      homeWins,
      draws,
      awayWins,
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento dettagli campionato...</p>
        </div>
      </div>
    );
  }

  if (!championship) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Campionato non trovato</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{championship.name}</h1>
            <p className="text-lg text-gray-600">
              <span className="font-semibold">Paese:</span> {championship.country || "N/A"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Stagione {championship.year || "N/A"}</p>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalTeams}</div>
              <div className="text-sm text-gray-600">Squadre</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalMatches}</div>
              <div className="text-sm text-gray-600">Partite</div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">{stats.homeWins}</div>
              <div className="text-sm text-gray-600">Vittorie Casa</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.awayWins}</div>
              <div className="text-sm text-gray-600">Vittorie Trasferta</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.draws}</div>
              <div className="text-sm text-gray-600">Pareggi</div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Squadre Partecipanti</h2>
        {teams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => (
              <div key={team.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <Link to={`/team/${team.id}`}>
                  <div className="flex items-center space-x-3">
                    {team.logo && <img src={team.logo} alt={`${team.name} logo`} className="w-12 h-12 object-contain" />}
                    <div>
                      <h3 className="font-semibold text-gray-800">{team.name}</h3>
                      <p className="text-sm text-gray-600">{team.city || "N/A"}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Nessuna squadra trovata per questo campionato.</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Partite</h2>
        {matches.length > 0 ? (
          <div className="space-y-4">
            {matches.map((match) => (
              <Link to={`/match/${match.id}`} key={match.id} className="block mb-4">
                <div key={match.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex items-center space-x-2 flex-1">
                        {teams.find((team) => team.id === match.team_1_id)?.logo && (
                          <img
                            src={teams.find((team) => team.id === match.team_1_id)?.logo}
                            alt={`${teams.find((team) => team.id === match.team_1_id)?.name} logo`}
                            className="w-8 h-8 object-contain"
                          />
                        )}
                        <span className="font-medium">{teams.find((team) => team.id === match.team_1_id)?.name || "Squadra Casa"}</span>
                      </div>

                      <div className="flex items-center space-x-2 px-4">
                        <span className="text-xl font-bold">{match.home_team_score}</span>
                        <span className="text-gray-500">-</span>
                        <span className="text-xl font-bold">{match.away_team_score}</span>
                      </div>

                      <div className="flex items-center space-x-2 flex-1 justify-end">
                        <span className="font-medium">{teams.find((team) => team.id === match.team_2_id)?.name || "Squadra Trasferta"}</span>
                        {teams.find((team) => team.id === match.team_2_id)?.logo && (
                          <img
                            src={teams.find((team) => team.id === match.team_2_id)?.logo}
                            alt={`${teams.find((team) => team.id === match.team_2_id)?.name} logo`}
                            className="w-8 h-8 object-contain"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {match.date && (
                    <div className="mt-2 text-sm text-gray-500">
                      {new Date(match.date).toLocaleDateString("it-IT", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Nessuna partita trovata per questo campionato.</p>
        )}
      </div>
    </div>
  );
}
