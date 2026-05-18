/* TIMO interactivo sensorial - versión corregida
   Estructura: 4 escenas en el orden de la historia:
   1. Portada  2. Respira  3. Túnel  4. Final
*/

const ASSETS = {
  portada: {
  fondo: "assets/portada/fondo_color.png",
  bolita: "assets/portada/timo_bolita.png",
  abierto: "assets/portada/timo_open.png",
  luciernagas: "assets/portada/luciernagas.png",
  conejo: "assets/portada/conejo.png",
  pajaro: "assets/portada/pajaro.png",
  mariposa: "assets/portada/mariposa.png",
  pelota: "assets/portada/pelota.png"
},
  respira: {
    fondo: "assets/respira/fondo_color.png",
    timoTronco: "assets/respira/timo_tronco.png",
    pajaro: "assets/respira/pajaro.png",
    mariposa: "assets/respira/mariposa.png",
    luciernagas: "assets/respira/luciernagas.png"
  },
  tunel: {
    fondo: "assets/tunel/fondo_color.png",
    bolita: "assets/tunel/timo_bolita.png",
    pelota: "assets/tunel/pelota.png"
  },
  final: {
    fondo: "assets/final/fondo_noche_color.png",
    timo: "assets/final/timo.png",
    mono: "assets/final/mono.png",
    conejo: "assets/final/conejo.png",
    pajaro: "assets/final/pajaro.png",
    mariposa: "assets/final/mariposa.png",
    pelota: "assets/final/pelota.png",
    luciernagas: "assets/final/luciernagas.png"
  }
};

const SOUND_PATHS = {
  stressLow: "sounds/stress_low.mp3",
  stressHigh: "sounds/stress_high.mp3",
  stressNoise: "sounds/stress_noise.mp3",
  heartbeatFast: "sounds/heartbeat_fast.mp3",
  heartbeatSoft: "sounds/heartbeat_soft.mp3",
  tunnelEcho: "sounds/tunnel_echo.mp3",
  rollingBall: "sounds/rolling_ball.mp3",
  bump: "sounds/bump.mp3",
  ballTap: "sounds/ball_tap.mp3",
  calmAir: "sounds/calm_air.mp3",
  deepBreath: "sounds/deep_breath.mp3",
  fireflies: "sounds/fireflies_soft.mp3",
  softChimes: "sounds/soft_chimes.mp3",
  happyWind: "sounds/happy_wind.mp3",
  forest: "sounds/forest_night.mp3",
  butterfly: "sounds/butterfly_flutter.mp3",
  playBall: "sounds/play_ball.mp3",
  softLaughs: "sounds/soft_laughs.mp3"
};

const $ = (id) => document.getElementById(id);

const app = $("app");
const fondo = $("fondo");
const cieloColor = $("cieloColor");
const oscuridad = $("oscuridad");
const spotLuz = $("spotLuz");
const ruido = $("ruido");
const flash = $("flash");
const luciernagasCampo = $("luciernagasCampo");
const luciernagasDibujo = $("luciernagasDibujo");
const timo = $("timo");
const tronco = $("tronco");
const pelota = $("pelota");
const mono = $("mono");
const conejo = $("conejo");
const pajaro = $("pajaro");
const mariposa = $("mariposa");
const ayEco = $("ayEco");
const titulo = $("titulo");
const instruccion = $("instruccion");
const cuento = $("cuento");
const btnSonido = $("btnSonido");
const btnSensible = $("btnSensible");
const avisoAudio = $("avisoAudio");

let escenaActual = "portada";
let sonidoActivo = false;
let modoSensible = false;
let estadoPortada = "oscuro";
let progresoPortada = 0;
let progresoRespira = 0;
let tunelX = 0.04;
let tunelY = 0.55;
let ultimoGolpe = 0;
let pointerActivo = false;
let startX = 0;
let startY = 0;
let ultimaX = 0;
let ultimaY = 0;

