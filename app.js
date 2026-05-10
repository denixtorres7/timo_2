const fondo = document.getElementById("fondo");
const oscuridad = document.getElementById("oscuridad");
const ruido = document.getElementById("ruido");
const flash = document.getElementById("flash");
const luciernagas = document.getElementById("luciernagas");

const timo = document.getElementById("timo");
const pelota = document.getElementById("pelota");
const mono = document.getElementById("mono");
const conejo = document.getElementById("conejo");
const pajaro = document.getElementById("pajaro");
const mariposa = document.getElementById("mariposa");

const titulo = document.getElementById("titulo");
const instruccion = document.getElementById("instruccion");
const cuento = document.getElementById("cuento");
const btnSonido = document.getElementById("btnSonido");

let escenaActual = "portada";
let progreso = 0;
let sonidoActivo = false;
let estadoPortada = "oscuro";
let startY = null;
let tunelProgreso = 0;
let respirando = false;

/* SONIDOS */

const sonidos = {
  stressLow: new Audio("sounds/stress_low.mp3"),
  stressHigh: new Audio("sounds/stress_high.mp3"),
  stressNoise: new Audio("sounds/stress_noise.mp3"),

  heartbeatFast: new Audio("sounds/heartbeat_fast.mp3"),
  heartbeatSoft: new Audio("sounds/heartbeat_soft.mp3"),

  tunnelEcho: new Audio("sounds/tunnel_echo.mp3"),
  rollingBall: new Audio("sounds/rolling_ball.mp3"),

  calmAir: new Audio("sounds/calm_air.mp3"),
  deepBreath: new Audio("sounds/deep_breath.mp3"),

  fireflies: new Audio("sounds/fireflies_soft.mp3"),
  softChimes: new Audio("sounds/soft_chimes.mp3"),
  happyWind: new Audio("sounds/happy_wind.mp3"),

  butterfly: new Audio("sounds/butterfly_flutter.mp3"),
  playBall: new Audio("sounds/play_ball.mp3"),
  softLaughs: new Audio("sounds/soft_laughs.mp3")
};

Object.values(sonidos).forEach(s => {
  s.loop = true;
  s.volume = 0;
});

/* LUCIÉRNAGAS */

function crearLuciernagas(cantidad = 18){
  luciernagas.innerHTML = "";

  for(let i = 0; i < cantidad; i++){
    const luz = document.createElement("span");
    luz.classList.add("luciernaga");

    luz.style.left = `${15 + Math.random() * 70}%`;
    luz.style.top = `${20 + Math.random() * 65}%`;
    luz.style.animationDelay = `${Math.random() * 4}s`;
    luz.style.animationDuration = `${3 + Math.random() * 4}s`;

    luciernagas.appendChild(luz);
  }
}

function intensidadLuciernagas(valor){
  luciernagas.style.opacity = valor;
}

/* SONIDO */

function encenderSonido(){
  sonidoActivo = true;

  Object.values(sonidos).forEach(s => {
    s.play().catch(()=>{});
  });

  btnSonido.setAttribute("data-tooltip", "Apagar sonido");
  actualizarAudioPorEscena();
}

function apagarSonido(){
  sonidoActivo = false;

  Object.values(sonidos).forEach(s => {
    s.pause();
    s.currentTime = 0;
    s.volume = 0;
  });

  btnSonido.setAttribute("data-tooltip", "Encender sonido");
}

btnSonido.addEventListener("click", event => {
  event.stopPropagation();

  if(sonidoActivo){
    apagarSonido();
  }else{
    encenderSonido();
  }
});

/* UTILIDADES */

function limpiarPersonajes(){
  [timo, pelota, mono, conejo, pajaro, mariposa].forEach(p => {
    p.className = "personaje oculto";
    p.style.left = "";
    p.style.top = "";
    p.style.width = "";
    p.style.transform = "";
    p.src = "";
  });
}

function setTexto(t, i, c){
  titulo.textContent = t;
  instruccion.textContent = i;
  cuento.textContent = c;
}

function vibrar(patron){
  if(navigator.vibrate){
    navigator.vibrate(patron);
  }
}

