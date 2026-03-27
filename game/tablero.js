/* ./memorama/game/tablero.js */
import { state } from "../core/gameState.js"
import { verificar } from "../modes/normal.js"
import { iniciarTimer } from "../modes/contrarreloj.js"

const tablero = document.getElementById("game-board")

export function renderizar(cartas){

  tablero.innerHTML=""

  cartas.forEach(c=>{

    const card=document.createElement("div")
    card.classList.add("card")

    card.dataset.valor=c.valor
    card.dataset.match=c.match

    const back=document.createElement("div")
    back.classList.add("card-face","card-back")

    const front=document.createElement("div")
    front.classList.add("card-face","card-front")
    front.textContent=c.valor

    card.appendChild(back)
    card.appendChild(front)

    card.onclick=()=>clickCarta(card)

    tablero.appendChild(card)

  })
}

function clickCarta(carta){

  if(state.bloqueado) return
  if(carta.classList.contains("flip")) return

  carta.classList.add("flip")

  if(!state.primeraCarta){
    state.primeraCarta=carta
    return
  }
  if(state.modoCompetitivo && state.intervaloTimer === null){
	iniciarTimer()
  }

  state.segundaCarta=carta
  state.bloqueado=true

  verificar()
}