const sonidos = {};
Object.entries(SOUND_PATHS).forEach(([key, path]) => {
  sonidos[key] = new Audio(path);
  sonidos[key].loop = !["bump", "ballTap", "playBall"].includes(key);
  sonidos[key].volume = 0;
});

function setVol(name, value) {
  if (!sonidos[name]) return;
  const v = modoSensible ? value * 0.45 : value;
  sonidos[name].volume = Math.max(0, Math.min(v, 1));
}

function bajarTodosLosSonidos() {
  Object.keys(sonidos).forEach((key) => setVol(key, 0));
}

function playOneShot(name, vol = 0.6) {
  if (!sonidoActivo || !sonidos[name]) return;
  const s = sonidos[name];
  s.currentTime = 0;
  s.volume = modoSensible ? vol * 0.45 : vol;
  s.play().catch(() => {});
}

function encenderSonido() {
  sonidoActivo = true;
  Object.values(sonidos).forEach((s) => s.play().catch(() => {}));
  btnSonido.textContent = "🔇";
  avisoAudio.style.opacity = 0;
  setTimeout(() => avisoAudio.classList.add("oculto"), 600);
  actualizarAudioPorEscena();
}

function apagarSonido() {
  sonidoActivo = false;
  Object.values(sonidos).forEach((s) => {
    s.pause();
    s.currentTime = 0;
    s.volume = 0;
  });
  btnSonido.textContent = "🔊";
}

function vibrar(patron) {
  if (!modoSensible && navigator.vibrate) {
    navigator.vibrate(patron);
  } else {
    app.classList.add("vibracionVisual");
    setTimeout(() => app.classList.remove("vibracionVisual"), 300);
  }
}

function flashRapido() {
  if (modoSensible) return;
  flash.style.opacity = 0.32;
  setTimeout(() => { flash.style.opacity = 0; }, 120);
}

function setTexto(t, i, c) {
  titulo.textContent = t;
  instruccion.textContent = i;
  cuento.textContent = c;
}

function mostrar(el, src, left, top, width) {
  el.src = src;
  el.classList.remove("oculto");
  el.style.left = left;
  el.style.top = top;
  el.style.width = width;
  el.style.transform = "translate(-50%,-50%)";
  el.style.opacity = 1;
}

function ocultarTodo() {
  [timo, tronco, pelota, mono, conejo, pajaro, mariposa, luciernagasDibujo].forEach((el) => {
    el.className = el.classList.contains("personaje") ? "personaje oculto" : "capa oculto";
    el.removeAttribute("style");
    if (el.tagName === "IMG") el.src = "";
  });
  ayEco.className = "oculto";
  luciernagasCampo.innerHTML = "";
}

function crearLuciernagas(cantidad = 18, foco = { x: 50, y: 50, radio: 30 }) {
  luciernagasCampo.innerHTML = "";
  for (let i = 0; i < cantidad; i++) {
    const luz = document.createElement("span");
    luz.className = "luciernaga";
    const ang = Math.random() * Math.PI * 2;
    const r = Math.random() * foco.radio;
    luz.style.left = `${foco.x + Math.cos(ang) * r}%`;
    luz.style.top = `${foco.y + Math.sin(ang) * r}%`;
    luz.style.animationDelay = `${Math.random() * 4}s`;
    luz.style.animationDuration = `${3 + Math.random() * 4}s`;
    luciernagasCampo.appendChild(luz);
  }
}

function intensidadLuciernagas(v) {
  luciernagasCampo.style.opacity = v;
  if (!luciernagasDibujo.classList.contains("oculto")) luciernagasDibujo.style.opacity = v;
}

function clima({ os = 0.5, ruidoOp = 0.1, brillo = 1, sat = 1, contraste = 1, color = "transparent", colorOp = 0.2 }) {
  oscuridad.style.opacity = os;
  ruido.style.opacity = ruidoOp;
  fondo.style.filter = `brightness(${brillo}) saturate(${sat}) contrast(${contraste})`;
  cieloColor.style.background = color;
  cieloColor.style.opacity = colorOp;
}

