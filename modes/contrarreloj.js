/* ./memorama/modes/contrarreloj.js */
import { state } from "../core/gameState.js"
import { generarTablero } from "../script.js"
import { guardarScore, obtenerTop } from "../data/score/scoreService.js"

export function iniciarTimer(){

  state.intervaloTimer = setInterval(()=>{

    state.tiempoRestante -= 10

    if(state.tiempoRestante <= 0){
      state.tiempoRestante = 0
      mostrarVictoriaContrarreloj()
    }

    actualizarTimer()

  },10)
}

function actualizarTimer(){

  const segundos = Math.floor(state.tiempoRestante / 1000)
  const miliseg = Math.floor((state.tiempoRestante % 1000)/10)

  document.getElementById("tiempo").textContent =
    segundos + ":" + miliseg.toString().padStart(2,"0")
}

export function bonusTiempo(){

  state.tiempoRestante += 2000

  const bonus = document.getElementById("bonus-tiempo")

  bonus.textContent = "+2s"
  bonus.style.opacity = 1

  setTimeout(()=>{
    bonus.style.opacity = 0
  },600)
}

export function siguienteRonda(){

  state.rondas++

  const tablero = document.getElementById("game-board")

  tablero.style.opacity="0"

  setTimeout(()=>{
    generarTablero()
    tablero.style.opacity="1"
  },500)
}

export async function mostrarVictoriaContrarreloj(){

  clearInterval(state.intervaloTimer)

  document.getElementById("game").classList.add("hidden")
  const victory = document.getElementById("victory")
  victory.classList.remove("hidden")

  document.querySelector("#victory h1").textContent =
    "時間終了！ Tiempo terminado"

  document.getElementById("victory-intentos").textContent =
    `ラウンド Rondas: ${state.rondas} | 正解 (せいかい) Aciertos: ${state.aciertos}`

  // 🔥 LÓGICA DE RÉCORD
  const top = await obtenerTop(state.sistema, 10)

  let entra = false

  if(top.length < 10){
    entra = true
  } else {
    const peor = top[top.length - 1]

    if(state.rondas > peor.rondas) entra = true
    else if(state.rondas === peor.rondas && state.aciertos > peor.aciertos) entra = true
    else if(
      state.rondas === peor.rondas &&
      state.aciertos === peor.aciertos &&
      state.intentos < peor.intentos
    ) entra = true
  }

  if(entra){
    let nombre = prompt("🏆 NUEVO RÉCORD / 新記録！\n\nIngresa tu nombre (máx 20 caracteres)\n名前を入力してください（20文字まで）:")
	if(nombre){
		nombre = nombre.trim().slice(0,20)
		if(nombre.length === 0){
			nombre = "匿名 Anónimo"
		}
		await guardarScore({
			nombre,
			sistema: state.sistema,
			aciertos: state.aciertos,
			rondas: state.rondas,
			intentos: state.intentos
		})
	}
  }
}
