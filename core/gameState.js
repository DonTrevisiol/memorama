/* ./memorama/core/gameState.js */
export const state = {
	modoJuego: "normal",
	sistema: "hiragana",
	modoCompetitivo: false,
	
	primeraCarta: null,
	segundaCarta: null,
	bloqueado: false,
	
	intentos: 0,
	aciertos: 0,
	rondas: 0,
	
	tiempoRestante: 60000,
	intervaloTimer: null
};
