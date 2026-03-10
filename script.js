// /memorama/script.js
import { hiraganaBase, hiraganaDakuten, hiraganaHandakuten } from "./data/hiragana/hiragana.js"
import { katakanaBase, katakanaDakuten, katakanaHandakuten } from "./data/katakana/katakana.js"

let modoJuego="normal"
let sistema="hiragana"
let primeraCarta=null
let segundaCarta=null
let bloqueado=false
let intentos=0
let aciertos=0

const menu=document.getElementById("menu")
const game=document.getElementById("game")
const tablero=document.getElementById("game-board")
const intentosSpan=document.getElementById("intentos")
const aciertosSpan=document.getElementById("aciertos")

document.getElementById("volver-menu").onclick=()=>{
location.reload()
}



window.selectMode=function(mode){
modoJuego=mode
document.getElementById("step-mode").classList.add("hidden")
document.getElementById("step-writing").classList.remove("hidden")
}



window.startGame=function(sys){
sistema=sys
iniciarJuego()
}

function iniciarJuego(){
	
tablero.innerHTML=""

menu.classList.add("hidden")
game.classList.remove("hidden")
intentos=0
aciertos=0
intentosSpan.textContent=0
aciertosSpan.textContent=0
let base=[]
let dakuten=[]
let handakuten=[]
if(sistema==="hiragana"){
base=[...hiraganaBase]
dakuten=[...hiraganaDakuten]
handakuten=[...hiraganaHandakuten]	
}

if(sistema==="katakana"){
base=[...katakanaBase]
dakuten=[...katakanaDakuten]
handakuten=[...katakanaHandakuten]
}
console.log("base: ", base)
const usarDakuten=document.getElementById("dakuten").checked
const usarHandakuten=document.getElementById("handakuten").checked

if(usarDakuten){
base = base.concat(dakuten)
}

if(usarHandakuten){
base = base.concat(handakuten)
}



const pares = mezclar([...base]).slice(0,8)



let cartas=[]



pares.forEach(p=>{

if(modoJuego==="normal"){

cartas.push({valor:p.kana,match:p.kana})
cartas.push({valor:p.kana,match:p.kana})

}

else{

cartas.push({valor:p.kana,match:p.romaji})
cartas.push({valor:p.romaji,match:p.kana})

}

})



cartas=mezclar(cartas)

renderizar(cartas)

}

function renderizar(cartas){

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

if(bloqueado) return
if(carta.classList.contains("flip")) return

carta.classList.add("flip")

if(!primeraCarta){

primeraCarta=carta
return

}

segundaCarta=carta

bloqueado=true

verificar()

}

function verificar(){

const match=

primeraCarta.dataset.valor===segundaCarta.dataset.match ||
segundaCarta.dataset.valor===primeraCarta.dataset.match

if(match){

aciertos++

aciertosSpan.textContent=aciertos

if(aciertos===8){
setTimeout(mostrarVictoria,500)
}

reset()

}



else{

intentos++

intentosSpan.textContent=intentos

setTimeout(()=>{

primeraCarta.classList.remove("flip")
segundaCarta.classList.remove("flip")

reset()

},1800)

}

}


function reset(){

primeraCarta=null
segundaCarta=null
bloqueado=false

}

function mezclar(array){

for(let i=array.length-1;i>0;i--){

let j=Math.floor(Math.random()*(i+1))
let temp=array[i]
array[i]=array[j]
array[j]=temp
}

return array

}

function mostrarVictoria(){

document.getElementById("game").classList.add("hidden")

const victory = document.getElementById("victory")
victory.classList.remove("hidden")

document.getElementById("victory-intentos").textContent = intentos

}


document.getElementById("play-again").onclick=()=>{
document.getElementById("victory").classList.add("hidden")
iniciarJuego()
}

document.getElementById("back-menu").onclick=()=>{
document.getElementById("victory").classList.add("hidden")

game.classList.add("hidden")
menu.classList.remove("hidden")

document.getElementById("step-writing").classList.add("hidden")
document.getElementById("step-mode").classList.remove("hidden")
}
