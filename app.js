const background = document.getElementById("background");
const noise = document.getElementById("noise");
const flash = document.getElementById("flash");
const startButton = document.getElementById("startButton");
const instruction = document.getElementById("instruction");
const colorWash = document.getElementById("colorWash");

const sprites = {
  timo: document.getElementById("timo"),
  mono: document.getElementById("mono"),
  conejo: document.getElementById("conejo"),
  pajaro: document.getElementById("pajaro"),
  mariposa: document.getElementById("mariposa"),
  pelota: document.getElementById("pelota")
};

let stressLevel = 25;
let audioIniciado = false;
let experienceStarted = false;

/* AUDIO: si algún archivo falta, la experiencia sigue funcionando */
const sonidos = {
  stressLow: new Audio("sounds/stress_low.mp3"),
  stressHigh: new Audio("sounds/stress_high.mp3"),
  stressNoise: new Audio("sounds/stress_noise.mp3"),
  calmAir: new Audio("sounds/calm_air.mp3"),
  calmPulse: new Audio("sounds/calm_pulse.mp3")
};

Object.values(sonidos).forEach(sound => {
  sound.loop = true;
  sound.volume = 0;
});

function iniciarAudio(){
  if(audioIniciado) return;
  audioIniciado = true;

  Object.values(sonidos).forEach(sound => {
    sound.play().catch(error => {
      console.log("Audio no disponible o bloqueado:", sound.src, error);
    });
  });
}

startButton.addEventListener("click", () => {
  experienceStarted = true;
  iniciarAudio();
  startButton.style.display = "none";
  updateStress();
});

/* En computador también funciona */
window.addEventListener("keydown", (e) => {
  if(e.key === "ArrowUp") subirEstres();
  if(e.key === "ArrowDown") regular();
});

/* TOQUE: insistir/golpear aumenta desregulación */
window.addEventListener("touchstart", () => {
  if(!experienceStarted) return;
  subirEstres();
});

window.addEventListener("click", () => {
  if(!experienceStarted) return;
  subirEstres();
});

/* DESLIZAR: regula el entorno */
window.addEventListener("touchmove", (event) => {
  if(!experienceStarted) return;
  event.preventDefault();
  regular();
}, {passive:false});

function subirEstres(){
  stressLevel += 14;
  if(stressLevel > 100) stressLevel = 100;

  if(navigator.vibrate){
    navigator.vibrate([90, 35, 110]);
  }

  if(stressLevel > 62){
    flash.style.opacity = 0.14;
    setTimeout(() => flash.style.opacity = 0, 100);
  }

  updateStress();
}

function regular(){
  stressLevel -= 2.4;
  if(stressLevel < 0) stressLevel = 0;
  updateStress();
}

/* Animación constante de personajes */
let t = 0;
function animate(){
  t += 0.035;

  const s = stressLevel / 100;
  const calm = 1 - s;

  // Timo: con estrés se retrae; con calma respira y mira
  const timoBreath = Math.sin(t * (1.2 + s * 4)) * (2 + calm * 4);
  sprites.timo.style.transform = `translate(${ -s*16 + timoBreath*.25 }px, ${s*10 + timoBreath}px) scale(${1 - s*.10}) rotate(${-s*5}deg)`;

  // Mono: el entorno invasivo se vuelve más errático
  sprites.mono.style.transform = `translate(${Math.sin(t*3.2)*s*18}px, ${Math.cos(t*2.7)*s*16}px) rotate(${Math.sin(t*4)*s*8}deg) scale(${1 + s*.04})`;

  // Conejo: tiembla cuando hay mucha estimulación
  sprites.conejo.style.transform = `translate(${Math.sin(t*8)*s*10}px, ${Math.cos(t*7)*s*9}px) rotate(${Math.sin(t*7)*s*5}deg)`;

  // Pájaro y mariposa: estímulos flotantes
  sprites.pajaro.style.transform = `translate(${Math.sin(t*2.5)*12 + s*18}px, ${Math.cos(t*2.1)*8 - s*12}px) rotate(${Math.sin(t*3)*10}deg)`;
  sprites.mariposa.style.transform = `translate(${Math.cos(t*3.4)*10 + s*16}px, ${Math.sin(t*2.9)*10}px) scale(${1 + Math.sin(t*4)*.04})`;

  // Pelota: estímulo/impacto más fuerte cuando hay estrés
  sprites.pelota.style.transform = `translate(${Math.sin(t*5)*s*22}px, ${Math.cos(t*4)*s*18}px) scale(${1 + s*.12})`;

  requestAnimationFrame(animate);
}
animate();

function updateStress(){
  const s = stressLevel / 100;

  // Fondo quieto: solo cambia el clima visual, no se mueve
  background.style.filter = `brightness(${106 - stressLevel*.33}%) contrast(${100 + stressLevel*.25}%)`;

  // Personajes: filtros compartidos
  Object.values(sprites).forEach(el => {
    el.style.filter = `blur(${stressLevel*.018}px) contrast(${100 + stressLevel*.45}%)`;
  });

  noise.style.opacity = s*.9;
  colorWash.style.opacity = 0.16 + (1-s)*0.34;
  colorWash.style.filter = `saturate(${80 + (1-s)*80}%)`;

  if(audioIniciado){
    sonidos.stressLow.volume = Math.min(1, stressLevel / 100);
    sonidos.stressHigh.volume = Math.max(0, (stressLevel - 30) / 100);
    sonidos.stressNoise.volume = Math.max(0, (stressLevel - 50) / 100);
    sonidos.calmAir.volume = Math.max(0, 1 - stressLevel / 100);
    sonidos.calmPulse.volume = Math.max(0, 0.55 - stressLevel / 160);
  }

  if(stressLevel > 70){
    instruction.textContent = "Demasiado estímulo. Desliza lento para bajar la intensidad.";
  } else if(stressLevel > 35){
    instruction.textContent = "El entorno empieza a regularse. Sigue deslizando suavemente.";
  } else {
    instruction.textContent = "Cuando el entorno baja su intensidad, Timo puede acercarse.";
  }
}

updateStress();