function actualizarBotones() {
  document.querySelectorAll("#menu [data-scene]").forEach((b) => {
    b.classList.toggle("activo", b.dataset.scene === escenaActual);
  });
}

function actualizarAudioPorEscena() {
  if (!sonidoActivo) return;
  bajarTodosLosSonidos();
  if (escenaActual === "portada") audioPortada();
  if (escenaActual === "respira") audioRespira();
  if (escenaActual === "tunel") audioTunel();
  if (escenaActual === "final") audioFinal();
}

function audioPortada() {
  const estres = 1 - progresoPortada;
  const calma = progresoPortada;
  setVol("stressLow", 0.45 * estres);
  setVol("stressHigh", 0.32 * estres);
  setVol("stressNoise", 0.34 * estres);
  setVol("heartbeatFast", 0.58 * estres);
  setVol("tunnelEcho", 0.28 * estres);
  setVol("rollingBall", 0.18 * estres);
  setVol("calmAir", 0.55 * calma);
  setVol("fireflies", 0.12 + 0.45 * calma);
  setVol("softChimes", 0.22 * calma);
  setVol("heartbeatSoft", 0.28 * calma);
}

function audioRespira() {
  const calma = progresoRespira;
  const tension = 1 - calma;
  setVol("heartbeatFast", 0.55 * tension);
  setVol("heartbeatSoft", 0.25 + 0.35 * calma);
  setVol("deepBreath", 0.25 + 0.5 * calma);
  setVol("calmAir", 0.18 + 0.55 * calma);
  setVol("fireflies", 0.2 + 0.35 * calma);
  setVol("butterfly", 0.14 + 0.15 * calma);
}

function audioTunel() {
  const d = distanciaAPelota();
  const cerca = 1 - Math.min(d / 0.55, 1);
  setVol("heartbeatFast", 0.22 + 0.45 * (1 - cerca));
  setVol("heartbeatSoft", 0.35 * cerca);
  setVol("tunnelEcho", 0.58 * (1 - cerca) + 0.15);
  setVol("rollingBall", 0.2 + 0.25 * cerca);
  setVol("calmAir", 0.18 * cerca);
}

function audioFinal() {
  setVol("happyWind", 0.5);
  setVol("forest", 0.5);
  setVol("fireflies", 0.55);
  setVol("softChimes", 0.35);
  setVol("butterfly", 0.22);
  setVol("softLaughs", 0.18);
}

function cargarEscena(nombre) {
  escenaActual = nombre;
  progresoPortada = 0;
  progresoRespira = 0;
  estadoPortada = "oscuro";
  tunelX = 0.04;
  tunelY = 0.55;
  ocultarTodo();
  actualizarBotones();
  spotLuz.style.opacity = 1;
  spotLuz.style.transform = "translate(-50%,-50%)";
  spotLuz.style.left = "50%";
  spotLuz.style.top = "50%";

  if (nombre === "portada") escenaPortada();
  if (nombre === "respira") escenaRespira();
  if (nombre === "tunel") escenaTunel();
  if (nombre === "final") escenaFinal();
  actualizarAudioPorEscena();
}

function escenaPortada(){
  fondo.src = ASSETS.portada.fondo;

  clima({
    os:.94,
    ruidoOp:.32,
    brillo:.42,
    sat:.62,
    contraste:1.15,
    color:"#07111f",
    colorOp:.25
  });

  crearLuciernagas(12,{x:18,y:63,radio:10});

mostrar(luciernagasDibujo, ASSETS.portada.luciernagas, "18%", "63%", "13vw");
  mostrar(timo, ASSETS.portada.bolita, "18%", "63%", "15vw");
  timo.classList.add("temblar");
  mostrar(conejo, ASSETS.portada.conejo, "73%","72%","clamp(60px,10vw,140px)");
  mostrar(pajaro, ASSETS.portada.pajaro, "48%","24%","clamp(40px,8vw,90px)");
  mostrar(mariposa, ASSETS.portada.mariposa, "52%","52%","clamp(30px,6vw,70px)");
  mostrar(pelota, ASSETS.portada.pelota, "58%","72%","clamp(45px,8vw,100px)");

  conejo.style.opacity = ".12";
  pajaro.style.opacity = ".14";
  mariposa.style.opacity = ".16";
  pelota.style.opacity = ".12";

  conejo.style.filter = "brightness(.35) blur(1px)";
  pajaro.style.filter = "brightness(.4) blur(1px)";
  mariposa.style.filter = "brightness(.45) blur(1px)";
  pelota.style.filter = "brightness(.35) blur(1px)";

  spotLuz.style.left = "18%";
  spotLuz.style.top = "63%";
  spotLuz.style.opacity = 1;

  setTexto(
    "",
    "Toca suave",
    "Timo salió al mundo, pero todo se sintió demasiado fuerte."
  );

  vibrar([30,80,30,120]);
}

