export const THEME = {
  primary: "#89CFF0", // azul pastel
  // puedes leer esto en tu CSS con style setProperty('--primary', THEME.primaryHex)
};

export const CRESTS = [
  { id: "crest1", name: "Escudo 1", src: "assets/crest1.png" },
  { id: "crest2", name: "Escudo 2", src: "assets/crest2.png" },
  { id: "crest3", name: "Escudo 3", src: "assets/crest3.png" },
  { id: "crest4", name: "Escudo 4", src: "assets/crest4.png" },
  { id: "crest5", name: "Escudo 5", src: "assets/crest5.png" },
];

export const RIVALS = [
  "Minabo de Kiev",
  "Vodka Junior",
  "Bayern de los Caídos",
  "Aston Birra",
  "Yayo Vallecano",
  "Borrachos FC",
  "Los Cojos",
];

// ====== POOL DE JUGADORES (30) ======
// Nota: tier (1-3) ≈ calidad/precio; credits 1-4; blurb y quirks son libres.
// Cambia lo que quieras: names, stats, etc. El motor usa "stats" y "role".
export const playersPool = [
  {
    id: "gk1",
    role: "GK",
    tier: 2,
    credits: 3,
    name: "Paco de la Nebulosa Botellines",
    blurb:
      "No te garantiza que se presente sobrio a los partídos, el rey de la fiesta del pueblo",
    quirks: ["resacoso"],
    stats: {
      technique: 3,
      speed: 2,
      strength: 3,
      intoxicated: 6,
      charisma: 4,
      reflexes: 6,
    },
    age: 57,
    sou: 7,
    destiny: 35,
    allergy: "polen",
    legs_number: 2,
    arms_number: 2,
  },
  {
    id: "gk2",
    role: "GK",
    tier: 1,
    credits: 2,
    name: "Rafa de la Nebulosa El manos",
    blurb:
      "Perdio una mano en una rellerta con el Jonathan, tiene buenas intenciones",
    quirks: ["puños"],
    stats: {
      technique: 2,
      speed: 3,
      strength: 4,
      intoxicated: 3,
      charisma: 3,
      reflexes: 5,
    },
    age: 43,
    soul: 3,
    destiny: 77,
    allergy: "ácaros",
    legs_number: 2,
    arms_number: 1,
  },
  {
    id: "gk3",
    role: "GK",
    tier: 3,
    credits: 4,
    name: "Tino de la Nebulosa Gato",
    blurb:
      "Una vez jugó en tercera división, es verdad que el equipo no era consciente",
    quirks: ["felino"],
    stats: {
      technique: 4,
      speed: 4,
      strength: 4,
      intoxicated: 2,
      charisma: 5,
      reflexes: 8,
    },
    age: 22,
    soul: 8,
    destiny: 4,
    allergy: "sol",
    legs_number: 2,
    arms_number: 2,
  },
  {
    id: "gk4",
    role: "GK",
    tier: 2,
    credits: 3,
    name: "Suso de la Nebulosa Termo",
    blurb:
      "Está con la condicional, los días que no tenga que ir a comisaria estará disponible",
    quirks: ["rachas"],
    stats: {
      technique: 3,
      speed: 3,
      strength: 4,
      intoxicated: 4,
      charisma: 4,
      reflexes: 6,
    },
    age: 66,
    soul: 5,
    destiny: 91,
    allergy: "lactosa",
    legs_number: 3,
    arms_number: 2,
  },
  {
    id: "def1",
    role: "DEF",
    tier: 2,
    credits: 2,
    name: "Manolo de la Nebulosa El carnicero",
    blurb: "O pasa el balón o pasa la pierna pero nunca los dos",
    quirks: ["condicional"],
    stats: {
      technique: 2,
      speed: 4,
      strength: 7,
      intoxicated: 3,
      charisma: 2,
    },
    age: 48,
    soul: 6,
    destiny: 29,
    allergy: "frutos secos",
    legs_number: 2,
    arms_number: 2,
  },
  {
    id: "def2",
    role: "DEF",
    tier: 1,
    credits: 1,
    name: "Paco de la Nebulosa El capitán",
    blurb:
      "Más años que Matusalem, experiencia garantizada, a medio camino entre este mundo y el otro.",
    quirks: ["silencioso"],
    stats: {
      technique: 3,
      speed: 3,
      strength: 6,
      intoxicated: 2,
      charisma: 1,
    },
    age: 61,
    soul: 2,
    destiny: 23,
    allergy: "polen",
    legs_number: 2,
    arms_number: 2,
  },
  {
    id: "def3",
    role: "DEF",
    tier: 2,
    credits: 2,
    name: "Panza de la Nebulosa",
    blurb: "164 kilos de pura defensa",
    quirks: ["barrendero"],
    stats: {
      technique: 3,
      speed: 3,
      strength: 6,
      intoxicated: 3,
      charisma: 3,
    },
    age: 36,
    soul: 7,
    destiny: 59,
    allergy: "ácaros",
    legs_number: 2,
    arms_number: 2,
  },
  {
    id: "def4",
    role: "DEF",
    tier: 3,
    credits: 4,
    name: "Rulo de la Nebulosa Seis dedos",
    blurb: "Te roba el balón y si te descuidas también la cartera",
    quirks: ["muralla"],
    stats: {
      technique: 4,
      speed: 5,
      strength: 8,
      intoxicated: 2,
      charisma: 3,
    },
    age: 28,
    soul: 8,
    destiny: 82,
    allergy: "lactosa",
    legs_number: 2,
    arms_number: 2,
  },
  {
    id: "def5",
    role: "DEF",
    tier: 2,
    credits: 2,
    name: "Largo de la Nebulosa",
    blurb: "Los pases cortos son para los perdedores",
    quirks: ["pata_larga"],
    stats: {
      technique: 3,
      speed: 5,
      strength: 7,
      intoxicated: 2,
      charisma: 3,
    },
    age: 37,
    soul: 4,
    destiny: 8,
    allergy: "sol",
    legs_number: 2,
    arms_number: 2,
  },
  {
    id: "def6",
    role: "DEF",
    tier: 1,
    credits: 1,
    name: "Tibur de la Nebulosa",
    blurb: "Ha venido por socializar con la gente",
    quirks: ["impetuoso"],
    stats: {
      technique: 3,
      speed: 4,
      strength: 5,
      intoxicated: 2,
      charisma: 3,
    },
    age: 19,
    soul: 9,
    destiny: 52,
    allergy: "frutos secos",
    legs_number: 2,
    arms_number: 2,
  },
  {
    id: "def7",
    role: "DEF",
    tier: 2,
    credits: 3,
    name: "Chato de la Nebulosa",
    blurb: "Cabecea todo lo que vuela, aunque sea un balón raso",
    quirks: ["cabezazo"],
    stats: {
      technique: 3,
      speed: 4,
      strength: 7,
      intoxicated: 3,
      charisma: 2,
    },
    age: 34,
    soul: 5,
    destiny: 15,
    allergy: "polen",
    legs_number: 2,
    arms_number: 2,
  },
  {
    id: "def8",
    role: "DEF",
    tier: 3,
    credits: 4,
    name: "Rafa de la Nebulosa Stopper",
    blurb: "Dueño de la tienda de la esquina y de la defensa del equipo",
    quirks: ["lector"],
    stats: {
      technique: 5,
      speed: 6,
      strength: 7,
      intoxicated: 2,
      charisma: 4,
    },
    age: 49,
    soul: 2,
    destiny: 90,
    allergy: "ácaros",
    legs_number: 2,
    arms_number: 3,
  },
  {
    id: "mid1",
    role: "MID",
    tier: 2,
    credits: 2,
    name: "Tato de la Nebulosa",
    blurb: "Distribuye sin mirar (a veces mal).",
    quirks: ["no_look"],
    stats: {
      technique: 6,
      speed: 5,
      strength: 4,
      intoxicated: 2,
      charisma: 5,
    },
    age: 23,
    soul: 6,
    destiny: 31,
    allergy: "sol",
    legs_number: 2,
    arms_number: 2,
  },
  {
    id: "mid2",
    role: "MID",
    tier: 3,
    credits: 4,
    name: "Jesé de la Nebulosa de Barrio",
    blurb:
      "le llamán jesé pero no por el fútbol, tiene 5 hijos con 5 mujeres diferentes",
    quirks: ["tacon"],
    stats: {
      technique: 8,
      speed: 4,
      strength: 3,
      intoxicated: 3,
      charisma: 6,
    },
    age: 32,
    soul: 4,
    destiny: 66,
    allergy: "lactosa",
    legs_number: 2,
    arms_number: 2,
  },
  {
    id: "mid3",
    role: "MID",
    tier: 2,
    credits: 2,
    name: "Nano de la Nebulosa",
    blurb: "metro cuarenta de puro odio",
    quirks: ["mosca"],
    stats: {
      technique: 5,
      speed: 5,
      strength: 4,
      intoxicated: 1,
      charisma: 5,
    },
    age: 25,
    soul: 9,
    destiny: 12,
    allergy: "frutos secos",
    legs_number: 2,
    arms_number: 2,
  },
  {
    id: "mid4",
    role: "MID",
    tier: 1,
    credits: 1,
    name: "El tuerto de la Nebulosa",
    blurb: "Lo que le falta de visión lo compensa con corazón ",
    quirks: ["pausado"],
    stats: {
      technique: 4,
      speed: 3,
      strength: 4,
      intoxicated: 3,
      charisma: 4,
    },
    age: 55,
    soul: 3,
    destiny: 47,
    allergy: "polen",
    legs_number: 2,
    arms_number: 2,
  },
  {
    id: "mid5",
    role: "MID",
    tier: 2,
    credits: 3,
    name: "Chispas de la Nebulosa",
    blurb:
      "Creatividad en el centro del campo y también para hacer un puente al coche",
    quirks: ["chisposo"],
    stats: {
      technique: 6,
      speed: 6,
      strength: 4,
      intoxicated: 2,
      charisma: 4,
    },
    age: 21,
    soul: 5,
    destiny: 78,
    allergy: "sol",
    legs_number: 2,
    arms_number: 2,
  },
  {
    id: "mid6",
    role: "MID",
    tier: 2,
    credits: 2,
    name: "Tiki de la Nebulosa",
    blurb: "Paredes y paredes y paredes.",
    quirks: ["tiki"],
    stats: {
      technique: 6,
      speed: 4,
      strength: 3,
      intoxicated: 2,
      charisma: 5,
    },
    age: 30,
    soul: 4,
    destiny: 24,
    allergy: "ácaros",
    legs_number: 2,
    arms_number: 2,
  },
  {
    id: "mid7",
    role: "MID",
    tier: 2,
    credits: 2,
    name: "Taka de la Nebulosa",
    blurb: "Recibe, gira, la lía poco.",
    quirks: ["asegurador"],
    stats: {
      technique: 5,
      speed: 5,
      strength: 3,
      intoxicated: 3,
      charisma: 5,
    },
    age: 26,
    soul: 3,
    destiny: 68,
    allergy: "lactosa",
    legs_number: 2,
    arms_number: 2,
  },
  {
    id: "mid8",
    role: "MID",
    tier: 3,
    credits: 4,
    name: "Pelé de la Nebulosa de Portal",
    blurb: "Más cerca de la calidad del pelé actual que del bueno",
    quirks: ["filigranas"],
    stats: {
      technique: 8,
      speed: 5,
      strength: 3,
      intoxicated: 2,
      charisma: 6,
    },
    age: 29,
    soul: 9,
    destiny: 55,
    allergy: "frutos secos",
    legs_number: 2,
    arms_number: 3,
  },
  {
    id: "mid9",
    role: "MID",
    tier: 1,
    credits: 1,
    name: "Yayo de la Nebulosa",
    blurb: "Esperando que acabe el partido para ir al bar a por unas cervezas",
    quirks: ["zorro"],
    stats: {
      technique: 5,
      speed: 2,
      strength: 3,
      intoxicated: 1,
      charisma: 7,
    },
    age: 63,
    soul: 2,
    destiny: 39,
    allergy: "polen",
    legs_number: 1,
    arms_number: 2,
  },
  {
    id: "mid10",
    role: "MID",
    tier: 2,
    credits: 2,
    name: "Tony de la Nebulosa",
    blurb: "Hijo del capo.... del dueño de la empresa de tratado de residuos",
    quirks: ["teatro"],
    stats: {
      technique: 6,
      speed: 5,
      strength: 3,
      intoxicated: 2,
      charisma: 5,
    },
    age: 35,
    soul: 4,
    destiny: 11,
    allergy: "lactosa",
    legs_number: 2,
    arms_number: 2,
  },
  {
    id: "atk1",
    role: "ATK",
    tier: 3,
    credits: 4,
    name: "el drogas de la Nebulosa",
    blurb: "Gran jugador siempre y cuando no se haga controle",
    quirks: ["sprinter"],
    stats: {
      technique: 6,
      speed: 8,
      strength: 3,
      intoxicated: 4,
      charisma: 6,
    },
    age: 41,
    soul: 8,
    destiny: 29,
    allergy: "sol",
    legs_number: 2,
    arms_number: 2,
  },
  {
    id: "atk2",
    role: "ATK",
    tier: 2,
    credits: 3,
    name: "Pitu de la Nebulosa",
    blurb: "Lo mete todo… cuando va entre palos.",
    quirks: ["rachas"],
    stats: {
      technique: 6,
      speed: 6,
      strength: 3,
      intoxicated: 2,
      charisma: 4,
    },
    age: 52,
    soul: 5,
    destiny: 88,
    allergy: "frutos secos",
    legs_number: 2,
    arms_number: 2,
  },
  {
    id: "atk3",
    role: "ATK",
    tier: 1,
    credits: 2,
    name: "Mono de la Nebulosa",
    blurb: "Se lleva el balón a casa aunque no haga hat trick",
    quirks: ["acrobata"],
    stats: {
      technique: 5,
      speed: 6,
      strength: 3,
      intoxicated: 2,
      charisma: 4,
    },
    age: 31,
    soul: 6,
    destiny: 10,
    allergy: "polen",
    legs_number: 2,
    arms_number: 2,
  },
  {
    id: "atk4",
    role: "ATK",
    tier: 2,
    credits: 3,
    name: "Andres de la Nebulosa Johnson",
    blurb: "es como Andy Johnson, no porque meta goles, por las arritmias",
    quirks: ["cañon"],
    stats: {
      technique: 5,
      speed: 5,
      strength: 4,
      intoxicated: 3,
      charisma: 4,
    },
    age: 44,
    soul: 7,
    destiny: 3,
    allergy: "ácaros",
    legs_number: 2,
    arms_number: 2,
  },
  {
    id: "atk5",
    role: "ATK",
    tier: 2,
    credits: 2,
    name: "Pollo de la Nebulosa",
    blurb: "Lo mismo te mete gol que te vende un gramo",
    quirks: ["temperamental"],
    stats: {
      technique: 5,
      speed: 6,
      strength: 3,
      intoxicated: 2,
      charisma: 4,
    },
    age: 27,
    soul: 5,
    destiny: 72,
    allergy: "lactosa",
    legs_number: 2,
    arms_number: 2,
  },
  {
    id: "atk6",
    role: "ATK",
    tier: 3,
    credits: 4,
    name: "Matute de la Nebulosa",
    blurb: "Huele el gol como las ratas al queso.",
    quirks: ["olfato"],
    stats: {
      technique: 7,
      speed: 7,
      strength: 4,
      intoxicated: 2,
      charisma: 5,
    },
    age: 38,
    soul: 9,
    destiny: 49,
    allergy: "frutos secos",
    legs_number: 2,
    arms_number: 2,
  },
  {
    id: "atk7",
    role: "ATK",
    tier: 1,
    credits: 1,
    name: "Eduardo de la Nebulosa",
    blurb: "Su madre le ha obligado a venir",
    quirks: ["spins"],
    stats: {
      technique: 4,
      speed: 5,
      strength: 3,
      intoxicated: 3,
      charisma: 3,
    },
    age: 59,
    soul: 3,
    destiny: 62,
    allergy: "polen",
    legs_number: 1,
    arms_number: 2,
  },
  {
    id: "atk8",
    role: "ATK",
    tier: 2,
    credits: 3,
    name: "CR69 de la Nebulosa",
    blurb: "Más preocupado de su peinado que del gol",
    quirks: ["churros"],
    stats: {
      technique: 6,
      speed: 5,
      strength: 4,
      intoxicated: 2,
      charisma: 4,
    },
    age: 33,
    soul: 6,
    destiny: 14,
    allergy: "ácaros",
    legs_number: 2,
    arms_number: 2,
  },
];

