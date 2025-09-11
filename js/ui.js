import { simularPartido, DEFAULT_EVENTS } from './engine.js';
const resultado = simularPartido(equipoT, equipoR, { N: 12, eventsDeck: DEFAULT_EVENTS });
console.log(resultado.log.join('\n'), resultado.score);

