// js/ui.js — Flujo de pantallas y draft completo

// --------- IMPORTS ---------
import {
  CRESTS,
  sampleForRole,
  jugadoresPool,
  RIVALS,
  createLeague,
  updateTable,
  standingsSorted,
  getRoundMatches,
  simulateAIRound,
  setUserPower
} from './data.js';

import { simularPartido, DEFAULT_EVENTS, teamPowerFromRoster } from './engine.js';

// --------- ESTADO GLOBAL ---------
export const career = {
  teamName: "",
  crestId: "",
  plantilla: [],
  coins: 12,
  jornada: 1,
  league: null
};

// --------- HELPERS ---------
function showScreen(id){
  document.querySelectorAll("[id^='screen-']").forEach(d => d.style.display = "none");
  const el = document.getElementById(id);
  if (el) el.style.display = "block";
}

function formatCoins(n){ return `${n} 💰`; }

function getPlayerById(id){ return jugadoresPool.find(j => j.id === id); }

function nombreAleatorio() {
  const pref = ["Atlético", "Racing", "Deportivo", "UD", "CD", "Real", "Peña"];
  const suf = ["del Polígono", "de la Charca", "del Barato", "de la Feria", "del Puerto", "del Barrio"];
  return `${pref[Math.floor(Math.random()*pref.length)]} ${suf[Math.floor(Math.random()*suf.length)]}`;
}

function playerCardHTML(p, selected){
  const sel = selected ? 'border-color:#2563eb; box-shadow:0 0 0 3px rgba(37,99,235,0.25);' : '';
  return `
    <div class="card" data-id="${p.id}" style="
      width:220px; border:2px solid ${selected?'#2563eb':'#ddd'}; border-radius:12px; 
      padding:10px; cursor:pointer; background:#fff; ${sel}
    ">
      <div style="font-size:12px; opacity:.7; margin-bottom:4px;">${p.rol}</div>
      <div style="font-weight:700; margin-bottom:6px;">${p.nombre}</div>
      <div style="font-size:13px; margin-bottom:8px;">${p.blurb || 'Jugador de barrio.'}</div>
      <div style="display:flex; gap:6px; align-items:center; justify-content:space-between;">
        <span style="font-size:12px; background:#eee; border-radius:999px; padding:2px 8px;">Tier ${p.tier ?? '-'}</span>
        <span style="font-weight:700;">${p.salario ?? 2}💰</span>
      </div>
    </div>
  `;
}

// --------- PANTALLA: SETUP (nombre + escudo) ---------
function renderSetup(){
  const root = document.getElementById("screen-setup");
  root.innerHTML = `
    <h1>⚽ Football Manager de Barrio</h1>
    <p>Elige el nombre de tu equipo y un escudo:</p>
    <div style="margin:1em 0;">
      <label>Nombre del equipo:<br>
        <input id="input-teamname" type="text" placeholder="Ej: Racing del Polígono" style="padding:6px; width:260px;">
      </label>
    </div>
    <div id="crest-options" style="display:flex; gap:12px; flex-wrap:wrap; margin:1em 0;"></div>
    <button id="btn-continue" disabled>Continuar ➡️</button>
  `;

  const crestBox = root.querySelector("#crest-options");
  CRESTS.forEach(c=>{
    const div = document.createElement("div");
    div.style.textAlign = "center";
    div.innerHTML = `
      <img src="${c.src}" alt="${c.name}" width="64" height="64"
           style="border:2px solid transparent; border-radius:8px; cursor:pointer; object-fit:cover;">
      <div style="font-size:12px;">${c.name}</div>
    `;
    const img = div.querySelector("img");
    img.addEventListener("error", () => {
      img.removeAttribute('src');
      img.style.width = '64px';
      img.style.height = '64px';
      img.style.background = '#ddd';
      img.title = c.name + ' (sin imagen)';
    });
    img.onclick = () => {
      crestBox.querySelectorAll("img").forEach(i => i.style.borderColor = "transparent");
      img.style.borderColor = "blue";
      career.crestId = c.id;
      checkContinue();
    };
    crestBox.appendChild(div);
  });

  const inputName = root.querySelector("#input-teamname");
  inputName.addEventListener("input", checkContinue);

  function checkContinue(){
    const btn = root.querySelector("#btn-continue");
    career.teamName = inputName.value.trim();
    btn.disabled = !(career.teamName && career.crestId);
  }

  root.querySelector("#btn-continue").onclick = ()=>{
    if(!career.teamName) career.teamName = nombreAleatorio();
    showScreen("screen-draft");
    renderDraft(); // Porteros
  };
}

