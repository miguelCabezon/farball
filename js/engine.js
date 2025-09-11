// js/engine.js — Motor de simulación de partido (ESM)

// ---------- Utilidades ----------
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const rnd = () => Math.random();

// ---------- Ratings por rol ----------
function rolATK(j){ return 0.6*j.tecnica + 0.4*j.velocidad - 0.3*(j.resaca||0); }
function rolMID(j){ return 0.5*j.tecnica + 0.3*j.velocidad + 0.2*(j.carisma||0) - 0.2*(j.resaca||0); }
function rolDEF(j){ return 0.5*j.fuerza  + 0.3*j.velocidad + 0.2*j.tecnica      - 0.2*(j.resaca||0); }
function rolGK (j){ return 0.7*(j.reflejos||0) + 0.3*(j.carisma||0) - 0.3*(j.resaca||0); }

// ---------- Agregados de equipo ----------
export function ratingEquipo(equipo){
  const ATKs = equipo.jugadores.filter(j=>j.rol==="ATK").map(rolATK).sort((a,b)=>b-a);
  const DEFs = equipo.jugadores.filter(j=>j.rol==="DEF").map(rolDEF).sort((a,b)=>b-a);
  const MIDs = equipo.jugadores.filter(j=>j.rol==="MID").map(rolMID);
  const gk  = equipo.jugadores.find(j=>j.rol==="GK");
  const GK  = gk ? rolGK(gk) : 0;

  const top2 = arr => {
    if(arr.length===0) return 0;
    if(arr.length===1) return arr[0];
    return (arr[0] + arr[1]) / 2;
  };

  const A = top2(ATKs) + 0.3 * (MIDs.length ? (MIDs.reduce((a,b)=>a+b,0)/MIDs.length) : 0);
  const D = top2(DEFs) + 0.4 * GK;

  return { A, D, GK };
}

const moralMul = m => 1 + (m - 5) * 0.04;
const homeMul  = isHome => isHome ? 1.05 : 1.00;

// ---------- Eventos por defecto (opcional) ----------
export const DEFAULT_EVENTS = [
  { id:"perro",       name:"Perro en el campo",     effect:"swap_possession_next" },
  { id:"condicional", name:"Condicional",           effect:"def_down_team", team:"T", factor:0.85, duration:"full" },
  { id:"mafia",       name:"Llamada de la mafia",   effect:"goal_bribe_team", team:"T" },
  { id:"resacaGK",    name:"Portero rival de resaca", effect:"gk_down_team", team:"R", ticks:4, factor:0.8 },
  { id:"feria",       name:"Feria sobre el campo",  effect:"reduce_plays", amount:2 },
  { id:"arbitro",     name:"Árbitro primo",         effect:"boost_conv_once", team:"T", amount:0.10 },
];

// ---------- Narración simple ----------
function lineJug(lado, conv, gol, i){
  return `Jugada ${i}: ataca ${lado}. Conv=${(conv*100).toFixed(1)}% → ${gol ? "¡GOL!" : "nada..."}`;
}

// ---------- Simulación principal ----------
/**
 * Simula un partido.
 * @param {Object} teamT  - { nombre, moral (0-10), local (bool), jugadores: [...] }
 * @param {Object} teamR  - igual que teamT
 * @param {Object} options - { N=12, baseConv=0.18, eventsDeck=DEFAULT_EVENTS, eventsEvery=3 }
 * @returns {Object} { score:{home, away}, log:[...], stats:{shotsT,shotsR,convT,convR}, eventsUsed:[...] }
 */
