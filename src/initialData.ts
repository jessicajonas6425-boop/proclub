/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Club, Player, Tournament, Match, News } from "./types";

export const SAMPLE_CLUBS: Club[] = [
  {
    id: "club-1",
    name: "Flamengo Pro Clubs",
    logo: "🔴⚫",
    city: "Rio de Janeiro",
    state: "RJ",
    primaryKit: "#E30613",
    secondaryKit: "#FFFFFF",
    manager: "Felipe 'Giga' Silva",
    captain: "Victor 'Mito' Santos",
    creatorId: "creator-flamengo",
    createdAt: new Date().toISOString()
  },
  {
    id: "club-2",
    name: "Palmeiras E-Sports",
    logo: "🟢⚪",
    city: "São Paulo",
    state: "SP",
    primaryKit: "#006437",
    secondaryKit: "#FFFFFF",
    manager: "Gustavo 'Verdão' Abel",
    captain: "Dudu 'Chave' Gomes",
    creatorId: "creator-palmeiras",
    createdAt: new Date().toISOString()
  },
  {
    id: "club-3",
    name: "São Paulo FC Pro",
    logo: "🔴⚪⚫",
    city: "São Paulo",
    state: "SP",
    primaryKit: "#E30613",
    secondaryKit: "#000000",
    manager: "Rogério 'Mestre' Ceni",
    captain: "Calleri 'Toca' Ramos",
    creatorId: "creator-saopaulo",
    createdAt: new Date().toISOString()
  },
  {
    id: "club-4",
    name: "Corinthians EA Sports",
    logo: "⚫⚪",
    city: "São Paulo",
    state: "SP",
    primaryKit: "#FFFFFF",
    secondaryKit: "#000000",
    manager: "Danilo 'Timão' Alvim",
    captain: "Cássio 'Gigante' Jr",
    creatorId: "creator-corinthians",
    createdAt: new Date().toISOString()
  },
  {
    id: "club-5",
    name: "Grêmio E-League",
    logo: "🔵⚫⚪",
    city: "Porto Alegre",
    state: "RS",
    primaryKit: "#00A3E0",
    secondaryKit: "#FFFFFF",
    manager: "Portaluppi 'Imortal' R.",
    captain: "Suárez 'Pistoleiro' M.",
    creatorId: "creator-gremio",
    createdAt: new Date().toISOString()
  },
  {
    id: "club-6",
    name: "Atlético Mineiro Pro",
    logo: "⚫⚪🐔",
    city: "Belo Horizonte",
    state: "MG",
    primaryKit: "#000000",
    secondaryKit: "#FFFFFF",
    manager: "Hulk 'Esmaga' Souza",
    captain: "Arana 'Flecha' P.",
    creatorId: "creator-atletico",
    createdAt: new Date().toISOString()
  },
  {
    id: "club-7",
    name: "Cruzeiro Stars Pro",
    logo: "🔵🦊",
    city: "Belo Horizonte",
    state: "MG",
    primaryKit: "#005BA3",
    secondaryKit: "#FFFFFF",
    manager: "Ronaldo 'Fenômeno' Jr",
    captain: "Matheus 'Maestro' P.",
    creatorId: "creator-cruzeiro",
    createdAt: new Date().toISOString()
  },
  {
    id: "club-8",
    name: "Vasco da Gama E-League",
    logo: "⚪⚫💢",
    city: "Rio de Janeiro",
    state: "RJ",
    primaryKit: "#000000",
    secondaryKit: "#FFFFFF",
    manager: "Dinamite 'Eterno' F.",
    captain: "Vegetti 'Pirata' P.",
    creatorId: "creator-vasco",
    createdAt: new Date().toISOString()
  }
];

