import WebSocketManager from './socket.js';
import { CountUp } from './countUp.min.js';

const ws = new WebSocketManager('localhost:24050');
const overlay = document.getElementById('overlay');

const currentPerformanceElem = document.getElementById('current-performance');
const performanceElem = document.getElementById('performance');
const hit320Elem = document.getElementById('hit-320');
const hit300Elem = document.getElementById('hit-300');
const hit200Elem = document.getElementById('hit-200');
const hit100Elem = document.getElementById('hit-100');
const hit50Elem = document.getElementById('hit-50');
const hitMissElem = document.getElementById('hit-miss');

const currentPerformanceCounter = new CountUp('current-performance', 0);
const performanceCounter = new CountUp('performance', 0);
const hit320Counter = new CountUp('hit-320', 0);
const hit300Counter = new CountUp('hit-300', 0);
const hit200Counter = new CountUp('hit-200', 0);
const hit100Counter = new CountUp('hit-100', 0);
const hit50Counter = new CountUp('hit-50', 0);
const hitMissCounter = new CountUp('hit-miss', 0);

const cache = {
    performance: 0,
    currentPerformance: 0,
    hit320: 0,
    hit300: 0,
    hit200: 0,
    hit100: 0,
    hit50: 0,
    hitMiss: 0,
    stateNumber: 0,
};

const colors = {
    performance: 'orange',
    '320': 'lightblue',
    '300': 'yellow',
    '200': 'limegreen',
    '100': 'dodgerblue',
    '50': 'violetblue',
    'miss': 'red',
};

const updateElement = (element, counter, value, color) => {
    if (element.innerText !== value.toString()) {
        counter.update(value);
        const containerElement = element.closest('.container');
        const barElement = containerElement?.querySelector('.bar');
        if (barElement) {
            barElement.style.backgroundColor = color;
            barElement.style.boxShadow = `0px 0px 10px 5px ${color}`;
            setTimeout(() => {
                barElement.style.backgroundColor = 'white';
                barElement.style.boxShadow = "0px 0px 0px 0px transparent";
            }, 500);
        } else {
            console.error('Bar element not found');
        }
    }
};

const updateOverlay = (data) => {
    try {
        const { play, state } = data;
        if (cache.stateNumber !== state.number) {
            cache.stateNumber = state.number;
            if (state.number === 2) {
                overlay.style.opacity = 1;
            } else {
                overlay.style.opacity = 0;
            }
        }
    
        const performance = play.pp.fc
        if (performance !== cache.performance) {
            updateElement(performanceElem, performanceCounter, play.pp.fc, colors.performance);
            cache.performance = performance;
        }
        const currentPerformance = play.pp.current
        if (performance !== cache.currentPerformance) {
            updateElement(currentPerformanceElem, currentPerformanceCounter, play.pp.current, colors.performance);
            cache.currentPerformance = currentPerformance;
        }
    
        const hits = [
            { elem: hit320Elem, counter: hit320Counter, value: play.hits.geki, cacheKey: 'hit320', color: colors['320'] },
            { elem: hit300Elem, counter: hit300Counter, value: play.hits[300], cacheKey: 'hit300', color: colors['300'] },
            { elem: hit200Elem, counter: hit200Counter, value: play.hits.katu, cacheKey: 'hit200', color: colors['200'] },
            { elem: hit100Elem, counter: hit100Counter, value: play.hits[100], cacheKey: 'hit100', color: colors['100'] },
            { elem: hit50Elem, counter: hit50Counter, value: play.hits[50], cacheKey: 'hit50', color: colors['50'] },
            { elem: hitMissElem, counter: hitMissCounter, value: play.hits[0], cacheKey: 'hitMiss', color: colors.miss },
        ];
        for (let i = 0; i < hits.length; i++) {
            if (hits[i].value !== cache[hits[i].cacheKey]) {
                updateElement(hits[i].elem, hits[i].counter, hits[i].value, hits[i].color);
                cache[hits[i].cacheKey] = hits[i].value;
            }
        }
    } catch (error) {
        console.error(error);
        
    }
};

ws.api_v2(updateOverlay);