export function simularPartido(teamT, teamR, options={}){
  const N          = options.N ?? 12;           // nº de jugadas totales
  const baseConv   = options.baseConv ?? 0.18;  // conversión base por ocasión
  const deck       = options.eventsDeck ?? DEFAULT_EVENTS;
  const eventsEvery= options.eventsEvery ?? 3;  // carta cada X jugadas
  const log = [];
  const eventsUsed = [];

  // Estado de efectos
  let boostConvOnce_T = 0;     // del árbitro primo (T)
  let swapNext = false;        // perro en el campo
  let gkDown_R_ticks = 0, gkDown_R_factor = 1.0; // resaca GK rival
  let defDown_T_factor = 1.0;  // condicional en defensa T
  let playsLeft = N;

  // Marcador y contadores
  let golesT = 0, golesR = 0;
  let shotsT = 0, shotsR = 0;

  // Funciones internas
  const calcRatings = () => {
    const RT = ratingEquipo(teamT);
    const RR = ratingEquipo(teamR);

    let A_T = RT.A, D_T = RT.D, GK_T = RT.GK;
    let A_R = RR.A, D_R = RR.D, GK_R = RR.GK;

    const mulT = moralMul(teamT.moral ?? 5) * homeMul(!!teamT.local);
    const mulR = moralMul(teamR.moral ?? 5) * homeMul(!!teamR.local);

    A_T *= mulT; D_T *= mulT;
    A_R *= mulR; D_R *= mulR;

    // Efectos activos
    D_T *= defDown_T_factor;
    GK_R *= gkDown_R_factor;

    return { A_T, D_T, GK_T, A_R, D_R, GK_R };
  };

  const robarEvento = () => {
    if(!deck || deck.length===0) return;
    const carta = deck[Math.floor(rnd()*deck.length)];
    eventsUsed.push(carta.id);

    switch(carta.effect){
      case "swap_possession_next":
        swapNext = true;
        log.push("🟡 Evento: Perro en el campo — La siguiente jugada cambia de posesión.");
        break;
      case "def_down_team":
        if(carta.team==="T"){
          defDown_T_factor = Math.min(defDown_T_factor, carta.factor ?? 0.85);
          log.push("🟡 Evento: Condicional — Baja tu defensa para el resto del partido.");
        }
        break;
      case "goal_bribe_team":
        if(carta.team==="T"){
          golesT++;
          log.push("🟡 Evento: Llamada de la mafia — Aceptas el 'trato'. +1 gol (la moral ya si eso…).");
        }
        break;
      case "gk_down_team":
        if(carta.team==="R"){
          gkDown_R_ticks  = carta.ticks ?? 4;
          gkDown_R_factor = carta.factor ?? 0.8;
          log.push("🟡 Evento: Portero rival de resaca — GK rival reducido por 4 jugadas.");
        }
        break;
      case "reduce_plays":
        const amt = carta.amount ?? 2;
        playsLeft = Math.max(6, playsLeft - amt);
        log.push("🟡 Evento: Feria — Se reducen las jugadas totales.");
        break;
      case "boost_conv_once":
        if(carta.team==="T"){
          boostConvOnce_T += (carta.amount ?? 0.10);
          log.push("🟡 Evento: Árbitro primo — Próxima ocasión a favor mejora la conversión.");
        }
        break;
    }
  };

  // Bucle de jugadas
  for(let i=1; i<=playsLeft; i++){
    // Cada X jugadas, evento
    if(((i-1) % eventsEvery) === 0) robarEvento();

    const { A_T, D_T, GK_T, A_R, D_R, GK_R } = calcRatings();

    // ¿Quién ataca?
    let pT = clamp(0.50 + 0.04 * ((A_T - D_R)/5), 0.20, 0.80);
    let atacante = (rnd() < pT) ? "T" : "R";
    if(swapNext){ atacante = atacante==="T" ? "R" : "T"; swapNext = false; }

    // Conversión a gol
    let conv;
    if(atacante==="T"){
      conv = baseConv + 0.02 * clamp((A_T - D_R)/5, -3, 3) - 0.01 * clamp((GK_R)/2, 0, 4);
      conv += boostConvOnce_T; // se consume solo si hay ocasión
      boostConvOnce_T = 0;
      shotsT++;
    } else {
      conv = baseConv + 0.02 * clamp((A_R - D_T)/5, -3, 3) - 0.01 * clamp((GK_T)/2, 0, 4);
      shotsR++;
    }
    conv = clamp(conv, 0.05, 0.45);

    const gol = rnd() < conv;
    const lado = atacante==="T" ? (teamT.nombre || "Local") : (teamR.nombre || "Visitante");
    log.push(lineJug(lado, conv, gol, i));

    if(gol){
      if(atacante==="T") golesT++; else golesR++;
    }

    // Tick de efectos con duración
    if(gkDown_R_ticks>0){
      gkDown_R_ticks--;
      if(gkDown_R_ticks===0) gkDown_R_factor = 1.0;
    }
  }

  log.push(`\n🧾 FINAL: ${teamT.nombre || "Local"} ${golesT} - ${golesR} ${teamR.nombre || "Visitante"}`);

  const convT = shotsT ? golesT/shotsT : 0;
  const convR = shotsR ? golesR/shotsR : 0;

  return {
    score: { home: golesT, away: golesR },
    log,
    stats: { shotsT, shotsR, convT, convR },
    eventsUsed
  };
}
export function teamPowerFromRoster(jugadores){
  const { A, D } = ratingEquipo({ jugadores });
  // mezcla simple: ataque pesa algo más que defensa
  let base = 0.6 * A + 0.4 * D;         // ~ escala 0..20 aprox según tus fórmulas
  let power = base / 10;                 // ~ normaliza a ~1.0
  power = Math.max(0.75, Math.min(1.25, power)); // acota
  return power;
}