// --------- DRAFT: RONDA 1 (PORTERO 1 de 4) ---------
function renderDraft(){
  const root = document.getElementById("screen-draft");
  if(!root) throw new Error("Falta <div id='screen-draft'> en index.html");

  const opcionesGK = sampleForRole("GK", 4);
  let selectedId = null;

  root.innerHTML = `
    <h2 style="margin:0 0 8px;">Draft — Ronda 1/4: Portero</h2>
    <div style="margin: 0 0 10px; font-size:14px;">
      <strong>Equipo:</strong> ${career.teamName || 'Tu equipo'} 
      — <strong>Presupuesto:</strong> <span id="coins">${formatCoins(career.coins)}</span>
    </div>
    <div style="display:flex; gap:12px; flex-wrap:wrap; margin:10px 0;" id="cards"></div>

    <div style="display:flex; gap:8px; align-items:center; margin-top:12px;">
      <button id="btn-confirm" disabled>Confirmar portero ✅</button>
      <button id="btn-cancel">⬅️ Volver</button>
      <span id="warn" style="color:#b91c1c; font-size:13px; display:none;">No te llega el presupuesto para este jugador.</span>
    </div>

    <hr style="margin:16px 0;">
    <div id="next" style="display:none;">
      <h3>Ronda 2: Defensas (elige 2)</h3>
      <button id="btn-next">Ir a la siguiente ronda ➡️</button>
    </div>
  `;

  const $cards = root.querySelector("#cards");
  const $coins = root.querySelector("#coins");
  const $btnConfirm = root.querySelector("#btn-confirm");
  const $btnCancel = root.querySelector("#btn-cancel");
  const $warn = root.querySelector("#warn");
  const $next = root.querySelector("#next");

  $cards.innerHTML = opcionesGK.map(p => playerCardHTML(p, false)).join("");

  $cards.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
      $cards.querySelectorAll(".card").forEach(c => {
        c.style.borderColor = "#ddd";
        c.style.boxShadow = "none";
      });
      card.style.borderColor = "#2563eb";
      card.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.25)";
      selectedId = card.getAttribute("data-id");
      const p = getPlayerById(selectedId);
      const coste = p?.salario ?? 2;
      if(coste > career.coins){
        $btnConfirm.disabled = true;
        $warn.style.display = "inline";
      } else {
        $btnConfirm.disabled = false;
        $warn.style.display = "none";
      }
    });
  });

  $btnConfirm.addEventListener("click", () => {
    if(!selectedId) return;
    const p = getPlayerById(selectedId);
    const coste = p?.salario ?? 2;
    if(coste > career.coins){
      $warn.style.display = "inline";
      return;
    }
    career.plantilla.push(selectedId);
    career.coins -= coste;
    $coins.textContent = formatCoins(career.coins);

    $btnConfirm.disabled = true;
    $cards.querySelectorAll(".card").forEach(c => c.style.pointerEvents = "none");
    $next.style.display = "block";

    root.querySelector("#btn-next").onclick = () => {
      showScreen("screen-draft");
      renderDraftDefensas();
    };
  });

  $btnCancel.addEventListener("click", () => {
    showScreen("screen-setup");
    renderSetup();
  });
}