function tocarPortada() {
  if (estadoPortada !== "oscuro") return;
  estadoPortada = "regular";
  if (!sonidoActivo) encenderSonido();
  vibrar([80, 40, 120]);
  flashRapido();
  timo.classList.remove("temblar");
  timo.classList.add("rodarFuera");
  luciernagasDibujo.style.left = "110%";
  spotLuz.style.left = "110%";
  setTexto("¡Uy!", "Desliza despacio para que Timo vuelva", "Timo se hizo bolita para protegerse. Necesitó que el mundo bajara su intensidad.");
  setVol("stressHigh", 0.22);
  setVol("stressNoise", 0.18);
  setVol("rollingBall", 0.20);
}
function actualizarPortadaConProgreso(){
  const p = progreso;

  clima({
    os:.94 - p*.86,
    ruidoOp:.32 - p*.30,
    brillo:.42 + p*.68,
    sat:.62 + p*.35,
    contraste:1.15 - p*.1,
    color:"#ffb36b",
    colorOp:.08 + p*.18
  });

  intensidadLuciernagas(.35 + p*.45);

  spotLuz.style.left = `${18 + p*19}%`;
  spotLuz.style.top = `${63 - p*3}%`;
  spotLuz.style.transform = `translate(-50%,-50%) scale(${1 + p*.75})`;

  luciernagasDibujo.style.left = `${18 + p*18}%`;
  luciernagasDibujo.style.top = `${63 - p*4}%`;
  luciernagasDibujo.style.width = `${13 + p*5}vw`;

  [mono, conejo, pajaro, mariposa, pelota].forEach(el => {
    el.style.opacity = .12 + p*.88;
    el.style.filter = `brightness(${.35 + p*.75}) blur(${1 - p}px)`;
  });

  if(p > .22 && !timo.classList.contains("volver")){
    timo.classList.remove("rodarFuera");
    timo.classList.add("volver");
  }

  if(p > .95 && estadoPortada !== "calma"){
    timo.classList.remove("volver", "temblar", "rodarFuera");
    timo.src = ASSETS.portada.abierto;
    timo.style.left = "36%";
    timo.style.top = "59%";
    timo.style.width = "19vw";
    timo.style.transform = "translate(-50%,-50%)";

  if(sonidoActivo){
  audioPortada();
}

    setTexto(
      "",
      "Gracias por esperar",
      "Cuando el entorno bajó su intensidad, Timo pudo volver a mirar."
    );

    estadoPortada = "calma";
  }

  audioPortada();
}

