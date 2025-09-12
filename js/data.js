export const THEME = {
  primaryHex: "#89CFF0", // azul pastel
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
// Nota: tier (1-3) ≈ calidad/precio; salario 1-4; blurb y quirks son libres.
// Cambia lo que quieras: nombres, stats, etc. El motor usa "stats" y "rol".
export const jugadoresPool = [
  // ---- PORTEROS (GK) x4 ----
  { id:"gk1", rol:"GK", tier:2, salario:3, nombre:"Paco 'Botellines'", blurb:"No te garantiza que se presente sobrio a los partídos, el rey de la fiesta del pueblo", quirks:["resacoso"], stats:{ tecnica:3, velocidad:2, fuerza:3, resaca:6, carisma:4, reflejos:6 } },
  { id:"gk2", rol:"GK", tier:1, salario:2, nombre:"Rafa 'El manos'", blurb:"Perdio una mano en una rellerta con el Jonathan, tiene buenas intenciones", quirks:["puños"], stats:{ tecnica:2, velocidad:3, fuerza:4, resaca:3, carisma:3, reflejos:5 } },
  { id:"gk3", rol:"GK", tier:3, salario:4, nombre:"Tino 'Gato'", blurb:"Una vez jugó en tercera división, es verdad que el equipo no era consciente", quirks:["felino"], stats:{ tecnica:4, velocidad:4, fuerza:4, resaca:2, carisma:5, reflejos:8 } },
  { id:"gk4", rol:"GK", tier:2, salario:3, nombre:"Suso 'Termo'", blurb:"Está con la condicional, los días que no tenga que ir a comisaria estará disponible", quirks:["rachas"], stats:{ tecnica:3, velocidad:3, fuerza:4, resaca:4, carisma:4, reflejos:6 } },

  // ---- DEFENSAS (DEF) x8 ----
  { id:"def1", rol:"DEF", tier:2, salario:2, nombre:"Manolo 'El carnicero'", blurb:"O pasa el balón o pasa la pierna pero nunca los dos", quirks:["condicional"], stats:{ tecnica:2, velocidad:4, fuerza:7, resaca:3, carisma:2 } },
  { id:"def2", rol:"DEF", tier:1, salario:1, nombre:"Paco 'El capitán'", blurb:"Más años que Matusalem, experiencia garantizada, a medio camino entre este mundo y el otro.", quirks:["silencioso"], stats:{ tecnica:3, velocidad:3, fuerza:6, resaca:2, carisma:1 } },
  { id:"def3", rol:"DEF", tier:2, salario:2, nombre:"Panza", blurb:"164 kilos de pura defensa", quirks:["barrendero"], stats:{ tecnica:3, velocidad:3, fuerza:6, resaca:3, carisma:3 } },
  { id:"def4", rol:"DEF", tier:3, salario:4, nombre:"Rulo 'Seis dedos'", blurb:"Te roba el balón y si te descuidas también la cartera", quirks:["muralla"], stats:{ tecnica:4, velocidad:5, fuerza:8, resaca:2, carisma:3 } },
  { id:"def5", rol:"DEF", tier:2, salario:2, nombre:"Largo", blurb:"Los pases cortos son para los perdedores", quirks:["pata_larga"], stats:{ tecnica:3, velocidad:5, fuerza:7, resaca:2, carisma:3 } },
  { id:"def6", rol:"DEF", tier:1, salario:1, nombre:"Tibur", blurb:"Ha venido por socializar con la gente", quirks:["impetuoso"], stats:{ tecnica:3, velocidad:4, fuerza:5, resaca:2, carisma:3 } },
  { id:"def7", rol:"DEF", tier:2, salario:3, nombre:"Chato", blurb:"Cabecea todo lo que vuela, aunque sea un balón raso", quirks:["cabezazo"], stats:{ tecnica:3, velocidad:4, fuerza:7, resaca:3, carisma:2 } },
  { id:"def8", rol:"DEF", tier:3, salario:4, nombre:"Rafa 'Stopper'", blurb:"Dueño de la tienda de la esquina y de la defensa del equipo", quirks:["lector"], stats:{ tecnica:5, velocidad:6, fuerza:7, resaca:2, carisma:4 } },

  // ---- MEDIOS (MID) x10 ----
  { id:"mid1", rol:"MID", tier:2, salario:2, nombre:"Tato", blurb:"Distribuye sin mirar (a veces mal).", quirks:["no_look"], stats:{ tecnica:6, velocidad:5, fuerza:4, resaca:2, carisma:5 } },
  { id:"mid2", rol:"MID", tier:3, salario:4, nombre:"Jesé de Barrio", blurb:"le llamán jesé pero no por el fútbol, tiene 5 hijos con 5 mujeres diferentes", quirks:["tacon"], stats:{ tecnica:8, velocidad:4, fuerza:3, resaca:3, carisma:6 } },
  { id:"mid3", rol:"MID", tier:2, salario:2, nombre:"Nano", blurb:"metro cuarenta de puro odio", quirks:["mosca"], stats:{ tecnica:5, velocidad:5, fuerza:4, resaca:1, carisma:5 } },
  { id:"mid4", rol:"MID", tier:1, salario:1, nombre:"El tuerto", blurb:"Lo que le falta de visión lo compensa con corazón ", quirks:["pausado"], stats:{ tecnica:4, velocidad:3, fuerza:4, resaca:3, carisma:4 } },
  { id:"mid5", rol:"MID", tier:2, salario:3, nombre:"Chispas", blurb:"Creatividad en el centro del campo y también para hacer un puente al coche", quirks:["chisposo"], stats:{ tecnica:6, velocidad:6, fuerza:4, resaca:2, carisma:4 } },
  { id:"mid6", rol:"MID", tier:2, salario:2, nombre:"Tiki", blurb:"Paredes y paredes y paredes.", quirks:["tiki"], stats:{ tecnica:6, velocidad:4, fuerza:3, resaca:2, carisma:5 } },
  { id:"mid7", rol:"MID", tier:2, salario:2, nombre:"Taka", blurb:"Recibe, gira, la lía poco.", quirks:["asegurador"], stats:{ tecnica:5, velocidad:5, fuerza:3, resaca:3, carisma:5 } },
  { id:"mid8", rol:"MID", tier:3, salario:4, nombre:"Pelé de Portal", blurb:"Más cerca de la calidad del pelé actual que del bueno", quirks:["filigranas"], stats:{ tecnica:8, velocidad:5, fuerza:3, resaca:2, carisma:6 } },
  { id:"mid9", rol:"MID", tier:1, salario:1, nombre:"Yayo", blurb:"Esperando que acabe el partido para ir al bar a por unas cervezas", quirks:["zorro"], stats:{ tecnica:5, velocidad:2, fuerza:3, resaca:1, carisma:7 } },
  { id:"mid10", rol:"MID", tier:2, salario:2, nombre:"Tony", blurb:"Hijo del capo.... del dueño de la empresa de tratado de residuos", quirks:["teatro"], stats:{ tecnica:6, velocidad:5, fuerza:3, resaca:2, carisma:5 } },

  // ---- DELANTEROS (ATK) x8 ----
  { id:"atk1", rol:"ATK", tier:3, salario:4, nombre:"el drogas'", blurb:"Gran jugador siempre y cuando no se haga control", quirks:["sprinter"], stats:{ tecnica:6, velocidad:8, fuerza:3, resaca:4, carisma:6 } },
  { id:"atk2", rol:"ATK", tier:2, salario:3, nombre:"Pitu", blurb:"Lo mete todo… cuando va entre palos.", quirks:["rachas"], stats:{ tecnica:6, velocidad:6, fuerza:3, resaca:2, carisma:4 } },
  { id:"atk3", rol:"ATK", tier:1, salario:2, nombre:"Mono", blurb:"Se lleva el balón a casa aunque no haga hat trick", quirks:["acrobata"], stats:{ tecnica:5, velocidad:6, fuerza:3, resaca:2, carisma:4 } },
  { id:"atk4", rol:"ATK", tier:2, salario:3, nombre:"Andres Johnson", blurb:"es como Andy Johnson, no porque meta goles, por las arritmias", quirks:["cañon"], stats:{ tecnica:5, velocidad:5, fuerza:4, resaca:3, carisma:4 } },
  { id:"atk5", rol:"ATK", tier:2, salario:2, nombre:"Pollo", blurb:"Lo mismo te mete gol que te vende un gramo", quirks:["temperamental"], stats:{ tecnica:5, velocidad:6, fuerza:3, resaca:2, carisma:4 } },
  { id:"atk6", rol:"ATK", tier:3, salario:4, nombre:"Matute", blurb:"Huele el gol como las ratas al queso.", quirks:["olfato"], stats:{ tecnica:7, velocidad:7, fuerza:4, resaca:2, carisma:5 } },
  { id:"atk7", rol:"ATK", tier:1, salario:1, nombre:"Eduardo", blurb:"Su madre le ha obligado a venir", quirks:["spins"], stats:{ tecnica:4, velocidad:5, fuerza:3, resaca:3, carisma:3 } },
  { id:"atk8", rol:"ATK", tier:2, salario:3, nombre:"CR69", blurb:"Más preocupado de su peinado que del gol", quirks:["churros"], stats:{ tecnica:6, velocidad:5, fuerza:4, resaca:2, carisma:4 } },
];

// ====== UTILIDAD (opcional) ======
// Baraja y devuelve N jugadores por rol, con mezcla de tiers simple
export function sampleForRole(role, n = 4) {
  const pool = jugadoresPool.filter(j => j.rol === role);
  // Mezcla tonta (orden aleatorio)
  const arr = pool.sort(() => Math.random() - 0.5);
  return arr.slice(0, Math.min(n, arr.length));
}
// === LIGA con rivales y potencia básica ===
export function createLeague(userTeamName, rivals) {
  const teams = [userTeamName, ...rivals].map(n => ({
    name: n, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0
  }));
  // potencia inicial para IA (base 0.85–1.15)
  const power = {};
  teams.forEach(t => { power[t.name] = 0.85 + Math.random() * 0.30; });

  return { user: userTeamName, rivals: [...rivals], teams, power, jornada: 1 };
}

// Recalcular power del usuario a partir de su plantilla real
export function setUserPower(league, userPower){
  league.power[league.user] = userPower;
}

// Orden de clasificación
export function standingsSorted(league){
  return [...league.teams].sort((a,b)=>{
    if (b.pts !== a.pts) return b.pts - a.pts;
    const dga = a.gf - a.gc, dgb = b.gf - b.gc;
    if (dgb !== dga) return dgb - dga;
    return b.gf - a.gf;
  });
}

export function updateTable(league, home, away, score) {
  const th = league.teams.find(t => t.name === home);
  const ta = league.teams.find(t => t.name === away);
  const { home: gh, away: ga } = score;
  th.pj++; ta.pj++;
  th.gf += gh; th.gc += ga; ta.gf += ga; ta.gc += gh;
  if (gh > ga) { th.pg++; ta.pp++; th.pts += 3; }
  else if (gh < ga) { ta.pg++; th.pp++; ta.pts += 3; }
  else { th.pe++; ta.pe++; th.pts++; ta.pts++; }
}

// === Emparejamientos jornada (usuario vs rival[j-1], resto se cruzan) ===
export function getRoundMatches(league){
  const { user, rivals, jornada } = league;
  const idx = jornada - 1;
  const matches = [];
  const rival = rivals[idx % rivals.length];
  matches.push({ home: user, away: rival });

  const pool = rivals.filter(r => r !== rival);
  // shuffle determinista por jornada
  let seed = 1234 + jornada * 777;
  function rand(){ seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2**32; }
  for(let i=pool.length-1;i>0;i--){
    const j = Math.floor(rand()*(i+1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  for(let i=0;i<pool.length;i+=2){
    if(pool[i+1]) matches.push({ home: pool[i], away: pool[i+1] });
  }
  return matches;
}

// === Simulación IA con power (logit simple + goles razonables) ===
function outcomeFromPower(ph, pa){
  const k = 2.2;                         // sensibilidad (sube/baja para más/menos favoritismo)
  const pHomeWin = 1/(1 + Math.pow(10, -k*(ph - pa))); // 0..1
  // Partimos de un 22% de empate y lo ajustamos levemente por equilibrio
  let pDraw = 0.22 * (1 - Math.min(0.5, Math.abs(ph - pa))); // más empate si están igualados
  pDraw = Math.max(0.12, Math.min(0.28, pDraw));
  const pAwayWin = 1 - pHomeWin - pDraw;

  const r = Math.random();
  if (r < pHomeWin) return "H";
  if (r < pHomeWin + pDraw) return "D";
  return "A";
}

function goalsFromOutcome(outcome, ph, pa){
  // Medias base con sesgo local y poder
  const baseH = 1.25 * ph / (0.9 + 0.2*pa);
  const baseA = 1.05 * pa / (0.95 + 0.2*ph);

  function sample(mu){
    // discretización simple tipo Poisson-like
    const t = [
      {g:0,p: Math.max(0.10, 0.55 - mu*0.25)},
      {g:1,p: Math.min(0.50, 0.30 + mu*0.20)},
      {g:2,p: Math.min(0.30, 0.12 + mu*0.15)},
      {g:3,p: Math.min(0.15, 0.06 + mu*0.08)},
      {g:4,p: 1.00},
    ];
    let r = Math.random(), acc = 0;
    for(const it of t){ acc += it.p; if(r <= acc) return it.g; }
    return 0;
  }

  let gh = sample(baseH), ga = sample(baseA);

  // Corrige para respetar el outcome deseado
  if (outcome === "H" && gh <= ga) gh = Math.max(ga+1, gh+1);
  if (outcome === "A" && ga <= gh) ga = Math.max(gh+1, ga+1);
  if (outcome === "D") { const m = Math.max(0, Math.min(3, Math.round((gh+ga)/2))); gh = ga = m; }

  return { home: gh, away: ga };
}

export function simulateAIRound(league, matches){
  matches.forEach(m => {
    if(m.home === league.user || m.away === league.user) return; // el del user lo maneja UI
    const ph = league.power[m.home] ?? 1.0;
    const pa = league.power[m.away] ?? 1.0;

    const outcome = outcomeFromPower(ph, pa);
    const score = goalsFromOutcome(outcome, ph, pa);
    updateTable(league, m.home, m.away, score);
  });
}

