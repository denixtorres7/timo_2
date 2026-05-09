const pageImage = document.getElementById("pageImage");
const noise = document.getElementById("noise");
const flash = document.getElementById("flash");

let stressLevel = 0;

/* TOQUE */

window.addEventListener("touchstart", ()=>{

  stressLevel += 10;

  if(stressLevel > 100){
    stressLevel = 100;
  }

  updateStress();

});

/* SCROLL / REGULACIÓN */

window.addEventListener("touchmove", ()=>{

  stressLevel -= 2;

  if(stressLevel < 0){
    stressLevel = 0;
  }

  updateStress();

});

/* ACTUALIZAR ESTADO */

function updateStress(){

  /* BLUR */

  pageImage.style.filter =
    `blur(${stressLevel * 0.08}px)
     brightness(${100 - stressLevel * 0.3}%)
     saturate(${100 + stressLevel}%)`;

  /* MOVIMIENTO */

  pageImage.style.transform =
    `translate(${Math.random()*stressLevel/5}px,
               ${Math.random()*stressLevel/5}px)`;

  /* RUIDO */

  noise.style.opacity = stressLevel / 100;

  /* FLASH */

  if(stressLevel > 60){

    flash.style.opacity = 0.15;

    setTimeout(()=>{
      flash.style.opacity = 0;
    },100);

  }

  /* CAMBIO DE ESCENA */

  if(stressLevel > 70){

    pageImage.src = "assets/DP_03.png";

  }
  else if(stressLevel > 30){

    pageImage.src = "assets/DP_02.png";

  }
  else{

    pageImage.src = "assets/DP_08.png";

  }

}