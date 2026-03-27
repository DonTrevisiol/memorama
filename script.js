/* ./memorama/script.js */
import { state } from "./core/gameState.js"
import { crearCartas } from "./game/cartas.js"
import { renderizar } from "./game/tablero.js"
import { renderRanking } from "./data/score/scoreUI.js"

import { hiraganaBase, hiraganaDakuten, hiraganaHandakuten } from "./data/hiragana/hiragana.js"
import { katakanaBase, katakanaDakuten, katakanaHandakuten } from "./data/katakana/katakana.js"

function selectMode(mode){

  state.modoJuego = mode
  state.modoCompetitivo = (mode==="contrarreloj")

  document.getElementById("step-mode").classList.add("hidden")
  document.getElementById("step-writing").classList.remove("hidden")

  const opciones = document.querySelector(".options")

  opciones.style.display = state.modoCompetitivo ? "none" : "block"
}

function startGame(sys){
  state.sistema=sys
  iniciarJuego()
}

function iniciarJuego(){
	const timerBox = document.getElementById("timer")
	if(state.modoJuego === "contrarreloj"){
		timerBox.classList.remove("hidden")
	}else{
		timerBox.classList.add("hidden")
	}

  document.getElementById("menu").classList.add("hidden")
  document.getElementById("game").classList.remove("hidden")

  state.intentos=0
  state.aciertos=0
  state.rondas=0
  state.tiempoRestante=60000
  state.intervaloTimer=null

  document.getElementById("intentos").textContent=0
  document.getElementById("aciertos").textContent=0

  generarTablero()
}

export function generarTablero(){

  let pool=[]

  let usarDakuten = state.modoCompetitivo || document.getElementById("dakuten").checked
  let usarHandakuten = state.modoCompetitivo || document.getElementById("handakuten").checked

  if(state.sistema==="hiragana"){
    pool=[...hiraganaBase]
    if(usarDakuten) pool=pool.concat(hiraganaDakuten)
    if(usarHandakuten) pool=pool.concat(hiraganaHandakuten)
  }

  if(state.sistema==="katakana"){
    pool=[...katakanaBase]
    if(usarDakuten) pool=pool.concat(katakanaDakuten)
    if(usarHandakuten) pool=pool.concat(katakanaHandakuten)
  }

  const cartas = crearCartas(pool)

  renderizar(cartas)
}

window.selectMode = selectMode
window.startGame = startGame

function initUI(){
	// REGLAS
	document.getElementById("btn-reglas").addEventListener("click", () => {

	document.getElementById("menu").classList.add("hidden")
	document.getElementById("rules").classList.remove("hidden")

})

	// CERRAR REGLAS
	document.getElementById("cerrar-reglas").addEventListener("click", () => {

	document.getElementById("rules").classList.add("hidden")
	document.getElementById("menu").classList.remove("hidden")

})


	// TABLAS
	document.getElementById("btn-tablas").addEventListener("click", async () => {

	document.getElementById("menu").classList.add("hidden")

	const ranking = document.getElementById("ranking")
	ranking.classList.remove("hidden")

	await renderRanking("ranking-content")

})

	// CERRAR TABLAS
	document.getElementById("cerrar-ranking").addEventListener("click", () => {

	document.getElementById("ranking").classList.add("hidden")
	document.getElementById("menu").classList.remove("hidden")

})

	// MODOS
	document.getElementById("modo-normal").addEventListener("click", () => {
	selectMode("normal")
	})

	document.getElementById("modo-educativo").addEventListener("click", () => {
	selectMode("educativo")
	})

	document.getElementById("modo-contrarreloj").addEventListener("click", () => {
	selectMode("contrarreloj")
	})

	// SISTEMA DE ESCRITURA
	document.getElementById("btn-hiragana").addEventListener("click", () => {
	startGame("hiragana")
	})

	document.getElementById("btn-katakana").addEventListener("click", () => {
	startGame("katakana")
	})

	// VOLVER AL MENÚ (DURANTE EL JUEGO)
	document.getElementById("back-menu").addEventListener("click", () => {
	location.reload()
	})
	document.getElementById("volver-menu").addEventListener("click", () => {
	location.reload()
	})
	
	// JUGAR OTRA VEZ
	document.getElementById("play-again").addEventListener("click", () => {
	document.getElementById("victory").classList.add("hidden")
	iniciarJuego()
	})
	
}
initUI()