export const SAMPLE_PLAYERS: Player[] = [
  // Flamengo
  {
    id: "player-1",
    clubId: "club-1",
    name: "Gabriel Barbosa Elite",
    nickname: "Gabigol_EA",
    position: "Atacante",
    number: 99,
    photo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=60",
    nationality: "Brasil",
    birthDate: "1996-08-30",
    eaId: "Gabigol_EA_Pro",
    goals: 14,
    assists: 4,
    saves: 0,
    yellowCards: 2,
    redCards: 0
  },
  {
    id: "player-2",
    clubId: "club-1",
    name: "Giorgian De Arrascaeta",
    nickname: "Arrasca_Mito",
    position: "Meia Atacante",
    number: 14,
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60",
    nationality: "Uruguai",
    birthDate: "1994-06-01",
    eaId: "Arrasca_Pro99",
    goals: 6,
    assists: 12,
    saves: 0,
    yellowCards: 1,
    redCards: 0
  },
  {
    id: "player-3",
    clubId: "club-1",
    name: "Bruno Henrique Elite",
    nickname: "BH27_Speed",
    position: "Ponta",
    number: 27,
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=60",
    nationality: "Brasil",
    birthDate: "1990-12-30",
    eaId: "BH27_Turbo",
    goals: 9,
    assists: 5,
    saves: 0,
    yellowCards: 0,
    redCards: 0
  },
  // Palmeiras
  {
    id: "player-4",
    clubId: "club-2",
    name: "Raphael Veiga Elite",
    nickname: "Veiga_Class",
    position: "Meio Campo",
    number: 23,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60",
    nationality: "Brasil",
    birthDate: "1995-06-19",
    eaId: "Veiga_EA23",
    goals: 11,
    assists: 8,
    saves: 0,
    yellowCards: 1,
    redCards: 0
  },
  {
    id: "player-5",
    clubId: "club-2",
    name: "Weverton Paredão",
    nickname: "Weverton_GK",
    position: "Goleiro",
    number: 21,
    photo: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&auto=format&fit=crop&q=60",
    nationality: "Brasil",
    birthDate: "1987-12-13",
    eaId: "WevertonWall",
    goals: 0,
    assists: 1,
    saves: 42,
    yellowCards: 0,
    redCards: 0
  },
  {
    id: "player-6",
    clubId: "club-2",
    name: "Gustavo Gómez",
    nickname: "Gomez_Xix",
    position: "Zagueiro",
    number: 15,
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=60",
    nationality: "Paraguai",
    birthDate: "1993-05-06",
    eaId: "Gomez_Captain_CB",
    goals: 3,
    assists: 0,
    saves: 0,
    yellowCards: 3,
    redCards: 1
  }
];

export const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: "t-1",
    name: "Brasileirão Série A",
    logo: "🏆",
    type: "Pontos Corridos",
    season: "Temporada 2026",
    rules: "Campeonato por pontos corridos, turno e returno. O líder sagra-se campeão e ganha vaga para a Super Copa.",
    numTeams: 20,
    teams: ["club-1", "club-2", "club-3", "club-4", "club-5", "club-6", "club-7", "club-8"],
    createdAt: new Date().toISOString()
  },
  {
    id: "t-2",
    name: "Brasileirão Série B",
    logo: "🥈",
    type: "Pontos Corridos",
    season: "Temporada 2026",
    rules: "Divisão de acesso. Os 4 melhores sobem para a Série A na temporada seguinte.",
    numTeams: 16,
    teams: ["club-5", "club-6", "club-7", "club-8"],
    createdAt: new Date().toISOString()
  },
  {
    id: "t-3",
    name: "Copa do Brasil FPC",
    logo: "⚔️",
    type: "Mata-Mata",
    season: "Série Épica 2026",
    rules: "Torneio mata-mata com jogos de ida e volta, gol fora de casa não vale como critério de desempate.",
    numTeams: 32,
    teams: ["club-1", "club-2", "club-3", "club-4", "club-5", "club-6", "club-7", "club-8"],
    createdAt: new Date().toISOString()
  },
  {
    id: "t-4",
    name: "Liga Pro Clubs",
    logo: "🌟",
    type: "Liga",
    season: "2026 Elite",
    rules: "Fase de grupos seguida de playoffs de mata-mata. Reúne a elite absoluta do futebol pro clubs.",
    numTeams: 12,
    teams: ["club-1", "club-2", "club-3", "club-4"],
    createdAt: new Date().toISOString()
  }
];

