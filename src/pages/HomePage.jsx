import { useState, useEffect } from "react";
import axios from "axios";
import Jumbotron from "../components/Jumbotron";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [todayMatches, setTodayMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch matches
        const matchesResponse = await axios.get("http://127.0.0.1:8000/api/games");
        const allMatches = matchesResponse.data.data;

        // Filter matches for today (you might need to adjust this based on your API date format)
        const today = new Date().toISOString().split("T")[0];
        const todayMatchesFiltered = allMatches.filter((match) => {
          // Assuming your API has a date field - adjust field name as needed
          const matchDate = match.date || match.game_date || match.match_date;
          return matchDate && matchDate.split("T")[0] === today;
        });

        // If no matches today, show next few matches as fallback
        const matchesToShow = todayMatchesFiltered.length > 0 ? todayMatchesFiltered.slice(0, 3) : allMatches.slice(0, 3);

        setTodayMatches(matchesToShow);

        // Extract unique teams from today's matches
        const uniqueTeams = [];
        const teamIds = new Set();

        matchesToShow.forEach((match) => {
          if (!teamIds.has(match.home_team.id)) {
            uniqueTeams.push(match.home_team);
            teamIds.add(match.home_team.id);
          }
          if (!teamIds.has(match.away_team.id)) {
            uniqueTeams.push(match.away_team);
            teamIds.add(match.away_team.id);
          }
        });

        setTeams(uniqueTeams);

        // Fetch players (showing all for now - might need API filtering by team)
        const playersResponse = await axios.get("http://127.0.0.1:8000/api/soccers");
        const allPlayers = playersResponse.data.data;

        // Show random selection of players or filter by teams if possible
        const playersToShow = allPlayers.slice(0, 6); // Show first 6 players
        setPlayers(playersToShow);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Jumbotron />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-600">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">⚽</span>
              <h2 className="text-xl font-bold text-green-800">Partite della Giornata</h2>
            </div>
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {todayMatches.length > 0 ? (
                  todayMatches.map((match) => (
                    <div key={match.id} className="bg-gray-50 p-3 rounded-lg">
                      <Link to={`/match/${match.id}`}>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">{match.home_team.name}</span>
                          <span className="text-green-600 font-bold">VS</span>
                          <span className="font-medium text-sm">{match.away_team.name}</span>
                        </div>
                        {match.time && <div className="text-xs text-gray-500 text-center mt-1">{match.time}</div>}
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Nessuna partita oggi</p>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-blue-600">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">🏟️</span>
              <h2 className="text-xl font-bold text-blue-800">Team in Campo</h2>
            </div>
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <div className="space-y-2 flex flex-col">
                {teams.length > 0 ? (
                  teams.map((team) => (
                    <Link className="bg-blue-50 p-2 rounded-lg" key={team.id} to={`/team/${team.id}`}>
                      <span className="font-medium text-sm text-blue-800">{team.name}</span>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Nessun team</p>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-yellow-600">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">👤</span>
              <h2 className="text-xl font-bold text-yellow-800">Giocatori in Evidenza</h2>
            </div>
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {players.length > 0 ? (
                  players.map((player) => (
                    <Link key={player.id} to={`/player/${player.id}`} className="block mb-2">
                      <div className="bg-yellow-50 p-2 rounded-lg">
                        <span className="font-medium text-sm text-yellow-800">{player.name}</span>
                        {player.team && <div className="text-xs text-gray-500">{player.team}</div>}
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Nessun giocatore</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
