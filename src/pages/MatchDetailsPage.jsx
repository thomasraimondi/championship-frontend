import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function MatchDetailsPage() {
  const { id } = useParams();
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:8000/api/games/${id}`);
        console.log(response.data.data);
        setMatchData(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to fetch match data");
      } finally {
        setLoading(false);
      }
    };

    fetchMatchData();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Caricamento...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Errore</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!matchData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Match non trovato</h2>
        </div>
      </div>
    );
  }

  const homeGoals = [];
  const awayGoals = [];

  if (matchData.goal) {
    matchData.goal.forEach((goal) => {
      if (goal.soccer.team_id === matchData.home_team?.id) {
        homeGoals.push(goal);
      } else if (goal.soccer.team_id === matchData.away_team?.id) {
        awayGoals.push(goal);
      }
    });
  }

  homeGoals.sort((a, b) => a.minute - b.minute);
  awayGoals.sort((a, b) => a.minute - b.minute);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        <Link to={`/team/${matchData.home_team?.id}`} className="hover:text-blue-600">
          {matchData.home_team?.name || "Squadra Casa"}
        </Link>{" "}
        vs{" "}
        <Link to={`/team/${matchData.away_team?.id}`} className="hover:text-red-600">
          {matchData.away_team?.name || "Squadra Trasferta"}
        </Link>
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Informazioni Match</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p>
              <strong>Data:</strong> {matchData.date || "N/A"}
            </p>
          </div>
          <div>
            <p>
              <strong>Risultato:</strong> {matchData.home_team_score || 0} - {matchData.away_team_score || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Goal del Match</h2>
        {homeGoals.length > 0 || awayGoals.length > 0 ? (
          <div className="flex items-center justify-center">
            <h3 className="w-1/2 text-lg font-semibold mb-4 text-center text-blue-600">{matchData.home_team?.name || "Squadra Casa"}</h3>
            <h3 className="w-1/2 text-lg font-semibold mb-4 text-center text-red-600">{matchData.away_team?.name || "Squadra Trasferta"}</h3>
          </div>
        ) : (
          <p className="text-gray-600 text-center py-4">Nessun goal segnato in questo match</p>
        )}
        <div className="flex items-center justify-center">
          <div className="w-full">
            {matchData.goal &&
              matchData.goal.map((goal) => {
                if (goal.soccer.team_id === matchData.home_team?.id) {
                  return (
                    <div key={goal.id} className="w-full flex items-center justify-center border-b border-gray-200">
                      <div className="w-1/2">
                        {goal.soccer.name} - {goal.minute}
                      </div>
                      <div className="w-1/2"></div>
                    </div>
                  );
                } else if (goal.soccer.team_id === matchData.away_team?.id) {
                  console.log("goal away:", goal);
                  return (
                    <div className="w-full flex items-center justify-center border-b border-gray-200">
                      <div className="w-1/2"></div>
                      <div key={goal.id}>
                        {goal.soccer.name} - {goal.minute}
                      </div>
                    </div>
                  );
                } else {
                  return null;
                }
              })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {matchData.home_team?.soccers && matchData.home_team.soccers.length > 0 ? (
            <div className="space-y-2">
              {matchData.home_team.soccers.map((player, index) => (
                <Link key={index} to={`/player/${player.id}`} className="block mb-2">
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">{player.name || "Giocatore"}</p>
                      <p className="text-sm text-gray-600">
                        {player.role || "Ruolo"} • {player.number || "N/A"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{player.age ? `${player.age} anni` : "Età N/A"}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">Nessun giocatore disponibile</p>
          )}
        </div>

        {/* Away Team Players */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {matchData.away_team?.soccers && matchData.away_team.soccers.length > 0 ? (
            <div className="space-y-2">
              {matchData.away_team.soccers.map((player, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">{player.name || "Giocatore"}</p>
                    <p className="text-sm text-gray-600">
                      {player.role || "Ruolo"} • {player.number || "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{player.age ? `${player.age} anni` : "Età N/A"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">Nessun giocatore disponibile</p>
          )}
        </div>
      </div>
    </div>
  );
}
