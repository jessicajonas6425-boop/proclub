/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Club {
  id: string;
  name: string;
  logo: string;
  city: string;
  state: string;
  primaryKit: string;
  secondaryKit: string;
  manager: string;
  captain: string;
  creatorId: string;
  createdAt: string;
}

export interface Player {
  id: string;
  clubId: string;
  name: string;
  nickname: string;
  position: "Goleiro" | "Zagueiro" | "Lateral" | "Volante" | "Meio Campo" | "Meia Atacante" | "Ponta" | "Atacante";
  number: number;
  photo: string;
  nationality: string;
  birthDate: string;
  eaId: string;
  goals: number;
  assists: number;
  saves: number;
  yellowCards: number;
  redCards: number;
}

export type TournamentType = "Liga" | "Copa" | "Super Copa" | "Mata-Mata" | "Pontos Corridos";

export interface Tournament {
  id: string;
  name: string;
  logo: string;
  type: TournamentType;
  season: string;
  rules: string;
  numTeams: number;
  teams: string[]; // List of Club IDs
  createdAt: string;
  startDate?: string;
  endDate?: string;
}

export interface MatchEvent {
  id: string;
  time: number;
  type: "goal" | "yellow" | "red";
  playerId: string;
  playerName: string;
  playerNickname: string;
  clubId: string;
}

export interface MatchStats {
  homePossession: number;
  awayPossession: number;
  homeShots: number;
  awayShots: number;
  homeFouls: number;
  awayFouls: number;
}

export interface Match {
  id: string;
  tournamentId: string;
  tournamentName?: string;
  round: number;
  date: string;
  time: string;
  stadium: string;
  homeTeamId: string;
  homeTeamName: string;
  homeTeamLogo: string;
  awayTeamId: string;
  awayTeamName: string;
  awayTeamLogo: string;
  homeScore: number;
  awayScore: number;
  status: "agendado" | "andamento" | "encerrado";
  liveMinutes?: number;
  stats: MatchStats;
  events: MatchEvent[];
}

export interface Standing {
  id: string; // clubId_tournamentId
  tournamentId: string;
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
}

export interface News {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
  author: string;
}

export interface Transfer {
  id: string;
  playerId: string;
  playerName: string;
  playerNickname: string;
  playerPosition: string;
  fromClubId: string;
  fromClubName: string;
  toClubId: string;
  toClubName: string;
  value: string;
  date: string;
  status: "pending" | "completed" | "cancelled";
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  senderClubName: string;
  text: string;
  timestamp: string;
}

export interface Protest {
  id: string;
  title: string;
  description: string;
  clubId: string;
  clubName: string;
  status: "aberto" | "analise" | "resolvido";
  createdAt: string;
}
