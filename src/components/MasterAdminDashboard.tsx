/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Tournament, Match, Club, Player, News, MatchEvent } from "../types";
import { Trophy, Plus, Settings, Play, CheckCircle, RefreshCcw, Calendar, Trash2, Heart, Shield, Award, Edit, FileText } from "lucide-react";

interface MasterAdminDashboardProps {
  tournaments: Tournament[];
  matches: Match[];
  clubs: Club[];
  players: Player[];
  news: News[];
  onAddTournament: (tourData: Partial<Tournament>) => void;
  onAddMatch: (matchData: Partial<Match>) => void;
  onUpdateMatch: (matchId: string, matchData: Partial<Match>) => void;
  onDeleteMatch: (matchId: string) => void;
  onAddNews: (newsData: Partial<News>) => void;
  onDeleteTournament: (tournamentId: string) => void;
  onRecalculateStandings: (tournamentId: string) => void;
  onDeleteClub: (clubId: string) => void;
  onUpdateClub: (clubId: string, clubData: Partial<Club>) => void;
  onRemovePlayer: (playerId: string) => void;
  onUpdatePlayer: (playerId: string, playerData: Partial<Player>) => void;
  onSeedDatabase?: () => void;
}

export function MasterAdminDashboard({
  tournaments,
  matches,
  clubs,
  players,
  news,
  onAddTournament,
  onAddMatch,
  onUpdateMatch,
  onDeleteMatch,
  onAddNews,
  onDeleteTournament,
  onRecalculateStandings,
  onDeleteClub,
  onUpdateClub,
  onRemovePlayer,
  onUpdatePlayer,
  onSeedDatabase
}: MasterAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"campeonatos" | "partidas" | "noticias" | "times">("campeonatos");

  // Tournament creation States
  const [tName, setTName] = useState("");
  const [tLogo, setTLogo] = useState("🏆");
  const [tType, setTType] = useState<Tournament["type"]>("Pontos Corridos");
  const [tSeason, setTSeason] = useState("Temporada 2026");
  const [tRules, setTRules] = useState("");
  const [tNumTeams, setTNumTeams] = useState<number>(10);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [tStartDate, setTStartDate] = useState("2026-06-10");
  const [tEndDate, setTEndDate] = useState("2026-11-20");

  // Match addition States
  const [matchTournamentId, setMatchTournamentId] = useState("");
  const [matchRound, setMatchRound] = useState<number>(1);
  const [matchDate, setMatchDate] = useState("2026-06-10");
  const [matchTime, setMatchTime] = useState("21:00");
  const [matchStadium, setMatchStadium] = useState("Estádio Principal");
  const [matchHomeId, setMatchHomeId] = useState("");
  const [matchAwayId, setMatchAwayId] = useState("");

  // Scorer/Event log state
  const [liveMatchId, setLiveMatchId] = useState<string | null>(null);
  const [eventTime, setEventTime] = useState<number>(45);
  const [eventType, setEventType] = useState<"goal" | "yellow" | "red">("goal");
  const [eventPlayerId, setEventPlayerId] = useState("");
  const [postMatchGoalScorerId, setPostMatchGoalScorerId] = useState("");
  const [postMatchAssistPlayerId, setPostMatchAssistPlayerId] = useState("");

  // News creation state
  const [newsTitle, setNewsTitle] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [newsImage, setNewsImage] = useState("");

  const activeLiveMatch = matches.find(m => m.id === liveMatchId);

  // Admin-specific editing states for Clubs and Players
  const [editingAdminClubId, setEditingAdminClubId] = useState<string | null>(null);
  const [editClubName, setEditClubName] = useState("");
  const [editClubCity, setEditClubCity] = useState("São Paulo");
  const [editClubState, setEditClubState] = useState("SP");
  const [editClubLogo, setEditClubLogo] = useState("🛡️");
  const [editClubManager, setEditClubManager] = useState("");
  const [editClubCaptain, setEditClubCaptain] = useState("");
  const [editClubPrimaryKit, setEditClubPrimaryKit] = useState("#FFFFFF");
  const [editClubSecondaryKit, setEditClubSecondaryKit] = useState("#000000");

  const [editingAdminPlayerId, setEditingAdminPlayerId] = useState<string | null>(null);
  const [editPlayerNickname, setEditPlayerNickname] = useState("");
  const [editPlayerName, setEditPlayerName] = useState("");
  const [editPlayerEaId, setEditPlayerEaId] = useState("");
  const [editPlayerPosition, setEditPlayerPosition] = useState<Player["position"]>("Atacante");
  const [editPlayerNumber, setEditPlayerNumber] = useState(10);
  const [editPlayerGoals, setEditPlayerGoals] = useState(0);
  const [editPlayerAssists, setEditPlayerAssists] = useState(0);

  const handleEditClubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdminClubId) return;
    onUpdateClub(editingAdminClubId, {
      name: editClubName,
      city: editClubCity,
      state: editClubState,
      logo: editClubLogo,
      manager: editClubManager,
      captain: editClubCaptain,
      primaryKit: editClubPrimaryKit,
      secondaryKit: editClubSecondaryKit
    });
    setEditingAdminClubId(null);
    alert("Equipe atualizada com sucesso pelo Administrador!");
  };

  const handleEditPlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdminPlayerId) return;
    onUpdatePlayer(editingAdminPlayerId, {
      nickname: editPlayerNickname,
      name: editPlayerName,
      eaId: editPlayerEaId,
      position: editPlayerPosition,
      number: Number(editPlayerNumber) || 10,
      goals: Number(editPlayerGoals) || 0,
      assists: Number(editPlayerAssists) || 0
    });
    setEditingAdminPlayerId(null);
    alert("Atleta atualizado com sucesso pelo Administrador!");
  };

  const startEditingClub = (club: Club) => {
    setEditingAdminClubId(club.id);
    setEditClubName(club.name);
    setEditClubCity(club.city);
    setEditClubState(club.state);
    setEditClubLogo(club.logo);
    setEditClubManager(club.manager);
    setEditClubCaptain(club.captain);
    setEditClubPrimaryKit(club.primaryKit || "#FFFFFF");
    setEditClubSecondaryKit(club.secondaryKit || "#000000");
  };

  const startEditingPlayer = (player: Player) => {
    setEditingAdminPlayerId(player.id);
    setEditPlayerNickname(player.nickname);
    setEditPlayerName(player.name);
    setEditPlayerEaId(player.eaId);
    setEditPlayerPosition(player.position);
    setEditPlayerNumber(player.number);
    setEditPlayerGoals(player.goals || 0);
    setEditPlayerAssists(player.assists || 0);
  };

  // Toggle selected team for tournament creation
  const handleTeamToggle = (teamId: string) => {
    if (selectedTeams.includes(teamId)) {
      setSelectedTeams(selectedTeams.filter(id => id !== teamId));
    } else {
      setSelectedTeams([...selectedTeams, teamId]);
    }
  };

  // Submit tournament
  const handleCreateTournamentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName) return;

    onAddTournament({
      name: tName,
      logo: tLogo,
      type: tType,
      season: tSeason,
      rules: tRules || `Campeonato oficial ${tName} - FPC`,
      numTeams: Number(tNumTeams) || 12,
      teams: selectedTeams,
      startDate: tStartDate,
      endDate: tEndDate,
      createdAt: new Date().toISOString()
    });

    setTName("");
    setTRules("");
    setSelectedTeams([]);
    alert("Campeonato registrado com sucesso!");
  };

  // Submit dynamic match
  const handleCreateMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchTournamentId || !matchHomeId || !matchAwayId) return;

    const homeClub = clubs.find(c => c.id === matchHomeId);
    const awayClub = clubs.find(c => c.id === matchAwayId);

    if (!homeClub || !awayClub) return;

    onAddMatch({
      tournamentId: matchTournamentId,
      round: Number(matchRound) || 1,
      date: matchDate,
      time: matchTime,
      stadium: matchStadium,
      homeTeamId: matchHomeId,
      homeTeamName: homeClub.name,
      homeTeamLogo: homeClub.logo,
      awayTeamId: matchAwayId,
      awayTeamName: awayClub.name,
      awayTeamLogo: awayClub.logo,
      homeScore: 0,
      awayScore: 0,
      status: "agendado",
      events: [],
      stats: {
        homePossession: 50,
        awayPossession: 50,
        homeShots: 0,
        awayShots: 0,
        homeFouls: 0,
        awayFouls: 0
      }
    });

    setMatchHomeId("");
    setMatchAwayId("");
    alert("Partida agendada individualmente com sucesso!");
  };

  // Submit dynamic news
  const handleCreateNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsContent) return;

    onAddNews({
      title: newsTitle,
      content: newsContent,
      image: newsImage || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800",
      date: new Date().toISOString().split("T")[0],
      author: "Master Administrador"
    });

    setNewsTitle("");
    setNewsContent("");
    setNewsImage("");
    alert("Artigo de Notícia postado em todos os canais FPC!");
  };

  // AUTOMATIC ROUND-ROBIN GENERATOR
  const handleGenerateTournamentFixtures = (tournament: Tournament) => {
    const tTeams = tournament.teams;
    if (tTeams.length < 2) {
      alert("Para gerar uma tabela, o campeonato precisa de no mínimo 2 clubes convidados!");
      return;
    }

    // Double Round Robin or standard match schedules
    let list = [...tTeams];
    if (list.length % 2 !== 0) {
      list.push("BYE"); // dummy team for odd counts
    }

    const n = list.length;
    const roundsCount = n - 1;
    const matchesPerRound = n / 2;

    let generatedCount = 0;

    // We will generate fixtures for the first round leg
    for (let r = 0; r < roundsCount; r++) {
      for (let m = 0; m < matchesPerRound; m++) {
        const homeIdx = (r + m) % (n - 1);
        let awayIdx = (n - 1 - m + r) % (n - 1);
        if (m === 0) {
          awayIdx = n - 1;
        }

        const homeId = list[homeIdx];
        const awayId = list[awayIdx];

        if (homeId === "BYE" || awayId === "BYE") continue;

        const homeClub = clubs.find(c => c.id === homeId);
        const awayClub = clubs.find(c => c.id === awayId);

        if (homeClub && awayClub) {
          const gameDate = new Date();
          // spacing out game dates relative to current date (e.g. 2026-06-05)
          gameDate.setDate(gameDate.getDate() + 5 + r * 3);
          const dateStr = gameDate.toISOString().split("T")[0];

          onAddMatch({
            tournamentId: tournament.id,
            round: r + 1,
            date: dateStr,
            time: "21:30",
            stadium: `${homeClub.name} Stadium`,
            homeTeamId: homeClub.id,
            homeTeamName: homeClub.name,
            homeTeamLogo: homeClub.logo,
            awayTeamId: awayClub.id,
            awayTeamName: awayClub.name,
            awayTeamLogo: awayClub.logo,
            homeScore: 0,
            awayScore: 0,
            status: "agendado",
            events: [],
            stats: {
              homePossession: 50,
              awayPossession: 50,
              homeShots: 0,
              awayShots: 0,
              homeFouls: 0,
              awayFouls: 0
            }
          });
          generatedCount++;
        }
      }
    }

    alert(`Sucesso! Foram sorteadas e criadas ${generatedCount} partidas automáticas em ${roundsCount} rodadas oficiais no Firebase!`);
  };

  // Add event (scorer, card) to active live-running match
  const handleAddLiveEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLiveMatch || !eventPlayerId) return;

    const athlete = players.find(p => p.id === eventPlayerId);
    if (!athlete) return;

    const newEvent = {
      id: "ev-" + Math.random().toString(36).substr(2, 9),
      time: Number(eventTime) || 30,
      type: eventType,
      playerId: eventPlayerId,
      playerName: athlete.name,
      playerNickname: athlete.nickname,
      clubId: athlete.clubId
    };

    // Construct updated score if it was a goal!
    const isHomeScoring = athlete.clubId === activeLiveMatch.homeTeamId;
    const hScore = isHomeScoring && eventType === "goal" ? activeLiveMatch.homeScore + 1 : activeLiveMatch.homeScore;
    const aScore = !isHomeScoring && eventType === "goal" ? activeLiveMatch.awayScore + 1 : activeLiveMatch.awayScore;

    // Update match Events sequence
    onUpdateMatch(activeLiveMatch.id, {
      homeScore: hScore,
      awayScore: aScore,
      events: [...activeLiveMatch.events, newEvent]
    });

    setEventPlayerId("");
    alert("Fato/Estatística registrado em tempo real no Live Match!");
  };

  return (
    <div id="master-admin-root" className="space-y-8">
      {/* 1. Header indicators */}
      <div className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-none p-6 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-sm font-display tracking-[0.25em] text-white uppercase flex items-center gap-2">
            🛡️ PAINEL MASTER DE ADMINISTRAÇÃO FPC
          </h2>
          <p className="text-[10px] text-zinc-400 font-sans mt-1">
            Controle integral da Federação: homologação de campeonatos, súmulas, disparador de gols em tempo real e pontuação automática.
          </p>
        </div>
        {/* Toggle columns */}
        <div className="flex bg-black border border-white/10 p-1 rounded-none gap-1 shrink-0 text-xs font-bold uppercase font-mono flex-wrap">
          <button onClick={() => setActiveTab("campeonatos")} className={`px-4 py-2 rounded-none transition duration-300 font-sans text-[10px] tracking-wider cursor-pointer ${activeTab === "campeonatos" ? "bg-[#D4AF37] text-black" : "text-zinc-500 hover:text-white"}`}>
            Campeonatos
          </button>
          <button onClick={() => setActiveTab("partidas")} className={`px-4 py-2 rounded-none transition duration-300 font-sans text-[10px] tracking-wider cursor-pointer ${activeTab === "partidas" ? "bg-[#D4AF37] text-black" : "text-zinc-500 hover:text-white"}`}>
            Partidas
          </button>
          <button onClick={() => setActiveTab("times")} className={`px-4 py-2 rounded-none transition duration-300 font-sans text-[10px] tracking-wider cursor-pointer ${activeTab === "times" ? "bg-[#D4AF37] text-black" : "text-zinc-500 hover:text-white"}`}>
            Times Cadastrados ({clubs.length})
          </button>
          <button onClick={() => setActiveTab("noticias")} className={`px-4 py-2 rounded-none transition duration-300 font-sans text-[10px] tracking-wider cursor-pointer ${activeTab === "noticias" ? "bg-[#D4AF37] text-black" : "text-zinc-500 hover:text-white"}`}>
            Notícias
          </button>
        </div>
      </div>

      {/* Database Management Controls */}
      <div className="bg-[#0c0c0c] border border-white/5 rounded-none p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <div>
            <p className="text-[10px] font-mono tracking-wider text-emerald-400 uppercase">BANCO DE DADOS EM TEMPO REAL FUNCIONAL (100%)</p>
            <p className="text-[9px] text-zinc-500">Firebase Firestore sincronizado com sucesso no navegador</p>
          </div>
        </div>
        {onSeedDatabase && (
          <button
            onClick={() => {
              if (window.confirm("Aviso: Esta ação irá preencher o banco de dados do Firebase Firestore com o conjunto oficial inicial de campeonatos, clubes e atletas da FPC. Deseja prosseguir?")) {
                onSeedDatabase();
                alert("CARGA INICIAL: Sincronização e carga preliminar concluídas em tempo real no Firestore!");
              }
            }}
            className="px-4 py-2 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] text-[9px] font-mono tracking-widest uppercase transition duration-300 rounded-none cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCcw className="w-3 h-3 animate-spin duration-1000" /> Carga Inicial (Seed Firestore)
          </button>
        )}
      </div>

      {/* 2. TAB A: CAMPEONATOS & AUTOMATION */}
      {activeTab === "campeonatos" && (
        <div id="master-tab-campeonatos" className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Create tournament */}
          <div className="bg-[#090909]/80 border border-white/5 rounded-none p-5 sm:p-6 shadow-lg">
            <h3 className="text-[10px] font-display font-light text-[#D4AF37] uppercase tracking-[0.2em] mb-5 border-l border-[#D4AF37] pl-3">
              Adicionar Novo Campeonato Oficial
            </h3>
            <form onSubmit={handleCreateTournamentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">NOME DO CAMPEONATO:</label>
                <input
                  id="admin-t-name"
                  type="text"
                  className="w-full bg-black text-white border border-white/10 rounded-none p-2.5 focus:outline-none focus:border-[#D4AF37]/45"
                  placeholder="Ex: Taça dos Campeões Elite"
                  value={tName}
                  onChange={e => setTName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">LOGO (EMOJI):</label>
                  <input
                    id="admin-t-logo"
                    type="text"
                    className="w-full bg-black text-white border border-white/10 rounded-none p-2.5 text-center text-lg focus:outline-none focus:border-[#D4AF37]/45 font-mono"
                    value={tLogo}
                    onChange={e => setTLogo(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5 font-sans">ESTILO CAMPEONATO:</label>
                  <select
                    id="admin-t-type"
                    className="w-full bg-black text-white border border-white/10 rounded-none p-2.5 font-sans focus:outline-none focus:border-[#D4AF37]/45"
                    value={tType}
                    onChange={e => setTType(e.target.value as Tournament["type"])}
                  >
                    <option value="Pontos Corridos">Pontos Corridos</option>
                    <option value="Mata-Mata">Mata-Mata</option>
                    <option value="Liga">Liga</option>
                    <option value="Copa">Copa</option>
                    <option value="Super Copa">Super Copa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5 font-sans">TEMPORADA INDEX:</label>
                  <input
                    id="admin-t-season"
                    type="text"
                    className="w-full bg-black text-white border border-white/10 rounded-none p-2.5 focus:outline-none focus:border-[#D4AF37]/45"
                    value={tSeason}
                    onChange={e => setTSeason(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5 font-sans">REGULAMENTO COMPLETO (TEXTO):</label>
                <textarea
                  id="admin-t-rules"
                  rows={2}
                  className="w-full bg-black text-white border border-white/10 rounded-none p-2.5 resize-none focus:outline-none focus:border-[#D4AF37]/45 leading-relaxed"
                  placeholder="Instruções gerais, placar de desempate, W.O..."
                  value={tRules}
                  onChange={e => setTRules(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-[#D4AF37] font-mono tracking-widest uppercase mb-1.5">DATA DE INÍCIO DO CAMPEONATO:</label>
                  <input
                    id="admin-t-startdate"
                    type="date"
                    className="w-full bg-black text-white border border-white/10 rounded-none p-2.5 focus:outline-none focus:border-[#D4AF37]/45 font-mono text-xs"
                    value={tStartDate}
                    onChange={e => setTStartDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-[#D4AF37] font-mono tracking-widest uppercase mb-1.5">DATA DE ENCERRAMENTO DO CAMPEONATO:</label>
                  <input
                    id="admin-t-enddate"
                    type="date"
                    className="w-full bg-black text-white border border-white/10 rounded-none p-2.5 focus:outline-none focus:border-[#D4AF37]/45 font-mono text-xs"
                    value={tEndDate}
                    onChange={e => setTEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Multi-select check clubs */}
              <div>
                <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-2 font-sans">CONVIDAR TIMES INTEGRANTES:</label>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto bg-black p-2.5 rounded-none border border-white/5">
                  {clubs.map(c => (
                    <label key={c.id} className="flex items-center gap-2 text-[10px] text-zinc-400 select-none cursor-pointer p-1 rounded-none hover:bg-zinc-950 hover:text-white transition">
                      <input
                        type="checkbox"
                        checked={selectedTeams.includes(c.id)}
                        onChange={() => handleTeamToggle(c.id)}
                        className="rounded-none accent-[#D4AF37]"
                      />
                      <span className="font-sans">{c.logo} {c.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                id="submit-tournament"
                type="submit"
                className="w-full bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-extrabold uppercase tracking-[0.2em] py-3 text-[10px] rounded-none shadow-lg transition-all duration-300 cursor-pointer"
              >
                CRIAR E HOMOLOGAR TORNEIO
              </button>
            </form>
          </div>

          {/* Active Tournament list with Generate Fixture controls */}
          <div className="bg-[#090909]/80 border border-white/5 rounded-none p-5 sm:p-6 shadow-lg space-y-4">
            <h3 className="text-[10px] font-display font-light text-[#D4AF37] uppercase tracking-[0.2em] mb-5 border-l border-[#D4AF37] pl-3">
              Campeonatos Ativos & Geradores de Tabelas
            </h3>
            {tournaments.length === 0 ? (
              <p className="text-center py-10 text-zinc-500 text-xs">Sem campeonatos cadastrados no banco FPC.</p>
            ) : (
              <div className="space-y-4">
                {tournaments.map(tour => {
                  const tournamentMatches = matches.filter(m => m.tournamentId === tour.id);
                  return (
                    <div key={tour.id} className="bg-black/60 border border-white/5 p-4 rounded-none text-xs space-y-3.5">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl shrink-0 grayscale hover:grayscale-0 transition duration-300">{tour.logo}</span>
                          <div>
                            <p className="text-white font-bold tracking-wide text-xs uppercase font-sans">{tour.name}</p>
                            <p className="text-[9px] text-zinc-500 font-mono tracking-widest mt-1 uppercase">{tour.type} • {tour.season}</p>
                            {(tour.startDate || tour.endDate) && (
                              <p className="text-[9px] text-[#D4AF37]/90 font-mono tracking-widest mt-0.5 uppercase">
                                Duração: {tour.startDate} até {tour.endDate}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          id={`del-tour-${tour.id}`}
                          onClick={() => {
                            if (confirm(`Excluir campeonato ${tour.name}?`)) {
                              onDeleteTournament(tour.id);
                            }
                          }}
                          className="p-1 px-1.5 bg-zinc-950 border border-white/5 text-zinc-400 hover:text-rose-400 transition"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>

                      <div className="flex gap-2 items-center text-[9px] text-zinc-450 font-mono">
                        <span className="bg-white/5 px-2.5 py-1 rounded-none border border-white/10 text-zinc-350 tracking-wider">
                          {tour.teams.length} CLUBES CONVIDADOS
                        </span>
                        <span className="bg-[#D4AF37]/5 px-2.5 py-1 rounded-none border border-[#D4AF37]/20 text-[#D4AF37] tracking-wider">
                          {tournamentMatches.length} PARTIDAS AGENDADAS
                        </span>
                      </div>

                      {/* Scheduling action button */}
                      <div className="flex gap-2 text-[9px] font-mono tracking-widest uppercase">
                        {tournamentMatches.length === 0 ? (
                          <button
                            id={`gen-table-btn-${tour.id}`}
                            onClick={() => handleGenerateTournamentFixtures(tour)}
                            className="bg-transparent hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black hover:font-bold px-4 py-2 border border-[#D4AF37] rounded-none flex items-center gap-1.5 transition-all duration-300 cursor-pointer text-[9px]"
                          >
                            <Trophy size={11} />
                            GERAR TABELA INTEGRAL
                          </button>
                        ) : (
                          <div className="flex gap-2 w-full flex-wrap">
                            <span className="text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-3 py-2 rounded-none inline-flex items-center gap-1">
                              ✓ TABELA ATIVA E GERADA
                            </span>
                            <button
                              id={`recalc-standings-${tour.id}`}
                              onClick={() => {
                                onRecalculateStandings(tour.id);
                                alert("Classificação recalculada com sucesso!");
                              }}
                              className="text-[#D4AF37] bg-transparent border border-amber-500/35 hover:bg-amber-500 hover:text-black font-extrabold flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-none ml-auto transition-all duration-300 cursor-pointer"
                            >
                              <RefreshCcw size={11} /> RE-CALCULAR PONTUAÇÕES
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. TAB B: PARTIDAS & LIVE MATCH SCORE LOGS */}
      {activeTab === "partidas" && (
        <div id="master-tab-partidas" className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Create / Schedule manually */}
          <div className="bg-[#090909]/80 border border-white/5 rounded-none p-5 sm:p-6 shadow-lg space-y-3">
            <h3 className="text-[10px] font-display font-light text-[#D4AF37] uppercase tracking-[0.2em] mb-5 border-l border-[#D4AF37] pl-3">
              Agendar Partida Manualmente
            </h3>
            <form onSubmit={handleCreateMatchSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">VINCULAR AO CAMPEONATO:</label>
                <select
                  id="sched-tour"
                  className="w-full bg-black text-white border border-white/10 rounded-none p-2.5 focus:outline-none focus:border-[#D4AF37]/50"
                  value={matchTournamentId}
                  onChange={e => setMatchTournamentId(e.target.value)}
                  required
                >
                  <option value="">-- SELECIONE CAMPEONATO --</option>
                  {tournaments.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">CLUBE MANDANTE (CASA):</label>
                  <select
                    id="sched-home"
                    className="w-full bg-black text-white border border-white/10 rounded-none p-2.5 focus:outline-none focus:border-[#D4AF37]/50"
                    value={matchHomeId}
                    onChange={e => setMatchHomeId(e.target.value)}
                    required
                  >
                    <option value="">-- MANDANTE --</option>
                    {clubs.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">CLUBE VISITANTE (FORA):</label>
                  <select
                    id="sched-away"
                    className="w-full bg-black text-white border border-white/10 rounded-none p-2.5 focus:outline-none focus:border-[#D4AF37]/50"
                    value={matchAwayId}
                    onChange={e => setMatchAwayId(e.target.value)}
                    required
                  >
                    <option value="">-- VISITANTE --</option>
                    {clubs.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">Nº DA RODADA:</label>
                  <input
                    id="sched-round"
                    type="number"
                    className="w-full bg-black text-white border border-white/10 rounded-none p-2 text-center"
                    value={matchRound}
                    onChange={e => setMatchRound(Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">DATA EVENTO:</label>
                  <input
                    id="sched-date"
                    type="date"
                    className="w-full bg-black text-white border border-white/10 rounded-none p-1.5 focus:outline-none focus:border-[#D4AF37]/50"
                    value={matchDate}
                    onChange={e => setMatchDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">HORÁRIO:</label>
                  <input
                    id="sched-time"
                    type="text"
                    className="w-full bg-black text-white border border-white/10 rounded-none p-2 text-center focus:outline-none focus:border-[#D4AF37]/50"
                    placeholder="21:15"
                    value={matchTime}
                    onChange={e => setMatchTime(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">LOCAL / ESTÁDIO COBALT:</label>
                <input
                  id="sched-stadium"
                  type="text"
                  className="w-full bg-black text-white border border-white/10 rounded-none p-2.5 focus:outline-none focus:border-[#D4AF37]/50"
                  placeholder="Ex: Arena Corinthians"
                  value={matchStadium}
                  onChange={e => setMatchStadium(e.target.value)}
                />
              </div>

              <button
                id="submit-match-btn"
                type="submit"
                className="w-full bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-extrabold uppercase py-3 rounded-none flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-95 transition"
              >
                <Calendar size={13} />
                <span>Cadastrar Partida</span>
              </button>
            </form>
          </div>

          {/* Matches List & Real-time Live Match event logger */}
          <div className="bg-[#090909]/80 border border-white/5 rounded-none p-5 sm:p-6 shadow-lg space-y-4">
            <h3 className="text-[10px] font-display font-light text-[#D4AF37] uppercase tracking-[0.2em] mb-5 border-l border-[#D4AF37] pl-3">
              Partidas Agendadas & Painel live Match ao Vivo
            </h3>

            {/* If a match is selected for post-match analysis (when finished) or live logging */}
            {activeLiveMatch && (
              <div className="bg-amber-500/5 p-5 rounded-none border border-[#D4AF37]/30 space-y-4 text-xs animate-[fadeIn_0.5s_ease_out]">
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <span className="text-[9px] text-[#D4AF37] font-mono font-bold uppercase tracking-wider">
                    {activeLiveMatch.status === "encerrado" ? "PAINEL PÓS-JOGO (SÚMULA)" : "PAINEL LIVE TRANSMISSOR FPC"}
                  </span>
                  <button
                    id="close-live-feed-btn"
                    onClick={() => setLiveMatchId(null)}
                    className="text-[9px] text-zinc-500 hover:text-white uppercase font-mono font-bold tracking-wider cursor-pointer"
                  >
                    × Fechar Painel
                  </button>
                </div>

                {/* Score Summary */}
                <div className="flex justify-between items-center text-center">
                  <div className="w-5/12 font-bold text-white uppercase text-center shrink-0">
                    <p className="text-3xl">{activeLiveMatch.homeTeamLogo}</p>
                    <p className="text-[10px] text-zinc-300 font-sans tracking-wide mt-1.5 truncate">{activeLiveMatch.homeTeamName}</p>
                  </div>
                  <div className="w-2/12 flex items-center justify-center bg-black px-3.5 py-2 rounded-none border border-[#D4AF37]/35 font-mono text-xl font-bold text-[#D4AF37]">
                    <span>{activeLiveMatch.homeScore}</span>
                    <span className="mx-2 text-zinc-750">:</span>
                    <span>{activeLiveMatch.awayScore}</span>
                  </div>
                  <div className="w-5/12 font-bold text-white uppercase text-center shrink-0">
                    <p className="text-3xl">{activeLiveMatch.awayTeamLogo}</p>
                    <p className="text-[10px] text-zinc-300 font-sans tracking-wide mt-1.5 truncate">{activeLiveMatch.awayTeamName}</p>
                  </div>
                </div>

                {/* Post-match Actions: Match stats and player ratings */}
                {activeLiveMatch.status === "encerrado" ? (
                  <div className="space-y-4 mt-3 bg-black/80 p-4 border border-white/10">
                    <p className="text-[#D4AF37] font-semibold text-[9px] uppercase font-mono tracking-widest border-l border-[#D4AF37] pl-2">SÚMULA PÓS-JOGO:</p>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-[8px] text-zinc-500 font-mono tracking-wider mb-1">PLACAR MANDANTE:</label>
                           <input type="number" className="w-full bg-zinc-950 p-2 text-center" defaultValue={activeLiveMatch.homeScore} 
                               onBlur={e => onUpdateMatch(activeLiveMatch.id, { homeScore: parseInt(e.target.value) })} />
                        </div>
                        <div>
                           <label className="block text-[8px] text-zinc-500 font-mono tracking-wider mb-1">PLACAR VISITANTE:</label>
                           <input type="number" className="w-full bg-zinc-950 p-2 text-center" defaultValue={activeLiveMatch.awayScore} 
                               onBlur={e => onUpdateMatch(activeLiveMatch.id, { awayScore: parseInt(e.target.value) })} />
                        </div>
                    </div>

                    <p className="text-[#D4AF37] font-semibold text-[9px] uppercase font-mono tracking-widest border-l border-[#D4AF37] pl-2 mt-4">GOLS E ASSISTÊNCIAS:</p>
                    
                    {/* List of Goals and Cards */}
                    <div className="space-y-1 mb-3">
                         {activeLiveMatch.events.filter(e => e.type === "goal" || e.type === "yellow" || e.type === "red" || e.type === "assist").map(evt => (
                             <div key={evt.id} className="flex justify-between text-[10px] bg-white/5 p-1 px-2 border border-white/5 text-zinc-300">
                                 <span>
                                     {evt.type === "goal" && `⚽ ${evt.playerNickname} ${evt.assistPlayerNickname ? `(Ass: ${evt.assistPlayerNickname})` : ""}`}
                                     {evt.type === "yellow" && `🟨 ${evt.playerNickname}`}
                                     {evt.type === "red" && `🟥 ${evt.playerNickname}`}
                                     {evt.type === "assist" && `👟 ${evt.playerNickname}`}
                                 </span>
                                 <button className="text-red-500" onClick={async () => {
                                     const eventToRemove = activeLiveMatch.events.find(e => e.id === evt.id);
                                     if (!eventToRemove) return;
                                     
                                     // Update stats
                                     if (eventToRemove.type === "yellow") {
                                         const player = players.find(p => p.id === eventToRemove.playerId);
                                         if (player) await onUpdatePlayer(player.id, { yellowCards: Math.max(0, (player.yellowCards || 0) - 1) });
                                     } else if (eventToRemove.type === "red") {
                                         const player = players.find(p => p.id === eventToRemove.playerId);
                                         if (player) await onUpdatePlayer(player.id, { redCards: Math.max(0, (player.redCards || 0) - 1) });
                                     } else if (eventToRemove.type === "assist") {
                                         const player = players.find(p => p.id === eventToRemove.playerId);
                                         if (player) await onUpdatePlayer(player.id, { assists: Math.max(0, (player.assists || 0) - 1) });
                                     }                

                                     await onUpdateMatch(activeLiveMatch.id, { events: activeLiveMatch.events.filter(e => e.id !== evt.id) });
                                 }}>×</button>
                             </div>
                         ))}
                    </div>

                    {/* Add Goal Form */}
                    <div className="grid grid-cols-2 gap-2">
                        <select className="bg-zinc-950 p-1 text-[9px]" value={postMatchGoalScorerId} onChange={e => setPostMatchGoalScorerId(e.target.value)}>
                            <option value="">-- Autor do Gol --</option>
                            {players.filter(p => p.clubId === activeLiveMatch.homeTeamId || p.clubId === activeLiveMatch.awayTeamId).map(p => <option key={p.id} value={p.id}>{p.nickname}</option>)}
                        </select>
                        <select className="bg-zinc-950 p-1 text-[9px]" value={postMatchAssistPlayerId} onChange={e => setPostMatchAssistPlayerId(e.target.value)}>
                            <option value="">-- Assistência --</option>
                            {players.filter(p => p.clubId === activeLiveMatch.homeTeamId || p.clubId === activeLiveMatch.awayTeamId).map(p => <option key={p.id} value={p.id}>{p.nickname}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <button 
                            className="bg-emerald-800 text-white p-1.5 text-[9px] font-bold"
                            onClick={() => {
                               const scorer = players.find(p => p.id === postMatchGoalScorerId);
                               if(!scorer) return;
                               const assist = players.find(p => p.id === postMatchAssistPlayerId);
                               
                               // Add Goal Event
                               const newEvent: MatchEvent = {
                                  id: Date.now().toString(), time: 90, type: "goal",
                                  playerId: scorer.id, playerName: scorer.name, playerNickname: scorer.nickname, clubId: scorer.clubId,
                                  ...(assist ? { assistPlayerId: assist.id, assistPlayerName: assist.name, assistPlayerNickname: assist.nickname } : {})
                               };
                               
                               // Update match with new goal
                               const newEvents = [...(activeLiveMatch.events || []), newEvent];

                               // Update Assist Count on Player
                               if(assist) {
                                   onUpdatePlayer(assist.id, { assists: (assist.assists || 0) + 1 });
                               }

                               onUpdateMatch(activeLiveMatch.id, { events: newEvents });
                               setPostMatchGoalScorerId(""); setPostMatchAssistPlayerId("");
                            }}
                        >
                            ADICIONAR GOL
                        </button>
                        <button 
                            className="bg-blue-800 text-white p-1.5 text-[9px] font-bold"
                            onClick={async () => {
                               const assist = players.find(p => p.id === postMatchAssistPlayerId);
                               if(!assist) return;
                               
                               // Add Assist Event
                               const newEvent: MatchEvent = {
                                  id: Date.now().toString(), time: 90, type: "assist",
                                  playerId: assist.id, playerName: assist.name, playerNickname: assist.nickname, clubId: assist.clubId,
                               };
                               
                               // Update match
                               const newEvents = [...(activeLiveMatch.events || []), newEvent];

                               // Update Assist Count on Player
                               await onUpdatePlayer(assist.id, { assists: (assist.assists || 0) + 1 });
                               await onUpdateMatch(activeLiveMatch.id, { events: newEvents });
                               
                               setPostMatchAssistPlayerId("");
                            }}
                        >
                            ADICIONAR ASSISTÊNCIA
                        </button>
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-2 p-2 border border-white/5 bg-black/50">
                        {players.filter(p => p.clubId === activeLiveMatch.homeTeamId || p.clubId === activeLiveMatch.awayTeamId).map(p => (
                            <div key={p.id} className="flex justify-between items-center text-xs">
                                <span className="text-zinc-300 truncate w-1/2">{p.nickname}</span>
                                <div className="flex items-center gap-1">
                                    <button 
                                        className="bg-yellow-500 text-black px-2 py-0.5 text-[8px] font-bold"
                                        onClick={async () => {
                                            const newEvent: MatchEvent = {
                                                id: Date.now().toString(), time: 90, type: "yellow",
                                                playerId: p.id, playerName: p.name, playerNickname: p.nickname, clubId: p.clubId,
                                            };
                                            await onUpdatePlayer(p.id, { yellowCards: (p.yellowCards || 0) + 1 });
                                            await onUpdateMatch(activeLiveMatch.id, { events: [...(activeLiveMatch.events || []), newEvent] });
                                        }}
                                    >🟨</button>
                                    <button 
                                        className="bg-red-600 text-white px-2 py-0.5 text-[8px] font-bold"
                                        onClick={async () => {
                                            const newEvent: MatchEvent = {
                                                id: Date.now().toString(), time: 90, type: "red",
                                                playerId: p.id, playerName: p.name, playerNickname: p.nickname, clubId: p.clubId,
                                            };
                                            await onUpdatePlayer(p.id, { redCards: (p.redCards || 0) + 1 });
                                            await onUpdateMatch(activeLiveMatch.id, { events: [...(activeLiveMatch.events || []), newEvent] });
                                        }}
                                    >🟥</button>
                                    <input 
                                        type="number" 
                                        min="0" max="10" step="0.1"
                                        placeholder="Nota"
                                        className="w-12 bg-zinc-950 p-1 text-center"
                                        defaultValue={activeLiveMatch.playerRatings?.[p.id] || ""}
                                        onBlur={async (e) => {
                                            const rating = parseFloat(e.target.value);
                                            const newRatings = { ...activeLiveMatch.playerRatings, [p.id]: rating };
                                            await onUpdateMatch(activeLiveMatch.id, { playerRatings: newRatings });
                                            await onUpdatePlayer(p.id, { averageRating: rating });
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                  </div>
                ) : (
                    /* Existing live event form here - keep temporarily if they really want/need it or handle differently */
                     <form id="live-event-form" onSubmit={handleAddLiveEventSubmit} className="space-y-3.5 mt-3 bg-black p-4 rounded-none border border-white/5 border-dashed">
                       {/* ... existing event form ... */}
                       <p className="text-[#D4AF37] font-semibold text-[9px] uppercase font-mono tracking-widest">REGISTRAR LANCE EM TEMPO REAL:</p>
                       <div className="grid grid-cols-3 gap-2">
                         <div>
                           <label className="block text-[8px] text-zinc-500 font-mono tracking-wider mb-1">MINUTO:</label>
                           <input
                             type="number"
                             className="w-full bg-zinc-950 text-white border border-white/10 rounded-none p-2 text-center focus:outline-none"
                             value={eventTime}
                             onChange={e => setEventTime(Number(e.target.value))}
                             required
                           />
                         </div>
                         <div className="col-span-2">
                           <label className="block text-[8px] text-zinc-500 font-mono tracking-wider mb-1 font-sans">LANÇAMENTO TIPO:</label>
                           <select
                             className="w-full bg-zinc-950 text-white border border-white/10 rounded-none p-2 focus:outline-none text-[10px]"
                             value={eventType}
                             onChange={e => setEventType(e.target.value as any)}
                             required
                           >
                             <option value="goal">⚽ GOL MARCADO</option>
                             <option value="yellow">🟨 CARTÃO AMARELO</option>
                             <option value="red">🟥 CARTÃO VERMELHO</option>
                           </select>
                         </div>
                       </div>
       
                       <div>
                         <label className="block text-[8px] text-zinc-500 font-mono tracking-wider mb-1 font-sans">JOGADOR REGISTRADO:</label>
                         <select
                           className="w-full bg-zinc-950 text-white border border-white/10 rounded-none p-2 font-mono text-[9px] focus:outline-none"
                           value={eventPlayerId}
                           onChange={e => setEventPlayerId(e.target.value)}
                           required
                         >
                           <option value="">-- SELECIONAR ATLETA ENVOLVIDO --</option>
                           {players.filter(p => p.clubId === activeLiveMatch.homeTeamId || p.clubId === activeLiveMatch.awayTeamId).map(p => {
                             const sideStr = p.clubId === activeLiveMatch.homeTeamId ? "[CASA]" : "[FORA]";
                             return (
                               <option key={p.id} value={p.id}>{p.nickname} {sideStr}</option>
                             );
                           })}
                         </select>
                       </div>
       
                       <button
                         id="submit-event-btn"
                         type="submit"
                         className="w-full bg-[#D4AF37] text-black font-extrabold uppercase tracking-[0.15em] py-2 px-3 rounded-none flex items-center justify-center gap-1.5 text-[9px] transition-all hover:brightness-110 cursor-pointer"
                       >
                         🚀 Disparar Lance Súmula
                       </button>
                     </form>
                )}

                {/* Clock controller / Terminate match */}
                {activeLiveMatch.status !== "encerrado" && (
                <div className="flex gap-2">
                  <button
                    id="sched-tick-clock-btn"
                    onClick={() => {
                      const minutes = activeLiveMatch.liveMinutes || 0;
                      onUpdateMatch(activeLiveMatch.id, { liveMinutes: minutes + 15 });
                    }}
                    className="flex-1 bg-transparent border border-[#D4AF37]/35 text-[#D4AF37] font-bold text-[9px] tracking-wider py-2 rounded-none flex items-center justify-center gap-1 hover:bg-[#D4AF37] hover:text-black transition duration-300"
                  >
                    ⏰ +15 MIN DE JOGO
                  </button>
                  <button
                    id="sched-terminate-btn"
                    onClick={() => {
                      onUpdateMatch(activeLiveMatch.id, { status: "encerrado", liveMinutes: 90 });
                      alert("Partida encerrada com sucesso!");
                    }}
                    className="flex-1 bg-rose-950/20 border border-rose-800 text-rose-300 font-extrabold text-[9px] tracking-widest py-2 rounded-none flex items-center justify-center gap-1 shadow-lg hover:bg-rose-900 hover:text-white transition duration-300"
                  >
                    🏁 ENCERRAR PARTIDA
                  </button>
                </div>
                )}
              </div>
            )}

            {/* Match Listings queue */}
            <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
              {matches.map(match => {
                const tourName = tournaments.find(t => t.id === match.tournamentId)?.name || "Campeonato FPC";
                return (
                  <div key={match.id} className="bg-black/60 p-4 rounded-none border border-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs text-zinc-300 hover:border-white/10 transition-all duration-300">
                    <div className="overflow-hidden">
                      <p className="text-[9px] text-[#D4AF37] font-mono tracking-widest uppercase font-semibold">{tourName} • RD {match.round}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="font-bold text-white font-sans text-xs tracking-wide">{match.homeTeamName}</span>
                        <span className="bg-black border border-white/10 px-2.5 py-0.5 rounded-none text-[#D4AF37] font-mono font-bold select-none text-xs">
                          {match.homeScore} - {match.awayScore}
                        </span>
                        <span className="font-bold text-white font-sans text-xs tracking-wide">{match.awayTeamName}</span>
                      </div>
                      <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider mt-2.5">Local: {match.stadium} • Data: {match.date} às {match.time}</p>
                    </div>

                    <div className="flex sm:flex-col gap-2 items-end shrink-0">
                      {match.status === "agendado" && (
                        <button
                          id={`start-match-btn-${match.id}`}
                          onClick={() => {
                            onUpdateMatch(match.id, { status: "andamento", liveMinutes: 0 });
                            setLiveMatchId(match.id);
                            alert("Partida iniciada! Use o painel de transmissor no topo para registrar gols e cartões em tempo real.");
                          }}
                          className="w-full bg-transparent border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black hover:font-bold px-3 py-1.5 rounded-none flex items-center justify-center gap-1 font-bold font-sans uppercase text-[9px] tracking-wider transition-all duration-300 cursor-pointer"
                        >
                          <Play size={10} /> Começar Match
                        </button>
                      )}
                      {match.status === "andamento" && (
                        <button
                          id={`manage-match-btn-${match.id}`}
                          onClick={() => setLiveMatchId(match.id)}
                          className="w-full bg-rose-500 text-black px-3 py-1.5 rounded-none flex items-center justify-center gap-1 font-sans font-extrabold text-[9px] tracking-wider uppercase cursor-pointer hover:bg-rose-600"
                        >
                          <Play size={10} className="animate-ping" /> PAINEL LIVE
                        </button>
                      )}
                      {match.status === "encerrado" && (
                        <button
                          id={`edit-match-btn-${match.id}`}
                          onClick={() => setLiveMatchId(match.id)}
                          className="w-full bg-zinc-800 text-white hover:bg-zinc-700 px-3 py-1.5 rounded-none flex items-center justify-center gap-1 font-sans font-extrabold text-[9px] tracking-wider uppercase cursor-pointer"
                        >
                          <Edit size={10} /> Editar Súmula
                        </button>
                      )}
                      <button
                        id={`del-match-${match.id}`}
                        onClick={() => onDeleteMatch(match.id)}
                        className="text-[9px] text-zinc-500 hover:text-rose-450 font-mono mt-1 tracking-wider uppercase cursor-pointer"
                      >
                        Excluir Jogo
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB C: NOTÍCIAS FEED */}
      {activeTab === "noticias" && (
        <div id="master-tab-noticias" className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Post Article */}
          <div className="xl:col-span-1 bg-[#090909]/80 border border-white/5 rounded-none p-5 sm:p-6 shadow-lg">
            <h3 className="text-[10px] font-display font-light text-[#D4AF37] uppercase tracking-[0.2em] mb-5 border-l border-[#D4AF37] pl-3">
              Disparar Artigo de Notícia
            </h3>
            <form onSubmit={handleCreateNewsSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">TÍTULO NOTICIAL:</label>
                <input
                  id="news-title-input"
                  type="text"
                  className="w-full bg-black text-white border border-white/10 rounded-none p-2.5 focus:outline-none focus:border-[#D4AF37]/50"
                  placeholder="Ex: Novo comitê antidoping Pro Clubs..."
                  value={newsTitle}
                  onChange={e => setNewsTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">IMAGEM URL PUBLICIDADE:</label>
                <input
                  id="news-img-input"
                  type="text"
                  className="w-full bg-black text-white border border-white/10 rounded-none p-2.5 focus:outline-none focus:border-[#D4AF37]/50"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newsImage}
                  onChange={e => setNewsImage(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">CORPO DA NOTÍCIA:</label>
                <textarea
                  id="news-desc"
                  rows={4}
                  className="w-full bg-black text-white border border-white/10 rounded-none p-2.5 resize-none focus:outline-none focus:border-[#D4AF37]/50 leading-relaxed"
                  placeholder="Escreva o texto completo da matéria..."
                  value={newsContent}
                  onChange={e => setNewsContent(e.target.value)}
                  required
                />
              </div>

              <button
                id="submit-news"
                type="submit"
                className="w-full bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-extrabold uppercase py-3 rounded-none shadow-md transition-all duration-300 text-[10px] tracking-widest cursor-pointer"
              >
                PUBLICAR MATÉRIA PORTAL
              </button>
            </form>
          </div>

          {/* Published Articles summary */}
          <div className="xl:col-span-2 bg-[#090909]/80 border border-white/5 rounded-none p-5 sm:p-6 shadow-lg">
            <h3 className="text-[10px] font-display font-light text-[#D4AF37] uppercase tracking-[0.2em] mb-5 border-l border-[#D4AF37] pl-3">
              Matérias Atuais no Portal FPC
            </h3>
            {/* News loop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Loop news */}
              {news.map(art => (
                <div key={art.id} className="bg-black/60 p-4 border border-white/5 rounded-none text-xs flex flex-col justify-between hover:border-white/10 transition-all duration-300">
                  <div>
                    <h4 className="text-white font-bold leading-snug truncate uppercase tracking-wide text-xs">{art.title}</h4>
                    <p className="text-[9px] text-[#D4AF37] font-mono mt-1.5 font-bold tracking-wider">{art.date}</p>
                    <p className="text-[10px] text-[zinc-400] leading-relaxed mt-2.5">{art.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB D: TIMES CADASTRADOS (ADMIN OVERRIDE) */}
      {activeTab === "times" && (
        <div id="master-tab-times" className="space-y-6">
          <div className="bg-[#090909]/80 border border-white/5 rounded-none p-5 sm:p-6 shadow-lg">
            <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-4">
              <div>
                <h3 className="text-xs font-display tracking-[0.2em] text-[#D4AF37] uppercase">
                  Controle Geral de Clubes & Elencos Cadastrados
                </h3>
                <p className="text-[10px] text-zinc-400 font-sans mt-1">
                  Visão total do ecossistema: o Administrador possui controle total para editar fichas e remover times ou atletas do banco de dados.
                </p>
              </div>
            </div>

            {/* Editing physical club form (Inline modal/box) */}
            {editingAdminClubId && (
              <form onSubmit={handleEditClubSubmit} className="bg-black/90 p-5 rounded-none border border-[#D4AF37]/40 mb-6 text-xs space-y-4">
                <p className="font-bold text-[#D4AF37] uppercase text-[9px] tracking-[0.2em] font-mono">
                  ✏️ EDITAR EQUIPE (ADMINISTRADOR)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[8px] text-zinc-500 font-mono tracking-widest uppercase mb-1">NOME DO CLUBE:</label>
                    <input
                      type="text"
                      className="w-full bg-zinc-950 border border-white/10 text-white rounded-none p-2 focus:outline-none focus:border-[#D4AF37]/50"
                      value={editClubName}
                      onChange={e => setEditClubName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] text-zinc-500 font-mono tracking-widest uppercase mb-1">ESCUDO (EMOJI):</label>
                    <input
                      type="text"
                      className="w-full bg-zinc-950 border border-white/10 text-white rounded-none p-2 text-center focus:outline-none focus:border-[#D4AF37]/50"
                      value={editClubLogo}
                      onChange={e => setEditClubLogo(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[8px] text-zinc-500 font-mono tracking-widest uppercase mb-1">SEDE:</label>
                      <input
                        type="text"
                        className="w-full bg-zinc-950 border border-white/10 text-white rounded-none p-2 focus:outline-none focus:border-[#D4AF37]/50"
                        value={editClubCity}
                        onChange={e => setEditClubCity(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] text-zinc-500 font-mono tracking-widest uppercase mb-1">UF:</label>
                      <input
                        type="text"
                        maxLength={2}
                        className="w-full bg-zinc-950 border border-white/10 text-white rounded-none p-2 text-center focus:outline-none focus:border-[#D4AF37]/50 font-mono"
                        value={editClubState}
                        onChange={e => setEditClubState(e.target.value.toUpperCase())}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[8px] text-zinc-500 font-mono tracking-widest uppercase mb-1">TÉCNICO / GESTOR:</label>
                    <input
                      type="text"
                      className="w-full bg-zinc-950 border border-white/10 text-white rounded-none p-2 focus:outline-none"
                      value={editClubManager}
                      onChange={e => setEditClubManager(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] text-zinc-500 font-mono tracking-widest uppercase mb-1">CAPITÃO ADVERSÁRIO:</label>
                    <input
                      type="text"
                      className="w-full bg-zinc-950 border border-white/10 text-white rounded-none p-2 focus:outline-none"
                      value={editClubCaptain}
                      onChange={e => setEditClubCaptain(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] text-zinc-500 font-mono tracking-widest uppercase mb-1 font-sans">PRIMARY KIT:</label>
                    <input
                      type="color"
                      className="w-full h-8 bg-transparent cursor-pointer"
                      value={editClubPrimaryKit}
                      onChange={e => setEditClubPrimaryKit(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] text-zinc-500 font-mono tracking-widest uppercase mb-1 font-sans">SECONDARY KIT:</label>
                    <input
                      type="color"
                      className="w-full h-8 bg-transparent cursor-pointer"
                      value={editClubSecondaryKit}
                      onChange={e => setEditClubSecondaryKit(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingAdminClubId(null)}
                    className="bg-zinc-900 border border-white/15 px-4 py-2 hover:bg-zinc-850 rounded-none text-zinc-400 text-[10px] uppercase font-mono"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-[#D4AF37] text-black px-5 py-2 font-bold hover:brightness-110 rounded-none text-[10px] uppercase tracking-wider"
                  >
                    Salvar Mudanças Equipe
                  </button>
                </div>
              </form>
            )}

            {/* Editing player details form (Inline modal/box) */}
            {editingAdminPlayerId && (
              <form onSubmit={handleEditPlayerSubmit} className="bg-black/90 p-5 rounded-none border border-red-500/45 mb-6 text-xs space-y-4">
                <p className="font-bold text-red-400 uppercase text-[9px] tracking-[0.2em] font-mono">
                  ✏️ EDITAR ATLETA & MICRO ESTATÍSTICAS (ADMINISTRADOR)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[8px] text-zinc-500 font-mono tracking-widest uppercase mb-1">CONCORDATÁRIO (NOME):</label>
                    <input
                      type="text"
                      className="w-full bg-zinc-950 border border-white/10 text-white rounded-none p-2 focus:outline-none"
                      value={editPlayerName}
                      onChange={e => setEditPlayerName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] text-zinc-500 font-mono tracking-widest uppercase mb-1">APELIDO EM JOGO:</label>
                    <input
                      type="text"
                      className="w-full bg-zinc-950 border border-white/10 text-white rounded-none p-2 focus:outline-none font-sans font-semibold"
                      value={editPlayerNickname}
                      onChange={e => setEditPlayerNickname(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] text-zinc-500 font-mono tracking-widest uppercase mb-1">EA ID CONTA:</label>
                    <input
                      type="text"
                      className="w-full bg-zinc-950 border border-white/10 text-white rounded-none p-2 focus:outline-none"
                      value={editPlayerEaId}
                      onChange={e => setEditPlayerEaId(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] text-zinc-500 font-mono tracking-widest uppercase mb-1">POSIÇÃO:</label>
                    <select
                      className="w-full bg-zinc-950 border border-white/10 text-white rounded-none p-2 focus:outline-none text-[10px]"
                      value={editPlayerPosition}
                      onChange={e => setEditPlayerPosition(e.target.value as any)}
                    >
                      <option value="Goleiro">Goleiro</option>
                      <option value="Zagueiro">Zagueiro</option>
                      <option value="Lateral">Lateral</option>
                      <option value="Volante">Volante</option>
                      <option value="Meio Campo">Meio Campo</option>
                      <option value="Meia Atacante">Meia Atacante</option>
                      <option value="Ponta">Ponta</option>
                      <option value="Atacante">Atacante</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[8px] text-zinc-500 font-mono tracking-widest uppercase mb-1">NÚMERO CAMISA:</label>
                    <input
                      type="number"
                      className="w-full bg-zinc-950 border border-white/10 text-white rounded-none p-2 focus:outline-none font-mono"
                      value={editPlayerNumber}
                      onChange={e => setEditPlayerNumber(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] text-zinc-500 font-mono tracking-widest uppercase mb-1 text-amber-500">GOLS ACUMULADOS:</label>
                    <input
                      type="number"
                      className="w-full bg-zinc-950 border border-amber-500/30 text-white rounded-none p-2 focus:outline-none font-mono font-bold"
                      value={editPlayerGoals}
                      onChange={e => setEditPlayerGoals(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] text-zinc-500 font-mono tracking-widest uppercase mb-1 text-zinc-300 font-sans">ASSISTÊNCIAS:</label>
                    <input
                      type="number"
                      className="w-full bg-zinc-950 border border-zinc-500/20 text-white rounded-none p-2 focus:outline-none font-mono font-bold"
                      value={editPlayerAssists}
                      onChange={e => setEditPlayerAssists(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingAdminPlayerId(null)}
                      className="flex-1 bg-zinc-900 border border-white/15 py-2.5 rounded-none text-zinc-400 text-[10px] uppercase font-mono"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-red-800 text-white py-2.5 font-bold hover:bg-red-700 rounded-none text-[10px] uppercase tracking-wider"
                    >
                      Gravar Dados Atleta
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* List of registered clubs and their squads */}
            {clubs.length === 0 ? (
              <p className="text-zinc-550 text-center py-10 font-sans">Sem times cadastrados até o momento.</p>
            ) : (
              <div className="space-y-6">
                {clubs.map(club => {
                  const squad = players.filter(p => p.clubId === club.id);
                  return (
                    <div key={club.id} className="bg-black/50 border border-white/5 rounded-none p-5 space-y-4">
                      {/* Club Header strip */}
                      <div className="flex justify-between items-center flex-wrap gap-4 border-b border-white/5 pb-3">
                        <div className="flex items-center gap-3.5">
                          <span className="text-3xl shrink-0 select-none">{club.logo || "🛡️"}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white uppercase">{club.name}</h4>
                              <span className="text-[8px] font-mono font-bold text-[#D4AF37] border border-[#D4AF37]/30 bg-[#D4AF37]/5 py-0.5 px-2">
                                {club.city} - {club.state}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-500 font-mono tracking-wide mt-1 uppercase">
                              Gestor Técnico: <strong className="text-white font-medium">{club.manager}</strong> • Capitão: <strong className="text-zinc-300 font-medium">{club.captain}</strong>
                            </p>
                          </div>
                        </div>

                        {/* Admin triggers */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEditingClub(club)}
                            className="bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-semibold text-[9px] uppercase tracking-wider py-1.5 px-3 rounded-none flex items-center gap-1 transition"
                          >
                            ✏️ Editar Equipe
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`ADMIN: Deseja realmente EXCLUIR permanentEMENTE o clube "${club.name}" e todos os seus atletas cadastrados? Esta ação é irreversível no Firebase!`)) {
                                onDeleteClub(club.id);
                              }
                            }}
                            className="bg-red-950/40 border border-red-800 text-red-300 hover:bg-red-900 hover:text-white font-semibold text-[9px] uppercase tracking-wider py-1.5 px-3 rounded-none flex items-center gap-1 transition"
                          >
                            🗑️ Excluir Clube
                          </button>
                        </div>
                      </div>

                      {/* Squad athletes listings */}
                      <div>
                        <p className="text-[9px] text-[#D4AF37] font-mono tracking-[0.2em] uppercase font-bold mb-3 font-sans">
                          Atletas no Elenco ({squad.length})
                        </p>
                        {squad.length === 0 ? (
                          <p className="text-zinc-650 text-[10px] font-mono uppercase italic font-sans pb-2">Nenhum jogador fichado neste clube.</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {squad.map(p => (
                              <div key={p.id} className="bg-black/90 p-3 rounded-none border border-white/5 flex justify-between gap-3 items-center hover:border-white/10 transition">
                                <div className="overflow-hidden">
                                  <div className="flex items-center gap-1.5 font-semibold text-white">
                                    <span className="truncate">{p.nickname}</span>
                                    <span className="text-[8px] bg-white/5 border border-white/15 py-0.5 px-1 font-mono text-zinc-400">{p.number}</span>
                                  </div>
                                  <p className="text-[9px] text-zinc-500 font-mono truncate uppercase mt-0.5">{p.name}</p>
                                  <p className="text-[9px] font-bold text-zinc-400 uppercase mt-1 inline-block bg-white/5 px-2 py-0.5 border border-white/5 shrink-0">{p.position}</p>
                                  <div className="flex gap-2 text-[9px] font-mono text-zinc-500 mt-2">
                                    <span>GOLS: <strong className="text-[#D4AF37]">{p.goals || 0}</strong></span>
                                    <span>ASSISTS: <strong className="text-zinc-300">{p.assists || 0}</strong></span>
                                  </div>
                                </div>

                                <div className="flex flex-col gap-1.5 shrink-0">
                                  <button
                                    onClick={() => startEditingPlayer(p)}
                                    title="Editar Atleta & Stats"
                                    className="p-1.5 bg-zinc-950 border border-white/5 text-zinc-400 hover:text-white transition duration-200 cursor-pointer"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`ADMIN: Deseja realmente remover o atleta "${p.nickname}" do elenco?`)) {
                                        onRemovePlayer(p.id);
                                      }
                                    }}
                                    title="Excluir Jogador"
                                    className="p-1.5 bg-red-950/20 border border-red-900/30 text-rose-400 hover:bg-red-950 transition duration-200 cursor-pointer"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
