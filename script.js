// script.js
let modoSeleccionado = null;
let primeraCarta = null;
let segundaCarta = null;
let bloqueado = false;
let intentos = 0;

const btnHiragana = document.getElementById("btn-hiragana");
const btnKatakana = document.getElementById("btn-katakana");
const btnComenzar = document.getElementById("comenzar");

const menu = document.getElementById("menu");
const game = document.getElementById("game");
const tablero = document.getElementById("game-board");
const intentosSpan = document.getElementById("intentos");

btnHiragana.addEventListener("click", () => {
  modoSeleccionado = "hiragana";
  btnHiragana.classList.add("activo");
  btnKatakana.classList.remove("activo");
});

btnKatakana.addEventListener("click", () => {
  modoSeleccionado = "katakana";
  btnKatakana.classList.add("activo");
  btnHiragana.classList.remove("activo");
});

btnComenzar.addEventListener("click", () => {
  if (!modoSeleccionado) {
    alert("Selecciona Hiragana o Katakana");
    return;
  }

  iniciarJuego();
});

function iniciarJuego() {
  intentos = 0;
  intentosSpan.textContent = intentos;
  primeraCarta = null;
  segundaCarta = null;
  bloqueado = false;

  menu.classList.add("hidden");
  game.classList.remove("hidden");

  const incluirDakuten = document.getElementById("dakuten").checked;
  const incluirHandakuten = document.getElementById("handakuten").checked;

  let base = obtenerBase(modoSeleccionado, incluirDakuten, incluirHandakuten);

  const cantidadPares = 8; // 16 cartas
  let seleccionados = mezclarArray(base).slice(0, cantidadPares);
  let cartas = mezclarArray([...seleccionados, ...seleccionados]);

  renderizarCartas(cartas);
}

function obtenerBase(modo, dakuten, handakuten) {
  let hiraganaBase = ["あ","い","う","え","お","か","き","く","け","こ"];
  let katakanaBase = ["ア","イ","ウ","エ","オ","カ","キ","ク","ケ","コ"];

  let dakutenSet = ["が","ぎ","ぐ","げ","ご"];
  let handakutenSet = ["ぱ","ぴ","ぷ","ぺ","ぽ"];

  let base = modo === "hiragana" ? hiraganaBase : katakanaBase;

  if (dakuten) base = base.concat(dakutenSet);
  if (handakuten) base = base.concat(handakutenSet);

  return base;
}

function mezclarArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function renderizarCartas(cartas) {
  tablero.innerHTML = "";

  cartas.forEach(valor => {
    const carta = document.createElement("div");
    carta.classList.add("card");
    carta.dataset.valor = valor;
    carta.textContent = "";

    carta.addEventListener("click", () => manejarClick(carta));

    tablero.appendChild(carta);
  });
}

function manejarClick(carta) {
  if (bloqueado) return;
  if (carta.classList.contains("revelada")) return;

  carta.textContent = carta.dataset.valor;
  carta.classList.add("revelada");

  if (!primeraCarta) {
    primeraCarta = carta;
    return;
  }

  segundaCarta = carta;
  bloqueado = true;
  intentos++;
  intentosSpan.textContent = intentos;

  if (primeraCarta.dataset.valor === segundaCarta.dataset.valor) {
    resetSeleccion();
  } else {
    setTimeout(() => {
      primeraCarta.textContent = "";
      segundaCarta.textContent = "";
      primeraCarta.classList.remove("revelada");
      segundaCarta.classList.remove("revelada");
      resetSeleccion();
    }, 800);
  }
}

function resetSeleccion() {
  primeraCarta = null;
  segundaCarta = null;
  bloqueado = false;
}
