/* TIMO interactivo sensorial
   Ajusta los nombres de archivos en ASSETS si tus PNG/MP3 se llaman diferente.
*/
const ASSETS = {
  portada: {
    fondo: "assets/portada/fondo_color.png",
    bolita: "assets/portada/timo_bolita.png",
    abierto: "assets/portada/timo_open.png",
    luciernagas: "assets/portada/luciernagas.png"
  },
  respira: {
    fondo: "assets/respira/fondo_color.png",
    timoTronco: "assets/respira/timo_tronco.png",
    tronco: "assets/respira/tronco.png",
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

const $ = id => document.getElementById(id);
const app = $("app"), fondo = $("fondo"), cieloColor = $("cieloColor"), oscuridad = $("oscuridad"), spotLuz = $("spotLuz"), ruido = $("ruido"), flash = $("flash"), luciernagasCampo = $("luciernagasCampo"), luciernagasDibujo = $("luciernagasDibujo"), timo = $("timo"), tronco = $("tronco"), pelota = $("pelota"), mono = $("mono"), conejo = $("conejo"), pajaro = $("pajaro"), mariposa = $("mariposa"), ayEco = $("ayEco"), titulo = $("titulo"), instruccion = $("instruccion"), cuento = $("cuento"), btnSonido = $("btnSonido"), btnSensible = $("btnSensible"), avisoAudio = $("avisoAudio");

let escenaActual = "portada";
let sonidoActivo = false;
let modoSensible = false;
let estadoPortada = "oscuro";
let progreso = 0;
let startX = null, startY = null;
let respiraProgreso = 0;
let tunelX = 0.04, tunelY = 0.55;
let ultimoGolpe = 0;

const sonidos = {};
Object.entries(SOUND_PATHS).forEach(([key, path]) => {
  sonidos[key] = new Audio(path);
  sonidos[key].loop = !["bump", "ballTap"].includes(key);
  sonidos[key].volume = 0;
});

function setVol(name, value){
  if(!sonidos[name]) return;
  sonidos[name].volume = Math.max(0, Math.min(modoSensible ? value * .45 : value, 1));
}
function bajarTodosLosSonidos(){Object.keys(sonidos).forEach(k => setVol(k,0));}
function playOneShot(name, vol=.6){
  if(!sonidoActivo || !sonidos[name]) return;
  const s = sonidos[name];
  s.currentTime = 0;
  s.volume = modoSensible ? vol*.45 : vol;
  s.play().catch(()=>{});
}
function encenderSonido(){
  sonidoActivo = true;
  Object.values(sonidos).forEach(s => s.play().catch(()=>{}));
  btnSonido.textContent = "🔇";
  avisoAudio.style.opacity = 0;
  setTimeout(()=> avisoAudio.classList.add("oculto"), 600);
  actualizarAudioPorEscena();
}
function apagarSonido(){
  sonidoActivo = false;
  Object.values(sonidos).forEach(s => {s.pause(); s.currentTime = 0; s.volume = 0;});
  btnSonido.textContent = "🔊";
}
function vibrar(patron){ if(!modoSensible && navigator.vibrate) navigator.vibrate(patron); }
function flashRapido(){ if(modoSensible) return; flash.style.opacity=.32; setTimeout(()=>flash.style.opacity=0,120); }
function setTexto(t,i,c){titulo.textContent=t; instruccion.textContent=i; cuento.textContent=c;}
function mostrar(el, src, left, top, width){el.src=src; el.classList.remove("oculto"); el.style.left=left; el.style.top=top; el.style.width=width; el.style.transform="translate(-50%,-50%)"; el.style.opacity=1;}
function ocultarTodo(){
  [timo,tronco,pelota,mono,conejo,pajaro,mariposa,luciernagasDibujo,ayEco].forEach(el=>{
    el.className = el.classList.contains("personaje") ? "personaje oculto" : "capa oculto";
    el.removeAttribute("style");
    if(el.tagName === "IMG") el.src="";
  });
  luciernagasCampo.innerHTML="";
}
function crearLuciernagas(cantidad=18, foco={x:50,y:50,radio:30}){
  luciernagasCampo.innerHTML="";
  for(let i=0;i<cantidad;i++){
    const luz=document.createElement("span");
    luz.className="luciernaga";
    const ang=Math.random()*Math.PI*2;
    const r=Math.random()*foco.radio;
    luz.style.left=`${foco.x + Math.cos(ang)*r}%`;
    luz.style.top=`${foco.y + Math.sin(ang)*r}%`;
    luz.style.animationDelay=`${Math.random()*4}s`;
    luz.style.animationDuration=`${3+Math.random()*4}s`;
    luciernagasCampo.appendChild(luz);
  }
}
function intensidadLuciernagas(v){luciernagasCampo.style.opacity=v; luciernagasDibujo.style.opacity=v;}
function clima({os=.5, ruidoOp=.1, brillo=1, sat=1, contraste=1, color="transparent", colorOp=.2}){
  oscuridad.style.opacity=os;
  ruido.style.opacity=ruidoOp;
  fondo.style.filter=`brightness(${brillo}) saturate(${sat}) contrast(${contraste})`;
  cieloColor.style.background=color;
  cieloColor.style.opacity=colorOp;
}
function actualizarBotones(){document.querySelectorAll("#menu [data-scene]").forEach(b=>b.classList.toggle("activo", b.dataset.scene===escenaActual));}

function actualizarAudioPorEscena(){
  if(!sonidoActivo) return;
  bajarTodosLosSonidos();
  if(escenaActual === "portada") audioPortada();
  if(escenaActual === "respira") audioRespira();
  if(escenaActual === "tunel") audioTunel();
  if(escenaActual === "final") audioFinal();
}
function audioPortada(){
  const estres = 1 - progreso, calma = progreso;
  setVol("stressLow", .45*estres); setVol("stressHigh", .32*estres); setVol("stressNoise", .34*estres);
  setVol("heartbeatFast", .58*estres); setVol("tunnelEcho", .28*estres); setVol("rollingBall", .18*estres);
  setVol("calmAir", .55*calma); setVol("fireflies", .12 + .45*calma); setVol("softChimes", .22*calma); setVol("heartbeatSoft", .28*calma);
}
function audioRespira(){
  const calma = respiraProgreso, tension = 1-calma;
  setVol("heartbeatFast", .55*tension); setVol("heartbeatSoft", .25 + .35*calma); setVol("deepBreath", .25 + .5*calma);
  setVol("calmAir", .18 + .55*calma); setVol("fireflies", .2 + .35*calma); setVol("butterfly", .14 + .15*calma);
}
function audioTunel(){
  const d = distanciaAPelota(); const cerca = 1 - Math.min(d/.55,1);
  setVol("heartbeatFast", .22 + .45*(1-cerca)); setVol("heartbeatSoft", .35*cerca);
  setVol("tunnelEcho", .58*(1-cerca)+.15); setVol("rollingBall", .2 + .25*cerca); setVol("calmAir", .18*cerca);
}
function audioFinal(){
  setVol("happyWind", .5); setVol("forest", .5); setVol("fireflies", .55); setVol("softChimes", .35); setVol("butterfly", .22); setVol("playBall", .25); setVol("softLaughs", .18);
}

function cargarEscena(nombre){
  escenaActual=nombre; progreso=0; respiraProgreso=0; estadoPortada="oscuro"; tunelX=.04; tunelY=.55;
  ocultarTodo(); actualizarBotones();
  spotLuz.style.opacity=1; spotLuz.style.transform="translate(-50%,-50%)";
  if(nombre==="portada") escenaPortada();
  if(nombre==="respira") escenaRespira();
  if(nombre==="tunel") escenaTunel();
  if(nombre==="final") escenaFinal();
  actualizarAudioPorEscena();
}

function escenaPortada(){
  fondo.src=ASSETS.portada.fondo;
  clima({os:.94, ruidoOp:.32, brillo:.42, sat:.62, contraste:1.15, color:"#07111f", colorOp:.25});
  crearLuciernagas(12,{x:18,y:63,radio:10});
  mostrar(luciernagasDibujo, ASSETS.portada.luciernagas, "18%", "63%", "24vw");
  mostrar(timo, ASSETS.portada.bolita, "18%", "63%", "15vw");
  timo.classList.add("temblar");
  spotLuz.style.left="18%"; spotLuz.style.top="63%"; spotLuz.style.opacity=1;
  setTexto("", "Toca suave", "Timo salió al mundo, pero todo se sintió demasiado fuerte.");
  vibrar([30,80,30,120]);
}
function tocarPortada(){
  estadoPortada="asustado"; if(!sonidoActivo) encenderSonido(); vibrar([80,40,120]); flashRapido();
  setVol("stressHigh", .7); setVol("stressNoise", .6); setVol("rollingBall", .62);
  timo.classList.remove("temblar"); timo.classList.add("rodarFuera");
  luciernagasDibujo.style.left="110%"; spotLuz.style.left="110%";
  setTexto("¡Uy!", "Desliza despacio", "Timo se hizo bolita para protegerse.");
  setTimeout(()=>estadoPortada="regular", 900);
}
function regularPortada(delta){
  progreso = Math.min(1, progreso + delta/1200);
  const p=progreso;
  clima({os:.94 - p*.86, ruidoOp:.32 - p*.30, brillo:.42 + p*.68, sat:.62+p*.35, contraste:1.15-p*.1, color:"#ffb36b", colorOp:.08+p*.18});
  intensidadLuciernagas(.35+p*.6);
  spotLuz.style.left=`${18+p*19}%`; spotLuz.style.top=`${63-p*3}%`; spotLuz.style.transform=`translate(-50%,-50%) scale(${1+p*1.1})`;
  luciernagasDibujo.style.left=`${18+p*18}%`; luciernagasDibujo.style.top=`${63-p*4}%`; luciernagasDibujo.style.width=`${24+p*7}vw`;
  if(p>.22 && !timo.classList.contains("volver")){timo.classList.remove("rodarFuera"); timo.classList.add("volver");}
  if(p>.95){
    timo.src=ASSETS.portada.abierto; timo.classList.remove("volver"); mostrar(timo, ASSETS.portada.abierto, "36%", "59%", "19vw");
    setTexto("", "Gracias por esperar", "Cuando el entorno bajó su intensidad, Timo pudo volver a mirar.");
    estadoPortada="calma";
  }
  audioPortada();
}

function escenaRespira(){
  fondo.src=ASSETS.respira.fondo;
  clima({os:.46, ruidoOp:.12, brillo:.75, sat:.78, contraste:1.05, color:"#f0b67a", colorOp:.18});
  crearLuciernagas(16,{x:33,y:62,radio:18});
  mostrar(timo, ASSETS.respira.timoTronco, "24%", "62%", "28vw");
  timo.classList.add("balancito");
  mostrar(mariposa, ASSETS.respira.mariposa, "18%", "40%", "7vw"); mariposa.classList.add("flotar");
  mostrar(pajaro, ASSETS.respira.pajaro, "12%", "28%", "9vw"); pajaro.classList.add("flotar");
  mostrar(luciernagasDibujo, ASSETS.respira.luciernagas, "25%", "58%", "24vw");
  spotLuz.style.left="24%"; spotLuz.style.top="62%";
  setTexto("Respira", "Desliza lento con Timo", "El tronco era su apoyo. Con él, el mundo empezó a sentirse más seguro.");
}
function moverRespira(delta){
  respiraProgreso=Math.min(1, respiraProgreso+delta/1300);
  const p=respiraProgreso;
  const x=24+p*42, y=62-p*6;
  timo.style.left=`${x}%`; timo.style.top=`${y}%`; timo.style.width=`${28-p*4}vw`;
  luciernagasDibujo.style.left=`${x}%`; luciernagasDibujo.style.top=`${y-4}%`;
  mariposa.style.left=`${18+p*40}%`; mariposa.style.top=`${40-p*8}%`;
  pajaro.style.left=`${12+p*55}%`; pajaro.style.top=`${28+p*2}%`;
  spotLuz.style.left=`${x}%`; spotLuz.style.top=`${y}%`; spotLuz.style.transform=`translate(-50%,-50%) scale(${1+p*.75})`;
  clima({os:.46-p*.34, ruidoOp:.12-p*.1, brillo:.75+p*.28, sat:.78+p*.22, contraste:1.05-p*.05, color:"#f7c47d", colorOp:.18+p*.18});
  intensidadLuciernagas(.38+p*.45);
  if(p>.88){setTexto("Respira", "Timo se asoma", "El miedo apareció, pero ya no ocupaba todo el espacio.");}
  audioRespira();
}

function escenaTunel(){
  fondo.src=ASSETS.tunel.fondo;
  clima({os:.34, ruidoOp:.16, brillo:.75, sat:.82, contraste:1.12, color:"#de7d4f", colorOp:.20});
  crearLuciernagas(8,{x:20,y:64,radio:12});
  mostrar(timo, ASSETS.tunel.bolita, "13%", "68%", "12vw");
  mostrar(pelota, ASSETS.tunel.pelota, "82%", "68%", "9vw"); pelota.classList.add("flotar");
  spotLuz.style.left="13%"; spotLuz.style.top="68%";
  setTexto("El túnel", "Inclina el celular para avanzar", "Lo que parecía un obstáculo, era justo el camino que él entendía mejor.");
  actualizarTimoTunel();
}
function distanciaAPelota(){const dx=.82-tunelX, dy=.68-tunelY; return Math.sqrt(dx*dx+dy*dy);}
function actualizarTimoTunel(){
  const x=10+tunelX*80, y=25+tunelY*70;
  timo.style.left=`${x}%`; timo.style.top=`${y}%`; timo.style.transform=`translate(-50%,-50%) rotate(${tunelX*720}deg)`;
  spotLuz.style.left=`${x}%`; spotLuz.style.top=`${y}%`;
  const d=distanciaAPelota(), cerca=1-Math.min(d/.55,1);
  clima({os:.34-cerca*.18, ruidoOp:.16-cerca*.1, brillo:.75+cerca*.23, sat:.82+cerca*.18, contraste:1.12-cerca*.07, color:"#cf6e52", colorOp:.22-cerca*.07});
  intensidadLuciernagas(.18+cerca*.38);
  if(d<.08){playOneShot("ballTap",.6); vibrar(35); setTexto("¡Toc!", "Lo logró a su manera", "La pelota sonó suave dentro del túnel.");}
  audioTunel();
}
function golpeTunel(){
  const now=Date.now(); if(now-ultimoGolpe<800) return; ultimoGolpe=now;
  playOneShot("bump",.75); vibrar([40,30,60]); ayEco.className=""; setTimeout(()=>ayEco.classList.add("oculto"),1100);
  setVol("heartbeatFast",.75); setVol("tunnelEcho",.7);
}
function moverTunelPorInclinacion(gamma,beta){
  const oldX=tunelX, oldY=tunelY;
  tunelX += gamma/2600; tunelY += (beta-45)/5200;
  if(tunelX<0 || tunelX>1 || tunelY<.15 || tunelY>.9) golpeTunel();
  tunelX=Math.max(0,Math.min(1,tunelX)); tunelY=Math.max(.15,Math.min(.9,tunelY));
  if(Math.abs(oldX-tunelX)+Math.abs(oldY-tunelY)>.001) actualizarTimoTunel();
}

function escenaFinal(){
  fondo.src=ASSETS.final.fondo;
  clima({os:.18, ruidoOp:0, brillo:.78, sat:1.05, contraste:1.05, color:"#16264d", colorOp:.35});
  crearLuciernagas(34,{x:50,y:55,radio:45});
  mostrar(luciernagasDibujo, ASSETS.final.luciernagas, "50%", "56%", "70vw");
  mostrar(timo, ASSETS.final.timo, "30%", "66%", "15vw");
  mostrar(mono, ASSETS.final.mono, "68%", "38%", "18vw"); mono.classList.add("flotar");
  mostrar(conejo, ASSETS.final.conejo, "18%", "72%", "13vw"); conejo.classList.add("flotar");
  mostrar(pajaro, ASSETS.final.pajaro, "54%", "24%", "9vw"); pajaro.classList.add("flotar");
  mostrar(mariposa, ASSETS.final.mariposa, "46%", "50%", "7vw"); mariposa.classList.add("flotar");
  mostrar(pelota, ASSETS.final.pelota, "58%", "72%", "9vw"); pelota.classList.add("pelotaVuelo");
  spotLuz.style.left="50%"; spotLuz.style.top="55%"; spotLuz.style.transform="translate(-50%,-50%) scale(2.6)";
  intensidadLuciernagas(.9);
  setTexto("Todos jugamos", "Toca para celebrar", "No todos nos movemos igual… pero todos merecemos jugar.");
  audioFinal();
}

window.addEventListener("click", e=>{
  if(e.target.closest("#menu")) return;
  if(!sonidoActivo) encenderSonido();
  if(escenaActual==="portada" && estadoPortada==="oscuro") tocarPortada();
  else if(escenaActual==="final"){playOneShot("playBall",.55); playOneShot("softLaughs",.35); vibrar(30); intensidadLuciernagas(1); setTimeout(()=>intensidadLuciernagas(.9),500);}
});
window.addEventListener("touchstart", e=>{startX=e.touches[0].clientX; startY=e.touches[0].clientY; if(!sonidoActivo) encenderSonido();},{passive:true});
window.addEventListener("touchmove", e=>{
  const x=e.touches[0].clientX, y=e.touches[0].clientY;
  const dy=startY-y;
  if(escenaActual==="portada" && estadoPortada==="regular" && dy>0) regularPortada(dy);
  if(escenaActual==="respira" && Math.abs(dy)>0) moverRespira(Math.abs(dy));
  if(escenaActual==="tunel") { tunelX += (x-startX)/6000; tunelY += (y-startY)/5000; actualizarTimoTunel(); }
  startX=x; startY=y;
},{passive:true});
window.addEventListener("deviceorientation", e=>{ if(escenaActual==="tunel") moverTunelPorInclinacion(e.gamma||0, e.beta||45); });

document.querySelectorAll("#menu [data-scene]").forEach(btn=>btn.addEventListener("click",()=>{if(!sonidoActivo) encenderSonido(); cargarEscena(btn.dataset.scene);}));
btnSonido.addEventListener("click", e=>{e.stopPropagation(); sonidoActivo ? apagarSonido() : encenderSonido();});
btnSensible.addEventListener("click", e=>{e.stopPropagation(); modoSensible=!modoSensible; app.classList.toggle("modoSensible",modoSensible); btnSensible.classList.toggle("activo",modoSensible); actualizarAudioPorEscena();});

cargarEscena("portada");

/* =========================
   MODO PRUEBA COMPUTADOR
   ========================= */

let modoDesktop = !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
let mouseActivo = false;
let mouseY = 0;

function vibrarVisual(){
  document.body.classList.add("vibracionVisual");
  setTimeout(() => {
    document.body.classList.remove("vibracionVisual");
  }, 300);
}

/* Reemplazo visual si no hay vibración física */
function vibrarSeguro(patron){
  if(navigator.vibrate){
    navigator.vibrate(patron);
  }else{
    vibrarVisual();
  }
}

/* Mouse: simula deslizamiento vertical */
window.addEventListener("mousedown", e => {
  mouseActivo = true;
  mouseY = e.clientY;

  if(!sonidoActivo){
    encenderSonido();
  }
});

window.addEventListener("mouseup", () => {
  mouseActivo = false;
});

window.addEventListener("mousemove", e => {
  if(!modoDesktop || !mouseActivo) return;

  const diferencia = mouseY - e.clientY;
  mouseY = e.clientY;

  if(Math.abs(diferencia) < 3) return;

  if(escenaActual === "portada" && estadoPortada === "regular"){
    progreso += diferencia / 1000;
    progreso = Math.max(0, Math.min(1, progreso));
    actualizarPortadaConProgreso();
  }

  if(escenaActual === "respira"){
    progreso += diferencia / 1000;
    progreso = Math.max(0, Math.min(1, progreso));
    actualizarRespiraConProgreso();
  }
});

/* Rueda del mouse: simula deslizar */
window.addEventListener("wheel", e => {
  if(!modoDesktop) return;

  const delta = -e.deltaY / 900;

  if(escenaActual === "portada" && estadoPortada === "regular"){
    progreso += delta;
    progreso = Math.max(0, Math.min(1, progreso));
    actualizarPortadaConProgreso();
  }

  if(escenaActual === "respira"){
    progreso += delta;
    progreso = Math.max(0, Math.min(1, progreso));
    actualizarRespiraConProgreso();
  }
});

/* Teclado:
   1-4 cambia escenas
   espacio = tap
   flechas / A-D = inclinación túnel
*/
window.addEventListener("keydown", e => {

  if(e.key === "1") cargarEscena("portada");
  if(e.key === "2") cargarEscena("respira");
  if(e.key === "3") cargarEscena("tunel");
  if(e.key === "4") cargarEscena("final");

  if(e.code === "Space"){
    window.dispatchEvent(new Event("click"));
  }

  if(escenaActual === "tunel"){
    if(e.key === "ArrowRight" || e.key.toLowerCase() === "d"){
      moverTunelDesktop(.06);
    }

    if(e.key === "ArrowLeft" || e.key.toLowerCase() === "a"){
      moverTunelDesktop(-.06);
    }

    if(e.key === "ArrowUp" || e.key.toLowerCase() === "w"){
      moverTunelDesktop(.04);
    }

    if(e.key === "ArrowDown" || e.key.toLowerCase() === "s"){
      moverTunelDesktop(-.04);
    }
  }
});

function moverTunelDesktop(valor){
  tunelProgreso += valor;
  tunelProgreso = Math.max(0, Math.min(1, tunelProgreso));
  moverTunel(tunelProgreso);

  if(valor < 0){
    golpeTunel();
  }
}
