/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Shield, Sparkles, Users, Trophy, LogIn, LogOut, UserCheck } from "lucide-react";

interface HeaderProps {
  currentRole: "admin" | "manager" | "visitor";
  setRole: (role: "admin" | "manager" | "visitor") => void;
  currentUser: any;
  onOpenAuthModal: () => void;
  handleLogout: () => void;
  stats: {
    clubsCount: number;
    playersCount: number;
    tournamentsCount: number;
    gamesCount: number;
    goalsCount: number;
  };
}

export function Header({
  currentRole,
  setRole,
  currentUser,
  onOpenAuthModal,
  handleLogout,
  stats
}: HeaderProps) {
  return (
    <header id="header-container" className="sticky top-0 z-50 bg-[#050505]/95 border-b border-[#D4AF37]/30 backdrop-blur-md">
      {/* Top micro ticker info */}
      <div id="stats-ticker" className="bg-black/95 text-[10px] text-zinc-400 font-mono tracking-wider py-2 px-4 border-b border-white/5 flex flex-wrap justify-end items-center gap-2">
        <div id="quick-stats" className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-zinc-400"><Users size={12} className="text-[#D4AF37]" /> TIMES: <strong className="text-white font-semibold font-mono">{stats.clubsCount}</strong></span>
          <span className="flex items-center gap-1 text-zinc-400"><Users size={12} className="text-[#D4AF37]" /> ATLETAS: <strong className="text-white font-semibold font-mono">{stats.playersCount}</strong></span>
          <span className="flex items-center gap-1 text-zinc-400"><Trophy size={12} className="text-[#D4AF37]" /> ATIVOS: <strong className="text-white font-semibold font-mono">{stats.tournamentsCount}</strong></span>
          <span className="flex items-center gap-1 text-zinc-400"><Sparkles size={12} className="text-[#D4AF37]" /> GOLS: <strong className="text-white font-semibold font-mono">{stats.goalsCount}</strong></span>
        </div>
      </div>

      <div id="main-header" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Brand */}
        <div id="brand-area" className="flex items-center gap-3.5">
          <div className="w-10 h-10 border border-[#D4AF37]/50 rounded-xs flex items-center justify-center overflow-hidden bg-black shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <img 
              src="https://i.ibb.co/xqJFZnyX/Chat-GPT-Image-5-de-jun-de-2026-16-06-46.png" 
              alt="FPC Logo" 
              className="w-full h-full object-cover escala-logo" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-base sm:text-lg md:text-xl font-display font-extralight tracking-[0.15em] text-white flex items-center gap-1 leading-none">
              FEDERAÇÃO <span className="font-extrabold text-[#D4AF37]">PRO CLUBS</span>
            </h1>
            <p className="text-[9px] text-[#D4AF37]/95 font-serif tracking-[0.2em] uppercase italic leading-none mt-1">Série Épica • Premier Division</p>
          </div>
        </div>

        {/* Authentication Widget and Role Simulation */}
        <div id="auth-controls" className="flex items-center gap-4 flex-wrap">
          {/* Real Firebase Authentication or Login state */}
          <div id="real-auth-region" className="flex items-center gap-2">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 pl-3 pr-2 py-1.5 rounded-xs">
                <div className="text-right">
                  <p className="text-xs text-white font-medium tracking-tight truncate max-w-[120px]">{currentUser.displayName || "Admin FPC"}</p>
                  <p className="text-[9px] text-[#D4AF37] font-mono uppercase tracking-widest font-semibold mt-0.5">
                    {currentUser.email === "jessicajonas6425@gmail.com" || currentRole === "admin" ? "Master Auth" : "User Club"}
                  </p>
                </div>
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt={currentUser.displayName} className="w-8 h-8 rounded-xs border border-[#D4AF37]/40" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 rounded-xs bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center font-mono text-xs font-semibold border border-[#D4AF37]/20">
                    FP
                  </div>
                )}
                <button
                  id="sign-out-btn"
                  onClick={handleLogout}
                  title="Sair"
                  className="p-1 px-2 text-zinc-400 hover:text-red-400 transition"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <button
                id="sign-in-btn"
                onClick={onOpenAuthModal}
                className="flex items-center gap-2 bg-gradient-to-r from-[#B8972C] to-[#D4AF37] text-black font-extrabold tracking-wider text-[10px] uppercase py-2.5 px-5 rounded-xs shadow-lg shadow-[#D4AF37]/15 hover:brightness-110 active:scale-95 transition"
              >
                <LogIn size={14} />
                <span>Entrar / Cadastrar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
