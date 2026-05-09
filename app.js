const pageImage = document.getElementById("pageImage");
const noise = document.getElementById("noise");
const flash = document.getElementById("flash");

let stressLevel = 20;

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