// ============================================================
// DRAFT GENÉRICO (multi-selección) para DEF, MID, ATK
// ============================================================
function renderDraftRoundMulti({ 
  title, role, need, optionsCount, nextTitle, onNext 
}){
  const root = document.getElementById("screen-draft");
  if(!root) throw new Error("Falta #screen-draft");

  const opciones = sampleForRole(role, optionsCount);
  const selected = new Set();

  root.innerHTML = `
    <h2 style="margin:0 0 8px;">${title}</h2>
    <div style="margin: 0 0 10px; font-size:14px;">
      <strong>Equipo:</strong> ${career.teamName || 'Tu equipo'}
      — <strong>Presupuesto:</strong> <span id="coins">${formatCoins(career.coins)}</span>
      — <strong>Seleccionados:</strong> <span id="picked">0</span> / ${need}
    </div>
    <div id="cards" style="display:flex; gap:12px; flex-wrap:wrap; margin:10px 0;"></div>

    <div style="display:flex; gap:8px; align-items:center; margin-top:12px;">
      <button id="btn-confirm" disabled>Confirmar ${need} ${role}</button>
      <button id="btn-cancel">⬅️ Volver</button>
      <span id="warn" style="color:#b91c1c; font-size:13px; display:none;">No te llega el presupuesto o te faltan jugadores.</span>
    </div>

    <hr style="margin:16px 0;">
    <div id="next" style="display:none;">
      <h3>${nextTitle}</h3>
      <button id="btn-next">Siguiente ronda ➡️</button>
    </div>
  `;

  const $cards = root.querySelector("#cards");
  const $coins = root.querySelector("#coins");
  const $picked = root.querySelector("#picked");
  const $btnConfirm = root.querySelector("#btn-confirm");
  const $btnCancel = root.querySelector("#btn-cancel");
  const $warn = root.querySelector("#warn");
  const $next = root.querySelector("#next");

  $cards.innerHTML = opciones.map(p => playerCardHTML(p, false)).join("");

  $cards.querySelectorAll(".card").forEach(card=>{
    card.addEventListener("click", ()=>{
      const id = card.getAttribute("data-id");
      if(selected.has(id)){
        selected.delete(id);
        card.style.borderColor = "#ddd";
        card.style.boxShadow = "none";
      } else {
        if(selected.size >= need){
          return;
        }
        selected.add(id);
        card.style.borderColor = "#2563eb";
        card.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.25)";
      }
      $picked.textContent = String(selected.size);
      validate();
    });
  });

  function selectedCost(){
    let sum = 0;
    selected.forEach(id => {
      const p = getPlayerById(id);
      sum += (p?.salario ?? 2);
    });
    return sum;
  }

  function validate(){
    const okCount = selected.size === need;
    const okBudget = selectedCost() <= career.coins;
    $btnConfirm.disabled = !(okCount && okBudget);
    $warn.style.display = (okCount && okBudget) ? "none" : "inline";
  }

  $btnConfirm.addEventListener("click", ()=>{
    if(selected.size !== need) return;
    const coste = selectedCost();
    if(coste > career.coins) { validate(); return; }

    selected.forEach(id => career.plantilla.push(id));
    career.coins -= coste;
    $coins.textContent = formatCoins(career.coins);

    $cards.querySelectorAll(".card").forEach(c => c.style.pointerEvents = "none");
    $btnConfirm.disabled = true;
    $next.style.display = "block";

    root.querySelector("#btn-next").onclick = onNext;
  });

  $btnCancel.addEventListener("click", ()=>{
    showScreen("screen-setup");
    renderSetup();
  });
}

function renderDraftDefensas(){
  renderDraftRoundMulti({
    title: "Draft — Ronda 2/4: Defensas (elige 2)",
    role: "DEF",
    need: 2,
    optionsCount: 6,
    nextTitle: "Ronda 3/4: Medios (elige 2)",
    onNext: () => {
      showScreen("screen-draft");
      renderDraftMedios();
    }
  });
}

function renderDraftMedios(){
  renderDraftRoundMulti({
    title: "Draft — Ronda 3/4: Medios (elige 2)",
    role: "MID",
    need: 2,
    optionsCount: 6,
    nextTitle: "Ronda 4/4: Delantero (elige 1)",
    onNext: () => {
      showScreen("screen-draft");
      renderDraftDelantero();
    }
  });
}

function renderDraftDelantero(){
  renderDraftRoundMulti({
    title: "Draft — Ronda 4/4: Delantero (elige 1)",
    role: "ATK",
    need: 1,
    optionsCount: 4,
    nextTitle: "¡Draft completado! Ver resumen del club",
    onNext: () => {
      showScreen("screen-club");
      renderClubSummary();
    }
  });
}

