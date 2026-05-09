const pageImage = document.getElementById("pageImage");
const noise = document.getElementById("noise");
const flash = document.getElementById("flash");
const startButton = document.getElementById("startButton");

let stressLevel = 20;

/* AUDIO */

const sonidos = {

  stressLow:
    new Audio("sounds/stress_low.mp3"),

  stressHigh:
    new Audio("sounds/stress_high.mp3"),

  stressNoise:
    new Audio("sounds/stress_noise.mp3"),

  calmAir:
    new Audio("sounds/calm_air.mp3"),

  calmPulse:
    new Audio("sounds/calm_pulse.mp3")

};

/* CONFIG */

Object.values(sonidos).forEach(sound=>{

  sound.loop = true;
  sound.volume = 0;

});

/* CALMA INICIAL */

sonidos.calmAir.volume = 1;
sonidos.calmPulse.volume = 0.4;

let audioIniciado = false;

/* INICIAR */

function iniciarAudio(){

  if(audioIniciado) return;

  audioIniciado = true;

  Object.values(sonidos).forEach(sound=>{

    sound.play().catch(error=>{

      console.log("ERROR AUDIO", error);

    });

  });

  startButton.style.display = "none";

}

/* BOTÓN */

startButton.addEventListener("click", ()=>{

  iniciarAudio();
  updateStress();

});

/* RESPIRACIÓN */

let breathing = 1;
let breathingDirection = 0.002;

function animate(){

  breathing += breathingDirection;

  if(breathing > 1.02 || breathing < 0.98){

    breathingDirection *= -1;

  }

  pageImage.style.transform = `

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

  if(!audioIniciado) return;

  stressLevel += 12;

  if(stressLevel > 100){

    stressLevel = 100;

  }

  if(navigator.vibrate){

    navigator.vibrate([80,30,100]);

  }

  updateStress();

});

/* MOUSE */

window.addEventListener("click", ()=>{

  if(!audioIniciado) return;

  stressLevel += 12;

  if(stressLevel > 100){

    stressLevel = 100;

  }

  updateStress();

});

/* REGULACIÓN */

window.addEventListener("touchmove", ()=>{

  if(!audioIniciado) return;

  stressLevel -= 1.5;

  if(stressLevel < 0){

    stressLevel = 0;

  }

  updateStress();

});

/* VISUAL + SONIDO */

function updateStress(){

  /* IMAGEN */

  pageImage.style.filter = `

    blur(${stressLevel * 0.05}px)

    brightness(${100 - stressLevel * 0.25}%)

    saturate(${100 + stressLevel * 0.8}%)

    contrast(${100 + stressLevel * 0.3}%)

  `;

  /* RUIDO */

  noise.style.opacity = stressLevel / 100;

  /* SONIDOS */

  sonidos.stressLow.volume =
    stressLevel / 100;

  sonidos.stressHigh.volume =
    Math.max(0,(stressLevel - 30)/100);

  sonidos.stressNoise.volume =
    Math.max(0,(stressLevel - 50)/100);

  sonidos.calmAir.volume =
    1 - (stressLevel/100);

  sonidos.calmPulse.volume =
    Math.max(0,0.6 - (stressLevel/160));

  /* FLASH */

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

updateStress();
