/* ./memorama/modes/normal.js */
import { state } from "../core/gameState.js"

const intentosSpan=document.getElementById("intentos")
const aciertosSpan=document.getElementById("aciertos")

export function verificar(){

  const match =
    state.primeraCarta.dataset.valor === state.segundaCarta.dataset.match ||
    state.segundaCarta.dataset.valor === state.primeraCarta.dataset.match

  if(match){

    state.aciertos++
    aciertosSpan.textContent = state.aciertos

    reset()
	if(state.modoJuego === "contrarreloj"){
		state.tiempoRestante += 2000
		const bonus = document.getElementById("bonus-tiempo")
		bonus.textContent = "+2s"
		bonus.style.opacity = 1
		setTimeout(()=>{
			bonus.style.opacity = 0
		},600)
	}
	
    const restantes = document.querySelectorAll(".card:not(.flip)")

    if(restantes.length === 0){
      if(state.modoJuego === "contrarreloj"){
        import("./contrarreloj.js").then(m=>m.siguienteRonda())
      }else{
        mostrarVictoria()
      }
    }

  }else{

    state.intentos++
    intentosSpan.textContent = state.intentos

    setTimeout(()=>{
      state.primeraCarta.classList.remove("flip")
      state.segundaCarta.classList.remove("flip")
      reset()
    },800)

  }
}

function reset(){
  state.primeraCarta=null
  state.segundaCarta=null
  state.bloqueado=false
}

export function mostrarVictoria(){
  
  clearInterval(state.intervaloTimer)

  document.getElementById("game").classList.add("hidden")
  const victory=document.getElementById("victory")
  victory.classList.remove("hidden")

  document.querySelector("#victory h1").textContent =
    "おめでとう！ ¡Juego completado!"

  document.getElementById("victory-intentos").textContent =
    "試行 (しこう) Intentos: " + state.intentos + " | 正解 (せいかい) Aciertos: " + state.aciertos
}