// ====== UTILIDAD (opcional) ======
// Baraja y devuelve N jugadores por rol, con mezcla de tiers simple
export function sampleForRole(role, n = 4) {
  const pool = playersPool.filter((j) => j.role === role);
  // Mezcla tonta (orden aleatorio)
  const arr = pool.sort(() => Math.random() - 0.5);
  return arr.slice(0, Math.min(n, arr.length));
}
// === LIGA con rivales y potencia básica ===
export function createLeague(userTeamName, rivals) {
  const teams = [userTeamName, ...rivals].map((n) => ({
    name: n,
    pj: 0,
    pg: 0,
    pe: 0,
    pp: 0,
    gf: 0,
    gc: 0,
    pts: 0,
  }));
  // potencia inicial para IA (base 0.85–1.15)
  const power = {};
  teams.forEach((t) => {
    power[t.name] = 0.85 + Math.random() * 0.3;
  });

  return { user: userTeamName, rivals: [...rivals], teams, power, jornada: 1 };
}

// Recalcular power del usuario a partir de su plantilla real
export function setUserPower(league, userPower) {
  league.power[league.user] = userPower;
}

// Orden de clasificación
export function standingsSorted(league) {
  return [...league.teams].sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    const dga = a.gf - a.gc,
      dgb = b.gf - b.gc;
    if (dgb !== dga) return dgb - dga;
    return b.gf - a.gf;
  });
}

