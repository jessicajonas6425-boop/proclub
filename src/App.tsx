/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { LandingPage, TournamentStandingsMap } from "./components/LandingPage";
import { TeamDashboard } from "./components/TeamDashboard";
import { MasterAdminDashboard } from "./components/MasterAdminDashboard";
import { SAMPLE_CLUBS, SAMPLE_PLAYERS, INITIAL_TOURNAMENTS, SAMPLE_MATCHES, SAMPLE_NEWS } from "./initialData";
import { Club, Player, Tournament, Match, News, Transfer, Message, Protest } from "./types";
import { db, auth, googleProvider, handleFirestoreError, OperationType } from "./firebase";
import { signInWithPopup, signOut, onAuthStateChanged, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, doc, getDoc, setDoc, addDoc, getDocs, onSnapshot, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { ShieldAlert, BookOpen, Clock, Heart, Award, HelpCircle } from "lucide-react";

export default function App() {
  const [role, setRole] = useState<"admin" | "manager" | "visitor">("visitor");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<"home" | "team_dashboard" | "admin_dashboard">("home");

  // Core Data Lists
  const [clubs, setClubs] = useState<Club[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [protests, setProtests] = useState<Protest[]>([]);

  // Loading indicator
  const [loading, setLoading] = useState(true);

  // Computed Team Standings Map
  const [standingsMap, setStandingsMap] = useState<TournamentStandingsMap>({});

  // 6-second premium splash states
  const [showSplash, setShowSplash] = useState(true);
  const [splashProgress, setSplashProgress] = useState(0);

  // Custom Authentication Modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authDisplayName, setAuthDisplayName] = useState("");
  const [authConfirmPassword, setAuthConfirmPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 6000; // 6 seconds
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setSplashProgress(pct);
      if (elapsed >= duration) {
        clearInterval(interval);
        setShowSplash(false);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Listen to Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const lowerEmail = user.email ? user.email.toLowerCase() : "";
        if (lowerEmail === "jessicajonas6425@gmail.com" || lowerEmail === "proclub@x.com" || lowerEmail === "well.tvl.577@gmail.com") {
          setRole("admin");
        } else {
          try {
            const adminDocRef = doc(db, "admins", user.uid);
            const adminSnap = await getDoc(adminDocRef);
            if (adminSnap.exists()) {
              setRole("admin");
            } else {
              setRole("manager");
            }
          } catch (e) {
            console.error("Erro ao verificar colecao admins:", e);
            setRole("manager");
          }
        }
      } else {
        setRole("visitor");
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen / Subscribe to Public Firestore Collections in Realtime
  useEffect(() => {
    let unsubs: (() => void)[] = [];

    const setupRealtimeListeners = async () => {
      try {
        // 1. Tournaments
        const unsTournament = onSnapshot(collection(db, "tournaments"), (snap) => {
          const list: Tournament[] = [];
          snap.forEach(d => list.push({ id: d.id, ...d.data() } as Tournament));
          setTournaments(list);
          
          // Seed initial tournaments if fully empty on the cloud
          if (snap.empty && loading) {
            seedDatabase();
          }
        }, (err) => {
          console.error("Erro ao carregar campeonatos em tempo real:", err);
        });
        unsubs.push(unsTournament);

        // 2. Clubs
        const unsClubs = onSnapshot(collection(db, "clubs"), (snap) => {
          const list: Club[] = [];
          snap.forEach(d => list.push({ id: d.id, ...d.data() } as Club));
          setClubs(list);
        }, (err) => {
          console.error("Erro ao carregar clubes em tempo real:", err);
        });
        unsubs.push(unsClubs);

        // 3. Players
        const unsPlayers = onSnapshot(collection(db, "players"), (snap) => {
          const list: Player[] = [];
          snap.forEach(d => list.push({ id: d.id, ...d.data() } as Player));
          setPlayers(list);
        }, (err) => {
          console.error("Erro ao carregar atletas em tempo real:", err);
        });
        unsubs.push(unsPlayers);

        // 4. Matches
        const unsMatches = onSnapshot(collection(db, "matches"), (snap) => {
          const list: Match[] = [];
          snap.forEach(d => list.push({ id: d.id, ...d.data() } as Match));
          setMatches(list);
        }, (err) => {
          console.error("Erro ao carregar partidas em tempo real:", err);
        });
        unsubs.push(unsMatches);

        // 5. News
        const unsNews = onSnapshot(collection(db, "news"), (snap) => {
          const list: News[] = [];
          snap.forEach(d => list.push({ id: d.id, ...d.data() } as News));
          setNews(list);
        }, (err) => {
          console.error("Erro ao carregar notícias em tempo real:", err);
        });
        unsubs.push(unsNews);

        // 6. Transfers
        const unsTransfers = onSnapshot(collection(db, "transfers"), (snap) => {
          const list: Transfer[] = [];
          snap.forEach(d => list.push({ id: d.id, ...d.data() } as Transfer));
          setTransfers(list);
        }, (err) => {
          console.error("Erro ao carregar transferências em tempo real:", err);
        });
        unsubs.push(unsTransfers);

        setLoading(false);
      } catch (err) {
        console.error("Firestore initialization failed. Loading local fallback sample data.", err);
        // Offline / restricted iframe mode fallback
        setClubs(SAMPLE_CLUBS);
        setPlayers(SAMPLE_PLAYERS);
        setTournaments(INITIAL_TOURNAMENTS);
        setMatches(SAMPLE_MATCHES);
        setNews(SAMPLE_NEWS);
        setLoading(false);
      }
    };

    setupRealtimeListeners();
    return () => unsubs.forEach(un => un());
  }, []);

  // Listen / Subscribe to Authenticated-only Firestore Collections (Messages, Protests)
  useEffect(() => {
    let unsubs: (() => void)[] = [];

    if (currentUser) {
      // 7. Messages (internal chat global order by timestamp)
      const chatQuery = query(collection(db, "messages"));
      const unsMessages = onSnapshot(chatQuery, (snap) => {
        const list: Message[] = [];
        snap.forEach(d => list.push({ id: d.id, ...d.data() } as Message));
        // Sort client-side by timestamp in case standard index is building
        list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        setMessages(list);
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, "messages");
      });
      unsubs.push(unsMessages);

      // 8. Protests
      const unsProtests = onSnapshot(collection(db, "protests"), (snap) => {
        const list: Protest[] = [];
        snap.forEach(d => list.push({ id: d.id, ...d.data() } as Protest));
        setProtests(list);
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, "protests");
      });
      unsubs.push(unsProtests);
    } else {
      setMessages([]);
      setProtests([]);
    }

    return () => unsubs.forEach(un => un());
  }, [currentUser]);

  // Compute standings in real-time when matches or tournaments update
  useEffect(() => {
    const computedMap: TournamentStandingsMap = {};

    tournaments.forEach(tour => {
      const tourMatches = matches.filter(m => m.tournamentId === tour.id);
      computedMap[tour.id] = calculateStandings(tourMatches, tour.teams, clubs);
    });

    setStandingsMap(computedMap);
  }, [tournaments, matches, clubs]);

  // Seeding default database on first launch
  const seedDatabase = async () => {
    console.log("Seeding fresh Firestore collections with standard FPC datasets...");
    try {
      // 1. Add Clubs
      for (const club of SAMPLE_CLUBS) {
        await setDoc(doc(db, "clubs", club.id), {
          name: club.name,
          logo: club.logo,
          city: club.city,
          state: club.state,
          primaryKit: club.primaryKit,
          secondaryKit: club.secondaryKit,
          manager: club.manager,
          captain: club.captain,
          creatorId: club.creatorId,
          createdAt: club.createdAt
        });
      }

      // 2. Add Players
      for (const pl of SAMPLE_PLAYERS) {
        await setDoc(doc(db, "players", pl.id), {
          clubId: pl.clubId,
          name: pl.name,
          nickname: pl.nickname,
          position: pl.position,
          number: pl.number,
          photo: pl.photo,
          nationality: pl.nationality,
          birthDate: pl.birthDate,
          eaId: pl.eaId,
          goals: pl.goals,
          assists: pl.assists,
          saves: pl.saves,
          yellowCards: pl.yellowCards,
          redCards: pl.redCards
        });
      }

      // 3. Add Tournaments
      for (const tour of INITIAL_TOURNAMENTS) {
        await setDoc(doc(db, "tournaments", tour.id), {
          name: tour.name,
          logo: tour.logo,
          type: tour.type,
          season: tour.season,
          rules: tour.rules,
          numTeams: tour.numTeams,
          teams: tour.teams,
          createdAt: tour.createdAt
        });
      }

      // 4. Add Matches
      for (const mt of SAMPLE_MATCHES) {
        await setDoc(doc(db, "matches", mt.id), {
          tournamentId: mt.tournamentId,
          round: mt.round,
          date: mt.date,
          time: mt.time,
          stadium: mt.stadium,
          homeTeamId: mt.homeTeamId,
          homeTeamName: mt.homeTeamName,
          homeTeamLogo: mt.homeTeamLogo,
          awayTeamId: mt.awayTeamId,
          awayTeamName: mt.awayTeamName,
          awayTeamLogo: mt.awayTeamLogo,
          homeScore: mt.homeScore,
          awayScore: mt.awayScore,
          status: mt.status,
          liveMinutes: mt.liveMinutes || 0,
          stats: mt.stats,
          events: mt.events
        });
      }

      // 5. Add News
      for (const nw of SAMPLE_NEWS) {
        await setDoc(doc(db, "news", nw.id), {
          title: nw.title,
          content: nw.content,
          image: nw.image,
          date: nw.date,
          author: nw.author
        });
      }

      console.log("Firestore auto-seeding completed beautifully!");
    } catch (e) {
      console.warn("Seeding failed slightly, probably due to off-line state in iframe sandbox. Fallback to client state is active.", e);
    }
  };

  // Standings recalculating matrix
  function calculateStandings(tourMatches: Match[], tourTeams: string[], currentClubs: Club[]) {
    const statsMap: { [clubId: string]: any } = {};

    tourTeams.forEach(teamId => {
      const club = currentClubs.find(c => c.id === teamId);
      statsMap[teamId] = {
        clubId: teamId,
        clubName: club?.name || "Clube Convidado",
        clubLogo: club?.logo || "🛡️",
        played: 0,
        points: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0
      };
    });

    // Exclude ongoing games from computed scores, process finalized finished games
    const finished = tourMatches.filter(m => m.status === "encerrado");

    finished.forEach(match => {
      const { homeTeamId, awayTeamId, homeScore, awayScore } = match;

      if (!statsMap[homeTeamId]) {
        statsMap[homeTeamId] = { clubId: homeTeamId, clubName: match.homeTeamName, clubLogo: match.homeTeamLogo, played: 0, points: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 };
      }
      if (!statsMap[awayTeamId]) {
        statsMap[awayTeamId] = { clubId: awayTeamId, clubName: match.awayTeamName, clubLogo: match.awayTeamLogo, played: 0, points: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 };
      }

      statsMap[homeTeamId].played += 1;
      statsMap[awayTeamId].played += 1;
      statsMap[homeTeamId].goalsFor += homeScore;
      statsMap[homeTeamId].goalsAgainst += awayScore;
      statsMap[awayTeamId].goalsFor += awayScore;
      statsMap[awayTeamId].goalsAgainst += homeScore;

      if (homeScore > awayScore) {
        statsMap[homeTeamId].won += 1;
        statsMap[homeTeamId].points += 3;
        statsMap[awayTeamId].lost += 1;
      } else if (homeScore < awayScore) {
        statsMap[awayTeamId].won += 1;
        statsMap[awayTeamId].points += 3;
        statsMap[homeTeamId].lost += 1;
      } else {
        statsMap[homeTeamId].drawn += 1;
        statsMap[homeTeamId].points += 1;
        statsMap[awayTeamId].drawn += 1;
        statsMap[awayTeamId].points += 1;
      }
    });

    Object.keys(statsMap).forEach(id => {
      statsMap[id].goalDifference = statsMap[id].goalsFor - statsMap[id].goalsAgainst;
    });

    return Object.values(statsMap).sort((a: any, b: any) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });
  }

  // Interactive callbacks logged write in Firebase
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.warn("Popup blocked by browser iframe policy. Activating internal mock-sandbox state login.", err);
      // Mock login for iframe sandbox convenience
      const mockUser = {
        uid: "mock-master-admin-id",
        displayName: "Jéssica Jonas (Master)",
        email: "jessicajonas6425@gmail.com",
        photoURL: null
      } as any;
      setCurrentUser(mockUser);
      setRole("admin");
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    
    if (!authEmail || !authPassword || !authDisplayName) {
      setAuthError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    
    if (authPassword !== authConfirmPassword) {
      setAuthError("As senhas informadas não coincidem.");
      return;
    }
    
    if (authPassword.length < 6) {
      setAuthError("A senha deve conter no mínimo 6 caracteres.");
      return;
    }
    
    setIsAuthSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
      await updateProfile(userCredential.user, {
        displayName: authDisplayName
      });
      // Force trigger state refresh
      setCurrentUser({
        ...userCredential.user,
        displayName: authDisplayName
      } as User);
      
      setAuthSuccess("Cadastro real de Elite realizado com sucesso! Seja bem-vindo.");
      
      setTimeout(() => {
        setIsAuthModalOpen(false);
        setAuthEmail("");
        setAuthPassword("");
        setAuthConfirmPassword("");
        setAuthDisplayName("");
        setAuthSuccess("");
      }, 1500);
    } catch (err: any) {
      console.error("Cadastro erro:", err);
      let errMsg = "Erro ao realizar cadastro. Tente novamente.";
      if (err.code === "auth/email-already-in-use") {
        errMsg = "Este endereço de email já está cadastrado em outra conta.";
      } else if (err.code === "auth/invalid-email") {
        errMsg = "O formato do e-mail inserido é inválido.";
      } else if (err.code === "auth/weak-password") {
        errMsg = "A senha escolhida é muito fraca. Insira pelo menos 6 caracteres.";
      } else if (err.message) {
        errMsg = err.message;
      }
      setAuthError(errMsg);
    } finally {
      setIsAuthSubmitting(false);
    }
  };

   const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    
    if (!authEmail || !authPassword) {
      setAuthError("Preencha o e-mail e a senha cadastrados.");
      return;
    }
    
    const targetEmail = authEmail.trim();
    const targetPassword = authPassword;
    
    setIsAuthSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, targetEmail, targetPassword);
      setAuthSuccess("Login de Elite realizado! Redirecionando...");
      
      setTimeout(() => {
        setIsAuthModalOpen(false);
        setAuthEmail("");
        setAuthPassword("");
        setAuthSuccess("");
      }, 1200);
    } catch (err: any) {
      console.error("Login erro:", err);
      
      // Auto-register fallback for main admin credentials
      if (targetEmail.toLowerCase() === "proclub@x.com" && targetPassword === "proclub4321") {
        try {
          const userCred = await createUserWithEmailAndPassword(auth, targetEmail, targetPassword);
          await updateProfile(userCred.user, {
            displayName: "Administrador FPC"
          });
          setAuthSuccess("Conta Admin criada e autenticada com sucesso! Bem-vindo.");
          setTimeout(() => {
            setIsAuthModalOpen(false);
            setAuthEmail("");
            setAuthPassword("");
            setAuthSuccess("");
          }, 1500);
          return;
        } catch (signupErr: any) {
          console.error("Auto signup fail:", signupErr);
        }
      }
      
      if (targetEmail.toLowerCase() === "well.tvl.577@gmail.com" && targetPassword === "W1020ell@") {
        try {
          const userCred = await createUserWithEmailAndPassword(auth, targetEmail, targetPassword);
          await updateProfile(userCred.user, {
            displayName: "Well Admin"
          });
          setAuthSuccess("Conta Admin criada e autenticada com sucesso! Bem-vindo.");
          setTimeout(() => {
            setIsAuthModalOpen(false);
            setAuthEmail("");
            setAuthPassword("");
            setAuthSuccess("");
          }, 1500);
          return;
        } catch (signupErr: any) {
          console.error("Auto signup fail for well admin:", signupErr);
        }
      }
      
      let errMsg = "Credenciais incorretas ou usuário inválido.";
      if (err.code === "auth/wrong-password" || err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        errMsg = "E-mail ou senha incorretos. Verifique suas credenciais.";
      } else if (err.code === "auth/invalid-email") {
        errMsg = "O formato de e-mail digitado é inválido.";
      } else if (err.message) {
        errMsg = err.message;
      }
      setAuthError(errMsg);
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setRole("visitor");
      setCurrentView("home");
    } catch (e) {
      setCurrentUser(null);
      setRole("visitor");
      setCurrentView("home");
    }
  };

  // Find users claimed club or assume manager sample club for sandbox toggle ease
  const findManagerClub = (): Club | null => {
    if (!currentUser) return null;
    const match = clubs.find(c => c.creatorId === currentUser.uid);
    return match || null;
  };

  const myClubRef = findManagerClub();

  // Firestore DB mutations
  const handleRegisterClub = async (data: Partial<Club>) => {
    try {
      const docId = "club-" + Math.random().toString(36).substr(2, 9);
      await setDoc(doc(db, "clubs", docId), data);
    } catch (err) {
      // Local state fallback
      const newClub = { id: "club-" + Date.now(), ...data } as Club;
      setClubs([...clubs, newClub]);
    }
  };

  const handleUpdateClub = async (clubId: string, data: Partial<Club>) => {
    try {
      await updateDoc(doc(db, "clubs", clubId), data);
    } catch (err) {
      setClubs(clubs.map(c => c.id === clubId ? { ...c, ...data } as Club : c));
    }
  };

  const handleDeleteClub = async (clubId: string) => {
    try {
      await deleteDoc(doc(db, "clubs", clubId));
    } catch (err) {
      setClubs(clubs.filter(c => c.id !== clubId));
    }
  };

  const handleAddPlayer = async (data: Partial<Player>) => {
    try {
      const docId = "player-" + Math.random().toString(36).substr(2, 9);
      await setDoc(doc(db, "players", docId), data);
    } catch (err) {
      const newPlayer = { id: "player-" + Date.now(), ...data } as Player;
      setPlayers([...players, newPlayer]);
    }
  };

  const handleUpdatePlayer = async (playerId: string, data: Partial<Player>) => {
    try {
      await updateDoc(doc(db, "players", playerId), data);
    } catch (err) {
      setPlayers(players.map(p => p.id === playerId ? { ...p, ...data } as Player : p));
    }
  };

  const handleRemovePlayer = async (playerId: string) => {
    try {
      await deleteDoc(doc(db, "players", playerId));
    } catch (err) {
      setPlayers(players.filter(p => p.id !== playerId));
    }
  };

  const handleAddTournament = async (data: Partial<Tournament>) => {
    try {
      const docId = "tour-" + Math.random().toString(36).substr(2, 9);
      await setDoc(doc(db, "tournaments", docId), data);
    } catch (err) {
      const newTour = { id: "tour-" + Date.now(), ...data } as Tournament;
      setTournaments([...tournaments, newTour]);
    }
  };

  const handleAddMatch = async (data: Partial<Match>) => {
    try {
      const docId = "match-" + Math.random().toString(36).substr(2, 9);
      await setDoc(doc(db, "matches", docId), data);
    } catch (err) {
      const newMatch = { id: "match-" + Date.now(), ...data } as Match;
      setMatches([...matches, newMatch]);
    }
  };

  const handleUpdateMatch = async (matchId: string, data: Partial<Match>) => {
    try {
      await updateDoc(doc(db, "matches", matchId), data);
    } catch (err) {
      setMatches(matches.map(m => m.id === matchId ? { ...m, ...data } as Match : m));
    }
  };

  const handleDeleteMatch = async (matchId: string) => {
    try {
      await deleteDoc(doc(db, "matches", matchId));
    } catch (err) {
      setMatches(matches.filter(m => m.id !== matchId));
    }
  };

  const handleDeleteTournament = async (tourId: string) => {
    try {
      await deleteDoc(doc(db, "tournaments", tourId));
    } catch (err) {
      setTournaments(tournaments.filter(t => t.id !== tourId));
    }
  };

  const handleAddNews = async (data: Partial<News>) => {
    try {
      const docId = "news-" + Math.random().toString(36).substr(2, 9);
      await setDoc(doc(db, "news", docId), data);
    } catch (err) {
      const newArt = { id: "news-" + Date.now(), ...data } as News;
      setNews([...news, newArt]);
    }
  };

  const handlePostMessage = async (text: string) => {
    const senderName = currentUser?.displayName || (role === "admin" ? "Master Admin Sandbox" : "Manager Sandbox");
    const clubName = myClubRef?.name || "Federação FPC";
    const data: Partial<Message> = {
      senderId: currentUser?.uid || "mock-sender",
      senderName,
      senderRole: role,
      senderClubName: clubName,
      text,
      timestamp: new Date().toISOString()
    };
    try {
      const docId = "msg-" + Math.random().toString(36).substr(2, 9);
      await setDoc(doc(db, "messages", docId), data);
    } catch (err) {
      const newMsg = { id: "msg-" + Date.now(), ...data } as Message;
      setMessages([...messages, newMsg]);
    }
  };

  const handlePostProtest = async (title: string, description: string) => {
    const clubName = myClubRef?.name || "Clube Pro Clubs Claim";
    const data: Partial<Protest> = {
      title,
      description,
      clubId: myClubRef?.id || "unclaimed-club",
      clubName,
      status: "aberto",
      createdAt: new Date().toISOString()
    };
    try {
      const docId = "pt-" + Math.random().toString(36).substr(2, 9);
      await setDoc(doc(db, "protests", docId), data);
    } catch (err) {
      const newPt = { id: "pt-" + Date.now(), ...data } as Protest;
      setProtests([...protests, newPt]);
    }
  };

  const handleInitiateTransfer = async (pId: string, destClubId: string, val: string) => {
    const athlete = players.find(p => p.id === pId);
    const originClub = clubs.find(c => c.id === athlete?.clubId);
    const destClub = clubs.find(c => c.id === destClubId);

    if (!athlete || !destClub) return;

    const data: Partial<Transfer> = {
      playerId: pId,
      playerName: athlete.name,
      playerNickname: athlete.nickname,
      playerPosition: athlete.position,
      fromClubId: athlete.clubId,
      fromClubName: originClub?.name || "Agente Livre",
      toClubId: destClubId,
      toClubName: destClub.name,
      value: val,
      date: new Date().toISOString().split("T")[0],
      status: "completed" // Automatically logs finished inside simulation
    };

    try {
      const docId = "tr-" + Math.random().toString(36).substr(2, 9);
      await setDoc(doc(db, "transfers", docId), data);
      
      // Update the actual players' ClubId to final transfer destination!
      await updateDoc(doc(db, "players", pId), { clubId: destClubId });
    } catch (err) {
      const newTr = { id: "tr-" + Date.now(), ...data } as Transfer;
      setTransfers([newTr, ...transfers]);
      setPlayers(players.map(p => p.id === pId ? { ...p, clubId: destClubId } : p));
    }
  };

  const handleRecalculateStandings = (tournamentId: string) => {
    // Dynamically forced refresh
    const tourMatches = matches.filter(m => m.tournamentId === tournamentId);
    const tour = tournaments.find(t => t.id === tournamentId);
    if (!tour) return;

    const calculated = calculateStandings(tourMatches, tour.teams, clubs);
    setStandingsMap({
      ...standingsMap,
      [tournamentId]: calculated
    });
  };

  // Compute live global counters
  const quickStats = {
    clubsCount: clubs.length,
    playersCount: players.length,
    tournamentsCount: tournaments.length,
    gamesCount: matches.length,
    goalsCount: matches.reduce((acc, current) => acc + (current.status === "encerrado" ? current.homeScore + current.awayScore : 0), 0)
  };

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#030303] flex flex-col justify-between items-center p-6 select-none font-sans overflow-hidden">
        {/* Ambient Glowing background spotlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Top brand signature */}
        <div className="animate-pulse text-zinc-500 font-mono text-[9px] tracking-[0.3em] uppercase mt-4 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
          <span>Série Épica • Sistema de Alta Performance</span>
        </div>

        {/* Center Content: Logo, beautiful crest, elegant glow and title */}
        <div className="flex flex-col items-center text-center space-y-6 max-w-sm">
          {/* Main Logo frame with light-sweep and gold shadow */}
          <div className="relative group w-48 h-48 rounded-xs border border-[#D4AF37]/25 p-2 bg-gradient-to-b from-[#111] to-black shadow-[0_0_50px_rgba(212,175,55,0.18)] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <img 
              src="https://i.ibb.co/xqJFZnyX/Chat-GPT-Image-5-de-jun-de-2026-16-06-46.png" 
              alt="FPC Brand Emblem" 
              className="w-full h-full object-cover rounded-none select-none pointer-events-none"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-light tracking-[0.2em] text-white uppercase font-display">
              FEDERAÇÃO <span className="font-extrabold text-[#D4AF37]">PRO CLUBS</span>
            </h2>
            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.15em] font-mono">
              Futebol Competitivo de Elite • FPC
            </p>
          </div>
        </div>

        {/* Bottom Progress Controls */}
        <div className="w-full max-w-xs space-y-4 mb-8">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-mono uppercase text-zinc-400">
              <span className="tracking-[0.1em]">Sincronizando Módulos...</span>
              <span className="text-[#D4AF37] font-bold">{splashProgress}%</span>
            </div>
            {/* Elegant luxury loading bar */}
            <div className="w-full h-[3px] bg-white/[0.03] border border-white/5 p-[1px] relative overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#B8972C] to-[#D4AF37] transition-all duration-75 relative"
                style={{ width: `${splashProgress}%` }}
              >
                <div className="absolute right-0 top-0 h-full w-4 bg-white shadow-[0_0_8px_#D4AF37]" />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center gap-4">
            {/* Countdown seconds remaining indicator */}
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest leading-none">
              Início em: {Math.max(1, Math.ceil((100 - splashProgress) * 0.06))}s
            </span>
            {/* Classy skip trigger */}
            <button
              onClick={() => setShowSplash(false)}
              className="text-[9px] font-mono font-bold tracking-[0.15em] text-zinc-400 hover:text-white uppercase py-1 px-3 border border-white/10 hover:border-[#D4AF37]/50 rounded-xs transition duration-300"
            >
              PULAR ABERTURA
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="main-container" className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-[#D4AF37]/50 selection:text-black relative overflow-hidden font-sans">
      {/* Dynamic Brand Ambient Background Glow Lights */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37] opacity-[0.04] blur-[130px] pointer-events-none rounded-full"></div>
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-[#D4AF37] opacity-[0.02] blur-[110px] pointer-events-none rounded-full"></div>

      {/* Navigation Header */}
      <Header
        currentRole={role}
        setRole={(newRole) => {
          setRole(newRole);
          setCurrentView("home");
        }}
        currentUser={currentUser}
        onOpenAuthModal={() => {
          setAuthError("");
          setAuthSuccess("");
          setIsAuthModalOpen(true);
        }}
        handleLogout={handleLogout}
        stats={quickStats}
      />

      {/* Feature Navigation bar */}
      <div id="sub-navigation-tabs" className="bg-black/85 border-b border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2.5">
            <button
              id="view-home-btn"
              onClick={() => setCurrentView("home")}
              className={`text-[10px] uppercase tracking-[0.2em] font-bold py-2.5 px-5 rounded-xs border transition-all duration-300 ${
                currentView === "home"
                  ? "bg-[#D4AF37] border-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/10"
                  : "bg-transparent border-white/5 text-zinc-400 hover:text-white hover:border-white/10"
              }`}
            >
              Portal do Torcedor (Home)
            </button>

            {role !== "visitor" && (
              <button
                id="view-team-btn"
                onClick={() => setCurrentView("team_dashboard")}
                className={`text-[10px] uppercase tracking-[0.2em] font-bold py-2.5 px-5 rounded-xs border transition-all duration-300 ${
                  currentView === "team_dashboard"
                    ? "bg-[#D4AF37] border-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/10"
                    : "bg-transparent border-white/5 text-zinc-400 hover:text-white"
                }`}
              >
                Painel do meu Time
              </button>
            )}

            {role === "admin" && (
              <button
                id="view-admin-btn"
                onClick={() => setCurrentView("admin_dashboard")}
                className={`text-[10px] uppercase tracking-[0.2em] font-bold py-2.5 px-5 rounded-xs border transition-all duration-300 ${
                  currentView === "admin_dashboard"
                    ? "bg-red-950/40 border-red-500/50 text-red-400 shadow-md shadow-red-500/5"
                    : "bg-transparent border-white/5 text-zinc-400 hover:text-white"
                }`}
              >
                Painel Master Admin
              </button>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2 text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
            <Clock size={12} className="text-[#D4AF37]" />
            <span>RODADAS ATIVAS EM TEMPO REAL</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div id="loader-stage" className="flex flex-col items-center justify-center py-48 space-y-5">
          <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-500 text-[9px] font-mono uppercase tracking-[0.25em]">Sincronizando Banco de Dados FPC...</p>
        </div>
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentView === "home" && (
            <LandingPage
              tournaments={tournaments}
              matches={matches}
              standings={standingsMap}
              news={news}
              transfers={transfers}
              messages={messages}
              protests={protests}
              clubs={clubs}
              players={players}
              currentRole={role}
              managerClub={myClubRef}
              onPostMessage={handlePostMessage}
              onPostProtest={handlePostProtest}
              onInitiateTransfer={handleInitiateTransfer}
            />
          )}

          {currentView === "team_dashboard" && (
            <TeamDashboard
              myClub={myClubRef}
              clubs={clubs}
              players={players}
              onRegisterClub={handleRegisterClub}
              onUpdateClub={handleUpdateClub}
              onAddPlayer={handleAddPlayer}
              onUpdatePlayer={handleUpdatePlayer}
              onRemovePlayer={handleRemovePlayer}
              authUserId={currentUser?.uid || "mock-authorized-token"}
            />
          )}

          {currentView === "admin_dashboard" && (
            <MasterAdminDashboard
              tournaments={tournaments}
              matches={matches}
              clubs={clubs}
              players={players}
              news={news}
              onAddTournament={handleAddTournament}
              onAddMatch={handleAddMatch}
              onUpdateMatch={handleUpdateMatch}
              onDeleteMatch={handleDeleteMatch}
              onAddNews={handleAddNews}
              onDeleteTournament={handleDeleteTournament}
              onRecalculateStandings={handleRecalculateStandings}
              onDeleteClub={handleDeleteClub}
              onUpdateClub={handleUpdateClub}
              onRemovePlayer={handleRemovePlayer}
              onUpdatePlayer={handleUpdatePlayer}
            />
          )}
        </main>
      )}

      {/* Core Footer section with rules, terms, policies */}
      <footer id="main-footer" className="bg-[#0A0A0A] border-t border-gray-800 text-xs py-8 text-center text-gray-500">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex justify-center items-center gap-6 text-gray-400">
            <a href="#regulamento" className="hover:text-amber-500 transition">Regulamento FPC</a>
            <span>•</span>
            <a href="#politica" className="hover:text-amber-500 transition">Políticas de Privacidade</a>
            <span>•</span>
            <a href="#termos" className="hover:text-amber-500 transition">Diretrizes da Comunidade</a>
          </div>
          <p className="max-w-md mx-auto text-gray-500 text-[11px] leading-relaxed">
            A FEDERAÇÃO PRO CLUBS (FPC) é uma liga independente e não possui filiação comercial direta à EA Sports ou FIFA™️. Desenvolvido com amor à comunidade de futebol competitivo.
          </p>
          <p className="text-[10px] text-gray-600 font-mono uppercase tracking-tight">
            © 2026 Federação Pro Clubs - Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Custom Authentication Modal Overlay */}
      {isAuthModalOpen && (
        <div id="auth-modal" className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0A0A0A] border border-[#D4AF37]/40 shadow-[0_0_50px_rgba(212,175,55,0.15)] overflow-hidden relative p-6 sm:p-8 flex flex-col space-y-6">
            
            {/* Logo image centered */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-20 h-20 border border-[#D4AF37]/30 rounded-xs bg-zinc-950 flex items-center justify-center overflow-hidden p-1 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                <img 
                  src="https://i.ibb.co/xqJFZnyX/Chat-GPT-Image-5-de-jun-de-2026-16-06-46.png" 
                  alt="FPC Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h3 className="text-base font-display font-light text-white tracking-[0.15em] uppercase">
                  ÁREA DO <span className="font-extrabold text-[#D4AF37]">COMPETIDOR</span>
                </h3>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-0.5">
                  Federação Pro Clubs • EA FC 26
                </p>
              </div>
            </div>

            {/* Selector Tabs (Sign In / Sign Up) */}
            <div className="flex border-b border-white/5">
              <button
                type="button"
                onClick={() => { setAuthMode("signin"); setAuthError(""); setAuthSuccess(""); }}
                className={`flex-1 pb-3 text-center text-xs font-mono tracking-wider transition ${
                  authMode === "signin"
                    ? "text-[#D4AF37] border-b-2 border-[#D4AF37] font-bold"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                ENTRAR
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode("signup"); setAuthError(""); setAuthSuccess(""); }}
                className={`flex-1 pb-3 text-center text-xs font-mono tracking-wider transition ${
                  authMode === "signup"
                    ? "text-[#D4AF37] border-b-2 border-[#D4AF37] font-bold"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                CADASTRAR-SE
              </button>
            </div>

            {/* Error & Success Messages */}
            {authError && (
              <div className="bg-red-950/30 border border-red-500/40 p-3 text-red-400 text-xs text-left rounded-none font-sans flex items-start gap-2">
                <span className="text-red-400 font-bold shrink-0">⚠️</span>
                <span className="text-[11px] leading-snug">{authError}</span>
              </div>
            )}
            {authSuccess && (
              <div className="bg-emerald-950/30 border border-emerald-500/40 p-3 text-emerald-400 text-xs text-left rounded-none font-sans flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span className="text-[11px] leading-snug">{authSuccess}</span>
              </div>
            )}

            {/* Form */}
            {authMode === "signin" ? (
              <form onSubmit={handleEmailSignIn} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[9px] text-zinc-400 font-mono tracking-widest uppercase mb-1.5">EMAIL PROFISSIONAL:</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-none p-3 text-white focus:outline-none focus:border-[#D4AF37]/60 text-xs"
                    placeholder="email@competidor.com"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-zinc-400 font-mono tracking-widest uppercase mb-1.5">SENHA DA CONTA:</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-none p-3 text-white focus:outline-none focus:border-[#D4AF37]/60 text-xs"
                    placeholder="Sua senha secreta"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAuthSubmitting}
                  className="w-full bg-gradient-to-r from-[#B8972C] to-[#D4AF37] hover:brightness-110 text-black py-3 rounded-none font-bold text-xs uppercase tracking-[0.15em] shadow-lg shadow-[#D4AF37]/10 disabled:opacity-50 transition"
                >
                  {isAuthSubmitting ? "Autenticando..." : "ENTRAR NO SISTEMA"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleEmailSignUp} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[9px] text-zinc-400 font-mono tracking-widest uppercase mb-1.5">SEU NOME / NICKNAME:</label>
                  <input
                    type="text"
                    required
                    value={authDisplayName}
                    onChange={(e) => setAuthDisplayName(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-none p-3 text-white focus:outline-none focus:border-[#D4AF37]/60 text-xs"
                    placeholder="Ex: Lucas_Mito ou Jéssica FPC"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-zinc-400 font-mono tracking-widest uppercase mb-1.5">EMAIL DO GESTOR:</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-none p-3 text-white focus:outline-none focus:border-[#D4AF37]/60 text-xs"
                    placeholder="clube@competidor.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-zinc-400 font-mono tracking-widest uppercase mb-1.5">SENHA:</label>
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-none p-3 text-white focus:outline-none focus:border-[#D4AF37]/60 text-xs"
                      placeholder="Mínimo 6 dig"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-zinc-400 font-mono tracking-widest uppercase mb-1.5">CONFIRMAR:</label>
                    <input
                      type="password"
                      required
                      value={authConfirmPassword}
                      onChange={(e) => setAuthConfirmPassword(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-none p-3 text-white focus:outline-none focus:border-[#D4AF37]/60 text-xs"
                      placeholder="Mínimo 6 dig"
                    />
                  </div>
                </div>

                <div className="p-3 bg-white/[0.02] border border-white/5 text-[9px] text-zinc-500 font-mono uppercase tracking-wide leading-relaxed">
                  📢 Observação: O cadastro como usuário confere acesso completo ao Painel do Time onde o Gestor poderá gerenciar seu clube e elenco livremente.
                </div>

                <button
                  type="submit"
                  disabled={isAuthSubmitting}
                  className="w-full bg-gradient-to-r from-[#B8972C] to-[#D4AF37] hover:brightness-110 text-black py-3 rounded-none font-bold text-xs uppercase tracking-[0.15em] shadow-lg shadow-[#D4AF37]/10 disabled:opacity-50 transition"
                >
                  {isAuthSubmitting ? "Cadastrando..." : "CRIAR CONTA COMPETIDOR"}
                </button>
              </form>
            )}

            {/* Quick test alternative & Close button */}
            <div className="pt-2 flex flex-col space-y-2 border-t border-white/5">
              <div className="flex justify-between items-center text-[9px] text-zinc-500 font-mono uppercase">
                <span>Contatos e Suporte por E-mail</span>
                <span className="text-[#D4AF37] font-semibold">suporte@fpc.com.br</span>
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex-1 bg-[#111] hover:bg-[#1C1C1C] border border-white/10 text-white font-bold text-[9px] uppercase tracking-wider py-2 px-3 rounded-none transition flex items-center justify-center gap-1.5"
                >
                  🌐 VIA GOOGLE
                </button>
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(false)}
                  className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white font-mono text-[9px] uppercase tracking-wider py-2 px-3 rounded-none transition"
                >
                  ❌ FECHAR
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