function regularPortada(delta) {
  progresoPortada = Math.max(0, Math.min(1, progresoPortada + delta / 2400));
  const p = progresoPortada;
  [conejo, pajaro, mariposa, pelota].forEach(el => {
  el.style.opacity = .12 + p * .88;
  el.style.filter = `brightness(${.35 + p * .75}) blur(${1 - p}px)`;
});
  clima({ os: 0.94 - p * 0.86, ruidoOp: 0.32 - p * 0.30, brillo: 0.42 + p * 0.68, sat: 0.62 + p * 0.35, contraste: 1.15 - p * 0.1, color: "#ffb36b", colorOp: 0.08 + p * 0.18 });
  intensidadLuciernagas(0.35 + p * 0.6);
  spotLuz.style.left = `${18 + p * 19}%`;
  spotLuz.style.top = `${63 - p * 3}%`;
  spotLuz.style.transform = `translate(-50%,-50%) scale(${1 + p * 1.1})`;
  luciernagasDibujo.style.left = `${18 + p * 18}%`;
  luciernagasDibujo.style.top = `${63 - p * 4}%`;
  luciernagasDibujo.style.width = `${24 + p * 7}vw`;

  if (p > 0.42 && !timo.classList.contains("volver")) {
    timo.classList.remove("rodarFuera");
    timo.classList.add("volver");
  }

  if (p > 0.95 && estadoPortada !== "calma") {
    timo.classList.remove("volver", "temblar", "rodarFuera");
    mostrar(timo, ASSETS.portada.abierto, "36%", "59%", "19vw");
    setTexto("", "Gracias por esperar", "Cuando el entorno bajó su intensidad, Timo pudo volver a mirar.");
    estadoPortada = "calma";
  }
  audioPortada();
}

function audioPortada(){
  const p = progreso;
  const estres = 1 - p;
  const calma = p;

  setVol("stressLow", .18 * estres);
  setVol("stressHigh", .10 * estres);
  setVol("stressNoise", .08 * estres);
  setVol("heartbeatFast", .20 * estres);
  setVol("tunnelEcho", .10 * estres);
  setVol("rollingBall", .06 * estres);

  setVol("heartbeatSoft", .08 * calma);
  setVol("calmAir", .22 * calma);
  setVol("fireflies", .16 + .20 * calma);
  setVol("softChimes", .12 * calma);
}

function moverRespira(delta) {
  progresoRespira = Math.max(0, Math.min(1, progresoRespira + Math.abs(delta) / 900));
  const p = progresoRespira;
  const x = 24 + p * 42;
  const y = 62 - p * 6;
  timo.style.left = `${x}%`;
  timo.style.top = `${y}%`;
  timo.style.width = `${28 - p * 4}vw`;
  luciernagasDibujo.style.left = `${x}%`;
  luciernagasDibujo.style.top = `${y - 4}%`;
  mariposa.style.left = `${18 + p * 40}%`;
  mariposa.style.top = `${40 - p * 8}%`;
  pajaro.style.left = `${12 + p * 55}%`;
  pajaro.style.top = `${28 + p * 2}%`;
  spotLuz.style.left = `${x}%`;
  spotLuz.style.top = `${y}%`;
  spotLuz.style.transform = `translate(-50%,-50%) scale(${1 + p * 0.75})`;
  clima({ os: 0.46 - p * 0.34, ruidoOp: 0.12 - p * 0.1, brillo: 0.75 + p * 0.28, sat: 0.78 + p * 0.22, contraste: 1.05 - p * 0.05, color: "#f7c47d", colorOp: 0.18 + p * 0.18 });
  intensidadLuciernagas(0.38 + p * 0.45);
  if (p > 0.88) {
    setTexto("Respira", "Timo se asoma", "El miedo apareció, pero ya no ocupaba todo el espacio.");
  }
  audioRespira();
}

function escenaTunel() {
  fondo.src = ASSETS.tunel.fondo;
  clima({ os: 0.34, ruidoOp: 0.16, brillo: 0.75, sat: 0.82, contraste: 1.12, color: "#de7d4f", colorOp: 0.20 });
  crearLuciernagas(8, { x: 20, y: 64, radio: 12 });
  mostrar(timo, ASSETS.tunel.bolita, "13%", "68%", "12vw");
  mostrar(pelota, ASSETS.tunel.pelota, "82%", "68%", "9vw");
  pelota.classList.add("flotar");
  spotLuz.style.left = "13%";
  spotLuz.style.top = "68%";
  setTexto("El túnel", "Inclina el celular o usa flechas para avanzar", "Lo que parecía un obstáculo, era justo el camino que él entendía mejor.");
  actualizarTimoTunel();
}

