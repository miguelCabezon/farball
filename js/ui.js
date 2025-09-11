// js/ui.js — control de pantallas
import { CRESTS, sampleForRole, jugadoresPool } from './data.js';
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

// -------- Pantalla DRAFT (placeholder) --------
function renderDraft(){
  const root = document.getElementById("screen-draft");
  root.innerHTML = `
    <h2>Draft de jugadores</h2>
    <p>(Aquí montaremos la elección de plantilla…)</p>
    <button id="btn-back">⬅️ Volver</button>
  `;
  root.querySelector("#btn-back").onclick = ()=>{
    showScreen("screen-setup");
    renderSetup();
  };
}

// -------- Init --------
showScreen("screen-setup");
renderSetup();

