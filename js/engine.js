// js/engine.js — motor de partido con log + eventos automáticos

// =========================
// Helpers y utilidades (podrían ir en otro archivo utils.js)
// =========================
function clamp(x, a, b) {
  return Math.max(a, Math.min(b, x));
}

// Saca stats de un jugador con defaults "de barrio"
function stat(j, key, def = 10) {
  // permitimos tanto j[key] numérico como algo por 'tier'
  if (typeof j[key] === "number") return j[key];
  if (typeof j.tier === "number") {
    // tier 1..5 ~ 6..14 (aprox)
    return clamp(6 + (j.tier - 1) * 2, 4, 18);
  }
  return def;
}

// Calcula rating de equipo a partir de la plantilla.
// Devuelve A (ataque), D (defensa) y GK (portero) en escala ~0..20.
export function teamRating({ players }) {
  // Si faltan roles, hacemos medias razonables con lo que haya.
  const gk = players.filter((j) => j.role === "GK");
  const dfs = players.filter((j) => j.role === "DEF");
  const mfs = players.filter((j) => j.role === "MID");
  const atks = players.filter((j) => j.role === "ATK");

  // Portero: si no hay, inventamos uno modesto
  const gkVal = gk.length ? stat(gk[0], "gk", 10) : 8;

  // Defensa = DEFs + parte de MIDs
  const defBase = avg(dfs.map((j) => stat(j, "def", 10)));
  const midDef = avg(mfs.map((j) => stat(j, "def", 10)));
  const D = clamp(defBase * 0.7 + midDef * 0.3 || 9, 4, 20);

  // Ataque = ATKs + parte de MIDs
  const atkBase = avg(atks.map((j) => stat(j, "atk", 10)));
  const midAtk = avg(mfs.map((j) => stat(j, "atk", 10)));
  const A = clamp(atkBase * 0.7 + midAtk * 0.3 || 9, 4, 20);

  return { A, D, GK: clamp(gkVal, 4, 20) };
}

