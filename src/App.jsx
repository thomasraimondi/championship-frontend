import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import ChampionshipPage from "./pages/ChampionshipPage";
import TeamPage from "./pages/TeamPage";
import PlayerPage from "./pages/PlayerPage";
import MatchPage from "./pages/MatchPage";
import StandingPage from "./pages/StandingPage";
import ChampionshipDetailsPage from "./pages/ChampionshipDetailsPage";
import TeamDetailsPage from "./pages/TeamDetailsPage";
import PlayerDetailsPage from "./pages/PlayerDetailsPage";
import MatchDetailsPage from "./pages/MatchDetailsPage";
import StandingDetailsPage from "./pages/StandingDetailsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/championship" element={<ChampionshipPage />} />
          <Route path="/championship/:id" element={<ChampionshipDetailsPage />} />
          <Route path="/teams" element={<TeamPage />} />
          <Route path="/team/:id" element={<TeamDetailsPage />} />
          <Route path="/players" element={<PlayerPage />} />
          <Route path="/player/:id" element={<PlayerDetailsPage />} />
          <Route path="/matches" element={<MatchPage />} />
          <Route path="/match/:id" element={<MatchDetailsPage />} />
          <Route path="/standings" element={<StandingPage />} />
          <Route path="/standings/:id" element={<StandingDetailsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