export const SAMPLE_MATCHES: Match[] = [
  {
    id: "match-1",
    tournamentId: "t-1",
    round: 1,
    date: "2026-06-10",
    time: "21:00",
    stadium: "Estádio do Maracanã",
    homeTeamId: "club-1",
    homeTeamName: "Flamengo Pro Clubs",
    homeTeamLogo: "🔴⚫",
    awayTeamId: "club-2",
    awayTeamName: "Palmeiras E-Sports",
    awayTeamLogo: "🟢⚪",
    homeScore: 3,
    awayScore: 2,
    status: "encerrado",
    stats: {
      homePossession: 55,
      awayPossession: 45,
      homeShots: 12,
      awayShots: 8,
      homeFouls: 4,
      awayFouls: 6
    },
    events: [
      { id: "e1", time: 15, type: "goal", playerId: "player-1", playerName: "Gabriel Barbosa", playerNickname: "Gabigol_EA", clubId: "club-1" },
      { id: "e2", time: 42, type: "goal", playerId: "player-4", playerName: "Raphael Veiga", playerNickname: "Veiga_Class", clubId: "club-2" },
      { id: "e3", time: 55, type: "goal", playerId: "player-3", playerName: "Bruno Henrique", playerNickname: "BH27_Speed", clubId: "club-1" },
      { id: "e4", time: 78, type: "yellow", playerId: "player-6", playerName: "Gustavo Gómez", playerNickname: "Gomez_Xix", clubId: "club-2" }
    ]
  },
  {
    id: "match-2",
    tournamentId: "t-1",
    round: 1,
    date: "2026-06-12",
    time: "22:00",
    stadium: "Arena de Itaquera",
    homeTeamId: "club-4",
    homeTeamName: "Corinthians EA Sports",
    homeTeamLogo: "⚫⚪",
    awayTeamId: "club-3",
    awayTeamName: "São Paulo FC Pro",
    awayTeamLogo: "🔴⚪⚫",
    homeScore: 1,
    awayScore: 1,
    status: "encerrado",
    stats: {
      homePossession: 48,
      awayPossession: 52,
      homeShots: 7,
      awayShots: 9,
      homeFouls: 5,
      awayFouls: 3
    },
    events: []
  },
  {
    id: "match-3",
    tournamentId: "t-1",
    round: 2,
    date: "2026-06-15",
    time: "21:30",
    stadium: "Arena Allianz Palestra",
    homeTeamId: "club-2",
    homeTeamName: "Palmeiras E-Sports",
    homeTeamLogo: "🟢⚪",
    awayTeamId: "club-4",
    awayTeamName: "Corinthians EA Sports",
    awayTeamLogo: "⚫⚪",
    homeScore: 0,
    awayScore: 0,
    status: "agendado",
    stats: {
      homePossession: 50,
      awayPossession: 50,
      homeShots: 0,
      awayShots: 0,
      homeFouls: 0,
      awayFouls: 0
    },
    events: []
  },
  {
    id: "match-4",
    tournamentId: "t-1",
    round: 2,
    date: "2026-06-18",
    time: "20:00",
    stadium: "Estádio Beira Rio",
    homeTeamId: "club-3",
    homeTeamName: "São Paulo FC Pro",
    awayTeamId: "club-1",
    awayTeamName: "Flamengo Pro Clubs",
    homeTeamLogo: "🔴⚪⚫",
    awayTeamLogo: "🔴⚫",
    homeScore: 0,
    awayScore: 0,
    status: "andamento",
    liveMinutes: 44,
    stats: {
      homePossession: 41,
      awayPossession: 59,
      homeShots: 3,
      awayShots: 7,
      homeFouls: 4,
      awayFouls: 2
    },
    events: [
      { id: "e10", time: 24, type: "goal", playerId: "player-1", playerName: "Gabriel Barbosa", playerNickname: "Gabigol_EA", clubId: "club-1" }
    ]
  }
];

export const SAMPLE_NEWS: News[] = [
  {
    id: "news-1",
    title: "ABERTURA DA TEMPORADA 2026 DA FEDERAÇÃO PRO CLUBS",
    content: "Damos as boas-vindas a todos os clubes pro clubs no maior campeonato de EA FC Pro Clubs do Brasil! Esta temporada conta com premiações recordes, sistema antifraude integrado e estatísticas minuciosas geradas em tempo real pelas plataformas integradas. Preparem seus times e lutem pelo topo nacional!",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
    date: "2026-06-05",
    author: "Federer Executivo"
  },
  {
    id: "news-2",
    title: "MERCADO DE TRANSFERÊNCIAS AQUECIDO NA ELITE",
    content: "O mercado de transferências oficiais da FPC está a todo vapor! Com grandes contratações anunciadas esta semana nos clubes cariocas e paulistas, os gestores estão buscando reforçar as posições críticas do meio de campo e ataque. Quem fará o maior investimento?",
    image: "https://images.unsplash.com/photo-1540747737956-378724044282?w=800&auto=format&fit=crop&q=80",
    date: "2026-06-04",
    author: "FPC Jornalismo"
  }
];