export function updateTable(league, home, away, score) {
  const th = league.teams.find((t) => t.name === home);
  const ta = league.teams.find((t) => t.name === away);
  const { home: gh, away: ga } = score;
  th.pj++;
  ta.pj++;
  th.gf += gh;
  th.gc += ga;
  ta.gf += ga;
  ta.gc += gh;
  if (gh > ga) {
    th.pg++;
    ta.pp++;
    th.pts += 3;
  } else if (gh < ga) {
    ta.pg++;
    th.pp++;
    ta.pts += 3;
  } else {
    th.pe++;
    ta.pe++;
    th.pts++;
    ta.pts++;
  }
}

// Crea liga con FIXTURES de 1 vuelta (cada equipo se enfrenta 1 vez)
export function createLeagueWithFixtures(userTeamName, rivals) {
  const teamsNames = [userTeamName, ...rivals];
  if (teamsNames.length % 2 !== 0) {
    throw new Error(
      "Número de equipos impar. Quita o añade uno para que sea par."
    );
  }
  const teams = teamsNames.map((n) => ({
    name: n,
    pj: 0,
    pg: 0,
    pe: 0,
    pp: 0,
    gf: 0,
    gc: 0,
    pts: 0,
  }));

  // potencia base IA
  const power = {};
  teamsNames.forEach((n) => (power[n] = 0.85 + Math.random() * 0.3));

  const fixtures = generateRoundRobinOnce(teamsNames); // array de jornadas [{home, away}...]

  return {
    user: userTeamName,
    teams,
    power,
    fixtures, // lista plana de partidos (1 vuelta)
    jornada: 1,
    totalJornadas: fixtures.length / (teamsNames.length / 2),
  };
}

