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
let rondas=0
let tiempoRestante=60000
let intervaloTimer=null
let modoCompetitivo=false


const menu=document.getElementById("menu")
const game=document.getElementById("game")
const tablero=document.getElementById("game-board")
const intentosSpan=document.getElementById("intentos")
const aciertosSpan=document.getElementById("aciertos")

document.getElementById("volver-menu").onclick=()=>{
location.reload()
}



window.selectMode=function(mode){

modoJuego = mode
modoCompetitivo = (mode === "contrarreloj")

document.getElementById("step-mode").classList.add("hidden")
document.getElementById("step-writing").classList.remove("hidden")

const opciones = document.querySelector(".options")

if(modoCompetitivo){

opciones.style.display = "none"

}else{

opciones.style.display = "block"

}

}



window.startGame=function(sys){
sistema=sys
iniciarJuego()
}

function iniciarJuego(){
    const timerBox = document.getElementById("timer")

    if(modoJuego === "contrarreloj"){

    timerBox.classList.remove("hidden")

    }else{

    timerBox.classList.add("hidden")

    }

menu.classList.add("hidden")
game.classList.remove("hidden")

intentos=0
aciertos=0
rondas=0
tiempoRestante=60000
intervaloTimer=null
intentosSpan.textContent=0
aciertosSpan.textContent=0

generarTablero()

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
if(modoCompetitivo && intervaloTimer === null){
iniciarTimer()
}
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

aciertosSpan.textContent = aciertos

if(modoJuego === "contrarreloj"){

tiempoRestante += 2000

const bonus = document.getElementById("bonus-tiempo")

bonus.textContent = "+2s"
bonus.style.opacity = 1

setTimeout(()=>{
bonus.style.opacity = 0
},600)

}

reset()

// comprobar si se terminó el tablero
const cartasRestantes = document.querySelectorAll(".card:not(.flip)")

if(cartasRestantes.length === 0){

if(modoJuego === "contrarreloj"){

rondas++
nuevoTablero()

}else{

mostrarVictoria()

}

}

}else{

intentos++

intentosSpan.textContent=intentos

setTimeout(()=>{

primeraCarta.classList.remove("flip")
segundaCarta.classList.remove("flip")

reset()

},800)

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

function nuevoTablero(){

tablero.style.opacity="0"

setTimeout(()=>{
generarTablero()
tablero.style.opacity="1"
},500)
}


function generarPoolCaracteres(){

let pool=[]

let usarDakuten
let usarHandakuten

if(modoJuego==="contrarreloj"){

usarDakuten=true
usarHandakuten=true

}else{

usarDakuten=document.getElementById("dakuten").checked
usarHandakuten=document.getElementById("handakuten").checked

}

if(sistema==="hiragana"){

pool=[...hiraganaBase]

if(usarDakuten) pool=pool.concat(hiraganaDakuten)
if(usarHandakuten) pool=pool.concat(hiraganaHandakuten)

}

if(sistema==="katakana"){

pool=[...katakanaBase]

if(usarDakuten) pool=pool.concat(katakanaDakuten)
if(usarHandakuten) pool=pool.concat(katakanaHandakuten)

}

return pool

}

function crearCartas(pool){

const pares=mezclar(pool).slice(0,8)

let cartas=[]

pares.forEach(p=>{

if(modoJuego==="normal"){

cartas.push({valor:p.kana,match:p.kana})
cartas.push({valor:p.kana,match:p.kana})

}else{

cartas.push({valor:p.kana,match:p.romaji})
cartas.push({valor:p.romaji,match:p.kana})

}

})

return mezclar(cartas)

}


function generarTablero(){

const pool=generarPoolCaracteres()

const cartas=crearCartas(pool)

renderizar(cartas)

}

function iniciarTimer(){

intervaloTimer = setInterval(()=>{

tiempoRestante -= 10

if(tiempoRestante <= 0){

tiempoRestante = 0
mostrarVictoria()

}

actualizarTimer()

},10)

}

function actualizarTimer(){

const segundos = Math.floor(tiempoRestante / 1000)
const miliseg = Math.floor((tiempoRestante % 1000) / 10)

document.getElementById("tiempo").textContent =
segundos + ":" + miliseg.toString().padStart(2,"0")

}

function finPorTiempo(){

document.getElementById("game").classList.add("hidden")

const victory = document.getElementById("victory")

victory.classList.remove("hidden")

document.querySelector("#victory h1").textContent =
"⏱ Tiempo terminado"

document.getElementById("victory-intentos").textContent = intentos

}

function mostrarVictoria(){

clearInterval(intervaloTimer)

document.getElementById("game").classList.add("hidden")

const victory=document.getElementById("victory")
victory.classList.remove("hidden")

if(modoJuego === "contrarreloj"){

document.querySelector("#victory h1").textContent =
"時間終了！ Tiempo terminado"

document.getElementById("victory-intentos").textContent =
"Aciertos: " + aciertos + " | Rondas: " + rondas

}else{

document.querySelector("#victory h1").textContent =
"おめでとう！ ¡Juego completado!"

document.getElementById("victory-intentos").textContent =
"Intentos: " + intentos + " | Aciertos: " + aciertos

}

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

document.getElementById("btn-reglas").onclick=()=>{

document.getElementById("menu").classList.add("hidden")

document.getElementById("rules").classList.remove("hidden")

}

document.getElementById("cerrar-reglas").onclick=()=>{

document.getElementById("rules").classList.add("hidden")

document.getElementById("menu").classList.remove("hidden")

}

document.getElementById("btn-tablas").onclick=()=>{

alert("Ranking próximamente")

}
