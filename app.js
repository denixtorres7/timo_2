const fondo = document.getElementById("fondo");
const oscuridad = document.getElementById("oscuridad");
const ruido = document.getElementById("ruido");
const flash = document.getElementById("flash");

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

const sonidos = {
  stressLow: new Audio("sounds/stress_low.mp3"),
  stressHigh: new Audio("sounds/stress_high.mp3"),
  stressNoise: new Audio("sounds/stress_noise.mp3"),
  calmAir: new Audio("sounds/calm_air.mp3"),
  calmPulse: new Audio("sounds/calm_pulse.mp3")
};

Object.values(sonidos).forEach(s => {
  s.loop = true;
  s.volume = 0;
});

function iniciarSonido(){
  sonidoActivo = true;
  Object.values(sonidos).forEach(s => s.play().catch(()=>{}));
  btnSonido.textContent = "🔊 Sonido activo";
}

btnSonido.addEventListener("click", iniciarSonido);

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
  if(navigator.vibrate) navigator.vibrate(patron);
}

function flashRapido(){
  flash.style.opacity = .35;
  setTimeout(()=> flash.style.opacity = 0, 120);
}

function actualizarAudio(estres, calma){
  if(!sonidoActivo) return;

  sonidos.stressLow.volume = estres * .6;
  sonidos.stressHigh.volume = estres * .45;
  sonidos.stressNoise.volume = estres * .5;

  sonidos.calmAir.volume = calma * .75;
  sonidos.calmPulse.volume = calma * .45;
}

function cargarEscena(nombre){
  escenaActual = nombre;
  progreso = 0;
  estadoPortada = "oscuro";

  limpiarPersonajes();

  oscuridad.style.opacity = 0;
  ruido.style.opacity = 0;
  actualizarAudio(0, .5);

  if(nombre === "portada") portada();
  if(nombre === "tunel") tunel();
  if(nombre === "respiracion") respiracion();
  if(nombre === "final") finalEscena();
}

/* PORTADA */

function portada(){
  fondo.src = "assets/portada/portada_fondo.png";
  oscuridad.style.opacity = .88;
  ruido.style.opacity = .45;

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

  actualizarAudio(1, 0);
}

/* TÚNEL */

function tunel(){
  fondo.src = "assets/tunel/fondo.png";
  oscuridad.style.opacity = .35;
  ruido.style.opacity = .18;

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
    "Inclina el celular",
    "La pelota cayó en un túnel estrecho, demasiado pequeño para algunos… pero no para todos."
  );

  actualizarAudio(.45, .25);
}

/* RESPIRACIÓN */

function respiracion(){
  fondo.src = "assets/respiracion/fondo.png";
  oscuridad.style.opacity = .18;
  ruido.style.opacity = .08;

  timo.classList.remove("oculto");
  timo.src = "assets/respiracion/timo.png";
  timo.style.left = "50%";
  timo.style.top = "58%";
  timo.style.width = "22vw";
  timo.classList.add("respirar");

  setTexto(
    "Respira",
    "Mantén presionado",
    "Respiró profundo y escuchó su propio ritmo."
  );

  actualizarAudio(.1, .8);
}

/* FINAL */

function finalEscena(){
  fondo.src = "assets/final/fondo.png";
  oscuridad.style.opacity = 0;
  ruido.style.opacity = 0;

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

  actualizarAudio(0, 1);
}

/* INTERACCIONES */

window.addEventListener("click", () => {
  if(!sonidoActivo) iniciarSonido();

  if(escenaActual === "portada" && estadoPortada === "oscuro"){
    estadoPortada = "asustado";
    vibrar([80,40,120]);
    flashRapido();

    setTexto(
      "¡Uy!",
      "Desliza despacio",
      "Algunas cosas las sentía más intensas que los demás."
    );

    setTimeout(()=>{
      timo.classList.remove("temblar");
      timo.classList.add("rodarFuera");
      estadoPortada = "regular";
    },700);
  }

  if(escenaActual === "final"){
    vibrar(40);
    flashRapido();
  }
});

window.addEventListener("touchstart", e => {
  startY = e.touches[0].clientY;

  if(escenaActual === "respiracion"){
    timo.classList.add("respirar");
    actualizarAudio(0, 1);
    vibrar(30);
  }
});

window.addEventListener("touchmove", e => {
  const y = e.touches[0].clientY;

  if(escenaActual === "portada" && estadoPortada === "regular"){
    const diferencia = startY - y;

    if(diferencia > 0){
      progreso += diferencia / 1600;
      if(progreso > 1) progreso = 1;
      startY = y;

      oscuridad.style.opacity = .88 - progreso * .82;
      ruido.style.opacity = .45 - progreso * .43;

      actualizarAudio(1 - progreso, progreso);

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
      }
    }
  }
});

window.addEventListener("deviceorientation", e => {
  if(escenaActual !== "tunel") return;

  const gamma = e.gamma || 0;
  const beta = e.beta || 0;

  timo.style.transform = `translate(${gamma * 1.2}px, ${beta * .4}px)`;
  pelota.style.transform = `translate(${-gamma * 1.5}px, ${-beta * .4}px)`;
});

cargarEscena("portada");
