// js/ui.js — control de pantallas
import { CRESTS } from './data.js';

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
