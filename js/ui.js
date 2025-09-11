// js/ui.js — control de pantallas
import { CRESTS, sampleForRole, jugadoresPool } from './data.js';
import { RIVALS, createLeague, updateTable, standingsSorted } from './data.js';
import { simularPartido, DEFAULT_EVENTS } from './engine.js';
// ===== Helpers que quizás no tengas aún =====
function formatCoins(n){ return `${n} 💰`; }
function getPlayerById(id){ return jugadoresPool.find(j => j.id === id); }

// ===== Render de una carta simple de jugador =====
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

// ===== Pantalla DRAFT – Ronda 1 (Porteros) =====
function renderDraft(){
  const root = document.getElementById("screen-draft");
  if(!root) throw new Error("Falta <div id='screen-draft'> en index.html");

  // Estado local de la ronda
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
      <h3>Ronda 2: Defensas (próximamente)</h3>
      <p>De momento dejamos esto como placeholder. Cuando confirmes el portero, pasaremos a preparar la ronda de defensas.</p>
      <button id="btn-next">Ir a la siguiente ronda ➡️</button>
    </div>
  `;

  const $cards = root.querySelector("#cards");
  const $coins = root.querySelector("#coins");
  const $btnConfirm = root.querySelector("#btn-confirm");
  const $btnCancel = root.querySelector("#btn-cancel");
  const $warn = root.querySelector("#warn");
  const $next = root.querySelector("#next");

  // Pintar cartas
  $cards.innerHTML = opcionesGK.map(p => playerCardHTML(p, false)).join("");

  // Click de selección
  $cards.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
      // marcar UI
      $cards.querySelectorAll(".card").forEach(c => {
        c.style.borderColor = "#ddd";
        c.style.boxShadow = "none";
      });
      card.style.borderColor = "#2563eb";
      card.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.25)";

      selectedId = card.getAttribute("data-id");
      const p = getPlayerById(selectedId);
      const coste = p?.salario ?? 2;

      // Validación de presupuesto
      if(coste > career.coins){
        $btnConfirm.disabled = true;
        $warn.style.display = "inline";
      } else {
        $btnConfirm.disabled = false;
        $warn.style.display = "none";
      }
    });
  });

  // Confirmar elección
  $btnConfirm.addEventListener("click", () => {
    if(!selectedId) return;
    const p = getPlayerById(selectedId);
    const coste = p?.salario ?? 2;
    if(coste > career.coins){
      $warn.style.display = "inline";
      return;
    }
    // Guardamos elección
    career.plantilla.push(selectedId);
    career.coins -= coste;
    $coins.textContent = formatCoins(career.coins);

    // Bloquear UI de ronda y mostrar siguiente paso
    $btnConfirm.disabled = true;
    $cards.querySelectorAll(".card").forEach(c => c.style.pointerEvents = "none");
    $next.style.display = "block";

    // Botón para avanzar (placeholder)
    const $btnNext = root.querySelector("#btn-next");
    $btnNext.onclick = () => {
    showScreen("screen-draft");
    renderDraftDefensas();
      // Aquí llamaremos a renderDraftDefensas() en la siguiente iteración.
      alert("Perfecto: portero fichado. A continuación montamos la ronda de DEFENSAS.");
      // Por ahora, volvemos a setup o nos quedamos aquí.
      // showScreen("screen-setup"); renderSetup();
    };
  });

  // Volver
  $btnCancel.addEventListener("click", () => {
    showScreen("screen-setup");
    renderSetup();
  });
}
// Estado de partida (global mínimo de momento)
export const career = {
  teamName: "",
  crestId: "",
  plantilla: [],
  coins: 12,
  jornada: 1,
};

// Helpers para mostrar/ocultar pantallas
function showScreen(id){
  document.querySelectorAll("body > div[id^='screen-']").forEach(div=>{
    div.style.display = "none";
  });
  document.getElementById(id).style.display = "block";
}

// -------- Pantalla SETUP --------
function renderSetup(){
  const root = document.getElementById("screen-setup");
  root.innerHTML = `
    <h1>⚽ Football Manager de Barrio</h1>
    <p>Elige el nombre de tu equipo y un escudo:</p>
    <div style="margin:1em 0;">
      <label>Nombre del equipo:<br>
        <input id="input-teamname" type="text" placeholder="Ej: Racing del Polígono" style="padding:6px; width:240px;">
      </label>
    </div>
    <div id="crest-options" style="display:flex; gap:12px; flex-wrap:wrap; margin:1em 0;"></div>
    <button id="btn-continue" disabled>Continuar ➡️</button>
  `;

  // Render escudos
  const crestBox = root.querySelector("#crest-options");
  CRESTS.forEach(c=>{
    const div = document.createElement("div");
    div.innerHTML = `
      <img src="${c.src}" alt="${c.name}" width="64" height="64" style="border:2px solid transparent; border-radius:8px; cursor:pointer;">
      <div style="font-size:12px; text-align:center;">${c.name}</div>
    `;
    div.querySelector("img").onclick = ()=>{
      // marcar seleccionado
      crestBox.querySelectorAll("img").forEach(img=>img.style.borderColor="transparent");
      div.querySelector("img").style.borderColor = "blue";
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
    console.log("Equipo creado:", career);
    // aquí iría el salto a la pantalla de draft
    showScreen("screen-draft");
    renderDraft(); // función que prepararemos luego
  };
}


// -------- Init --------
showScreen("screen-setup");
renderSetup();

// ============================================================
// DRAFT GENÉRICO (multi-selección) para DEF, MID, ATK
// ============================================================

function renderDraftRoundMulti({ 
  title, role, need, optionsCount, nextTitle, onNext 
}){
  const root = document.getElementById("screen-draft");
  if(!root) throw new Error("Falta #screen-draft");

  // Opciones a mostrar
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

  // Pinta cartas
  $cards.innerHTML = opciones.map(p => playerCardHTML(p, false)).join("");

  // Click en carta → seleccionar/deseleccionar
  $cards.querySelectorAll(".card").forEach(card=>{
    card.addEventListener("click", ()=>{
      const id = card.getAttribute("data-id");
      if(selected.has(id)){
        selected.delete(id);
        card.style.borderColor = "#ddd";
        card.style.boxShadow = "none";
      } else {
        if(selected.size >= need){
          // Si ya tienes el cupo, no dejes pasar (o quita la más antigua si prefieres)
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

  // Confirmar ronda
  $btnConfirm.addEventListener("click", ()=>{
    if(selected.size !== need) return;
    const coste = selectedCost();
    if(coste > career.coins) {
      validate();
      return;
    }
    // Guardar
    selected.forEach(id => career.plantilla.push(id));
    career.coins -= coste;
    $coins.textContent = formatCoins(career.coins);

    // Bloquear cartas
    $cards.querySelectorAll(".card").forEach(c => c.style.pointerEvents = "none");
    $btnConfirm.disabled = true;
    $next.style.display = "block";

    // Ir a siguiente ronda
    root.querySelector("#btn-next").onclick = onNext;
  });

  // Volver
  $btnCancel.addEventListener("click", ()=>{
    showScreen("screen-setup");
    renderSetup();
  });
}

// ----------------- Ronda 2: DEFENSAS (elige 2) -----------------
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

// ----------------- Ronda 3: MEDIOS (elige 2) -------------------
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

// ----------------- Ronda 4: DELANTERO (elige 1) ----------------
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

// ----------------- Resumen del club tras el draft --------------
function renderClubSummary(){
  if (!career.league) {
  career.league = createLeague(career.teamName, RIVALS);
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
  const root = document.getElementById("screen-club");
  if(!root) throw new Error("Falta #screen-club");

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

  root.innerHTML = `
  <hr style="margin:16px 0;">
  <h3>Clasificación (Jornada ${career.league.jornada - 1})</h3>
  <div id="tabla-clasificacion">${tableHTML()}</div>
  <div style="margin-top:12px;">
    <button id="btn-jugar">Jugar jornada ${career.league.jornada} ▶️</button>
  </div>
root.querySelector("#btn-jugar").onclick = ()=>{
  const j = career.league.jornada;
  const fixture = career.league.fixtures[j-1];
  if(!fixture){ alert("¡Liga terminada!"); return; }

  // Construir equipoT desde la plantilla elegida
  const equipoT = {
    nombre: career.teamName, moral: 7, local: true,
    jugadores: career.plantilla.map(getPlayerById).filter(Boolean)
  };
  const equipoR = { nombre: fixture.away, moral: 5, local: false, jugadores: sampleRivalSquad() };

  const res = simularPartido(equipoT, equipoR, { N: 12, eventsDeck: DEFAULT_EVENTS });
  updateTable(career.league, fixture.home, fixture.away, res.score);
  career.league.jornada++;

  alert(`${fixture.home} ${res.score.home} - ${res.score.away} ${fixture.away}`);

  // refrescar tabla
  document.getElementById("tabla-clasificacion").innerHTML = tableHTML();
  // refrescar cabecera con jornada (re-render completo si prefieres)
};
function sampleRivalSquad(){
  // Saca 1 GK, 2 DEF, 2 MID, 1 ATK aleatorios del pool (simple)
  const gk  = sampleForRole("GK", 1);
  const dfs = sampleForRole("DEF", 2);
  const mfs = sampleForRole("MID", 2);
  const atk = sampleForRole("ATK", 1);
  return [...gk, ...dfs, ...mfs, ...atk];
}
  
    <h2>${career.teamName} — Plantilla final</h2>
    <p><strong>Presupuesto restante:</strong> ${formatCoins(career.coins)}</p>
    ${listRole("GK", byRole.GK)}
    ${listRole("DEF", byRole.DEF)}
    ${listRole("MID", byRole.MID)}
    ${listRole("ATK", byRole.ATK)}
    <div style="margin-top:16px; display:flex; gap:8px;">
      <button id="btn-jugar">Jugar primer partido ▶️</button>
      <button id="btn-rehacer">Rehacer draft 🔄</button>
    </div>
  `;

  // Wire botones (placeholder de partido; ya lo enchufamos a engine en el siguiente paso)
  root.querySelector("#btn-jugar").onclick = ()=>{
    alert("¡Listo para conectar con el motor de partido (engine.js)! En la próxima iteración mapeamos career.plantilla a equipoT y simulamos.");
    // showScreen("screen-match"); renderMatch(); // lo haremos luego
  };
  root.querySelector("#btn-rehacer").onclick = ()=>{
    career.plantilla = [];
    career.coins = 12;
    showScreen("screen-draft");
    renderDraft(); // vuelve a la ronda de porteros
  };
}