// --------- RESUMEN + CLASIFICACIÓN ---------
function renderClubSummary(){
  const root = document.getElementById("screen-club");
  if(!root) throw new Error("Falta #screen-club");

  if (!career.league) {
    career.league = createLeague(career.teamName, RIVALS);
  }

  const byRole = { GK:[], DEF:[], MID:[], ATK:[] };
  career.plantilla.forEach(id=>{
    const p = getPlayerById(id);
    if(p) byRole[p.rol]?.push(p);
  });

  function listRole(role, arr){
    if(!arr || !arr.length) return `<p><strong>${role}:</strong> —</p>`;
    return `
      <p><strong>${role} (${arr.length}):</strong></p>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        ${arr.map(p => `
          <div style="border:1px solid #ddd; border-radius:10px; padding:8px 10px;">
            <div style="font-size:12px; opacity:.7;">${p.rol}</div>
            <div style="font-weight:700;">${p.nombre}</div>
            <div style="font-size:12px;">${p.blurb || ""}</div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function tableHTML(){
    const rows = standingsSorted(career.league).map(t => `
      <tr>
        <td>${t.name}</td><td>${t.pj}</td><td>${t.pg}</td><td>${t.pe}</td><td>${t.pp}</td>
        <td>${t.gf}</td><td>${t.gc}</td><td>${t.gf - t.gc}</td><td><strong>${t.pts}</strong></td>
      </tr>`).join("");
    return `
      <table style="border-collapse:collapse; width:100%; max-width:760px;">
        <thead>
          <tr><th>Equipo</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th><th>GF</th><th>GC</th><th>DG</th><th>PTS</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  root.innerHTML = `
    <h2>${career.teamName} — Plantilla final</h2>
    <p><strong>Presupuesto restante:</strong> ${formatCoins(career.coins)}</p>
    ${listRole("GK", byRole.GK)}
    ${listRole("DEF", byRole.DEF)}
    ${listRole("MID", byRole.MID)}
    ${listRole("ATK", byRole.ATK)}

    <hr style="margin:16px 0;">
    <h3>Clasificación (Jornada ${Math.max(0, career.league.jornada - 1)})</h3>
    <div id="tabla-clasificacion">${tableHTML()}</div>

    <div style="margin-top:12px; display:flex; gap:8px;">
      <button id="btn-jugar-jornada">Jugar jornada ${career.league.jornada} ▶️</button>
      <button id="btn-rehacer">Rehacer draft 🔄</button>
    </div>
  `;

  // Handlers
  const btnRehacer = root.querySelector("#btn-rehacer");
  if (btnRehacer) {
    btnRehacer.onclick = ()=>{
      career.plantilla = [];
      career.coins = 12;
      career.league = null;
      showScreen("screen-draft");
      renderDraft();
    };
  }

  const btnJugar = root.querySelector("#btn-jugar-jornada");
  if (!btnJugar) {
    console.error("[UI] No encuentro #btn-jugar-jornada. Revisa el innerHTML o el id del botón.");
    return; // evita el error de 'null.onclick'
  }

  btnJugar.onclick = ()=>{
    const matches = getRoundMatches(career.league);
    const my = matches.find(m => m.home === career.teamName || m.away === career.teamName);
    if(!my){ alert("¡Liga terminada!"); return; }

    const myRoster = career.plantilla.map(getPlayerById).filter(Boolean);
    const myPower = teamPowerFromRoster(myRoster);
    setUserPower(career.league, myPower);

    const soyLocal = (my.home === career.teamName);
    const equipoT = { nombre: my.home, moral: 7, local: true,  jugadores: soyLocal ? myRoster : sampleRivalSquad() };
    const equipoR = { nombre: my.away, moral: 5, local: false, jugadores: soyLocal ? sampleRivalSquad() : myRoster };

    const res = simularPartido(equipoT, equipoR, { N: 12, eventsDeck: DEFAULT_EVENTS });
    updateTable(career.league, my.home, my.away, res.score);

    simulateAIRound(career.league, matches);

    career.league.jornada++;
    alert(`${my.home} ${res.score.home} - ${res.score.away} ${my.away}`);

    const tabla = document.getElementById("tabla-clasificacion");
    if (tabla) {
      tabla.innerHTML = (function tableHTML(){
        const rows = standingsSorted(career.league).map(t => `
          <tr>
            <td>${t.name}</td><td>${t.pj}</td><td>${t.pg}</td><td>${t.pe}</td><td>${t.pp}</td>
            <td>${t.gf}</td><td>${t.gc}</td><td>${t.gf - t.gc}</td><td><strong>${t.pts}</strong></td>
          </tr>`).join("");
        return `
          <table style="border-collapse:collapse; width:100%; max-width:760px;">
            <thead>
              <tr><th>Equipo</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th><th>GF</th><th>GC</th><th>DG</th><th>PTS</th></tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>`;
      })();
    }

    if (career.league.jornada > career.league.rivals.length) {
      btnJugar.textContent = "Liga finalizada ✔️";
      btnJugar.disabled = true;
    } else {
      btnJugar.textContent = `Jugar jornada ${career.league.jornada} ▶️`;
    }

    // (opcional) pequeño ruido en power IA
    Object.keys(career.league.power).forEach(name=>{
      if(name === career.teamName) return;
      let p = career.league.power[name];
      p += (Math.random()-0.5)*0.05;
      career.league.power[name] = Math.max(0.80, Math.min(1.20, p));
    });
  };

  // Escuadrón simple del rival
  function sampleRivalSquad(){
    const gk  = sampleForRole("GK", 1);
    const dfs = sampleForRole("DEF", 2);
    const mfs = sampleForRole("MID", 2);
    const atk = sampleForRole("ATK", 1);
    return [...gk, ...dfs, ...mfs, ...atk];
  }
} // <-- ¡ESTA llave cierra renderClubSummary()!

// --------- ARRANQUE ---------
showScreen("screen-setup");
renderSetup();
