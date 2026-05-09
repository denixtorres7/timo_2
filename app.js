const pageImage = document.getElementById("pageImage");
const noise = document.getElementById("noise");
const flash = document.getElementById("flash");

/* AUDIO */

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

let audioIniciado = false;

function iniciarAudio() {
  if (audioIniciado) return;
  audioIniciado = true;

  Object.values(sonidos).forEach(sound => {
    sound.play().catch(error => {
      console.log("No se pudo reproducir:", sound.src, error);
    });
  });
}

/* ESTRÉS */

const stressLow = new Audio("sounds/stress_low.mp3");
const stressHigh = new Audio("sounds/stress_high.mp3");
const stressNoise = new Audio("sounds/stress_noise.mp3");

/* CALMA */

const calmAir = new Audio("sounds/calm_air.mp3");
const calmPulse = new Audio("sounds/calm_pulse.mp3");

/* LOOP */

[
  stressLow,
  stressHigh,
  stressNoise,
  calmAir,
  calmPulse
].forEach(sound => {

  sound.loop = true;

});

/* VOLUMEN INICIAL */

stressLow.volume = 0;
stressHigh.volume = 0;
stressNoise.volume = 0;

calmAir.volume = 1;
calmPulse.volume = 0.5;

/* INICIAR */

window.addEventListener("touchstart", ()=>{

  stressLow.play();
  stressHigh.play();
  stressNoise.play();

  calmAir.play();
  calmPulse.play();

},{ once:true });

let breathing = 1;
let breathingDirection = 0.002;

/* RESPIRACIÓN */

function animate(){

  breathing += breathingDirection;

  if(breathing > 1.02 || breathing < 0.98){
    breathingDirection *= -1;
  }

  pageImage.style.transform =
    `
    scale(${breathing})
    translate(
      ${Math.random()*stressLevel/12}px,
      ${Math.random()*stressLevel/12}px
    )
    `;

  requestAnimationFrame(animate);
}

animate();

/* TOQUE */

window.addEventListener("touchstart", ()=>{

  stressLevel += 12;

  if(stressLevel > 100){
    stressLevel = 100;
  }

  /* vibración celular */

  if(navigator.vibrate){
    navigator.vibrate([80,30,100]);
  }

  updateStress();

});

/* SCROLL REGULADOR */

window.addEventListener("touchmove", ()=>{

  stressLevel -= 1.5;

  if(stressLevel < 0){
    stressLevel = 0;
  }

  updateStress();

});

/* ESTADO VISUAL */

function updateStress(){

  /* SONIDO */

stressSound.volume = stressLevel / 100;

calmSound.volume = 1 - (stressLevel / 100);

  /* DISTORSIÓN */

  pageImage.style.filter =
    `
    blur(${stressLevel * 0.05}px)
    brightness(${100 - stressLevel * 0.25}%)
    saturate(${100 + stressLevel * 0.8}%)
    contrast(${100 + stressLevel * 0.3}%)
    `;

  /* RUIDO */

  noise.style.opacity = stressLevel / 100;

  /* AUDIO SENSORIAL */

stressLow.volume = stressLevel / 100;

stressHigh.volume =
  Math.max(0, (stressLevel - 30) / 100);

stressNoise.volume =
  Math.max(0, (stressLevel - 50) / 100);

/* CALMA */

calmAir.volume =
  1 - (stressLevel / 100);

calmPulse.volume =
  0.6 - (stressLevel / 160);

  /* FLASH SENSORIAL */

  if(stressLevel > 65){

    flash.style.opacity = 0.12;

    setTimeout(()=>{
      flash.style.opacity = 0;
    },120);

  }

  /* ESCENAS */

  if(stressLevel > 75){

    pageImage.src = "assets/DP_03.png";

  }
  else if(stressLevel > 45){

    pageImage.src = "assets/DP_02.png";

  }
  else if(stressLevel > 20){

    pageImage.src = "assets/DP_01.png";

  }
  else{

    pageImage.src = "assets/DP_08.png";

  }

}