// Genera round-robin 1 vuelta (método del círculo, sin ida/vuelta)
export function generateRoundRobinOnce(teamNames) {
  const n = teamNames.length;
  const half = n / 2;
  let arr = [...teamNames];
  const rounds = n - 1;
  const fixtures = [];

  for (let r = 0; r < rounds; r++) {
    for (let i = 0; i < half; i++) {
      const t1 = arr[i];
      const t2 = arr[n - 1 - i];
      // Alterna localía para que el user no sea siempre local
      const home = r % 2 === 0 ? t1 : t2;
      const away = r % 2 === 0 ? t2 : t1;
      fixtures.push({ round: r + 1, home, away });
    }
    // rotación (mantén arr[0] fijo)
    const fixed = arr[0];
    const rest = arr.slice(1);
    rest.unshift(rest.pop());
    arr = [fixed, ...rest];
  }
  return fixtures;
}

// Devuelve los partidos de una jornada concreta a partir de fixtures
export function getRoundMatchesByFixtures(league) {
  const { jornada, fixtures } = league;
  return fixtures.filter((f) => f.round === jornada);
}

function outcomeFromPower(ph, pa) {
  const k = 2.2; // sensibilidad
  const pHomeWin = 1 / (1 + Math.pow(10, -k * (ph - pa)));
  let pDraw = 0.22 * (1 - Math.min(0.5, Math.abs(ph - pa)));
  pDraw = Math.max(0.12, Math.min(0.28, pDraw));
  const pAwayWin = 1 - pHomeWin - pDraw;
  const r = Math.random();
  if (r < pHomeWin) return "H";
  if (r < pHomeWin + pDraw) return "D";
  return "A";
}