function flashRapido(){
  flash.style.opacity = .35;

  setTimeout(() => {
    flash.style.opacity = 0;
  }, 120);
}

function bajarTodosLosSonidos(){
  Object.values(sonidos).forEach(s => {
    s.volume = 0;
  });
}

/* LUZ NARRATIVA */

function setLuzNarrativa(tipo){
  if(tipo === "penumbra"){
    fondo.style.filter = "brightness(.45) saturate(.6) contrast(1.1)";
    oscuridad.style.opacity = .72;
    ruido.style.opacity = .35;
    intensidadLuciernagas(.25);
  }

  if(tipo === "tunel"){
    fondo.style.filter = "brightness(.55) saturate(.55) contrast(1.25)";
    oscuridad.style.opacity = .45;
    ruido.style.opacity = .22;
    intensidadLuciernagas(.12);
  }

  if(tipo === "respiracion"){
    fondo.style.filter = "brightness(.85) saturate(.8) contrast(1)";
    oscuridad.style.opacity = .18;
    ruido.style.opacity = .06;
    intensidadLuciernagas(.25);
  }

  if(tipo === "dia"){
    fondo.style.filter = "brightness(1.08) saturate(1.05) contrast(1)";
    oscuridad.style.opacity = 0;
    ruido.style.opacity = 0;
    intensidadLuciernagas(.65);
  }
}

/* AUDIO POR ESCENA */

function actualizarAudioPorEscena(){
  if(!sonidoActivo) return;

  bajarTodosLosSonidos();

  if(escenaActual === "portada"){
    sonidos.stressLow.volume = .45;
    sonidos.stressHigh.volume = .15;
    sonidos.stressNoise.volume = .25;
    sonidos.heartbeatFast.volume = .55;
    sonidos.tunnelEcho.volume = .35;
    sonidos.fireflies.volume = .08;
  }

  if(escenaActual === "tunel"){
    sonidos.tunnelEcho.volume = .55;
    sonidos.rollingBall.volume = .22;
    sonidos.stressLow.volume = .25;
    sonidos.calmAir.volume = .12;
  }

  if(escenaActual === "respiracion"){
    sonidos.heartbeatSoft.volume = .35;
    sonidos.deepBreath.volume = .55;
    sonidos.calmAir.volume = .65;
    sonidos.softChimes.volume = .18;
  }

  if(escenaActual === "final"){
    sonidos.happyWind.volume = .55;
    sonidos.fireflies.volume = .4;
    sonidos.softChimes.volume = .35;
    sonidos.butterfly.volume = .18;
    sonidos.playBall.volume = .22;
    sonidos.softLaughs.volume = .16;
  }
}

/* AUDIO PORTADA */

function regularAudioPortada(){
  if(!sonidoActivo) return;

  const estres = 1 - progreso;
  const calma = progreso;

  sonidos.stressLow.volume = estres * .45;
  sonidos.stressHigh.volume = estres * .35;
  sonidos.stressNoise.volume = estres * .35;

  sonidos.heartbeatFast.volume = estres * .55;
  sonidos.tunnelEcho.volume = estres * .35;
  sonidos.rollingBall.volume = estres * .2;

  sonidos.heartbeatSoft.volume = calma * .35;
  sonidos.calmAir.volume = calma * .65;
  sonidos.fireflies.volume = .08 + calma * .45;
  sonidos.softChimes.volume = calma * .25;
}

/* CARGA DE ESCENAS */

function cargarEscena(nombre){
  escenaActual = nombre;
  progreso = 0;
  estadoPortada = "oscuro";
  tunelProgreso = 0;
  respirando = false;

  limpiarPersonajes();
  fondo.style.filter = "";

  if(nombre === "portada"){
    portada();
  }

  if(nombre === "tunel"){
    tunel();
  }

  if(nombre === "respiracion"){
    respiracion();
  }

  if(nombre === "final"){
    finalEscena();
  }

  actualizarAudioPorEscena();
}

/* PORTADA */

