/* ./memorama/game/cartas.js */
import { mezclar } from "../core/utils.js"
import { state } from "../core/gameState.js"

export function crearCartas(pool){
	const pares=mezclar(pool).slice(0,8)
	let cartas=[]
	pares.forEach(p=>{
		if(state.modoJuego==="normal"){
			cartas.push({valor:p.kana,match:p.kana})
			cartas.push({valor:p.kana,match:p.kana})
		} else if(state.modoJuego==="educativo" || state.modoJuego==="contrarreloj"){
			cartas.push({valor:p.kana,match:p.romaji})
			cartas.push({valor:p.romaji,match:p.kana})
		}
	})
	return mezclar(cartas)
}