function distanciaAPelota() {
  const dx = 0.82 - tunelX;
  const dy = 0.68 - tunelY;
  return Math.sqrt(dx * dx + dy * dy);
}

function actualizarTimoTunel() {
  const x = 10 + tunelX * 80;
  const y = 25 + tunelY * 70;
  timo.style.left = `${x}%`;
  timo.style.top = `${y}%`;
  timo.style.transform = `translate(-50%,-50%) rotate(${tunelX * 720}deg)`;
  spotLuz.style.left = `${x}%`;
  spotLuz.style.top = `${y}%`;
  const d = distanciaAPelota();
  const cerca = 1 - Math.min(d / 0.55, 1);
  clima({ os: 0.34 - cerca * 0.18, ruidoOp: 0.16 - cerca * 0.1, brillo: 0.75 + cerca * 0.23, sat: 0.82 + cerca * 0.18, contraste: 1.12 - cerca * 0.07, color: "#cf6e52", colorOp: 0.22 - cerca * 0.07 });
  intensidadLuciernagas(0.18 + cerca * 0.38);
  if (d < 0.08) {
    playOneShot("ballTap", 0.6);
    vibrar(35);
    setTexto("¡Toc!", "Lo logró a su manera", "La pelota sonó suave dentro del túnel.");
  }
  audioTunel();
}

function golpeTunel() {
  const now = Date.now();
  if (now - ultimoGolpe < 800) return;
  ultimoGolpe = now;
  playOneShot("bump", 0.75);
  vibrar([40, 30, 60]);
  ayEco.className = "";
  setTimeout(() => ayEco.classList.add("oculto"), 1100);
  setVol("heartbeatFast", 0.75);
  setVol("tunnelEcho", 0.7);
}

function moverTunelPorInclinacion(gamma, beta) {
  const oldX = tunelX;
  const oldY = tunelY;
  tunelX += gamma / 2600;
  tunelY += (beta - 45) / 5200;
  if (tunelX < 0 || tunelX > 1 || tunelY < 0.15 || tunelY > 0.9) golpeTunel();
  tunelX = Math.max(0, Math.min(1, tunelX));
  tunelY = Math.max(0.15, Math.min(0.9, tunelY));
  if (Math.abs(oldX - tunelX) + Math.abs(oldY - tunelY) > 0.001) actualizarTimoTunel();
}

function moverTunelDesktop(dx, dy = 0) {
  tunelX += dx;
  tunelY += dy;
  if (tunelX < 0 || tunelX > 1 || tunelY < 0.15 || tunelY > 0.9) golpeTunel();
  tunelX = Math.max(0, Math.min(1, tunelX));
  tunelY = Math.max(0.15, Math.min(0.9, tunelY));
  actualizarTimoTunel();
}

function escenaFinal() {
  fondo.src = ASSETS.final.fondo;
  clima({ os: 0.18, ruidoOp: 0, brillo: 0.78, sat: 1.05, contraste: 1.05, color: "#16264d", colorOp: 0.35 });
  crearLuciernagas(34, { x: 50, y: 55, radio: 45 });
  mostrar(luciernagasDibujo, ASSETS.final.luciernagas, "50%", "56%", "70vw");
  mostrar(timo, ASSETS.final.timo, "30%", "66%", "15vw");
  mostrar(mono, ASSETS.final.mono, "68%", "38%", "18vw");
  mono.classList.add("flotar");
  mostrar(conejo, ASSETS.final.conejo, "18%", "72%", "13vw");
  conejo.classList.add("flotar");
  mostrar(pajaro, ASSETS.final.pajaro, "54%", "24%", "9vw");
  pajaro.classList.add("flotar");
  mostrar(mariposa, ASSETS.final.mariposa, "46%", "50%", "7vw");
  mariposa.classList.add("flotar");
  mostrar(pelota, ASSETS.final.pelota, "58%", "72%", "8vw");
  pelota.classList.add("pelotaInteractiva");
  spotLuz.style.left = "50%";
  spotLuz.style.top = "55%";
  spotLuz.style.transform = "translate(-50%,-50%) scale(2.6)";
  intensidadLuciernagas(0.9);
  setTexto("Todos jugamos", "Toca la pelota para lanzarla", "No todos nos movemos igual… pero todos merecemos jugar.");
  audioFinal();
}