function portada(){
  fondo.src = "assets/portada/portada_fondo.png";

  crearLuciernagas(18);
  setLuzNarrativa("penumbra");

  timo.classList.remove("oculto");
  timo.src = "assets/portada/timo_roll.png";
  timo.style.left = "18%";
  timo.style.top = "58%";
  timo.style.width = "20vw";
  timo.classList.add("temblar");

  setTexto(
    "Todo se siente fuerte",
    "Toca suave",
    "Timo era un armadillo que observaba todo con cuidado."
  );
}

/* TÚNEL */

function tunel(){
  fondo.src = "assets/tunel/fondo.png";

  crearLuciernagas(8);
  setLuzNarrativa("tunel");

  timo.classList.remove("oculto");
  timo.src = "assets/tunel/timo.png";
  timo.style.left = "20%";
  timo.style.top = "62%";
  timo.style.width = "18vw";

  pelota.classList.remove("oculto");
  pelota.src = "assets/tunel/pelota.png";
  pelota.style.left = "68%";
  pelota.style.top = "54%";
  pelota.style.width = "8vw";
  pelota.classList.add("flotar");

  setTexto(
    "El túnel",
    "Desliza o inclina",
    "La pelota cayó en un túnel estrecho, demasiado pequeño para algunos… pero no para todos."
  );
}

/* MOVER TÚNEL */

function moverTunel(valor){
  const xTimo = 20 + valor * 42;
  const yTimo = 62 - valor * 14;

  timo.style.left = `${xTimo}%`;
  timo.style.top = `${yTimo}%`;
  timo.style.transform = `rotate(${valor * 360}deg)`;

  pelota.style.left = `${68 - valor * 8}%`;
  pelota.style.top = `${54 + valor * 8}%`;

  oscuridad.style.opacity = .45 - valor * .22;
  ruido.style.opacity = .22 - valor * .16;
  intensidadLuciernagas(.12 + valor * .35);

  if(sonidoActivo){
    sonidos.tunnelEcho.volume = .55 - valor * .25;
    sonidos.rollingBall.volume = .22 + valor * .25;
    sonidos.calmAir.volume = .12 + valor * .25;
  }

  if(valor > .95){
    setTexto(
      "Lo logró",
      "Avanzó a su manera",
      "Lo que parecía un obstáculo, era justo el camino que él entendía mejor."
    );
  }
}

/* RESPIRACIÓN */

function respiracion(){
  fondo.src = "assets/respiracion/fondo.png";

  crearLuciernagas(14);
  setLuzNarrativa("respiracion");

  timo.classList.remove("oculto");
  timo.src = "assets/respiracion/timo.png";
  timo.style.left = "50%";
  timo.style.top = "58%";
  timo.style.width = "22vw";

  setTexto(
    "Respira",
    "Toca para respirar",
    "Respiró profundo y escuchó su propio ritmo."
  );
}

/* FINAL */

function finalEscena(){
  fondo.src = "assets/final/fondo.png";

  crearLuciernagas(26);
  setLuzNarrativa("dia");

  timo.classList.remove("oculto");
  timo.src = "assets/final/timo.png";
  timo.style.left = "28%";
  timo.style.top = "62%";
  timo.style.width = "16vw";

  mono.classList.remove("oculto");
  mono.src = "assets/final/mono.png";
  mono.style.left = "66%";
  mono.style.top = "45%";
  mono.style.width = "18vw";
  mono.classList.add("flotar");

  conejo.classList.remove("oculto");
  conejo.src = "assets/final/conejo.png";
  conejo.style.left = "76%";
  conejo.style.top = "70%";
  conejo.style.width = "13vw";

  pajaro.classList.remove("oculto");
  pajaro.src = "assets/final/pajaro.png";
  pajaro.style.left = "48%";
  pajaro.style.top = "22%";
  pajaro.style.width = "10vw";
  pajaro.classList.add("flotar");

  mariposa.classList.remove("oculto");
  mariposa.src = "assets/final/mariposa.png";
  mariposa.style.left = "52%";
  mariposa.style.top = "52%";
  mariposa.style.width = "7vw";
  mariposa.classList.add("flotar");

  pelota.classList.remove("oculto");
  pelota.src = "assets/final/pelota.png";
  pelota.style.left = "58%";
  pelota.style.top = "72%";
  pelota.style.width = "8vw";

  setTexto(
    "Todos jugamos",
    "Toca los personajes",
    "Pero todos merecemos jugar."
  );
}

