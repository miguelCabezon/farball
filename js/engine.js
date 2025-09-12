// js/engine.js — motor de partido con log + eventos automáticos

// =========================
// Helpers y utilidades
// =========================
function clamp(x, a, b){ return Math.max(a, Math.min(b, x)); }

// Saca stats de un jugador con defaults "de barrio"
function stat(j, key, def=10){
  // permitimos tanto j[key] numérico como algo por 'tier'
  if (typeof j[key] === "number") return j[key];
  if (typeof j.tier === "number"){
    // tier 1..5 ~ 6..14 (aprox)
    return clamp(6 + (j.tier-1)*2, 4, 18);
  }
  return def;
}

// Calcula rating de equipo a partir de la plantilla.
// Devuelve A (ataque), D (defensa) y GK (portero) en escala ~0..20.
export function ratingEquipo({ jugadores }){
  // Si faltan roles, hacemos medias razonables con lo que haya.
  const gk  = jugadores.filter(j => j.rol === "GK");
  const dfs = jugadores.filter(j => j.rol === "DEF");
  const mfs = jugadores.filter(j => j.rol === "MID");
  const atks= jugadores.filter(j => j.rol === "ATK");

  // Portero: si no hay, inventamos uno modesto
  const gkVal = gk.length ? stat(gk[0], "gk", 10) : 8;

  // Defensa = DEFs + parte de MIDs
  const defBase = avg(dfs.map(j => stat(j, "def", 10)));
  const midDef  = avg(mfs.map(j => stat(j, "def", 10)));
  const D = clamp((defBase*0.7 + midDef*0.3) || 9, 4, 20);

  // Ataque = ATKs + parte de MIDs
  const atkBase = avg(atks.map(j => stat(j, "atk", 10)));
  const midAtk  = avg(mfs.map(j => stat(j, "atk", 10)));
  const A = clamp((atkBase*0.7 + midAtk*0.3) || 9, 4, 20);

  return { A, D, GK: clamp(gkVal, 4, 20) };
}

function avg(arr){
  if(!arr || !arr.length) return 0;
  return arr.reduce((a,b)=>a+b,0)/arr.length;
}

// Potencia ~1.0 basada en A/D de la plantilla (para IA y simulación global)
export function teamPowerFromRoster(jugadores){
  const { A, D } = ratingEquipo({ jugadores });
  let base = 0.6 * A + 0.4 * D;     // mezcla con ligero sesgo a ataque
  let power = base / 10;            // normaliza a ~1.0
  return clamp(power, 0.75, 1.25);  // limita rango razonable
}

// =========================
// Eventos automáticos (sin decisión)
// =========================
export const AUTO_EVENTS = {
  condicional: {
    chance: 0.10, // 10% de saltar una vez (seed)
    apply(state, side, log){
      // side = "local" | "visitante" => baja defensa resto de partido
      const tag = side === "local" ? "LOCAL" : "VIS";
      state.modifiers[side].def -= 0.12; // -12% defensa
      log.push(`🚨 (${tag}) La poli se lleva a un defensa (−DEF todo el partido)`);
    }
  },
  resacoso: {
    chance: 0.15,
    apply(state, side, log){
      state.modifiers[side].convNext += -0.12; // próxima ocasión -12%
      const tag = side === "local" ? "LOCAL" : "VIS";
      log.push(`🥴 (${tag}) Resacoso: la próxima ocasión baja la puntería`);
    }
  },
  felino: {
    chance: 0.12,
    apply(state, side, log){
      // mejora al portero de este side vs próxima ocasión rival
      const other = side === "local" ? "visitante" : "local";
      state.modifiers[other].convNext += -0.10;
      const tag = side === "local" ? "LOCAL" : "VIS";
      log.push(`🐈 (${tag}) Portero felino: la próxima al rival le costará marcar`);
    }
  },
  zorro: {
    chance: 0.10,
    apply(state, side, log){
      // próxima ocasión propia con +conv
      state.modifiers[side].convNext += 0.10;
      const tag = side === "local" ? "LOCAL" : "VIS";
      log.push(`🦊 (${tag}) Pillería: próxima ocasión con más picardía`);
    }
  },
};

