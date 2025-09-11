// js/ui.js — Flujo de pantallas, draft y liga

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
        <span style="font-weight:7








