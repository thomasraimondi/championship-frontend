import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./assets/layouts/MainLayout";
import HomePage from "./assets/pages/HomePage";
import ChampionshipPage from "./assets/pages/ChampionshipPage";
import TeamPage from "./assets/pages/TeamPage";
import PlayerPage from "./assets/pages/PlayerPage";
import MatchPage from "./assets/pages/MatchPage";
import StandingPage from "./assets/pages/StandingPage";
import ChampionshipDetailsPage from "./assets/pages/ChampionshipDetailsPage";
import TeamDetailsPage from "./assets/pages/TeamDetailsPage";
import PlayerDetailsPage from "./assets/pages/PlayerDetailsPage";
import MatchDetailsPage from "./assets/pages/MatchDetailsPage";
import StandingDetailsPage from "./assets/pages/StandingDetailsPage";

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