function avg(arr) {
  if (!arr || !arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// Potencia ~1.0 basada en A/D de la plantilla (para IA y simulación global)
export function teamPowerFromRoster(players) {
  const { A, D } = teamRating({ players });
  let base = 0.6 * A + 0.4 * D; // mezcla con ligero sesgo a ataque
  let power = base / 10; // normaliza a ~1.0
  return clamp(power, 0.75, 1.25); // limita rango razonable
}

// =========================
// Eventos automáticos (sin decisión)
// =========================
export const AUTO_EVENTS = {
  condicional: {
    chance: 0.1, // 10% de saltar una vez (seed)
    apply(state, side, log) {
      // side = "home" | "away" => baja defensa resto de partido
      const tag = side === "home" ? "home" : "away";
      state.modifiers[side].def -= 0.12; // -12% defensa
      log.push(
        `🚨 (${tag}) La policía aparece y se lleva a tu defensa, dicen que no se qué de una estafa piramidal`
      );
    },
  },
  resacoso: {
    chance: 0.15,
    apply(state, side, log) {
      state.modifiers[side].convNext += -0.12; // próxima ocasión -12%
      const tag = side === "home" ? "home" : "away";
      log.push(
        `🥴 (${tag}) Resacoso, tu jugador se pone a vomitar de la resaca, te dice que son 5 minutos y está fino`
      );
    },
  },
  felino: {
    chance: 0.12,
    apply(state, side, log) {
      // mejora al portero de este side vs próxima ocasión rival
      const other = side === "home" ? "awayitante" : "home";
      state.modifiers[other].convNext += -0.1;
      const tag = side === "home" ? "home" : "away";
      log.push(
        `🐈 (${tag}) Las anfetas que se ha tomado tu portero le están dando unos reflejos felinos`
      );
    },
  },
  zorro: {
    chance: 0.1,
    apply(state, side, log) {
      // próxima ocasión propia con +conv
      state.modifiers[side].convNext += 0.1;
      const tag = side === "home" ? "home" : "away";
      log.push(`🦊 (${tag}) Pillería: próxima ocasión con más picardía`);
    },
  },
};

// Alias para no romper tus imports actuales
export const DEFAULT_EVENTS = AUTO_EVENTS;

// =========================
// Motor principal
// =========================
export function simulateMatch(teamHome, teamAway, opts) {
  const N = opts?.N ?? 12;
  const deck = opts?.eventsDeck ?? DEFAULT_EVENTS;

  const log = [];
  // Ratings iniciales
  const rL = teamRating(teamHome);
  const rV = teamRating(teamAway);
  log.push(
    `📊 Ratings — home A:${rL.A.toFixed(1)} D:${rL.D.toFixed(
      1
    )} GK:${rL.GK.toFixed(1)} | ` +
      `away A:${rV.A.toFixed(1)} D:${rV.D.toFixed(1)} GK:${rV.GK.toFixed(1)}`
  );

  // Estado vivo
  const state = {
    teamL: teamHome,
    teamV: teamAway,
    score: { home: 0, away: 0 },
    modifiers: {
      home: { def: 0, convNext: 0 },
      away: { def: 0, convNext: 0 },
    },
  };

  // Semilla de eventos (0–2 por equipo, no repite tipo)
  seedAutoEvents(state, deck, log);

  // Bucle de jugadas
  for (let i = 1; i <= N; i++) {
    const { pL, pV } = chanceProb(rL, rV, state);
    // quién ataca esta jugada
    const homeAttack = Math.random() < pL / (pL + pV);
    const tag = homeAttack ? "home" : "away";
    log.push(`▶️ Jugada ${i}: ataca ${tag}`);

    // ¿ocasion clara?
    const pO = homeAttack ? pL : pV;
    if (Math.random() < pO) {
      // prob de convertir (consume convNext del que ataca)
      const pC = probConversion(homeAttack, rL, rV, state);
      if (Math.random() < pC) {
        if (homeAttack) {
          state.score.home++;
        } else {
          state.score.away++;
        }
        log.push(`⚽ ¡Gol ${tag}! (${state.score.home}-${state.score.away})`);
      } else {
        log.push(`❌ Ocasión fallida (${tag})`);
      }
    } else {
      log.push(`⛔ Jugada sin peligro`);
    }
  }

  return { score: state.score, log };
}

// =========================
// Internas del motor
// =========================
function seedAutoEvents(state, deck, log) {
  const tipos = Object.keys(deck);
  ["home", "awayitante"].forEach((side) => {
    let pool = [...tipos];
    const seeds = 1 + (Math.random() < 0.35 ? 1 : 0); // 1 o 2 eventos
    for (let k = 0; k < seeds; k++) {
      if (!pool.length) break;
      const idx = Math.floor(Math.random() * pool.length);
      const key = pool.splice(idx, 1)[0];
      const ev = deck[key];
      if (Math.random() < ev.chance) {
        try {
          ev.apply(state, side, log);
        } catch (e) {
          /* ignora errores de evento */
        }
      }
    }
  });
}

// Probabilidad de que haya ocasión para cada equipo en esta jugada
function chanceProb(rL, rV, state) {
  // Defensa ajustada por modificadores persistentes (def puede ser negativa → clamp abajo)
  const defL = clamp(rL.D + state.modifiers.home.def * 20, 2, 24);
  const defV = clamp(rV.D + state.modifiers.away.def * 20, 2, 24);

  // Base 0.5 + sesgo por (Ataque - Defensa rival) reescalado
  const pL = clamp(0.5 + (0.3 * (rL.A - defV)) / 20, 0.15, 0.85);
  const pV = clamp(0.5 + (0.3 * (rV.A - defL)) / 20, 0.15, 0.85);
  return { pL, pV };
}

// Probabilidad de convertir una ocasión (consumiendo convNext del que ataca)
function probConversion(forhome, rL, rV, state) {
  const base = forhome ? 0.28 : 0.26; // home un poco más
  const gk = forhome ? rV.GK : rL.GK; // portero rival
  const adjGK = (-0.2 * (gk - 10)) / 10; // GK alto reduce conversión

  const sideKey = forhome ? "home" : "away";
  const bonus = state.modifiers[sideKey].convNext || 0;
  state.modifiers[sideKey].convNext = 0; // consumir

  return clamp(base + adjGK + bonus, 0.06, 0.52);
}
