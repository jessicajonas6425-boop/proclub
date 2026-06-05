/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Tournament, Match, News, Transfer, Message, Protest, Club, Player } from "../types";
import { Trophy, Calendar, Users, Newspaper, MessageSquare, AlertTriangle, ShieldCheck, Star, Award, Zap, Camera, BookOpen, Send, TrendingUp, DollarSign } from "lucide-react";

interface LandingPageProps {
  tournaments: Tournament[];
  matches: Match[];
  standings: TournamentStandingsMap;
  news: News[];
  transfers: Transfer[];
  messages: Message[];
  protests: Protest[];
  clubs: Club[];
  players: Player[];
  currentRole: "admin" | "manager" | "visitor";
  managerClub: Club | null;
  onPostMessage: (text: string) => void;
  onPostProtest: (title: string, description: string) => void;
  onInitiateTransfer: (playerId: string, targetClubId: string, value: string) => void;
}

export type TournamentStandingsMap = {
  [tournamentId: string]: {
    clubId: string;
    clubName: string;
    clubLogo: string;
    played: number;
    points: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
  }[];
};

export function LandingPage({
  tournaments,
  matches,
  standings,
  news,
  transfers,
  messages,
  protests,
  clubs,
  players,
  currentRole,
  managerClub,
  onPostMessage,
  onPostProtest,
  onInitiateTransfer
}: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<"tabelas" | "mercado" | "rankings" | "protestos" | "noticias">("tabelas");
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>(tournaments[0]?.id || "t-1");
  const [chatMessage, setChatMessage] = useState("");
  const [protestTitle, setProtestTitle] = useState("");
  const [protestDesc, setProtestDesc] = useState("");

  const [transferPlayerId, setTransferPlayerId] = useState("");
  const [transferTargetClubId, setTransferTargetClubId] = useState("");
  const [transferValue, setTransferValue] = useState("");

  const [activeMediaTab, setActiveMediaTab] = useState<"fotos" | "videos">("fotos");

  // Filter matches for selected tournament or live matches
  const activeMatches = matches.filter(m => m.tournamentId === selectedTournamentId || m.status === "andamento");
  const liveMatches = matches.filter(m => m.status === "andamento");
  const scheduledMatches = matches.filter(m => m.status === "agendado").slice(0, 4);
  const finishedMatches = matches.filter(m => m.status === "encerrado").slice(0, 4);

  const selectedTournament = tournaments.find(t => t.id === selectedTournamentId);

  const handleProtestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!protestTitle || !protestDesc) return;
    onPostProtest(protestTitle, protestDesc);
    setProtestTitle("");
    setProtestDesc("");
    alert("Protesto enviado com sucesso à Federação! Aguarde análise oportuna.");
  };

  const handleChatMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    onPostMessage(chatMessage);
    setChatMessage("");
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferPlayerId || !transferTargetClubId) return;
    onInitiateTransfer(transferPlayerId, transferTargetClubId, transferValue || "Negociação Livre");
    setTransferPlayerId("");
    setTransferTargetClubId("");
    setTransferValue("");
    alert("Oferta de transferência cadastrada no Mercado de Trabalho executado!");
  };

  // World & National Ranking mock values (computed cleanly from pre-registered data stats)
  const rankingMundial = [
    { rank: 1, name: "Flamengo Pro Clubs", score: 2850, logo: "🔴⚫", trend: "up" },
    { rank: 2, name: "Palmeiras E-Sports", score: 2720, logo: "🟢⚪", trend: "down" },
    { rank: 3, name: "São Paulo FC Pro", score: 2540, logo: "🔴⚪⚫", trend: "same" },
    { rank: 4, name: "Cruzeiro Stars Pro", score: 2410, logo: "🔵🦊", trend: "up" },
    { rank: 5, name: "Corinthians EA Sports", score: 2390, logo: "⚫⚪", trend: "down" }
  ];

  const rankingNacional = [
    { rank: 1, name: "Flamengo Pro Clubs", score: 1950, logo: "🔴⚫" },
    { rank: 2, name: "Palmeiras E-Sports", score: 1820, logo: "🟢⚪" },
    { rank: 3, name: "São Paulo FC Pro", score: 1710, logo: "🔴⚪⚫" },
    { rank: 4, name: "Grêmio E-League", score: 1680, logo: "🔵⚫⚪" },
    { rank: 5, name: "Atlético Mineiro Pro", score: 1540, logo: "⚫⚪🐔" }
  ];

  const hallOfFame = [
    { year: "2025", champ: "Flamengo Pro Clubs", runner: "Palmeiras E-Sports", tournament: "Brasileirão Série A", MVP: "Gabigol_EA" },
    { year: "2025", champ: "São Paulo FC Pro", runner: "Grêmio E-League", tournament: "Copa do Brasil FPC", MVP: "Lucas_Mito" },
    { year: "2024", champ: "Palmeiras E-Sports", runner: "Cruzeiro Stars Pro", tournament: "Liga Pro Clubs", MVP: "Veiga_Class" }
  ];

  return (
    <div id="landing-main" className="space-y-8 pb-16">
      {/* 1. HERO BANNER PRINCIPAL with futuristic EA FC soccer visuals */}
      <section id="hero-banner" className="relative overflow-hidden rounded-xs bg-[#090909]/80 border border-white/5 py-14 px-8 md:px-16 text-center md:text-left flex flex-col md:flex-row items-center gap-10 bg-cover bg-center" style={{ backgroundImage: "radial-gradient(circle at 75% 30%, rgba(212, 175, 55, 0.1) 0%, transparent 70%)" }}>
        <div className="flex-1 space-y-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37]/5 border border-[#D4AF37]/25 rounded-xs text-[9px] font-bold text-[#D4AF37] tracking-[0.2em] uppercase font-mono">
            <Zap size={12} className="text-[#D4AF37]" /> CAMPEONATO OFICIAL FPC
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6.5xl font-display font-light text-white tracking-[0.08em] leading-tight uppercase">
            FEDERAÇÃO <br />
            <span className="font-extrabold text-[#D4AF37] gold-glow">PRO CLUBS</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl font-sans font-light leading-relaxed tracking-wide">
            Sinta a emoção do futebol competitivo na plataforma premium desenhada para a comunidade Pro Clubs mais apaixonada do país. Dados sincronizados em alta velocidade, tabelas automatizadas e transmissões ao vivo.
          </p>
          <div className="flex flex-wrap gap-4 pt-3 justify-center md:justify-start">
            <a href="#competicoes" onClick={() => { setActiveTab("tabelas"); window.scrollTo({ top: document.getElementById("tab-navigation-bar")?.offsetTop, behavior: "smooth" }); }} className="bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300 font-bold text-[10px] uppercase tracking-[0.2em] px-8 py-3 rounded-xs">
              Ver Competições
            </a>
            {currentRole === "manager" ? (
              <span className="bg-white/5 text-zinc-300 text-[10px] uppercase tracking-[0.15em] px-6 py-3 rounded-xs border border-white/10 flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#D4AF37]" /> Gestor Credenciado
              </span>
            ) : (
              <span className="text-zinc-500 text-[9px] uppercase tracking-wider font-mono flex items-center gap-2 justify-center">
                Portal de Preview • Sincronia Firebase Ativa
              </span>
            )}
          </div>
        </div>

        {/* Brand crest decoration */}
        <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center shrink-0">
          {/* Animated golden orbital rings */}
          <div className="absolute inset-0 rounded-full border border-dashed border-[#D4AF37]/20 animate-[spin_60s_linear_infinite]" />
          <div className="absolute w-[85%] h-[85%] rounded-full border border-double border-[#D4AF37]/10 animate-[spin_30s_linear_reverse]" />
          
          {/* Main Logo card centered */}
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-none bg-zinc-950 border border-[#D4AF37]/60 flex items-center justify-center shadow-[0_0_35px_rgba(212,175,55,0.15)] overflow-hidden relative">
            <img 
              src="https://i.ibb.co/xqJFZnyX/Chat-GPT-Image-5-de-jun-de-2026-16-06-46.png" 
              alt="FPC Official Crest" 
              className="w-full h-full object-cover escala-logo" 
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* 2. LIVE MATCH IN PROGRESS TICKER (Realtime Dynamic Game updates) */}
      {liveMatches.length > 0 && (
        <section id="live-games-section" className="bg-red-950/15 border border-red-500/25 rounded-none p-5 shadow-lg">
          <div className="flex items-center gap-2 text-red-500 font-bold uppercase text-[10px] tracking-[0.2em] mb-4">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span>TRANSMISSÃO REAL-TIME ATIVA</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {liveMatches.map(match => (
              <div key={match.id} className="bg-black/80 p-5 rounded-none border border-red-500/15 flex flex-col gap-4">
                <div className="flex justify-between items-center text-[9px] text-zinc-500 font-mono uppercase tracking-wider">
                  <span>Rodada {match.round} • {match.stadium}</span>
                  <span className="bg-red-800 text-white px-2.5 py-0.5 rounded-xs font-bold tracking-widest">{match.liveMinutes}&apos; CRONÓMETRO</span>
                </div>
                <div className="flex items-center justify-between font-bold text-sm">
                  <div className="flex items-center gap-2.5 w-5/12">
                    <span className="text-xl shrink-0">{match.homeTeamLogo}</span>
                    <span className="truncate text-white tracking-wide font-sans">{match.homeTeamName}</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 bg-white/[0.02] px-3.5 py-1.5 rounded-none border border-white/5 text-lg font-mono text-[#D4AF37] w-2/12">
                    <span>{match.homeScore}</span>
                    <span className="text-zinc-700">:</span>
                    <span>{match.awayScore}</span>
                  </div>
                  <div className="flex items-center justify-end gap-2.5 w-5/12 text-right">
                    <span className="truncate text-white tracking-wide font-sans">{match.awayTeamName}</span>
                    <span className="text-xl shrink-0">{match.awayTeamLogo}</span>
                  </div>
                </div>

                {/* Micro Live stats */}
                <div className="border-t border-white/5 pt-3 grid grid-cols-3 text-center text-[10px] text-zinc-500 font-mono tracking-tight">
                  <div>Chutes: {match.stats.homeShots} vs {match.stats.awayShots}</div>
                  <div className="text-[#D4AF37]">Posse: {match.stats.homePossession}% vs {match.stats.awayPossession}%</div>
                  <div>Faltas: {match.stats.homeFouls} vs {match.stats.awayFouls}</div>
                </div>

                {/* Match Live Events Logger queue */}
                {match.events.length > 0 && (
                  <div className="bg-black/90 p-3 rounded-none text-[10px] space-y-1.5 text-zinc-400 border border-white/5">
                    <div className="text-zinc-500 uppercase font-mono tracking-widest font-bold text-[9px]">LANCES EM TEMPO REAL:</div>
                    {match.events.slice(-3).map((ev, i) => (
                      <div key={i} className="flex justify-between items-center text-[11px]">
                        <span className="text-[#D4AF37] font-mono font-semibold">{ev.time}&apos;</span>
                        <span className="text-zinc-300 font-medium font-sans truncate ml-2">
                          {ev.type === "goal" ? "⚽ GOL! " : ev.type === "yellow" ? "🟨 Cartão Amarelo - " : "🟥 Cartão Vermelho! "}
                          {ev.playerNickname}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. DUAL-ROW FOR NEXT MATCHES & LATEST RESULTS (PUBLIC VIEW) */}
      <section id="agenda-historico" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next games */}
        <div className="bg-[#090909]/80 border border-white/5 rounded-none p-5 sm:p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xs font-display font-light tracking-[0.25em] text-white uppercase flex items-center gap-2 border-l border-[#D4AF37] pl-3">
                <Calendar size={14} className="text-[#D4AF37]" /> Próximos Confrontos FPC
              </h3>
              <span className="text-[9px] text-[#D4AF37] font-mono tracking-widest font-semibold uppercase">LIVE SYNC</span>
            </div>
            {scheduledMatches.length === 0 ? (
              <div className="text-center py-10 text-zinc-600 text-xs font-mono">Sem jogos agendados no momento.</div>
            ) : (
              <div className="space-y-3">
                {scheduledMatches.map(match => (
                  <div key={match.id} className="bg-white/[0.01] hover:bg-white/[0.03] py-3 px-4 rounded-none border border-white/5 flex justify-between items-center gap-3 text-xs transition duration-300">
                    <div className="flex items-center gap-2 w-5/12 overflow-hidden">
                      <span className="text-lg shrink-0">{match.homeTeamLogo}</span>
                      <span className="text-white truncate font-medium font-sans tracking-wide">{match.homeTeamName}</span>
                    </div>
                    <div className="bg-black/90 text-[9px] font-mono py-1.5 px-3 rounded-none border border-white/5 shrink-0 text-center text-[#D4AF37] leading-tight tracking-wider uppercase">
                      <div>{match.date}</div>
                      <div className="text-white mt-0.5">{match.time}</div>
                    </div>
                    <div className="flex items-center gap-2 w-5/12 overflow-hidden justify-end text-right">
                      <span className="text-white truncate font-medium font-sans tracking-wide">{match.awayTeamName}</span>
                      <span className="text-lg shrink-0">{match.awayTeamLogo}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Latest Results */}
        <div className="bg-[#090909]/80 border border-white/5 rounded-none p-5 sm:p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xs font-display font-light tracking-[0.25em] text-white uppercase flex items-center gap-2 border-l border-[#D4AF37] pl-3">
                <ShieldCheck size={14} className="text-[#D4AF37]" /> Resultados Recentes
              </h3>
              <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase">AUTOMÁTICO</span>
            </div>
            {finishedMatches.length === 0 ? (
              <div className="text-center py-10 text-zinc-600 text-xs font-mono">Nenhum resultado cadastrado.</div>
            ) : (
              <div className="space-y-3">
                {finishedMatches.map(match => (
                  <div key={match.id} className="bg-white/[0.01] py-3 px-4 rounded-none border border-white/5 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2 w-5/12 overflow-hidden">
                      <span className="text-lg">{match.homeTeamLogo}</span>
                      <span className="text-white truncate font-medium tracking-wide">{match.homeTeamName}</span>
                    </div>
                    <div className="bg-black text-[#D4AF37] font-mono py-1 px-3 border border-white/5 text-xs font-bold">
                      {match.homeScore} - {match.awayScore}
                    </div>
                    <div className="flex items-center gap-2 w-5/12 overflow-hidden justify-end text-right">
                      <span className="text-white truncate font-medium tracking-wide">{match.awayTeamName}</span>
                      <span className="text-lg">{match.awayTeamLogo}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. MAIN NAVIGATIONAL CONTENT TABS FOR PUBLIC ACCESS */}
      <div id="tab-navigation-bar" className="border-b border-white/5 flex justify-start items-center gap-1 overflow-x-auto pb-px">
        <button
          id="btn-tab-tabelas"
          onClick={() => setActiveTab("tabelas")}
          className={`flex items-center gap-2 py-4 px-5 text-[10px] font-bold uppercase tracking-[0.2em] border-b-2 transition shrink-0 ${
            activeTab === "tabelas" ? "border-[#D4AF37] text-white bg-white/[0.02]" : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Trophy size={13} className="text-[#D4AF37]" /> Campeonatos & Classificação
        </button>
        <button
          id="btn-tab-noticias"
          onClick={() => setActiveTab("noticias")}
          className={`flex items-center gap-2 py-4 px-5 text-[10px] font-bold uppercase tracking-[0.2em] border-b-2 transition shrink-0 ${
            activeTab === "noticias" ? "border-[#D4AF37] text-white bg-white/[0.02]" : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Newspaper size={13} className="text-[#D4AF37]" /> Notícias do Futebol
        </button>
        <button
          id="btn-tab-mercado"
          onClick={() => setActiveTab("mercado")}
          className={`flex items-center gap-2 py-4 px-5 text-[10px] font-bold uppercase tracking-[0.2em] border-b-2 transition shrink-0 ${
            activeTab === "mercado" ? "border-[#D4AF37] text-white bg-white/[0.02]" : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <DollarSign size={13} className="text-[#D4AF37]" /> Mercado & Transferências
        </button>
        <button
          id="btn-tab-rankings"
          onClick={() => setActiveTab("rankings")}
          className={`flex items-center gap-2 py-4 px-5 text-[10px] font-bold uppercase tracking-[0.2em] border-b-2 transition shrink-0 ${
            activeTab === "rankings" ? "border-[#D4AF37] text-white bg-white/[0.02]" : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Star size={13} className="text-[#D4AF37]" /> Rankings & Hall da Fama
        </button>
        <button
          id="btn-tab-protestos"
          onClick={() => setActiveTab("protestos")}
          className={`flex items-center gap-2 py-4 px-5 text-[10px] font-bold uppercase tracking-[0.2em] border-b-2 transition shrink-0 ${
            activeTab === "protestos" ? "border-[#D4AF37] text-white bg-white/[0.02]" : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <AlertTriangle size={13} className="text-[#D4AF37]" /> Provas & Protestos
        </button>
      </div>

      {/* 5. CONTENT IN TAB AREA */}

      {/* TAB A: CAMPEONATOS & TABELAS */}
      {activeTab === "tabelas" && (
        <div id="tab-content-tabelas" className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Tournament selector and stats */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-[#090909]/80 border border-white/5 rounded-none p-4 flex items-center gap-3 overflow-x-auto">
              <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-[0.25em] font-mono shrink-0 mr-3">VER CAMPEONATO:</span>
              {tournaments.map(tour => (
                <button
                  key={tour.id}
                  id={`btn-select-tournament-${tour.id}`}
                  onClick={() => setSelectedTournamentId(tour.id)}
                  className={`px-4 py-2 rounded-none text-[9px] uppercase tracking-[0.2em] font-bold transition duration-300 shrink-0 ${
                    selectedTournamentId === tour.id
                      ? "bg-[#D4AF37] text-black font-extrabold shadow-sm"
                      : "bg-white/[0.02] text-zinc-400 hover:text-white border border-white/5 hover:border-white/10"
                  }`}
                >
                  <span className="mr-1.5">{tour.logo}</span>
                  {tour.name}
                </button>
              ))}
            </div>

            {/* Standings Table Card */}
            <div className="bg-[#090909]/80 border border-white/5 rounded-none p-5 sm:p-6 shadow-xl overflow-hidden">
              <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
                <div>
                  <h4 className="text-sm font-display tracking-widest text-white flex items-center gap-2">
                    {selectedTournament?.logo} TABELA DE CLASSIFICAÇÃO - AO VIVO
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-sans mt-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse inline-block"></span>
                    {selectedTournament?.rules}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] border border-[#D4AF37]/30 px-2.5 py-1 rounded-none bg-[#D4AF37]/5">
                    {selectedTournament?.season}
                  </span>
                </div>
              </div>

              {/* Responsive Classificao Table */}
              <div className="overflow-x-auto rounded-none border border-white/5">
                <table id="standings-data-table" className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-black text-[9px] text-zinc-500 border-b border-white/5 font-mono tracking-widest uppercase">
                      <th className="py-3.5 px-3.5 font-bold w-12 text-center">POS</th>
                      <th className="py-3.5 px-4 font-bold">CLUBE</th>
                      <th className="py-3.5 px-3 text-center font-bold">PTS</th>
                      <th className="py-3.5 px-3 text-center font-bold">J</th>
                      <th className="py-3.5 px-3 text-center font-bold">V</th>
                      <th className="py-3.5 px-3 text-center font-bold">E</th>
                      <th className="py-3.5 px-3 text-center font-bold">D</th>
                      <th className="py-3.5 px-3 text-center font-bold">GP</th>
                      <th className="py-3.5 px-3 text-center font-bold">GC</th>
                      <th className="py-3.5 px-3 text-center font-bold">SG</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-black/20">
                    {!standings[selectedTournamentId] || standings[selectedTournamentId].length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-12 text-center text-zinc-600 font-mono text-[11px] tracking-wide uppercase">
                          Nenhum clube disputando classificação ainda. Utilize o Painel Master para cadastrar times ou gerar partidas.
                        </td>
                      </tr>
                    ) : (
                      standings[selectedTournamentId].map((row, idx) => {
                        const isLeader = idx === 0;
                        const isRelegated = selectedTournament?.type === "Pontos Corridos" && idx >= standings[selectedTournamentId].length - 2;
                        return (
                           <tr key={row.clubId} className={`hover:bg-white/[0.02] transition-colors duration-200 ${isLeader ? "bg-[#D4AF37]/5" : ""}`}>
                            <td className="py-4 px-3.5 text-center font-mono font-bold">
                              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-none font-bold text-[11px] ${
                                isLeader ? "bg-[#D4AF37] text-black" : isRelegated ? "bg-red-950/40 text-red-400 border border-red-500/20" : "bg-zinc-900 border border-white/5 text-zinc-400"
                              }`}>
                                {idx + 1}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-semibold text-white flex items-center gap-2.5">
                              <span className="text-lg shrink-0">{row.clubLogo || "🛡️"}</span>
                              <span className="truncate tracking-wide font-sans">{row.clubName}</span>
                            </td>
                            <td className="py-4 px-3 text-center font-bold font-mono text-base text-[#D4AF37] bg-white/[0.01]">{row.points}</td>
                            <td className="py-4 px-3 text-center font-mono text-zinc-200">{row.played}</td>
                            <td className="py-4 px-3 text-center font-mono text-zinc-400">{row.won}</td>
                            <td className="py-4 px-3 text-center font-mono text-zinc-400">{row.drawn}</td>
                            <td className="py-4 px-3 text-center font-mono text-zinc-400">{row.lost}</td>
                            <td className="py-4 px-3 text-center font-mono text-zinc-500">{row.goalsFor}</td>
                            <td className="py-4 px-3 text-center font-mono text-zinc-500">{row.goalsAgainst}</td>
                            <td className={`py-4 px-3 text-center font-mono font-bold ${row.goalDifference > 0 ? "text-emerald-400" : row.goalDifference < 0 ? "text-rose-400" : "text-zinc-500"}`}>
                              {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Golden Stats & Performance Columns (Best Scoring & Assists) */}
          <div className="space-y-6">
            {/* Top Scorers */}
            <div className="bg-[#090909]/80 border border-white/5 rounded-none p-5 sm:p-6 shadow-md">
              <h4 className="text-[10px] font-display font-light text-[#D4AF37] uppercase tracking-[0.25em] mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
                <Award size={14} className="text-[#D4AF37]" /> Artilharia Geral (FPC Gold)
              </h4>
              {players.filter(p => p.goals > 0).length === 0 ? (
                <p className="text-center py-6 text-zinc-600 text-[10px] font-mono uppercase tracking-wider">Sem dados apurados.</p>
              ) : (
                <div className="space-y-3">
                  {players
                    .sort((a, b) => b.goals - a.goals)
                    .slice(0, 5)
                    .map((item, index) => {
                      const matchedClub = clubs.find(c => c.id === item.clubId);
                      return (
                        <div key={item.id} className="flex justify-between items-center text-xs bg-black/60 p-3 rounded-none border border-white/5">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[9px] text-zinc-400 font-bold bg-zinc-900 border border-white/5 w-5 h-5 flex items-center justify-center">{index + 1}</span>
                            <div>
                              <p className="text-white font-semibold tracking-wide font-sans">{item.nickname}</p>
                              <p className="text-[9px] text-zinc-500 font-mono mt-0.5 uppercase tracking-tight">{matchedClub?.name || "Sem Clube"}</p>
                            </div>
                          </div>
                          <div className="text-right font-mono">
                            <span className="text-[10px] font-bold text-[#D4AF37] bg-[#D4AF37]/5 border border-[#D4AF37]/25 py-1 px-2.5">{item.goals} GOLS</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Top Assists */}
            <div className="bg-[#090909]/80 border border-white/5 rounded-none p-5 sm:p-6 shadow-md">
              <h4 className="text-[10px] font-display font-light text-[#D4AF37] uppercase tracking-[0.25em] mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
                <Star size={13} className="text-[#D4AF37]" /> Garçons da Liga (Assistências)
              </h4>
              {players.filter(p => p.assists > 0).length === 0 ? (
                <p className="text-center py-6 text-zinc-600 text-[10px] font-mono uppercase tracking-wider">Sem dados apurados.</p>
              ) : (
                <div className="space-y-3">
                  {players
                    .sort((a, b) => b.assists - a.assists)
                    .slice(0, 5)
                    .map((item, index) => {
                      const matchedClub = clubs.find(c => c.id === item.clubId);
                      return (
                        <div key={item.id} className="flex justify-between items-center text-xs bg-black/60 p-3 rounded-none border border-white/5">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[9px] text-zinc-400 font-bold bg-zinc-900 border border-white/5 w-5 h-5 flex items-center justify-center">{index + 1}</span>
                            <div>
                              <p className="text-white font-semibold tracking-wide font-sans">{item.nickname}</p>
                              <p className="text-[9px] text-zinc-500 font-mono mt-0.5 uppercase tracking-tight">{matchedClub?.name || "Sem Clube"}</p>
                            </div>
                          </div>
                          <div className="text-right font-mono">
                            <span className="text-[10px] font-bold text-zinc-300 bg-white/5 border border-white/5 py-1 px-2.5">{item.assists} PASTAS</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB B: NEWS PORTAL */}
      {activeTab === "noticias" && (
        <div id="tab-content-noticias" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.length === 0 ? (
            <div className="col-span-full py-12 text-center text-zinc-500 font-mono text-[11px] tracking-wide uppercase">Sem notícias registradas pela Federação no momento.</div>
          ) : (
            news.map(art => (
              <div key={art.id} className="bg-[#090909]/85 overflow-hidden rounded-none border border-white/5 flex flex-col justify-between hover:border-white/10 transition-all duration-300">
                <div>
                  <img src={art.image || "https://images.unsplash.com/photo-1540747737956-378724044282?w=800"} alt="FPC Notícias" className="w-full h-44 object-cover border-b border-white/5 grayscale hover:grayscale-0 transition-all duration-500" />
                  <div className="p-5 space-y-3">
                    <p className="text-[9px] text-[#D4AF37] font-mono tracking-[0.2em] font-bold uppercase">{art.date} • EXCLUSIVO FPC</p>
                    <h4 className="text-base font-display font-bold text-white uppercase tracking-wider leading-snug">{art.title}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans font-light">{art.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB C: MERCADO DE TRABALHO E CHAT */}
      {activeTab === "mercado" && (
        <div id="tab-content-mercado" className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Active Transfers lists & Forms */}
          <div className="space-y-6">
            {/* Transfer launcher for authorized managers */}
            <div className="bg-[#090909]/80 border border-white/5 rounded-none p-5 sm:p-6 shadow-lg">
              <h4 className="text-xs font-display tracking-[0.25em] text-white uppercase mb-4 flex items-center gap-2 border-l border-[#D4AF37] pl-3">
                <TrendingUp size={14} className="text-[#D4AF37]" /> Gerenciador de Janela de Atletas
              </h4>
              {currentRole === "visitor" ? (
                <div className="bg-amber-950/10 border border-[#D4AF37]/20 p-4 rounded-none text-[11px] text-zinc-400 leading-relaxed font-sans">
                  ⚠️ Apenas os <strong className="text-[#D4AF37] font-bold">Gestores Credenciados</strong> podem formalizar transferências de atletas no Firebase. Use o alternador de simulação no cabeçalho.
                </div>
              ) : (
                <form id="transfer-form text-xs" className="space-y-4 text-xs" onSubmit={handleTransferSubmit}>
                  {managerClub && (
                    <div className="text-[10px] text-zinc-400 bg-white/[0.02] p-2.5 rounded-none border border-white/5 font-mono tracking-wide uppercase">
                      Janela aberta por: <strong className="text-[#D4AF37] font-bold">{managerClub.name}</strong>
                    </div>
                  )}
                  <div>
                    <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">ATLETA ENVOLVIDO:</label>
                    <select
                      id="select-transfer-player"
                      className="w-full bg-black text-white border border-white/10 rounded-none p-3 text-xs font-mono focus:outline-none focus:border-[#D4AF37]/50"
                      value={transferPlayerId}
                      onChange={e => setTransferPlayerId(e.target.value)}
                      required
                    >
                      <option value="">-- SELECIONAR ATLETA DA CORTE --</option>
                      {players.map(p => {
                        const originalClubName = clubs.find(c => c.id === p.clubId)?.name || "Livre";
                        return (
                          <option key={p.id} value={p.id}>
                            {p.nickname} ({originalClubName})
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">CLUBE DE DESTINATÁRIO:</label>
                      <select
                        id="select-transfer-destination"
                        className="w-full bg-black text-white border border-white/10 rounded-none p-3 text-xs focus:outline-none focus:border-[#D4AF37]/50 font-sans font-semibold"
                        value={transferTargetClubId}
                        onChange={e => setTransferTargetClubId(e.target.value)}
                        required
                      >
                        <option value="">-- SELECIONAR --</option>
                        {clubs.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">VALOR DA TRANSAÇÃO (M):</label>
                      <input
                        id="input-transfer-value"
                        type="text"
                        placeholder="Ex: 10M ou Passe Livre"
                        className="w-full bg-black text-white border border-white/10 rounded-none p-2.5 text-xs focus:outline-none focus:border-[#D4AF37]/50"
                        value={transferValue}
                        onChange={e => setTransferValue(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    id="submit-transfer-btn"
                    type="submit"
                    className="w-full bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300 font-bold text-[10px] uppercase tracking-[0.2em] py-3 rounded-none"
                  >
                    CO-ASSINAR JOGO E TRANSFERÊNCIA
                  </button>
                </form>
              )}
            </div>

            {/* Public Transfer logs feed */}
            <div className="bg-[#090909]/80 border border-white/5 rounded-none p-5 sm:p-6 shadow-lg">
              <h4 className="text-xs font-display tracking-[0.25em] text-white uppercase mb-4 flex items-center gap-2 border-l border-[#D4AF37] pl-3">
                <DollarSign size={14} className="text-[#D4AF37]" /> Registros da Janela Oficial
              </h4>
              {transfers.length === 0 ? (
                <div className="text-center py-12 text-zinc-600 font-mono text-[10px] uppercase tracking-wider">Nenhuma transação efetuada nesta temporada.</div>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {transfers.map(t => (
                    <div key={t.id} className="bg-black/60 p-3.5 rounded-none border border-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white tracking-wide">{t.playerNickname}</span>
                          <span className="text-[8px] bg-white/5 border border-white/10 text-zinc-400 py-0.5 px-2 rounded-none font-mono font-bold tracking-wider uppercase">{t.playerPosition}</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-mono mt-1.5 uppercase tracking-tight">
                          Origem: <strong className="text-[#D4AF37] font-semibold">{t.fromClubName}</strong> ➔ Destino: <strong className="text-emerald-400 font-semibold">{t.toClubName}</strong>
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-xs font-bold text-[#D4AF37] font-mono leading-none flex items-center gap-1 justify-start sm:justify-end">{t.value}</span>
                        <span className="bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-none text-[8px] uppercase font-mono tracking-wider inline-block mt-1">✓ EFETUADO</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Real-time FPC Managers Internal Chat room */}
          <div className="bg-[#090909]/80 border border-white/5 rounded-none p-5 sm:p-6 flex flex-col justify-between h-[540px] shadow-lg">
            <div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4 flex-wrap gap-2">
                <div>
                  <h4 className="text-xs font-display tracking-[0.2em] text-white uppercase flex items-center gap-2">
                    <MessageSquare size={14} className="text-[#D4AF37]" /> CONFERÊNCIA GERAL DE GESTORES
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-sans mt-1">Painel moderado • Sincronia instantânea de comunicação</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Sincronizado"></span>
              </div>

              {/* Chat frame */}
              <div id="chat-messages-scroll" className="space-y-3.5 h-[340px] overflow-y-auto pr-2">
                {messages.length === 0 ? (
                  <p className="text-center py-24 text-zinc-600 font-mono text-[10px] uppercase tracking-widest leading-relaxed">A sala de conferência está vazia no momento.<br />Digite para começar a interagir!</p>
                ) : (
                  messages.map(msg => {
                    const isMaster = msg.senderRole === "admin" || msg.senderId === "creator-flamengo" || msg.senderName === "Federer Executivo";
                    return (
                      <div key={msg.id} className={`flex flex-col bg-black/60 p-3 rounded-none border border-white/5 ${isMaster ? "border-[#D4AF37]/30 bg-[#D4AF37]/2" : ""}`}>
                        <div className="flex items-center justify-between text-[9px] font-mono tracking-wider uppercase mb-1.5">
                          <span className={`font-bold ${isMaster ? "text-[#D4AF37] gold-glow" : "text-zinc-400"}`}>
                            {msg.senderName} {msg.senderClubName && `[${msg.senderClubName}]`}
                          </span>
                          <span className="text-zinc-600">{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ""}</span>
                        </div>
                        <p className="text-xs text-zinc-200 leading-relaxed font-sans font-normal">{msg.text}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Form messaging input */}
            <form id="chat-sender-form" onSubmit={handleChatMessageSubmit} className="flex gap-2.5 border-t border-white/5 pt-4 mt-2">
              <input
                id="input-chat-text"
                type="text"
                className="flex-1 bg-black text-white border border-white/10 rounded-none px-4 py-3 text-xs font-sans focus:outline-none focus:border-[#D4AF37]/50 placeholder:text-zinc-700 font-light"
                placeholder={currentRole === "visitor" ? "Apenas Administradores de Clubes autorizados..." : "Digite um comunicado oficial..."}
                value={chatMessage}
                onChange={e => setChatMessage(e.target.value)}
                disabled={currentRole === "visitor"}
              />
              <button
                id="send-chat-btn"
                type="submit"
                className={`bg-transparent border border-[#D4AF37] text-[#D4AF37] font-bold px-5 py-3 rounded-none flex items-center justify-center transition-all duration-300 shrink-0 ${
                  currentRole === "visitor" ? "opacity-30 cursor-not-allowed" : "hover:bg-[#D4AF37] hover:text-black"
                }`}
                disabled={currentRole === "visitor"}
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB D: RANKINGS, VIDEOS, MIDIA & HALL DA FAMA */}
      {activeTab === "rankings" && (
        <div id="tab-content-rankings" className="space-y-8">
          {/* Double list: world & national */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* National ranking */}
            <div className="bg-[#090909]/80 border border-white/5 rounded-none p-5 sm:p-6 shadow-lg">
              <h4 className="text-xs font-display tracking-[0.2em] text-white uppercase mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
                <Trophy size={14} className="text-[#D4AF37]" /> RANKING NACIONAL FPC DE CLUBES
              </h4>
              <div className="space-y-2">
                {rankingNacional.map(item => (
                  <div key={item.rank} className="flex justify-between items-center text-xs bg-black/50 hover:bg-white/[0.01] transition py-3 px-4 rounded-none border border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-zinc-500 w-5 text-center">#{item.rank}</span>
                      <span className="text-lg shrink-0">{item.logo}</span>
                      <span className="text-white font-medium tracking-wide">{item.name}</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#D4AF37]">{item.score} PTS FPC</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Global/World ranking */}
            <div className="bg-[#090909]/80 border border-white/5 rounded-none p-5 sm:p-6 shadow-lg">
              <h4 className="text-xs font-display tracking-[0.2em] text-white uppercase mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
                <Star size={14} className="text-[#D4AF37]" /> RANKING MUNDIAL DE CLUBES VIRTUAIS
              </h4>
              <div className="space-y-2">
                {rankingMundial.map(item => (
                  <div key={item.rank} className="flex justify-between items-center text-xs bg-black/50 hover:bg-white/[0.01] transition py-3 px-4 rounded-none border border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-zinc-500 w-5 text-center">#{item.rank}</span>
                      <span className="text-lg shrink-0">{item.logo}</span>
                      <span className="text-white font-semibold tracking-wide">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-xs font-medium text-zinc-400">
                      <span>{item.score} PTS</span>
                      <span className={item.trend === "up" ? "text-emerald-400" : item.trend === "down" ? "text-rose-400" : "text-zinc-600"}>
                        {item.trend === "up" ? "▲" : item.trend === "down" ? "▼" : "◀▶"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hall of Fame section */}
          <div className="bg-[#090909]/80 border border-white/5 rounded-none p-5 sm:p-6 shadow-lg">
            <h4 className="text-xs font-display tracking-[0.2em] text-white uppercase mb-4 flex items-center gap-2 border-l border-[#D4AF37] pl-3">
              <Award size={14} className="text-[#D4AF37]" /> Hall da Fama e Histórico de Campeões
            </h4>
            <div className="overflow-x-auto border border-white/5 rounded-none">
              <table className="w-full text-left border-collapse text-xs bg-black/20">
                <thead>
                  <tr className="bg-black text-[9px] text-zinc-500 border-b border-white/5 font-mono tracking-widest uppercase">
                    <th className="py-3.5 px-4 font-bold">TEMPORADA</th>
                    <th className="py-3.5 px-4 font-bold">CAMPEONATO</th>
                    <th className="py-3.5 px-4 font-bold">CAMPEÃO ABSOLUTO</th>
                    <th className="py-3.5 px-4 font-bold">VICE-CAMPEÃO</th>
                    <th className="py-3.5 px-4 font-bold">MELHOR JOGADOR (MVP FPC)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-sans text-zinc-300">
                  {hallOfFame.map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#D4AF37]">{row.year}</td>
                      <td className="py-3.5 px-4 font-semibold uppercase text-white tracking-wide">{row.tournament}</td>
                      <td className="py-3.5 px-4 text-white font-medium">👑 {row.champ}</td>
                      <td className="py-3.5 px-4 text-zinc-450">{row.runner}</td>
                      <td className="py-3.5 px-4 text-[#D4AF37] font-mono font-medium">{row.MVP}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dynamic Graphic and Video Galleries */}
          <div className="bg-[#090909]/80 border border-white/5 rounded-none p-5 sm:p-6 shadow-lg">
            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4 flex-wrap gap-2">
              <h4 className="text-xs font-display tracking-[0.2em] text-white uppercase flex items-center gap-2">
                <Camera size={14} className="text-[#D4AF37]" /> Galeria de Fotos & Vídeos (Highlights)
              </h4>
              <div className="bg-black p-1 rounded-none border border-white/10 flex gap-1">
                <button
                  onClick={() => setActiveMediaTab("fotos")}
                  className={`text-[9px] uppercase tracking-wider font-extrabold py-1 px-3 rounded-none ${
                    activeMediaTab === "fotos" ? "bg-[#D4AF37] text-black" : "text-zinc-500 hover:text-white"
                  }`}
                >
                  Fotos
                </button>
                <button
                  onClick={() => setActiveMediaTab("videos")}
                  className={`text-[9px] uppercase tracking-wider font-extrabold py-1 px-3 rounded-none ${
                    activeMediaTab === "videos" ? "bg-[#D4AF37] text-black" : "text-zinc-500 hover:text-white"
                  }`}
                >
                  Vídeos
                </button>
              </div>
            </div>

            {activeMediaTab === "fotos" ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&q=80",
                  "https://images.unsplash.com/photo-1540747737956-378724044282?w=400&q=80",
                  "https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=400&q=80",
                  "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80"
                ].map((src, idx) => (
                  <div key={idx} className="relative rounded-none overflow-hidden group border border-white/5">
                    <img src={src} alt="Highlights FPC" className="w-full h-32 object-cover group-hover:scale-105 transition duration-500 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center p-3 text-center">
                      <span className="text-[9px] text-[#D4AF37] font-mono uppercase tracking-[0.2em] font-semibold">GALERIA OFICIAL FPC</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Golaço de Trivela - Semifinal Copa do Brasil FPC", length: "0:45", views: "1.2k views" },
                  { title: "Defesas Espetaculares da Rodada 4 - Brasileirão Serie A", length: "3:12", views: "850 views" }
                ].map((vid, idx) => (
                  <div key={idx} className="bg-black/60 p-4 rounded-none border border-white/5 flex justify-between items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center font-bold text-[#D4AF37] text-xs">
                        ▶
                      </div>
                      <div>
                        <p className="text-white text-xs font-semibold leading-snug tracking-wide font-sans">{vid.title}</p>
                        <p className="text-[9px] text-zinc-500 font-mono mt-1">{vid.views}</p>
                      </div>
                    </div>
                    <span className="font-mono text-[9px] bg-zinc-900 border border-white/10 text-zinc-400 px-2 py-0.5 rounded-none">{vid.length}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB E: PROTESTOS E REGULAMENTO */}
      {activeTab === "protestos" && (
        <div id="tab-content-protestos" className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Dispute Regulation handbook */}
          <div className="bg-[#090909]/80 border border-white/5 rounded-none p-5 sm:p-6 shadow-lg space-y-4">
            <h4 className="text-xs font-display tracking-[0.2em] text-white uppercase flex items-center gap-2 border-l border-[#D4AF37] pl-3">
              <BookOpen size={14} className="text-[#D4AF37]" /> Regulamento Online FPC 2026
            </h4>
            <div className="space-y-4 text-xs text-zinc-300 leading-relaxed max-h-[420px] overflow-y-auto pr-1">
              <div className="p-4 bg-black/45 rounded-none border border-white/5">
                <h5 className="font-bold text-[#D4AF37] font-mono tracking-wider mb-1 uppercase text-[10px]">Artigo 1 - Regras do Pro Clubs</h5>
                <p className="text-zinc-400 font-sans leading-relaxed text-xs">Todos os times inscritos no Brasileirão Série A, Série B ou Copas devem comparecer com no mínimo 7 atletas no horário previamente marcado do jogo. Tolerâncias de até 15 minutos adicionais podem ser autorizadas mediante concordância de ambos os gestores antes do horário fixado.</p>
              </div>
              <div className="p-4 bg-black/45 rounded-none border border-white/5">
                <h5 className="font-bold text-[#D4AF37] font-mono tracking-wider mb-1 uppercase text-[10px]">Artigo 2 - Desconexões de Servidores</h5>
                <p className="text-zinc-400 font-sans leading-relaxed text-xs">Em caso de travamento do servidor EA FC nos primeiros 5 minutos de partida, o jogo será reiniciado preservando o placar caso gols tenham sido sacramentados. Caso ocorra após os 5 minutos, os segundos remanescentes devem ser acordados por chat privado e relatados imediatamente para os administradores master da federação.</p>
              </div>
              <div className="p-4 bg-black/45 rounded-none border border-white/5">
                <h5 className="font-bold text-[#D4AF37] font-mono tracking-wider mb-1 uppercase text-[10px]">Artigo 3 - Inscrições no Elenco</h5>
                <p className="text-zinc-400 font-sans leading-relaxed text-xs">Nenhum jogador poderá atuar por dois times diferentes em uma mesma rodada de campeonato ou de forma clandestina. A punição em caráter de pirataria desclassificará automaticamente o clube infrator conferindo placar desportivo de W.O. (3 - 0) a favor do time reclamante legal.</p>
              </div>
            </div>
          </div>

          {/* Protest File form & history (manager only) */}
          <div className="space-y-6">
            <div className="bg-[#090909]/80 border border-white/5 rounded-none p-5 sm:p-6 shadow-lg">
              <h4 className="text-xs font-display tracking-[0.2em] text-white uppercase mb-4 flex items-center gap-2 border-l border-[#D4AF37] pl-3">
                <AlertTriangle size={14} className="text-[#D4AF37]" /> Protocolar Reclamação Oficial
              </h4>
              <p className="text-xs text-zinc-400 mb-4 leading-relaxed font-sans">
                Seu clube sofreu alguma infração às regras esportivas? Envie evidências por vídeo/imagem em tempo real direto ao comitê da FPC.
              </p>

              {currentRole === "visitor" ? (
                <div className="bg-amber-950/15 border border-[#D4AF37]/20 p-4 rounded-none text-xs text-zinc-400 leading-normal">
                  ⚠️ Formulário restrito para **Administradores de Clubes**. Mude seu simulador no painel de topo para **Club Manager** para registrar reclamações formais.
                </div>
              ) : (
                <form id="protest-form" onSubmit={handleProtestSubmit} className="space-y-4 text-xs">
                  {managerClub && (
                    <div className="text-[10px] text-zinc-400 font-mono bg-white/[0.02] p-2 rounded-none border border-white/5 inline-block mb-1">
                      Responsável: <strong className="text-[#D4AF37]">{managerClub.name} Manager</strong>
                    </div>
                  )}
                  <div>
                    <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">TÍTULO DA RECLAMAÇÃO:</label>
                    <input
                      id="input-protest-title"
                      type="text"
                      className="w-full bg-black text-white border border-white/10 rounded-none p-3.5 focus:outline-none focus:border-[#D4AF37]/50"
                      placeholder="Ex: Reclamação W.O. - Rodada 5"
                      value={protestTitle}
                      onChange={e => setProtestTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">DESCRIÇÃO E LINKS DE PROVAS (CAPTURA / TWITCH / YOUTUBE):</label>
                    <textarea
                      id="input-protest-desc"
                      rows={3}
                      className="w-full bg-black text-white border border-white/10 rounded-none p-3.5 focus:outline-none focus:border-[#D4AF37]/50 resize-none font-sans font-light"
                      placeholder="Descreva o incidente ou erro do adversário e anexe o link público de vídeo correspondente..."
                      value={protestDesc}
                      onChange={e => setProtestDesc(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button
                    id="submit-protest-btn"
                    type="submit"
                    className="w-full bg-transparent border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 font-bold text-[10px] uppercase tracking-[0.2em] py-3 rounded-none"
                  >
                    REGISTRAR PROCESSO DISCIPLINAR
                  </button>
                </form>
              )}
            </div>

            {/* List of Protest history */}
            <div className="bg-[#090909]/80 border border-white/5 rounded-none p-5 sm:p-6 shadow-lg">
              <h4 className="text-[9px] font-mono tracking-widest uppercase text-zinc-500 mb-4">Processos em Análise Judicial</h4>
              {protests.length === 0 ? (
                <p className="text-center py-6 text-zinc-600 text-[10px] uppercase font-mono tracking-wider">Nenhum incidente cadastrado recente.</p>
              ) : (
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {protests.map(p => (
                    <div key={p.id} className="bg-black/60 p-3.5 rounded-none border border-white/5 text-xs flex justify-between items-start gap-4">
                      <div>
                        <p className="font-semibold text-white tracking-wide">{p.title}</p>
                        <p className="text-[9px] text-[#D4AF37] font-mono tracking-wide mt-1 uppercase">Clube: {p.clubName}</p>
                        <p className="text-[11px] text-zinc-400 line-clamp-1 mt-1.5 font-light font-sans italic">&ldquo;{p.description}&rdquo;</p>
                      </div>
                      <span className={`text-[8px] uppercase font-mono tracking-wider font-extrabold px-2.5 py-1 rounded-none shrink-0 ${
                        p.status === "aberto" ? "bg-amber-950/40 text-amber-500 border border-amber-500/10" : p.status === "analise" ? "bg-blue-950/40 text-blue-400 border border-blue-500/10" : "bg-emerald-950/40 text-emerald-400 border border-emerald-500/10"
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