function lanzarPelota() {
  if (escenaActual !== "final") return;
  pelota.classList.remove("saltarPelota");
  void pelota.offsetWidth;
  pelota.classList.add("saltarPelota");
  playOneShot("playBall", 0.75);
  playOneShot("softLaughs", 0.35);
  setVol("happyWind", 0.65);
  vibrar(35);
  setTexto("¡La lanzaste!", "Toca otra vez la pelota", "Ahora tú también juegas con Timo.");
}

function manejarTapGlobal(e) {
  if (e.target.closest("#menu")) return;
  if (e.target === pelota && escenaActual === "final") return;
  if (!sonidoActivo) encenderSonido();
  if (escenaActual === "portada" && estadoPortada === "oscuro") tocarPortada();
  if (escenaActual === "final") {
    intensidadLuciernagas(1);
    setTimeout(() => intensidadLuciernagas(0.9), 500);
  }
}

window.addEventListener("pointerdown", (e) => {
  pointerActivo = true;
  startX = e.clientX;
  startY = e.clientY;
  ultimaX = e.clientX;
  ultimaY = e.clientY;
});

window.addEventListener("pointerup", () => {
  pointerActivo = false;
});

window.addEventListener("pointercancel", () => {
  pointerActivo = false;
});

window.addEventListener("pointermove", (e) => {
  if (!pointerActivo) return;
  const dx = e.clientX - ultimaX;
  const dy = ultimaY - e.clientY;
  ultimaX = e.clientX;
  ultimaY = e.clientY;

  if (escenaActual === "portada" && estadoPortada === "regular" && Math.abs(dy) > 1) {
    regularPortada(Math.max(dy, 0));
  }

  if (escenaActual === "respira" && Math.abs(dy) > 1) {
    moverRespira(Math.abs(dy));
  }

  if (escenaActual === "tunel") {
    moverTunelDesktop(dx / 900, -dy / 1200);
  }
});

window.addEventListener("wheel", (e) => {
  const delta = -e.deltaY;
  if (escenaActual === "portada" && estadoPortada === "regular") regularPortada(Math.max(delta, 0));
  if (escenaActual === "respira") moverRespira(Math.abs(delta));
});

window.addEventListener("click", manejarTapGlobal);

window.addEventListener("deviceorientation", (e) => {
  if (escenaActual === "tunel") moverTunelPorInclinacion(e.gamma || 0, e.beta || 45);
});

window.addEventListener("keydown", (e) => {
  if (e.key === "1") cargarEscena("portada");
  if (e.key === "2") cargarEscena("respira");
  if (e.key === "3") cargarEscena("tunel");
  if (e.key === "4") cargarEscena("final");
  if (e.code === "Space") manejarTapGlobal({ target: document.body });

  if (escenaActual === "tunel") {
    if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") moverTunelDesktop(0.035, 0);
    if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") moverTunelDesktop(-0.035, 0);
    if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") moverTunelDesktop(0, -0.025);
    if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") moverTunelDesktop(0, 0.025);
  }
});

pelota.addEventListener("pointerdown", (e) => {
  e.stopPropagation();
  if (!sonidoActivo) encenderSonido();
  lanzarPelota();
});

document.querySelectorAll("#menu [data-scene]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!sonidoActivo) encenderSonido();
    cargarEscena(btn.dataset.scene);
  });
});

btnSonido.addEventListener("click", (e) => {
  e.stopPropagation();
  sonidoActivo ? apagarSonido() : encenderSonido();
});

btnSensible.addEventListener("click", (e) => {
  e.stopPropagation();
  modoSensible = !modoSensible;
  app.classList.toggle("modoSensible", modoSensible);
  btnSensible.classList.toggle("activo", modoSensible);
  actualizarAudioPorEscena();
});

cargarEscena("portada");
