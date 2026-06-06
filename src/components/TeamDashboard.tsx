/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Club, Player } from "../types";
import { Shield, Plus, Edit, Trash2, Save, FileEdit, Users, Award, Eye, UserX, AlertCircle } from "lucide-react";

interface TeamDashboardProps {
  myClub: Club | null;
  clubs: Club[];
  players: Player[];
  onRegisterClub: (clubData: Partial<Club>) => void;
  onUpdateClub: (clubId: string, clubData: Partial<Club>) => void;
  onAddPlayer: (playerData: Partial<Player>) => void;
  onUpdatePlayer: (playerId: string, playerData: Partial<Player>) => void;
  onRemovePlayer: (playerId: string) => void;
  authUserId: string;
  isRegistrationOpen: boolean;
}

export function TeamDashboard({
  myClub,
  clubs,
  players,
  onRegisterClub,
  onUpdateClub,
  onAddPlayer,
  onUpdatePlayer,
  onRemovePlayer,
  authUserId,
  isRegistrationOpen
}: TeamDashboardProps) {
  // Roster addition state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);

  // Club registration form states
  const [clubName, setClubName] = useState("");
  const [clubCity, setClubCity] = useState("São Paulo");
  const [clubState, setClubState] = useState("SP");
  const [clubLogo, setClubLogo] = useState("🛡️");
  const [clubManager, setClubManager] = useState("");
  const [clubCaptain, setClubCaptain] = useState("");
  const [clubPrimaryKit, setClubPrimaryKit] = useState("#FFFFFF");
  const [clubSecondaryKit, setClubSecondaryKit] = useState("#000000");

  // Player form states
  const [pName, setPName] = useState("");
  const [pNickname, setPNickname] = useState("");
  const [pPosition, setPPosition] = useState<Player["position"]>("Atacante");
  const [pNumber, setPNumber] = useState<number>(10);
  const [pPhoto, setPPhoto] = useState("");
  const [pNationality, setPNationality] = useState("Brasil");
  const [pBirthDate, setPBirthDate] = useState("2000-01-01");
  const [pEaId, setPEaId] = useState("");

  const myPlayers = myClub ? players.filter(p => p.clubId === myClub.id) : [];

  // Submit Club Profile
  const handleClubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: clubName || "FPC Premier FC",
      city: clubCity || "Sampa",
      state: clubState || "SP",
      logo: clubLogo || "🛡️",
      manager: clubManager || "Gestor Solitário",
      captain: clubCaptain || "Capitão Fiel",
      primaryKit: clubPrimaryKit,
      secondaryKit: clubSecondaryKit,
      creatorId: authUserId,
      createdAt: new Date().toISOString()
    };

    if (myClub) {
      onUpdateClub(myClub.id, data);
      alert("Configurações do clube salvas com sucesso!");
    } else {
      onRegisterClub(data);
      alert("Clube registrado com sucesso na Federação!");
    }
  };

  const loadClubIntoForm = () => {
    if (myClub) {
      setClubName(myClub.name);
      setClubCity(myClub.city);
      setClubState(myClub.state);
      setClubLogo(myClub.logo);
      setClubManager(myClub.manager);
      setClubCaptain(myClub.captain);
      setClubPrimaryKit(myClub.primaryKit);
      setClubSecondaryKit(myClub.secondaryKit);
    }
  };

  React.useEffect(() => {
    loadClubIntoForm();
  }, [myClub]);

  // Submit Player Addition or Edit
  const handlePlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myClub) return;

    const data: Partial<Player> = {
      clubId: myClub.id,
      name: pName,
      nickname: pNickname,
      position: pPosition,
      number: Number(pNumber) || 10,
      photo: pPhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=50",
      nationality: pNationality,
      birthDate: pBirthDate,
      eaId: pEaId,
      goals: editingPlayerId ? undefined : 0,
      assists: editingPlayerId ? undefined : 0,
      saves: editingPlayerId ? undefined : 0,
      yellowCards: editingPlayerId ? undefined : 0,
      redCards: editingPlayerId ? undefined : 0
    };

    if (editingPlayerId) {
      onUpdatePlayer(editingPlayerId, data);
      setEditingPlayerId(null);
      alert("Ficha do atleta atualizada!");
    } else {
      onAddPlayer(data);
      alert("Atleta integrado ao elenco com sucesso!");
    }

    // Reset Form
    setPName("");
    setPNickname("");
    setPPosition("Atacante");
    setPNumber(10);
    setPPhoto("");
    setPEaId("");
    setShowAddForm(false);
  };

  const handleEditPlayerClick = (p: Player) => {
    setEditingPlayerId(p.id);
    setPName(p.name);
    setPNickname(p.nickname);
    setPPosition(p.position);
    setPNumber(p.number);
    setPPhoto(p.photo);
    setPNationality(p.nationality);
    setPBirthDate(p.birthDate);
    setPEaId(p.eaId);
    setShowAddForm(true);
  };

  return (
    <div id="team-dash-root" className="space-y-8">
      {/* Disclaimer on unclaimed club roles */}
      {!myClub && (
        <div className="bg-gradient-to-r from-zinc-950 to-[#D4AF37]/5 border border-[#D4AF37]/30 rounded-none p-6 text-center space-y-4 max-w-2xl mx-auto shadow-xl">
          <Shield size={42} className="text-[#D4AF37] mx-auto" />
          <h3 className="text-sm font-display tracking-[0.2em] text-white uppercase">FILIE SEU CLUBE DE PRO CLUBS</h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans font-light">
            Seu usuário autenticado não possui clube afiliado registrado. Complete as especificações abaixo para fundar seu clube e gerenciar sua comissão técnica e elenco na liga!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Club Profile Customizer */}
        <div className="bg-[#090909]/80 border border-white/5 rounded-none p-5 sm:p-6 shadow-lg">
          <h4 className="text-[10px] font-display font-light text-[#D4AF37] uppercase tracking-[0.2em] mb-5 border-l border-[#D4AF37] pl-3 flex items-center gap-2">
            <FileEdit size={14} className="text-[#D4AF37]" /> FICHA DE AFILIAÇÃO
          </h4>
          <form onSubmit={handleClubSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">NOME DO CLUBE:</label>
              <input
                id="input-club-name"
                type="text"
                className="w-full bg-black text-white border border-white/10 rounded-none p-3 focus:outline-none focus:border-[#D4AF37]/50"
                placeholder="Ex: Santos Pro Esports"
                value={clubName}
                onChange={e => setClubName(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">SÉDE / CIDADE:</label>
                <input
                   id="input-club-city"
                   type="text"
                   className="w-full bg-black text-white border border-white/10 rounded-none p-2.5 focus:outline-none focus:border-[#D4AF37]/50"
                   value={clubCity}
                   onChange={e => setClubCity(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">ESTADO:</label>
                <input
                  id="input-club-state"
                  type="text"
                  maxLength={2}
                  className="w-full bg-black text-white border border-white/10 rounded-none p-2.5 text-center focus:outline-none focus:border-[#D4AF37]/50 font-mono"
                  value={clubState}
                  onChange={e => setClubState(e.target.value.toUpperCase())}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">ESCUDO (EMOJI/ÍCONE):</label>
                <input
                  id="input-club-logo"
                  type="text"
                  className="w-full bg-black text-white border border-white/10 rounded-none p-2.5 text-center focus:outline-none focus:border-[#D4AF37]/50"
                  placeholder="Ex: 🐱 ou 🔴⚪"
                  value={clubLogo}
                  onChange={e => setClubLogo(e.target.value)}
                />
              </div>
              <div className="bg-black/40 border border-white/5 rounded-none p-2 flex items-center justify-center text-4xl">
                {clubLogo || "🛡️"}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5 font-sans">COR KIT 1:</label>
                <div className="flex gap-2 items-center">
                  <input
                    id="input-club-kit1"
                    type="color"
                    className="w-8 h-8 rounded-none bg-transparent cursor-pointer border-0"
                    value={clubPrimaryKit}
                    onChange={e => setClubPrimaryKit(e.target.value)}
                  />
                  <span className="font-mono text-[9px] text-zinc-400 uppercase">{clubPrimaryKit}</span>
                </div>
              </div>
              <div>
                <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5 font-sans">COR KIT 2:</label>
                <div className="flex gap-2 items-center">
                  <input
                    id="input-club-kit2"
                    type="color"
                    className="w-8 h-8 rounded-none bg-transparent cursor-pointer border-0"
                    value={clubSecondaryKit}
                    onChange={e => setClubSecondaryKit(e.target.value)}
                  />
                  <span className="font-mono text-[9px] text-zinc-400 uppercase">{clubSecondaryKit}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">TÉCNICO / GESTOR:</label>
                <input
                  id="input-club-manager"
                  type="text"
                  className="w-full bg-black text-white border border-white/10 rounded-none p-2.5 focus:outline-none focus:border-[#D4AF37]/50"
                  value={clubManager}
                  onChange={e => setClubManager(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">CAPITÃO ADVERSÁRIO:</label>
                <input
                  id="input-club-captain"
                  type="text"
                  className="w-full bg-black text-white border border-white/10 rounded-none p-2.5 focus:outline-none focus:border-[#D4AF37]/50"
                  value={clubCaptain}
                  onChange={e => setClubCaptain(e.target.value)}
                />
              </div>
            </div>

            <button
              id="save-club-btn"
              type="submit"
              className="w-full bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300 font-bold text-[10px] uppercase tracking-[0.2em] py-3 rounded-none flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <Save size={14} />
              <span>{myClub ? "SALVAR PERFIL DO CLUBE" : "FILIAR EQUIPE NA FPC"}</span>
            </button>
          </form>
        </div>

        {/* Right Column (2/3span): Squad Roster and Athlete Management */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#090909]/80 border border-white/5 rounded-none p-5 sm:p-6 shadow-lg">
            <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
              <div>
                <h4 className="text-xs font-display tracking-[0.2em] text-white uppercase flex items-center gap-2">
                  <Users size={14} className="text-[#D4AF37]" /> Elenco Oficial de Atletas Virtuais
                </h4>
                <p className="text-[10px] text-zinc-500 font-sans mt-1">
                  Gerenciamento dinâmico de elenco para competições oficiais. Máximo de 25 atletas.
                </p>
              </div>
              {myClub && (
                <button
                  id="btn-show-add-player"
                  disabled={!isRegistrationOpen}
                  onClick={() => {
                    setEditingPlayerId(null);
                    setShowAddForm(!showAddForm);
                  }}
                  className={`bg-transparent border ${isRegistrationOpen ? 'border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black' : 'border-zinc-800 text-zinc-700'} font-bold text-[9px] uppercase tracking-wider py-2 px-4 rounded-none flex items-center gap-1 transition-all duration-300 ${isRegistrationOpen ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                >
                  <Plus size={12} /> {isRegistrationOpen ? "Add Atleta" : "Janela Fechada"}
                </button>
              )}
            </div>

            {/* In-place Player additions form (Collapsible) */}
            {showAddForm && myClub && (
              <form onSubmit={handlePlayerSubmit} className="bg-black/90 p-5 rounded-none border border-[#D4AF37]/30 mb-6 text-xs space-y-4">
                <p className="font-bold text-[#D4AF37] uppercase text-[9px] tracking-[0.2em] font-mono flex items-center gap-1.5">
                  <Award size={13} className="text-[#D4AF37]" /> {editingPlayerId ? "ATUALIZAR DADOS DO ATLETA" : "INTEGRAR ATLETA AO SEU ELENCO"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">CONCORDATÁRIO (NOME COMPLETO):</label>
                    <input
                      id="p-fullname"
                      type="text"
                      className="w-full bg-black border border-white/10 rounded-none p-2.5 focus:outline-none focus:border-[#D4AF37]/40 text-white"
                      placeholder="Ex: Diego Ribas"
                      value={pName}
                      onChange={e => setPName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">APELIDO EM JOGO (NICKNAME):</label>
                    <input
                      id="p-nickname"
                      type="text"
                      className="w-full bg-black border border-white/10 rounded-none p-2.5 focus:outline-none focus:border-[#D4AF37]/40 text-white"
                      placeholder="Ex: Dieguinho10"
                      value={pNickname}
                      onChange={e => setPNickname(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">CONTA EA ID DO ATLETA:</label>
                    <input
                      id="p-eaid"
                      type="text"
                      className="w-full bg-black border border-white/10 rounded-none p-2.5 focus:outline-none focus:border-[#D4AF37]/40 text-white"
                      placeholder="Ex: Diego_FPC_Power"
                      value={pEaId}
                      onChange={e => setPEaId(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">POSIÇÃO TÁTICA:</label>
                    <select
                      id="p-position-select"
                      className="w-full bg-black border border-white/10 rounded-none p-2.5 text-white focus:outline-none focus:border-[#D4AF37]/40"
                      value={pPosition}
                      onChange={e => setPPosition(e.target.value as Player["position"])}
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
                  <div>
                    <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">NÚMERO DA CAMISA:</label>
                    <input
                      id="p-num"
                      type="number"
                      className="w-full bg-black border border-white/10 rounded-none p-2.5 focus:outline-none focus:border-[#D4AF37]/40 text-white font-mono"
                      value={pNumber}
                      onChange={e => setPNumber(Number(e.target.value))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">NACIONALIDADE:</label>
                    <input
                      id="p-nation"
                      type="text"
                      className="w-full bg-black border border-white/10 rounded-none p-2.5 focus:outline-none focus:border-[#D4AF37]/40 text-white"
                      value={pNationality}
                      onChange={e => setPNationality(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">NASCIMENTO:</label>
                    <input
                      id="p-birth"
                      type="date"
                      className="w-full bg-black border border-white/10 rounded-none p-2 text-white focus:outline-none focus:border-[#D4AF37]/40"
                      value={pBirthDate}
                      onChange={e => setPBirthDate(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">IMAGEM AVATAR URL (FOTO DE PERFIL):</label>
                  <input
                    id="p-photo-url"
                    type="text"
                    className="w-full bg-black border border-white/10 rounded-none p-2.5 placeholder:text-zinc-700 text-white focus:outline-none"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={pPhoto}
                    onChange={e => setPPhoto(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    id="btn-cancel-p-form"
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-zinc-900 border border-white/10 hover:border-white/20 text-zinc-400 font-bold px-4 py-2 text-[10px] uppercase tracking-wider rounded-none"
                  >
                    Descartar
                  </button>
                  <button
                    id="btn-save-player"
                    type="submit"
                    className="bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-extrabold uppercase px-5 py-2 text-[10px] tracking-wider rounded-none transition"
                  >
                    Salvar Jogador
                  </button>
                </div>
              </form>
            )}

            {/* Athlete list Grid layout */}
            {!myClub ? (
              <div className="text-center py-12 bg-black/40 border border-dashed border-white/5 rounded-none space-y-2 text-zinc-500 text-xs">
                <AlertCircle size={24} className="text-[#D4AF37] mx-auto mb-1 animate-pulse" />
                <p className="font-mono tracking-widest uppercase font-bold text-[10px] text-zinc-400">NENHUM CLUBE FILIADO</p>
                <p className="text-[10px] text-zinc-500 leading-normal">Crie seu clube utilizando a ficha de afiliação na coluna à esquerda.</p>
              </div>
            ) : myPlayers.length === 0 ? (
              <div className="text-center py-12 bg-black/40 border border-dashed border-white/5 rounded-none text-xs text-zinc-500 leading-normal">
                Nenhum jogador cadastrado no momento. Clique em "Add Atleta" no canto superior direito para dar início ao seu elenco!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myPlayers.map(p => (
                  <div key={p.id} className="bg-black/60 rounded-none border border-white/5 p-4 flex justify-between gap-3 text-xs hover:border-[#D4AF37]/35 transition-all duration-300">
                    <div className="flex items-start gap-3 overflow-hidden">
                      <img src={p.photo} alt={p.nickname} className="w-12 h-12 rounded-none object-cover border border-[#D4AF37]/20 shrink-0 grayscale hover:grayscale-0 transition-all duration-300" referrerPolicy="no-referrer" />
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white font-sans truncate tracking-wide text-xs">{p.nickname}</span>
                          <span className="text-[8px] bg-[#D4AF37]/5 border border-[#D4AF37]/30 text-[#D4AF37] py-0.5 px-1.5 rounded-none font-mono font-bold">{p.number}</span>
                        </div>
                        <p className="text-[9px] text-zinc-500 font-mono tracking-wider mt-1 truncate uppercase">{p.name}</p>
                        <p className="text-[10px] text-zinc-400 font-mono mt-1.5 shrink-0">EA ID: <strong className="text-white font-medium">{p.eaId}</strong></p>
                        <p className="text-[9px] font-mono text-zinc-300 font-extrabold bg-white/5 border border-white/10 py-1 px-2.5 rounded-none mt-2.5 inline-block uppercase tracking-wider">{p.position}</p>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-end shrink-0">
                      {/* Player Micro statistics indicator */}
                      <div className="text-right text-[9px] font-mono text-zinc-500 space-y-0.5">
                        <p>GOLS: <strong className="text-[#D4AF37] font-extrabold">{p.goals || 0}</strong></p>
                        <p>ASSISTS: <strong className="text-zinc-300 font-bold">{p.assists || 0}</strong></p>
                      </div>

                      {/* Operation controllers */}
                      <div className="flex gap-1.5">
                        <button
                          id={`p-edit-${p.id}`}
                          title="Editar Ficha"
                          onClick={() => handleEditPlayerClick(p)}
                          className="p-1 px-1.5 bg-zinc-950 border border-white/5 text-zinc-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/45 transition duration-200"
                        >
                          <Edit size={11} />
                        </button>
                        <button
                          id={`p-delete-${p.id}`}
                          title="Remover Atleta"
                          onClick={() => {
                            if (confirm(`Excluir ${p.nickname} permanentemente do time?`)) {
                              onRemovePlayer(p.id);
                            }
                          }}
                          className="p-1 px-1.5 bg-red-950/20 border border-red-900/30 text-rose-400 hover:bg-rose-950 hover:text-white transition duration-200"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
