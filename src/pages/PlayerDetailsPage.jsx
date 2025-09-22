import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faExclamationTriangle, faFutbol } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function PlayerDetailsPage() {
  const [player, setPlayer] = useState(null);
  const [team, setTeam] = useState(null);
  const [championship, setChampionship] = useState(null);
  const [games, setGames] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true);

        // Fetch player details with all related data
        const playerResponse = await axios.get(`http://127.0.0.1:8000/api/soccers/${id}`);
        const playerData = playerResponse.data.data;

        setPlayer(playerData);
        setTeam(playerData.team || null);
        setChampionship(playerData.team?.championship || null);
        setGames(playerData.games || []);
        setGoals(playerData.goals || []);
      } catch (error) {
        console.error("Error fetching player data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [id]);

  // Calculate player statistics
  const calculatePlayerStats = () => {
    if (!player) return null;

    const totalGames = games.length;
    const totalGoals = goals.length;
    const gamesWithGoals = goals.reduce((acc, goal) => {
      if (!acc.includes(goal.game_id)) {
        acc.push(goal.game_id);
      }
      return acc;
    }, []).length;

    return {
      totalGames,
      totalGoals,
      gamesWithGoals,
      goalsPerGame: totalGames > 0 ? ((totalGoals / totalGames) * 100).toFixed(2) + "%" : 0,
    };
  };

  const stats = calculatePlayerStats();

  // Get games with goals for highlighting
  const getGamesWithGoals = () => {
    if (!goals || !games) return [];
    return goals.map((goal) => goal.game_id);
  };

  const gamesWithGoals = getGamesWithGoals();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">Caricamento dettagli giocatore...</p>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-red-600">Giocatore non trovato</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Player Information Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {player.name} {player.lastname}
              </h1>
              <p className="text-lg text-gray-600">
                <span className="font-semibold">Ruolo:</span> {player.role || "N/A"}
              </p>
              <p className="text-lg text-gray-600">
                <span className="font-semibold">Età:</span> {player.age || "N/A"} anni
              </p>
              {team && (
                <p className="text-lg text-gray-600">
                  <span className="font-semibold">Squadra:</span> {team.name}
                </p>
              )}
              {championship && (
                <p className="text-lg text-gray-600">
                  <span className="font-semibold">Campionato:</span>{" "}
                  <Link to={`/championship/${championship.id}`} className="hover:text-blue-600">
                    {championship.name}
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalGames}</div>
              <div className="text-sm text-gray-600">Partite Giocate</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalGoals}</div>
              <div className="text-sm text-gray-600">Goal Segnati</div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">{stats.gamesWithGoals}</div>
              <div className="text-sm text-gray-600">Partite con Goal</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.goalsPerGame}</div>
              <div className="text-sm text-gray-600">Goal per Partita</div>
            </div>
          </div>
        )}
      </div>

      {/* Games Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FontAwesomeIcon icon={faFutbol} className="mr-3 text-blue-600" />
          Partite Giocate
        </h2>
        {games.length > 0 ? (
          <div className="space-y-3">
            {games.map((game) => {
              const hasGoals = gamesWithGoals.includes(game.id);
              const gameGoals = goals.filter((goal) => goal.game_id === game.id);

              return (
                <div key={game.id} className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${hasGoals ? "bg-green-50 border-green-200" : "bg-gray-50"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="font-semibold text-gray-800">{game.homeTeam?.name || "Squadra Casa"}</div>
                        <div className="text-2xl font-bold text-blue-600">{game.home_team_score}</div>
                      </div>
                      <div className="text-gray-400">vs</div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-800">{game.awayTeam?.name || "Squadra Trasferta"}</div>
                        <div className="text-2xl font-bold text-blue-600">{game.away_team_score}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-1">{new Date(game.date).toLocaleDateString("it-IT")}</div>
                      {hasGoals && (
                        <div className="flex items-center text-green-600 font-semibold">
                          <FontAwesomeIcon icon={faFutbol} className="mr-1" />
                          {gameGoals.length} goal{gameGoals.length > 1 ? "i" : ""}
                        </div>
                      )}
                    </div>
                  </div>
                  {hasGoals && (
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <div className="text-sm text-green-700">
                        <strong>Goal segnati:</strong> {gameGoals.map((goal) => `Minuto ${goal.minute}${goal.description ? ` - ${goal.description}` : ""}`).join(", ")}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Nessuna partita trovata per questo giocatore.</p>
        )}
      </div>
    </div>
  );
}