/* INTERACCIONES */

window.addEventListener("click", event => {
  if(event.target.closest("#menu")) return;

  if(escenaActual === "portada" && estadoPortada === "oscuro"){
    estadoPortada = "asustado";

    if(!sonidoActivo){
      encenderSonido();
    }

    vibrar([80,40,120]);
    flashRapido();

    sonidos.stressHigh.volume = .65;
    sonidos.stressNoise.volume = .55;
    sonidos.rollingBall.volume = .55;

    setTexto(
      "¡Uy!",
      "Desliza despacio",
      "Algunas cosas las sentía más intensas que los demás."
    );

    setTimeout(() => {
      timo.classList.remove("temblar");
      timo.classList.add("rodarFuera");
      estadoPortada = "regular";
    }, 700);
  }

  if(escenaActual === "respiracion"){
    respirando = !respirando;

    if(respirando){
      timo.classList.add("respirar");
      intensidadLuciernagas(.65);

      setTexto(
        "Respira",
        "Toca otra vez para pausar",
        "Respiró profundo y escuchó su propio ritmo."
      );

      if(sonidoActivo){
        sonidos.deepBreath.volume = .75;
        sonidos.heartbeatSoft.volume = .4;
      }

      vibrar(30);
    }else{
      timo.classList.remove("respirar");
      intensidadLuciernagas(.25);

      setTexto(
        "Respira",
        "Toca para respirar",
        "Respiró profundo y escuchó su propio ritmo."
      );
    }
  }

  if(escenaActual === "final"){
    vibrar(40);
    flashRapido();

    intensidadLuciernagas(.95);

    if(sonidoActivo){
      sonidos.playBall.volume = .5;
      sonidos.softLaughs.volume = .35;
    }
  }
});

window.addEventListener("touchstart", e => {
  startY = e.touches[0].clientY;
});

window.addEventListener("touchmove", e => {
  const y = e.touches[0].clientY;

  /* PORTADA */

  if(escenaActual === "portada" && estadoPortada === "regular"){
    const diferencia = startY - y;

    if(diferencia > 0){
      progreso += diferencia / 1600;

      if(progreso > 1){
        progreso = 1;
      }

      startY = y;

      oscuridad.style.opacity = .72 - progreso * .72;
      ruido.style.opacity = .35 - progreso * .35;
      intensidadLuciernagas(.25 + progreso * .75);

      fondo.style.filter =
        `brightness(${.45 + progreso * .65})
         saturate(${.6 + progreso * .45})
         contrast(${1.1 - progreso * .1})`;

      regularAudioPortada();

      if(progreso > .25 && !timo.classList.contains("volver")){
        timo.classList.remove("rodarFuera");
        timo.classList.add("volver");
      }

      if(progreso > .95){
        timo.src = "assets/portada/timo_open.png";
        timo.classList.remove("volver");
        timo.style.left = "35%";
        timo.style.top = "58%";
        timo.style.width = "18vw";

        setTexto(
          "Gracias",
          "Vamos a jugar",
          "Cuando el entorno escucha, todos encuentran su lugar."
        );

        estadoPortada = "calma";
        regularAudioPortada();
      }
    }
  }

  /* TÚNEL */

  if(escenaActual === "tunel"){
    const diferencia = startY - y;

    tunelProgreso += Math.abs(diferencia) / 900;

    if(tunelProgreso > 1){
      tunelProgreso = 1;
    }

    startY = y;

    moverTunel(tunelProgreso);
  }
});

/* INCLINACIÓN COMO APOYO */

window.addEventListener("deviceorientation", e => {
  if(escenaActual !== "tunel") return;

  const gamma = e.gamma || 0;

  if(Math.abs(gamma) > 5){
    tunelProgreso += Math.abs(gamma) / 1200;

    if(tunelProgreso > 1){
      tunelProgreso = 1;
    }

    moverTunel(tunelProgreso);
  }
});

cargarEscena("portada");