function goalsFromOutcome(outcome, ph, pa) {
  const baseH = (1.25 * ph) / (0.9 + 0.2 * pa);
  const baseA = (1.05 * pa) / (0.95 + 0.2 * ph);
  function sample(mu) {
    const t = [
      { g: 0, p: Math.max(0.1, 0.55 - mu * 0.25) },
      { g: 1, p: Math.min(0.5, 0.3 + mu * 0.2) },
      { g: 2, p: Math.min(0.3, 0.12 + mu * 0.15) },
      { g: 3, p: Math.min(0.15, 0.06 + mu * 0.08) },
      { g: 4, p: 1.0 },
    ];
    let r = Math.random(),
      acc = 0;
    for (const it of t) {
      acc += it.p;
      if (r <= acc) return it.g;
    }
    return 0;
  }
  let gh = sample(baseH),
    ga = sample(baseA);
  if (outcome === "H" && gh <= ga) gh = Math.max(ga + 1, gh + 1);
  if (outcome === "A" && ga <= gh) ga = Math.max(gh + 1, ga + 1);
  if (outcome === "D") {
    const m = Math.max(0, Math.min(3, Math.round((gh + ga) / 2)));
    gh = ga = m;
  }
  return { home: gh, away: ga };
}

export function simulateAIRound(league, matches) {
  matches.forEach((m) => {
    if (m.home === league.user || m.away === league.user) return; // tu partido lo simula el motor real
    const ph = league.power[m.home] ?? 1.0;
    const pa = league.power[m.away] ?? 1.0;
    const outcome = outcomeFromPower(ph, pa);
    const score = goalsFromOutcome(outcome, ph, pa);
    updateTable(league, m.home, m.away, score);
  });
}
