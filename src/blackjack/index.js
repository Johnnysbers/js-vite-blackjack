import _ from 'underscore';
// import { crearDeck as crearNuevoDeck } from './usecases/crear-deck';
import { crearDeck, pedirCarta, valorCarta } from './usecases';

(() => {
    'use strict'

    let deck         = [];
    const tipos      = ['C', 'D', 'H', 'S'],
          especiales = ['A', 'J', 'Q', 'K'];

    let puntosJugadores = [];

    // Referencias del HTML
    const btnPedir   = document.querySelector('#btnPedir'),
          btnDetener = document.querySelector('#btnDetener'),
          btnNuevo   = document.querySelector('#btnNuevo');

    const divCartasJugadores = document.querySelectorAll('.divCartas'),
          puntosHTML         = document.querySelectorAll('small');

    deck = crearDeck(tipos, especiales);
    
    // Esta función inicializa el juego
    const inicializarJuego = (numJugadores = 2) => {
        console.clear();
        deck = crearDeck(tipos, especiales);

        puntosJugadores = [];

        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);            
        }

        puntosHTML.forEach(elem => elem.innerText = 0);
        divCartasJugadores.forEach(elem => elem.innerHTML = '');

        btnPedir.disabled   = false;
        btnDetener.disabled = false;
    }

    pedirCarta(deck);

    // Turno: 0 = primer jugador y el último será el ordenador
    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];

        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${carta}.png`; // 3H, JD
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append(imgCarta);
    }
    
    const determinarGanador = () => {
        const [puntosMinimos, puntosOrdenador] = puntosJugadores;

        setTimeout(() => {
            if (puntosOrdenador === puntosMinimos) {
                alert('Nadie gana 🥺');
            } else if (puntosMinimos > 21) {
                alert('¡Ordenador gana!');
            } else if (puntosOrdenador > 21){
                alert('Jugador gana!');
            } else {
                alert('¡Ordenador gana!');
            }
        }, 10);
    }
    
    // Turno del ordenador
    const turnoOrdenador = (puntosMinimos) => {
        let puntosOrdenador = 0;

        do {
            const carta = pedirCarta(deck);
            
            puntosOrdenador = acumularPuntos(carta, puntosJugadores.length - 1);
            crearCarta(carta, puntosJugadores.length - 1);

        } while ((puntosOrdenador < puntosMinimos) && (puntosMinimos <= 21));

        determinarGanador();
    }

    // Eventos
    btnPedir.addEventListener('click', () => {
        
        const carta = pedirCarta(deck);
        const puntosJugador = acumularPuntos(carta, 0);

        crearCarta(carta, 0);

        if (puntosJugador > 21) {
            console.warn('Lo siento mucho, perdiste');
            btnPedir.disabled   = true;
            btnDetener.disabled = true;
            turnoOrdenador(puntosJugador);
        } else if (puntosJugador === 21) {
            console.warn('¡21, genial!');
            btnPedir.disabled   = true;
            btnDetener.disabled = true;
            turnoOrdenador(puntosJugador);
        }
    });

    btnDetener.addEventListener('click', () => {
        btnPedir.disabled   = true;
        btnDetener.disabled = true;

        turnoOrdenador(puntosJugadores[0]);
    });

    btnNuevo.addEventListener('click', () => {
        inicializarJuego();
    });
})();