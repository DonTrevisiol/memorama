// ./memorama/data/score/scoreUI.js
import { obtenerTop } from "./scoreService.js"

export async function renderRanking(containerId){

  const container = document.getElementById(containerId)
  container.innerHTML = ""

  const sistemas = ["hiragana", "katakana"]

  for(const sistema of sistemas){

    const titulo = document.createElement("h2")
    titulo.textContent = sistema.toUpperCase()

    const lista = document.createElement("ol")

    const top = await obtenerTop(sistema, 10)

    if(top.length === 0){
      const empty = document.createElement("p")
      empty.textContent = "No hay récords todavía"
      container.appendChild(titulo)
      container.appendChild(empty)
      continue
    }

    top.forEach((jugador, index) => {

      const item = document.createElement("li")

      let medalla = ""

	if(index === 0) medalla = "🥇 "
	if(index === 1) medalla = "🥈 "
	if(index === 2) medalla = "🥉 "

	item.textContent =
		`${medalla}${jugador.nombre} — ${jugador.rondas} rondas | ${jugador.aciertos} aciertos | ${jugador.intentos} intentos`
        
        //ESTILOS DE LOS TOP:
        if(index === 0){
			item.classList.add("top1")
		} else if(index === 1){
			item.classList.add("top2")
		} else if(index === 2){
			item.classList.add("top3")
		}

      lista.appendChild(item)

    })

    container.appendChild(titulo)
    container.appendChild(lista)

  }
}