// Alias para no romper tus imports actuales
export const DEFAULT_EVENTS = AUTO_EVENTS;

// =========================
// Motor principal
// =========================
export function simularPartido(teamLocal, teamVisitante, opts){
  const N = opts?.N ?? 12;
  const deck = opts?.eventsDeck ?? DEFAULT_EVENTS;

  const log = [];
  // Ratings iniciales
  const rL = ratingEquipo(teamLocal);
  const rV = ratingEquipo(teamVisitante);
  log.push(`📊 Ratings — LOCAL A:${rL.A.toFixed(1)} D:${rL.D.toFixed(1)} GK:${rL.GK.toFixed(1)} | ` +
           `VIS A:${rV.A.toFixed(1)} D:${rV.D.toFixed(1)} GK:${rV.GK.toFixed(1)}`);

  // Estado vivo
  const state = {
    teamL: teamLocal,
    teamV: teamVisitante,
    score: { home:0, away:0 },
    modifiers: {
      local:     { def:0, convNext:0 },
      visitante: { def:0, convNext:0 },
    }
  };

  // Semilla de eventos (0–2 por equipo, no repite tipo)
  seedAutoEvents(state, deck, log);

  // Bucle de jugadas
  for(let i=1; i<=N; i++){
    const { pL, pV } = probOcasion(rL, rV, state);
    // quién ataca esta jugada
    const atacanLocal = Math.random() < (pL / (pL + pV));
    const tag = atacanLocal ? "LOCAL" : "VIS";
    log.push(`▶️ Jugada ${i}: ataca ${tag}`);

    // ¿ocasion clara?
    const pO = atacanLocal ? pL : pV;
    if (Math.random() < pO){
      // prob de convertir (consume convNext del que ataca)
      const pC = probConversion(atacanLocal, rL, rV, state);
      if (Math.random() < pC){
        if (atacanLocal){
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
function seedAutoEvents(state, deck, log){
  const tipos = Object.keys(deck);
  ["local","visitante"].forEach(side=>{
    let pool = [...tipos];
    const seeds = 1 + (Math.random() < 0.35 ? 1 : 0); // 1 o 2 eventos
    for(let k=0;k<seeds;k++){
      if(!pool.length) break;
      const idx = Math.floor(Math.random()*pool.length);
      const key = pool.splice(idx,1)[0];
      const ev = deck[key];
      if (Math.random() < ev.chance){
        try { ev.apply(state, side, log); } catch(e){ /* ignora errores de evento */ }
      }
    }
  });
}

// Probabilidad de que haya ocasión para cada equipo en esta jugada
function probOcasion(rL, rV, state){
  // Defensa ajustada por modificadores persistentes (def puede ser negativa → clamp abajo)
  const defL = clamp(rL.D + (state.modifiers.local.def*20), 2, 24);
  const defV = clamp(rV.D + (state.modifiers.visitante.def*20), 2, 24);

  // Base 0.5 + sesgo por (Ataque - Defensa rival) reescalado
  const pL = clamp(0.50 + 0.30 * (rL.A - defV) / 20, 0.15, 0.85);
  const pV = clamp(0.50 + 0.30 * (rV.A - defL) / 20, 0.15, 0.85);
  return { pL, pV };
}

// Probabilidad de convertir una ocasión (consumiendo convNext del que ataca)
function probConversion(forLocal, rL, rV, state){
  const base = forLocal ? 0.28 : 0.26;   // local un poco más
  const gk   = forLocal ? rV.GK : rL.GK; // portero rival
  const adjGK = -0.20 * (gk - 10) / 10;  // GK alto reduce conversión

  const sideKey = forLocal ? "local" : "visitante";
  const bonus = state.modifiers[sideKey].convNext || 0;
  state.modifiers[sideKey].convNext = 0; // consumir

  return clamp(base + adjGK + bonus, 0.06, 0.52);
}



