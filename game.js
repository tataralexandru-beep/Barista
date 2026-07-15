/*
 * ESPRESSO DOOM: CAFFEINE RUSH
 * A coffee-themed 3D Raycaster survival game written in vanilla JS.
 * Ported with classic DOOM state-machine structures, pain chances,
 * responsive multi-touch PC & mobile controls, and synthesized chiptunes.
 */

// Global Configuration & Constants
const MAP_WIDTH = 24;
const MAP_HEIGHT = 24;

// Cozy Cafe Map (0 = empty, >0 = walls)
const MAP_COZY_CAFE = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,0,0,2,2,0,2,2,0,1,0,0,4,4,4,4,0,1],
    [1,0,0,1,1,0,1,0,0,2,0,0,0,2,0,1,0,0,4,0,0,4,0,1],
    [1,0,0,1,1,0,0,0,0,2,0,0,0,2,0,0,0,0,4,0,0,4,0,1],
    [1,0,0,0,0,0,0,0,0,2,2,0,2,2,0,0,0,0,4,0,0,4,0,1],
    [1,1,1,0,1,1,1,1,0,0,0,0,0,0,0,1,1,1,4,0,0,4,0,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,3,3,3,0,1],
    [1,0,0,2,2,2,0,0,0,1,0,0,1,0,0,0,0,0,0,3,0,3,0,1],
    [1,0,0,2,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,3,0,1],
    [1,0,0,2,2,2,0,0,0,1,0,0,1,0,0,0,0,0,0,3,3,3,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,0,1,1,1,1,1,0,0,1,1,1,1,1,1,0,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,3,3,3,3,0,0,1,0,0,1,0,0,4,4,4,4,4,0,0,0,1],
    [1,0,0,3,0,0,3,0,0,0,0,0,0,0,0,4,0,0,0,4,0,0,0,1],
    [1,0,0,3,0,0,3,0,0,0,0,0,0,0,0,4,0,0,0,4,0,0,0,1],
    [1,0,0,3,3,3,3,0,0,0,0,0,0,0,0,4,4,4,4,4,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// The Office Grind Map
const MAP_OFFICE_GRIND = [
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,0,0,0,0,0,2,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2],
    [2,0,3,3,3,0,2,0,3,3,3,0,3,3,0,2,0,3,3,3,3,3,0,2],
    [2,0,3,0,3,0,0,0,3,0,3,0,3,0,0,0,0,3,0,0,0,3,0,2],
    [2,0,3,0,3,0,2,0,3,0,3,0,3,0,2,2,0,3,0,2,0,3,0,2],
    [2,0,3,3,3,0,2,0,3,3,3,0,3,0,0,2,0,3,3,2,3,3,0,2],
    [2,0,0,0,0,0,2,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2],
    [2,2,0,2,2,2,2,2,2,0,2,2,2,2,0,2,2,2,2,2,0,2,2,2],
    [2,0,0,0,0,0,0,0,2,0,2,0,0,2,0,2,0,0,0,2,0,2,0,2],
    [2,0,1,1,1,1,1,0,2,0,2,0,0,2,0,2,0,1,0,2,0,2,0,2],
    [2,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,2],
    [2,0,1,0,0,0,1,0,2,0,2,2,2,2,0,2,0,1,1,1,1,1,0,2],
    [2,0,1,1,0,1,1,0,2,0,2,0,0,2,0,2,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,2,0,2,0,0,2,0,2,2,2,2,2,0,2,2,2],
    [2,2,2,2,0,2,2,2,2,0,2,0,0,2,0,0,0,0,0,2,0,2,0,2],
    [2,0,0,0,0,0,0,0,0,0,2,0,0,2,2,2,2,2,0,2,0,2,0,2],
    [2,0,4,4,4,4,4,4,0,0,2,0,0,0,0,0,0,2,0,2,0,0,0,2],
    [2,0,4,0,0,0,0,4,0,0,2,2,2,2,2,2,0,2,0,2,2,2,0,2],
    [2,0,4,0,3,3,0,4,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2],
    [2,0,4,0,3,3,0,4,0,2,2,0,2,2,0,2,2,2,2,2,2,2,0,2],
    [2,0,4,0,0,0,0,4,0,2,0,0,0,2,0,2,0,0,0,0,0,2,0,2],
    [2,0,4,4,4,4,4,4,0,2,0,0,0,2,0,2,0,3,3,3,0,2,0,2],
    [2,0,0,0,0,0,0,0,0,2,0,0,0,2,0,0,0,3,0,3,0,0,0,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
];

// Coffee Warehouse Map
const MAP_COFFEE_WAREHOUSE = [
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,4,4,4,4,4,4,4,4,4,0,3,0,1,1,1,1,1,1,1,1,0,3],
    [3,0,4,0,0,0,0,0,0,0,4,0,3,0,1,0,0,0,0,0,0,1,0,3],
    [3,0,4,0,1,1,1,1,1,0,4,0,0,0,1,0,2,2,2,2,0,1,0,3],
    [3,0,4,0,1,0,0,0,1,0,4,0,3,0,1,0,2,0,0,2,0,1,0,3],
    [3,0,4,0,1,0,0,0,1,0,4,0,3,0,1,0,2,0,0,2,0,1,0,3],
    [3,0,4,0,1,1,0,1,1,0,4,0,3,0,1,0,2,2,2,2,0,1,0,3],
    [3,0,4,0,0,0,0,0,0,0,4,0,3,0,1,0,0,0,0,0,0,1,0,3],
    [3,0,4,4,4,4,0,4,4,4,4,0,3,0,1,1,1,1,0,1,1,1,0,3],
    [3,0,0,0,0,3,0,3,0,0,0,0,3,0,0,0,0,3,0,3,0,0,0,3],
    [3,3,3,3,0,3,0,3,0,3,3,3,3,3,3,3,0,3,0,3,0,3,3,3],
    [3,0,0,0,0,3,0,3,0,0,0,0,0,0,0,0,0,3,0,3,0,0,0,3],
    [3,0,2,2,2,3,0,3,2,2,2,2,2,2,2,2,2,3,0,3,2,2,0,3],
    [3,0,2,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,2,0,3],
    [3,0,2,0,4,4,4,4,4,4,0,2,2,0,4,4,4,4,4,4,0,2,0,3],
    [3,0,2,0,4,0,0,0,0,4,0,0,0,0,4,0,0,0,0,4,0,2,0,3],
    [3,0,2,0,4,0,1,1,0,4,0,3,3,0,4,0,1,1,0,4,0,2,0,3],
    [3,0,2,0,4,0,1,1,0,4,0,3,3,0,4,0,1,1,0,4,0,2,0,3],
    [3,0,2,0,4,0,0,0,0,4,0,0,0,0,4,0,0,0,0,4,0,2,0,3],
    [3,0,2,0,4,4,4,4,4,4,0,2,2,0,4,4,4,4,4,4,0,2,0,3],
    [3,0,2,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,2,0,3],
    [3,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,3],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]
];

// Web Audio API Synthesizer
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    switch (type) {
        case 'shoot': {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(360, now);
            osc.frequency.exponentialRampToValueAtTime(70, now + 0.16);

            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.16);

            // Sizzling steam noise
            const bufferSize = audioCtx.sampleRate * 0.13;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;
            const noiseGain = audioCtx.createGain();
            noiseGain.gain.setValueAtTime(0.22, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.13);
            noise.connect(noiseGain);
            noiseGain.connect(audioCtx.destination);
            noise.start(now);
            noise.stop(now + 0.13);
            break;
        }
        case 'zombie_groan': {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(115, now);
            osc.frequency.linearRampToValueAtTime(65, now + 0.65);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.7);
            break;
        }
        case 'zombie_hit': {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(260, now);
            osc.frequency.exponentialRampToValueAtTime(90, now + 0.12);

            gain.gain.setValueAtTime(0.22, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.12);
            break;
        }
        case 'pickup_caffeine': {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
            osc.frequency.setValueAtTime(783.99, now + 0.16); // G5

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.35);
            break;
        }
        case 'player_hit': {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(75, now);
            osc.frequency.exponentialRampToValueAtTime(25, now + 0.22);

            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.22);
            break;
        }
        case 'level_clear': {
            const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
            const dur = 0.08;
            notes.forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + idx * dur);

                gain.gain.setValueAtTime(0.15, now + idx * dur);
                gain.gain.exponentialRampToValueAtTime(0.005, now + idx * dur + 0.2);

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start(now + idx * dur);
                osc.stop(now + idx * dur + 0.2);
            });
            break;
        }
    }
}

// Background music looping synthesizer
let musicInterval = null;
let musicTempo = 135; // bpm
function startBackgroundMusic() {
    if (musicInterval) clearInterval(musicInterval);
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const scale = [130.81, 146.83, 164.81, 196.00, 220.00];
    const melody = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    let step = 0;

    const intervalMs = (60 / musicTempo) * 1000 / 2; // Eighth notes

    musicInterval = setInterval(() => {
        const now = audioCtx.currentTime;

        if (step % 2 === 0) {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const bassIdx = (step / 2) % 4;
            const bassNotes = [scale[0], scale[3], scale[4], scale[2]];

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(bassNotes[bassIdx], now);

            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.005, now + 0.2);

            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.2);
        }

        if (Math.random() < 0.4 && step % 4 !== 0) {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const note = melody[Math.floor(Math.random() * melody.length)];

            osc.type = 'sine';
            osc.frequency.setValueAtTime(note, now);

            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.15);
        }

        step++;
    }, intervalMs);
}

function stopBackgroundMusic() {
    if (musicInterval) {
        clearInterval(musicInterval);
        musicInterval = null;
    }
}


// Procedural Assets (Wall Textures & Sprites)
const textures = [];
const sprites = {};

function buildProceduralAssets() {
    const createTextureCanvas = (type) => {
        const cv = document.createElement('canvas');
        cv.width = 64;
        cv.height = 64;
        const ctx = cv.getContext('2d');

        if (type === 1) {
            ctx.fillStyle = '#2c1b18';
            ctx.fillRect(0, 0, 64, 64);
            ctx.strokeStyle = '#1e110f';
            ctx.lineWidth = 2;
            for (let y = 0; y < 64; y += 16) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(64, y);
                ctx.stroke();

                for (let x = 8; x < 64; x += 16) {
                    ctx.beginPath();
                    ctx.moveTo(x + (y % 32 === 0 ? 8 : 0), y);
                    ctx.lineTo(x + (y % 32 === 0 ? 8 : 0), y + 16);
                    ctx.stroke();
                }
            }
            ctx.fillStyle = 'rgba(215, 204, 200, 0.15)';
            ctx.fillRect(0, 0, 64, 4);

        } else if (type === 2) {
            ctx.fillStyle = '#cfd8dc';
            ctx.fillRect(0, 0, 64, 64);
            ctx.strokeStyle = '#78909c';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, 64, 64);

            ctx.fillStyle = '#90caf9';
            ctx.fillRect(10, 15, 12, 12);
            ctx.fillStyle = 'rgba(121, 85, 72, 0.4)';
            ctx.fillRect(14, 23, 8, 4);

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(45, 20, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#37474f';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(45, 20);
            ctx.lineTo(45, 15);
            ctx.moveTo(45, 20);
            ctx.lineTo(49, 20);
            ctx.stroke();

        } else if (type === 3) {
            ctx.fillStyle = '#8d6e63';
            ctx.fillRect(0, 0, 64, 64);
            ctx.strokeStyle = '#5d4037';
            ctx.lineWidth = 1;
            for (let i = 0; i < 64; i += 4) {
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(64, i);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, 64);
                ctx.stroke();
            }
            ctx.fillStyle = '#3e2723';
            ctx.font = 'bold 10px monospace';
            ctx.fillText("COFFEE", 14, 25);
            ctx.fillText("BEANS", 17, 37);
            ctx.fillText("100%", 20, 49);

        } else if (type === 4) {
            ctx.fillStyle = '#1a0f0d';
            ctx.fillRect(0, 0, 64, 64);
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#ff9800';
            ctx.strokeStyle = '#ff9800';
            ctx.lineWidth = 2;
            ctx.strokeRect(8, 8, 48, 48);

            ctx.fillStyle = 'transparent';
            ctx.beginPath();
            ctx.moveTo(24, 28);
            ctx.lineTo(40, 28);
            ctx.lineTo(38, 44);
            ctx.lineTo(26, 44);
            ctx.closePath();
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(40, 36, 4, -Math.PI/2, Math.PI/2);
            ctx.stroke();

            ctx.strokeStyle = '#ffcc80';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(28, 24);
            ctx.bezierCurveTo(26, 20, 30, 18, 28, 14);
            ctx.moveTo(34, 24);
            ctx.bezierCurveTo(32, 20, 36, 18, 34, 14);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        return cv;
    };

    for (let i = 1; i <= 4; i++) {
        textures[i] = createTextureCanvas(i);
    }

    // CREATE SPRITE FRAMES (DOOM state-machine visual frames)

    // Sleep-deprived Zombie - Frame A (Left step)
    const zombieA = document.createElement('canvas');
    zombieA.width = 64; zombieA.height = 128;
    const zACtx = zombieA.getContext('2d');
    zACtx.fillStyle = '#37474f'; zACtx.fillRect(16, 48, 32, 60);
    zACtx.fillStyle = '#cfd8dc'; zACtx.fillRect(12, 55, 12, 10); zACtx.fillRect(40, 55, 12, 10);
    zACtx.fillStyle = '#f44336'; zACtx.fillRect(44, 60, 10, 12);
    zACtx.fillStyle = '#ffcc80'; zACtx.fillRect(20, 20, 24, 28);
    zACtx.fillStyle = '#b0bec5'; zACtx.fillRect(22, 28, 8, 6); zACtx.fillRect(34, 28, 8, 6);
    zACtx.fillStyle = '#f44336'; zACtx.fillRect(24, 29, 2, 2); zACtx.fillRect(36, 29, 2, 2);
    zACtx.fillStyle = '#000000'; zACtx.fillRect(27, 38, 10, 8); // Yawn mouth
    zACtx.fillStyle = '#4e342e'; zACtx.fillRect(16, 14, 32, 8);
    zACtx.fillStyle = '#795548'; zACtx.fillRect(14, 108, 14, 12); zACtx.fillRect(36, 108, 16, 12); // Foot step A
    sprites.zombieA = zombieA;

    // Sleep-deprived Zombie - Frame B (Right step)
    const zombieB = document.createElement('canvas');
    zombieB.width = 64; zombieB.height = 128;
    const zBCtx = zombieB.getContext('2d');
    zBCtx.fillStyle = '#37474f'; zBCtx.fillRect(16, 48, 32, 60);
    zBCtx.fillStyle = '#cfd8dc'; zBCtx.fillRect(10, 55, 12, 10); zBCtx.fillRect(42, 55, 12, 10);
    zBCtx.fillStyle = '#f44336'; zBCtx.fillRect(44, 60, 10, 12);
    zBCtx.fillStyle = '#ffcc80'; zBCtx.fillRect(20, 20, 24, 28);
    zBCtx.fillStyle = '#b0bec5'; zBCtx.fillRect(22, 28, 8, 6); zBCtx.fillRect(34, 28, 8, 6);
    zBCtx.fillStyle = '#f44336'; zBCtx.fillRect(24, 29, 2, 2); zBCtx.fillRect(36, 29, 2, 2);
    zBCtx.fillStyle = '#000000'; zBCtx.fillRect(27, 38, 10, 8);
    zBCtx.fillStyle = '#4e342e'; zBCtx.fillRect(16, 14, 32, 8);
    zBCtx.fillStyle = '#795548'; zBCtx.fillRect(12, 108, 16, 12); zBCtx.fillRect(34, 108, 14, 12); // Foot step B
    sprites.zombieB = zombieB;

    // Sleep-deprived Zombie - Frame P (Pain / Hurt Flinch)
    const zombiePain = document.createElement('canvas');
    zombiePain.width = 64; zombiePain.height = 128;
    const zPCtx = zombiePain.getContext('2d');
    zPCtx.fillStyle = '#4e3629'; zPCtx.fillRect(14, 48, 36, 60); // Dark splatters
    zPCtx.fillStyle = '#cfd8dc'; zPCtx.fillRect(8, 45, 12, 15); zPCtx.fillRect(44, 45, 12, 15); // Recoil arms up!
    zPCtx.fillStyle = '#ffcc80'; zPCtx.fillRect(20, 16, 24, 28);
    zPCtx.fillStyle = '#b71c1c'; zPCtx.fillRect(20, 16, 24, 10); // Red pain forehead
    zPCtx.fillStyle = '#000000'; zPCtx.fillRect(24, 32, 16, 4); // Frown
    sprites.zombiePain = zombiePain;

    // Sleep-deprived Zombie - Frame D1 (Death Collapse Frame 1)
    const zombieD1 = document.createElement('canvas');
    zombieD1.width = 64; zombieD1.height = 128;
    const zD1Ctx = zombieD1.getContext('2d');
    zD1Ctx.fillStyle = '#37474f'; zD1Ctx.fillRect(14, 70, 36, 40); // Collapsing torso
    zD1Ctx.fillStyle = '#ffcc80'; zD1Ctx.fillRect(20, 42, 24, 28);
    zD1Ctx.fillStyle = '#b71c1c'; zD1Ctx.fillRect(18, 50, 28, 6);
    sprites.zombieD1 = zombieD1;

    // Sleep-deprived Zombie - Frame D2 (Death Collapse Frame 2 / Spilled Coffee puddle)
    const zombieD2 = document.createElement('canvas');
    zombieD2.width = 64; zombieD2.height = 128;
    const zD2Ctx = zombieD2.getContext('2d');
    // Dark mahogany brown coffee puddle spreading out wide on the floor
    zD2Ctx.fillStyle = '#2c1b18';
    zD2Ctx.beginPath();
    zD2Ctx.ellipse(32, 110, 26, 12, 0, 0, Math.PI * 2);
    zD2Ctx.fill();
    zD2Ctx.fillStyle = '#4e342e'; // Disheveled hair floating in puddle
    zD2Ctx.fillRect(24, 102, 16, 8);
    zD2Ctx.fillStyle = '#f44336'; // Empty red mug sitting on side
    zD2Ctx.fillRect(42, 104, 10, 8);
    sprites.zombieD2 = zombieD2;

    // Coffee Beans / Caffeine Collectible Ammo/Health
    const caffeineSprite = document.createElement('canvas');
    caffeineSprite.width = 64;
    caffeineSprite.height = 64;
    const cCtx = caffeineSprite.getContext('2d');
    cCtx.fillStyle = 'rgba(255, 152, 0, 0.3)';
    cCtx.beginPath();
    cCtx.arc(32, 32, 24, 0, Math.PI*2);
    cCtx.fill();
    cCtx.fillStyle = '#5d4037';
    cCtx.beginPath();
    cCtx.ellipse(32, 32, 14, 20, Math.PI / 6, 0, Math.PI*2);
    cCtx.fill();
    cCtx.strokeStyle = '#ffe0b2';
    cCtx.lineWidth = 2;
    cCtx.beginPath();
    cCtx.moveTo(25, 16);
    cCtx.bezierCurveTo(28, 24, 36, 40, 39, 48);
    cCtx.stroke();
    sprites.caffeine = caffeineSprite;

    // Hot Croissant / Donut for Health
    const donutSprite = document.createElement('canvas');
    donutSprite.width = 64;
    donutSprite.height = 64;
    const dCtx = donutSprite.getContext('2d');
    dCtx.fillStyle = 'rgba(233, 30, 99, 0.25)';
    dCtx.beginPath();
    dCtx.arc(32, 32, 22, 0, Math.PI * 2);
    dCtx.fill();
    dCtx.fillStyle = '#ffb74d';
    dCtx.beginPath();
    dCtx.arc(32, 32, 16, 0, Math.PI * 2);
    dCtx.fill();
    dCtx.fillStyle = '#f06292';
    dCtx.beginPath();
    dCtx.arc(32, 32, 13, 0, Math.PI * 2);
    dCtx.fill();
    dCtx.globalCompositeOperation = 'destination-out';
    dCtx.beginPath();
    dCtx.arc(32, 32, 5, 0, Math.PI * 2);
    dCtx.fill();
    dCtx.globalCompositeOperation = 'source-over';
    dCtx.fillStyle = '#00e676';
    dCtx.fillRect(24, 24, 3, 2);
    dCtx.fillStyle = '#29b6f6';
    dCtx.fillRect(36, 22, 3, 2);
    dCtx.fillStyle = '#ffeb3b';
    dCtx.fillRect(30, 38, 2, 3);
    dCtx.fillStyle = '#ffffff';
    dCtx.fillRect(22, 34, 3, 2);
    sprites.donut = donutSprite;

    // RETRO WOODEN COFFEE GRINDER (Compact weapon layout)
    // Idle / Ready state
    const gunIdle = document.createElement('canvas');
    gunIdle.width = 128;
    gunIdle.height = 128;
    const gCtx = gunIdle.getContext('2d');

    // Wood body of grinder
    gCtx.fillStyle = '#8d6e63';
    gCtx.fillRect(44, 65, 40, 50);
    gCtx.strokeStyle = '#5d4037';
    gCtx.lineWidth = 2;
    gCtx.strokeRect(44, 65, 40, 50);

    // Brass hopper funnel on top
    gCtx.fillStyle = '#ffd54f';
    gCtx.beginPath();
    gCtx.moveTo(40, 65);
    gCtx.lineTo(88, 65);
    gCtx.lineTo(76, 50);
    gCtx.lineTo(52, 50);
    gCtx.closePath();
    gCtx.fill();
    gCtx.stroke();

    // Black coffee beans peeking out of hopper
    gCtx.fillStyle = '#3e2723';
    gCtx.beginPath();
    gCtx.arc(64, 58, 6, 0, Math.PI*2);
    gCtx.fill();

    // Metallic Crank pin
    gCtx.fillStyle = '#90a4ae';
    gCtx.fillRect(62, 40, 4, 10);

    // Crank handle lever (Idle resting position)
    gCtx.strokeStyle = '#b0bec5';
    gCtx.lineWidth = 3;
    gCtx.beginPath();
    gCtx.moveTo(64, 40);
    gCtx.lineTo(92, 32);
    gCtx.stroke();

    // Wooden crank knob on the handle
    gCtx.fillStyle = '#5d4037';
    gCtx.beginPath();
    gCtx.arc(92, 32, 5, 0, Math.PI*2);
    gCtx.fill();

    sprites.gunIdle = gunIdle;

    // Firing State (Crank handle rapidly spinning, grinding beans / coffee grounds flying)
    const gunFire = document.createElement('canvas');
    gunFire.width = 128;
    gunFire.height = 128;
    const gfCtx = gunFire.getContext('2d');

    // Redraw Wood body slightly vibrating
    gfCtx.fillStyle = '#8d6e63';
    gfCtx.fillRect(44, 67, 40, 50); // Vibrated down 2px
    gfCtx.strokeStyle = '#5d4037';
    gfCtx.lineWidth = 2;
    gfCtx.strokeRect(44, 67, 40, 50);

    // Brass hopper
    gfCtx.fillStyle = '#ffd54f';
    gfCtx.beginPath();
    gfCtx.moveTo(40, 67);
    gfCtx.lineTo(88, 67);
    gfCtx.lineTo(76, 52);
    gfCtx.lineTo(52, 52);
    gfCtx.closePath();
    gfCtx.fill();
    gfCtx.stroke();

    // Crank pin
    gfCtx.fillStyle = '#90a4ae';
    gfCtx.fillRect(62, 42, 4, 10);

    // Crank handle (Spinning rapidly to the opposite side!)
    gfCtx.strokeStyle = '#b0bec5';
    gfCtx.lineWidth = 3;
    gfCtx.beginPath();
    gfCtx.moveTo(64, 42);
    gfCtx.lineTo(38, 48); // Rotated left
    gfCtx.stroke();

    gfCtx.fillStyle = '#5d4037';
    gfCtx.beginPath();
    gfCtx.arc(38, 48, 5, 0, Math.PI*2);
    gfCtx.fill();

    // Steaming coffee powder grounds cloud spraying from the front!
    gfCtx.fillStyle = 'rgba(93, 64, 55, 0.6)';
    gfCtx.beginPath();
    gfCtx.arc(64, 25, 18, 0, Math.PI * 2);
    gfCtx.fill();

    // Splashing grounds/beans lines
    gfCtx.strokeStyle = '#ffe0b2';
    gfCtx.lineWidth = 2.5;
    gfCtx.beginPath();
    gfCtx.moveTo(60, 20); gfCtx.lineTo(55, 2);
    gfCtx.moveTo(64, 20); gfCtx.lineTo(64, 0);
    gfCtx.moveTo(68, 20); gfCtx.lineTo(73, 2);
    gfCtx.stroke();

    sprites.gunFire = gunFire;
}


// Engine Game State Variables
let canvas, ctx;
let playerX = 1.5, playerY = 1.5; // safe spawning coordinates
let playerAngle = 0;
let playerHealth = 100;
let playerAmmo = 50;
let playerScore = 0;
let currentWave = 1;
let currentLevel = 1;
let levelGrid = MAP_COZY_CAFE;
let gameActive = false;
let isPaused = false;
let highScores = { 1: 0, 2: 0, 3: 0 };

// Visual juice variables
let screenFlashColor = null;
let screenFlashTimer = 0;

// Controls Tracking
const keys = {};
let turnSpeed = 0.055;
let moveSpeed = 0.09;

// Entities (Zombies & Pickups)
let entities = [];

// Screen buffers / Resolution scaler
const RENDER_SCALE = 2;
let screenW, screenH;

// Touch Control State
let activeTouchId = null;
let touchStartX = 0;
let touchStartY = 0;
let touchCurX = 0;
let touchCurY = 0;
const joystickMaxRadius = 60;

// Dual mobile drag-to-aim variables
let rightTouchId = null;
let rightTouchStartX = 0;
let rightTouchStartY = 0;
let rightTouchLastX = 0;

// Input listeners setup
function setupInput() {
    window.addEventListener('keydown', (e) => {
        keys[e.code] = true;

        if (e.code === 'Space') {
            triggerShoot();
        }
        if (e.code === 'Escape') {
            togglePause();
        }
    });

    window.addEventListener('keyup', (e) => {
        keys[e.code] = false;
    });

    canvas.addEventListener('mousedown', (e) => {
        if (!gameActive || isPaused) return;
        if (window.matchMedia('(pointer: coarse)').matches) return;

        if (document.pointerLockElement !== canvas) {
            canvas.requestPointerLock();
        } else {
            triggerShoot();
        }
    });

    document.addEventListener('pointerlockchange', () => {
        if (document.pointerLockElement !== canvas && gameActive && !isPaused) {
            togglePause();
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (document.pointerLockElement === canvas && gameActive && !isPaused) {
            playerAngle += e.movementX * 0.0035;
        }
    });

    const leftJoy = document.getElementById('left-joystick-base');
    const knob = document.getElementById('left-joystick-knob');
    const fireBtn = document.getElementById('right-shoot-button');

    window.addEventListener('touchstart', (e) => {
        if (!gameActive || isPaused) return;

        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];

            const rect = leftJoy.getBoundingClientRect();
            const isInJoystick = (
                touch.clientX >= rect.left &&
                touch.clientX <= rect.right &&
                touch.clientY >= rect.top &&
                touch.clientY <= rect.bottom
            );

            const fireRect = fireBtn.getBoundingClientRect();
            const isInFire = (
                touch.clientX >= fireRect.left &&
                touch.clientX <= fireRect.right &&
                touch.clientY >= fireRect.top &&
                touch.clientY <= fireRect.bottom
            );

            if (isInJoystick) {
                activeTouchId = touch.identifier;
                touchStartX = rect.left + rect.width / 2;
                touchStartY = rect.top + rect.height / 2;
                touchCurX = touch.clientX;
                touchCurY = touch.clientY;
            } else if (!isInFire && touch.clientX > window.innerWidth / 2) {
                rightTouchId = touch.identifier;
                rightTouchStartX = touch.clientX;
                rightTouchStartY = touch.clientY;
                rightTouchLastX = touch.clientX;
            }
        }
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
        if (!gameActive || isPaused) return;

        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];

            if (touch.identifier === activeTouchId) {
                touchCurX = touch.clientX;
                touchCurY = touch.clientY;

                let dx = touchCurX - touchStartX;
                let dy = touchCurY - touchStartY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist > joystickMaxRadius) {
                    dx = (dx / dist) * joystickMaxRadius;
                    dy = (dy / dist) * joystickMaxRadius;
                }

                knob.style.transform = `translate(${dx}px, ${dy}px)`;
            } else if (touch.identifier === rightTouchId) {
                const diffX = touch.clientX - rightTouchLastX;
                rightTouchLastX = touch.clientX;
                playerAngle += diffX * 0.007;
            }
        }
    }, { passive: false });

    const handleTouchEnd = (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            if (touch.identifier === activeTouchId) {
                activeTouchId = null;
                touchStartX = 0;
                touchStartY = 0;
                touchCurX = 0;
                touchCurY = 0;
                knob.style.transform = 'translate(0px, 0px)';
            } else if (touch.identifier === rightTouchId) {
                rightTouchId = null;
            }
        }
    };

    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    fireBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        triggerShoot();
    });

    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    screenW = Math.floor(window.innerWidth / RENDER_SCALE);
    screenH = Math.floor((window.innerHeight - 90) / RENDER_SCALE);

    canvas.width = screenW;
    canvas.height = screenH;

    const mobileUI = document.getElementById('mobile-controls');
    if (window.matchMedia('(pointer: coarse)').matches) {
        mobileUI.classList.remove('hidden');
    } else {
        mobileUI.classList.add('hidden');
    }
}


// Game loops & weapon/zombie state machines
let lastTime = 0;
let shootAnimFrame = 0;

function initGame() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    buildProceduralAssets();
    setupInput();
    resizeCanvas();

    const storedScores = localStorage.getItem('espresso_doom_highscores');
    if (storedScores) {
        highScores = JSON.parse(storedScores);
    }
    updateGlobalHighScoreDisplay();

    requestAnimationFrame(gameLoop);
}

function updateGlobalHighScoreDisplay() {
    const curLevelBtn = document.querySelector('.level-btn.active');
    const lvl = curLevelBtn ? parseInt(curLevelBtn.dataset.level) : 1;
    document.getElementById('global-high-score').textContent = highScores[lvl] || 0;
}

function startGame(levelNum) {
    currentLevel = levelNum;
    if (levelNum === 1) levelGrid = MAP_COZY_CAFE;
    else if (levelNum === 2) levelGrid = MAP_OFFICE_GRIND;
    else levelGrid = MAP_COFFEE_WAREHOUSE;

    playerX = 1.5;
    playerY = 1.5;
    playerAngle = 0;
    playerHealth = 100;
    playerAmmo = 60;
    playerScore = 0;
    currentWave = 1;

    screenFlashColor = null;
    screenFlashTimer = 0;

    entities = [];

    spawnStaticItems();
    spawnWave(currentWave);

    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('pause-screen').classList.add('hidden');
    document.getElementById('gameover-screen').classList.add('hidden');

    gameActive = true;
    isPaused = false;

    updateHUD();
    playSound('level_clear');
    startBackgroundMusic();
}

function spawnStaticItems() {
    for (let r = 1; r < MAP_HEIGHT - 1; r++) {
        for (let c = 1; c < MAP_WIDTH - 1; c++) {
            if (levelGrid[r][c] === 0) {
                if (r === 1 && c === 1) continue;

                const rand = Math.random();
                if (rand < 0.12) {
                    entities.push({
                        type: 'caffeine',
                        x: c + 0.5,
                        y: r + 0.5,
                        sprite: 'caffeine',
                        scale: 0.45,
                        pickupType: 'ammo',
                        active: true
                    });
                } else if (rand < 0.20) {
                    entities.push({
                        type: 'donut',
                        x: c + 0.5,
                        y: r + 0.5,
                        sprite: 'donut',
                        scale: 0.45,
                        pickupType: 'health',
                        active: true
                    });
                }
            }
        }
    }
}

function spawnWave(wave) {
    const numZombies = wave * 2 + 1;
    let spawned = 0;
    let attempts = 0;

    while (spawned < numZombies && attempts < 100) {
        attempts++;
        const rx = Math.floor(Math.random() * (MAP_WIDTH - 2)) + 1;
        const ry = Math.floor(Math.random() * (MAP_HEIGHT - 2)) + 1;

        if (levelGrid[ry][rx] === 0) {
            const dist = Math.hypot(rx + 0.5 - playerX, ry + 0.5 - playerY);
            if (dist > 4.5) {
                // DOOM State-Machine Based Zombie Entity
                entities.push({
                    type: 'zombie',
                    x: rx + 0.5,
                    y: ry + 0.5,
                    state: 'CHASE', // State list: CHASE, PAIN, DEATH_1, DEATH_2
                    stateTimer: 0,
                    walkAnimTime: Math.random() * 10,
                    sprite: 'zombieA',
                    scale: 0.8,
                    health: 10 + wave * 5,
                    speed: 0.02 + Math.min(0.025, wave * 0.005),
                    damage: 8 + wave * 2,
                    lastGroan: Date.now() + Math.random() * 4000,
                    active: true
                });
                spawned++;
            }
        }
    }
}

function triggerShoot() {
    if (!gameActive || isPaused || playerAmmo <= 0 || shootAnimFrame > 0) return;

    playerAmmo--;
    shootAnimFrame = 1; // Transition Weapon FSM to firing flash state
    updateHUD();
    playSound('shoot');

    triggerScreenFlash('rgba(255, 236, 179, 0.15)', 0.12);

    // Raycasting shooting vector
    let minT = Infinity;
    let hitZombie = null;

    entities.forEach(ent => {
        if (ent.type === 'zombie' && ent.active && ent.state !== 'DEATH_2') {
            const dx = ent.x - playerX;
            const dy = ent.y - playerY;

            const lookX = Math.cos(playerAngle);
            const lookY = Math.sin(playerAngle);
            const projection = dx * lookX + dy * lookY;

            if (projection > 0) {
                const perpDistSq = (dx * dx + dy * dy) - projection * projection;
                if (perpDistSq < 0.22) {
                    if (projection < minT) {
                        minT = projection;
                        hitZombie = ent;
                    }
                }
            }
        }
    });

    let wallT = Infinity;
    const sinA = Math.sin(playerAngle);
    const cosA = Math.cos(playerAngle);

    for (let d = 0.1; d < 20; d += 0.1) {
        const wx = Math.floor(playerX + cosA * d);
        const wy = Math.floor(playerY + sinA * d);
        if (wx < 0 || wx >= MAP_WIDTH || wy < 0 || wy >= MAP_HEIGHT || levelGrid[wy][wx] > 0) {
            wallT = d;
            break;
        }
    }

    if (hitZombie && minT < wallT) {
        // Hit! Subtract health
        hitZombie.health -= 15;
        playSound('zombie_hit');
        spawnSplashParticles(hitZombie.x, hitZombie.y);

        // Doom-style "Pain Chance": 70% probability to transition walking zombie to PAIN flinch state
        if (hitZombie.health > 0) {
            if (Math.random() < 0.70 && hitZombie.state !== 'PAIN') {
                hitZombie.state = 'PAIN';
                hitZombie.stateTimer = 0.35; // stuns them for 0.35 seconds
                hitZombie.sprite = 'zombiePain';
            }
        } else {
            // Initiate sequential DEATH State Machine
            hitZombie.state = 'DEATH_1';
            hitZombie.stateTimer = 0.30; // 0.3 seconds in collapsing frame
            hitZombie.sprite = 'zombieD1';

            playerScore += 100;
            updateHUD();

            // Re-check wave state
            const aliveZombies = entities.filter(e => e.type === 'zombie' && e.active && e.state !== 'DEATH_1' && e.state !== 'DEATH_2').length;
            if (aliveZombies === 0) {
                currentWave++;
                playSound('level_clear');
                spawnWave(currentWave);
                playerAmmo = Math.min(100, playerAmmo + 20);
                updateHUD();
            }
        }
    }
}

// Particle Splash system
let particles = [];
function spawnSplashParticles(x, y) {
    for (let i = 0; i < 15; i++) {
        particles.push({
            x: x,
            y: y,
            z: 0.1 + Math.random() * 0.4,
            vx: (Math.random() - 0.5) * 0.12,
            vy: (Math.random() - 0.5) * 0.12,
            vz: (Math.random()) * 0.12,
            color: '#4e3629',
            life: 1.0
        });
    }
}

function triggerScreenFlash(color, duration) {
    screenFlashColor = color;
    screenFlashTimer = duration;
}

function updateHUD() {
    document.getElementById('health-val').textContent = playerHealth;
    document.getElementById('health-bar').style.width = playerHealth + '%';
    document.getElementById('ammo-val').textContent = playerAmmo;
    document.getElementById('ammo-bar').style.width = playerAmmo + '%';
    document.getElementById('hud-score').textContent = String(playerScore).padStart(6, '0');
    document.getElementById('hud-wave').textContent = currentWave;
    document.getElementById('coffee-level').style.height = playerHealth + '%';
}

function togglePause() {
    if (!gameActive) return;
    isPaused = !isPaused;

    const pauseScreen = document.getElementById('pause-screen');
    if (isPaused) {
        pauseScreen.classList.remove('hidden');
        document.exitPointerLock();
        stopBackgroundMusic();
    } else {
        pauseScreen.classList.add('hidden');
        canvas.requestPointerLock();
        startBackgroundMusic();
    }
}

function gameOver() {
    gameActive = false;
    document.exitPointerLock();
    stopBackgroundMusic();

    if (playerScore > highScores[currentLevel]) {
        highScores[currentLevel] = playerScore;
        localStorage.setItem('espresso_doom_highscores', JSON.stringify(highScores));
        updateGlobalHighScoreDisplay();
    }

    document.getElementById('final-score').textContent = playerScore;
    document.getElementById('final-waves').textContent = currentWave - 1;

    const totalKills = entities.filter(e => e.type === 'zombie' && !e.active).length;
    document.getElementById('final-kills').textContent = totalKills;

    document.getElementById('gameover-screen').classList.remove('hidden');
}


// Engine Loop
function gameLoop(time) {
    requestAnimationFrame(gameLoop);

    if (!gameActive || isPaused) {
        lastTime = time;
        return;
    }

    const dt = (time - lastTime) / 1000;
    lastTime = time;

    updateLogic(dt);
    render3D();
}

function isCellEmpty(x, y) {
    const gridX = Math.floor(x);
    const gridY = Math.floor(y);
    if (gridX < 0 || gridX >= MAP_WIDTH || gridY < 0 || gridY >= MAP_HEIGHT) return false;
    return levelGrid[gridY][gridX] === 0;
}

function checkCircleCollision(newX, newY, radius) {
    const directions = [
        [radius, 0], [-radius, 0], [0, radius], [0, -radius],
        [radius * 0.7, radius * 0.7], [-radius * 0.7, radius * 0.7],
        [radius * 0.7, -radius * 0.7], [-radius * 0.7, -radius * 0.7]
    ];

    for (let i = 0; i < directions.length; i++) {
        const testX = newX + directions[i][0];
        const testY = newY + directions[i][1];
        if (!isCellEmpty(testX, testY)) {
            return false;
        }
    }
    return true;
}

function updateLogic(dt) {
    // 1. ESPRESSO GUN WEAPON STATE MACHINE
    if (shootAnimFrame > 0) {
        shootAnimFrame++;
        if (shootAnimFrame > 8) shootAnimFrame = 0;
    }

    // 2. Visual Flash Timers
    if (screenFlashTimer > 0) {
        screenFlashTimer -= dt;
        if (screenFlashTimer <= 0) screenFlashColor = null;
    }

    // 3. MOVEMENT CONTROLS
    let moveX = 0;
    let moveY = 0;
    let rotation = 0;

    if (keys['KeyW'] || keys['ArrowUp']) {
        moveX += Math.cos(playerAngle);
        moveY += Math.sin(playerAngle);
    }
    if (keys['KeyS'] || keys['ArrowDown']) {
        moveX -= Math.cos(playerAngle);
        moveY -= Math.sin(playerAngle);
    }
    if (keys['KeyA']) {
        moveX += Math.sin(playerAngle);
        moveY -= Math.cos(playerAngle);
    }
    if (keys['KeyD']) {
        moveX -= Math.sin(playerAngle);
        moveY += Math.cos(playerAngle);
    }
    if (keys['KeyQ'] || keys['ArrowLeft']) {
        rotation -= 1.2 * turnSpeed;
    }
    if (keys['KeyE'] || keys['ArrowRight']) {
        rotation += 1.2 * turnSpeed;
    }

    if (activeTouchId !== null) {
        const dx = touchCurX - touchStartX;
        const dy = touchCurY - touchStartY;
        const dist = Math.hypot(dx, dy);

        if (dist > 10) {
            const angle = Math.atan2(dy, dx);
            const intensity = Math.min(1, dist / joystickMaxRadius);

            const forward = -Math.sin(angle) * intensity;
            const strafe = Math.cos(angle) * intensity;

            moveX += Math.cos(playerAngle) * forward + Math.sin(playerAngle) * strafe;
            moveY += Math.sin(playerAngle) * forward - Math.cos(playerAngle) * strafe;
        }
    }

    playerAngle += rotation;

    // Player Wall Sliding Collision
    if (moveX !== 0 || moveY !== 0) {
        const len = Math.hypot(moveX, moveY);
        const dx = (moveX / len) * moveSpeed;
        const dy = (moveY / len) * moveSpeed;

        const radius = 0.35;

        const testX = playerX + dx;
        if (checkCircleCollision(testX, playerY, radius)) {
            playerX = testX;
        }

        const testY = playerY + dy;
        if (checkCircleCollision(playerX, testY, radius)) {
            playerY = testY;
        }
    }

    // 4. ENTITY UPDATE & ZOMBIE STATE MACHINE
    const now = Date.now();
    entities.forEach(ent => {
        if (!ent.active) return;

        const distToPlayer = Math.hypot(playerX - ent.x, playerY - ent.y);

        if (ent.type === 'zombie') {

            // State: PAIN (Flinch stun)
            if (ent.state === 'PAIN') {
                ent.stateTimer -= dt;
                if (ent.stateTimer <= 0) {
                    ent.state = 'CHASE'; // Resume chase
                    ent.sprite = 'zombieA';
                }
                return; // Frozen/Stunned while in Pain state!
            }

            // State: DEATH_1 (Collapsing/Falling Frame)
            if (ent.state === 'DEATH_1') {
                ent.stateTimer -= dt;
                if (ent.stateTimer <= 0) {
                    ent.state = 'DEATH_2'; // Settle into dead puddle frame
                    ent.sprite = 'zombieD2';
                    ent.scale = 0.55; // Lower height profile for puddle
                }
                return;
            }

            // State: DEATH_2 (Permanent Dead puddle on the floor)
            if (ent.state === 'DEATH_2') {
                return;
            }

            // State: CHASE (Default Zombie AI)
            if (ent.state === 'CHASE') {
                // Periodic groan
                if (now > ent.lastGroan) {
                    playSound('zombie_groan');
                    ent.lastGroan = now + 4000 + Math.random() * 5000;
                }

                // Shuffle Leg Animations (A/B flip-flop walking frames)
                ent.walkAnimTime += dt * 5.5;
                ent.sprite = (Math.floor(ent.walkAnimTime) % 2 === 0) ? 'zombieA' : 'zombieB';

                if (distToPlayer > 0.48) {
                    const angleToPlayer = Math.atan2(playerY - ent.y, playerX - ent.x);
                    const stepX = Math.cos(angleToPlayer) * ent.speed;
                    const stepY = Math.sin(angleToPlayer) * ent.speed;

                    const zombieRadius = 0.30;
                    const nextZX = ent.x + stepX;
                    if (checkCircleCollision(nextZX, ent.y, zombieRadius)) {
                        ent.x = nextZX;
                    }
                    const nextZY = ent.y + stepY;
                    if (checkCircleCollision(ent.x, nextZY, zombieRadius)) {
                        ent.y = nextZY;
                    }
                } else {
                    // Inside melee attack range! Hit player
                    playerHealth -= ent.damage;
                    playSound('player_hit');
                    triggerScreenFlash('rgba(244, 67, 54, 0.35)', 0.22);

                    const attackAngle = Math.atan2(playerY - ent.y, playerX - ent.x);
                    const kbX = playerX + Math.cos(attackAngle) * 0.15;
                    const kbY = playerY + Math.sin(attackAngle) * 0.15;
                    if (checkCircleCollision(kbX, kbY, 0.35)) {
                        playerX = kbX;
                        playerY = kbY;
                    }

                    updateHUD();

                    if (playerHealth <= 0) {
                        playerHealth = 0;
                        updateHUD();
                        gameOver();
                    }
                }
            }
        }

        // Collectibles check
        if (ent.pickupType && distToPlayer < 0.6) {
            ent.active = false;
            playSound('pickup_caffeine');

            if (ent.pickupType === 'health') {
                playerHealth = Math.min(100, playerHealth + 25);
                triggerScreenFlash('rgba(76, 175, 80, 0.25)', 0.15);
            } else if (ent.pickupType === 'ammo') {
                playerAmmo = Math.min(100, playerAmmo + 30);
                triggerScreenFlash('rgba(255, 152, 0, 0.25)', 0.15);
            }
            updateHUD();
        }
    });

    // 5. PARTICLES UPDATE
    particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.vz -= 0.01;
        p.life -= dt * 2.0;
        if (p.life <= 0) {
            particles.splice(idx, 1);
        }
    });
}

function render3D() {
    ctx.fillStyle = '#1c100e';
    ctx.fillRect(0, 0, screenW, screenH / 2);
    ctx.fillStyle = '#422a22';
    ctx.fillRect(0, screenH / 2, screenW, screenH / 2);

    const fov = Math.PI / 3;
    const halfFov = fov / 2;
    const numRays = screenW;
    const wallZBuffer = new Float32Array(numRays);

    for (let r = 0; r < numRays; r++) {
        const rayAngle = playerAngle - halfFov + (r / numRays) * fov;
        const cosR = Math.cos(rayAngle);
        const sinR = Math.sin(rayAngle);

        let mapX = Math.floor(playerX);
        let mapY = Math.floor(playerY);

        let sideDistX, sideDistY;
        const deltaDistX = Math.abs(1 / cosR);
        const deltaDistY = Math.abs(1 / sinR);

        let stepX, stepY;
        let hit = 0;
        let side = 0;

        if (cosR < 0) {
            stepX = -1;
            sideDistX = (playerX - mapX) * deltaDistX;
        } else {
            stepX = 1;
            sideDistX = (mapX + 1.0 - playerX) * deltaDistX;
        }

        if (sinR < 0) {
            stepY = -1;
            sideDistY = (playerY - mapY) * deltaDistY;
        } else {
            stepY = 1;
            sideDistY = (mapY + 1.0 - playerY) * deltaDistY;
        }

        let limit = 0;
        while (hit === 0 && limit < 50) {
            limit++;
            if (sideDistX < sideDistY) {
                sideDistX += deltaDistX;
                mapX += stepX;
                side = 0;
            } else {
                sideDistY += deltaDistY;
                mapY += stepY;
                side = 1;
            }
            if (mapX >= 0 && mapX < MAP_WIDTH && mapY >= 0 && mapY < MAP_HEIGHT) {
                if (levelGrid[mapY][mapX] > 0) {
                    hit = levelGrid[mapY][mapX];
                }
            } else {
                break;
            }
        }

        let perpWallDist;
        if (side === 0) {
            perpWallDist = (mapX - playerX + (1 - stepX) / 2) / cosR;
        } else {
            perpWallDist = (mapY - playerY + (1 - stepY) / 2) / sinR;
        }

        if (perpWallDist <= 0) perpWallDist = 0.01;
        wallZBuffer[r] = perpWallDist;

        const lineHeight = Math.floor(screenH / perpWallDist);

        let wallX;
        if (side === 0) wallX = playerY + perpWallDist * sinR;
        else wallX = playerX + perpWallDist * cosR;
        wallX -= Math.floor(wallX);

        let texX = Math.floor(wallX * 64);
        if (side === 0 && cosR > 0) texX = 64 - texX - 1;
        if (side === 1 && sinR < 0) texX = 64 - texX - 1;

        let drawStart = -lineHeight / 2 + screenH / 2;
        let drawEnd = lineHeight / 2 + screenH / 2;

        const texCanvas = textures[hit] || textures[1];

        ctx.drawImage(
            texCanvas,
            texX, 0, 1, 64,
            r, drawStart, 1, drawEnd - drawStart
        );

        const depthOpacity = Math.min(0.85, perpWallDist / 12);
        ctx.fillStyle = `rgba(13, 8, 7, ${side === 1 ? depthOpacity * 0.5 + 0.2 : depthOpacity})`;
        ctx.fillRect(r, drawStart, 1, drawEnd - drawStart);
    }

    // MATHEMATICALLY CORRECT CAMERA PLANE BILLBOARD PROJECTION MATRIX FOR SPRITES
    const dirX = Math.cos(playerAngle);
    const dirY = Math.sin(playerAngle);
    const planeX = -Math.sin(playerAngle) * Math.tan(fov / 2);
    const planeY = Math.cos(playerAngle) * Math.tan(fov / 2);

    const sortedSprites = entities
        .filter(ent => ent.active)
        .map(ent => {
            const dx = ent.x - playerX;
            const dy = ent.y - playerY;
            return {
                ent: ent,
                dist: dx * dx + dy * dy
            };
        })
        .sort((a, b) => b.dist - a.dist);

    sortedSprites.forEach(({ ent }) => {
        const spriteX = ent.x - playerX;
        const spriteY = ent.y - playerY;

        const invDet = 1.0 / (planeX * dirY - dirX * planeY);
        const transformX = invDet * (dirY * spriteX - dirX * spriteY);
        const transformY = invDet * (-planeY * spriteX + planeX * spriteY);

        if (transformY <= 0.1) return;

        const spriteScreenX = Math.floor((screenW / 2) * (1 + transformX / transformY));
        const spriteH = Math.abs(Math.floor(screenH / transformY)) * ent.scale;
        const spriteW = spriteH * (sprites[ent.sprite].width / sprites[ent.sprite].height);

        let yOffset = 0;
        if (ent.state === 'DEATH_2') {
            yOffset = spriteH * 0.35;
        }

        const drawStartY = -spriteH / 2 + screenH / 2 + yOffset;
        const drawStartX = spriteScreenX - spriteW / 2;

        const img = sprites[ent.sprite];
        for (let col = 0; col < spriteW; col++) {
            const screenX = Math.floor(drawStartX + col);
            if (screenX >= 0 && screenX < screenW && transformY < wallZBuffer[screenX]) {
                const texX = Math.floor((col / spriteW) * img.width);

                ctx.drawImage(
                    img,
                    texX, 0, 1, img.height,
                    screenX, drawStartY, 1, spriteH
                );
            }
        }
    });

    // MATHEMATICALLY CORRECT CAMERA PLANE BILLBOARD PROJECTION MATRIX FOR PARTICLES
    particles.forEach(p => {
        const dx = p.x - playerX;
        const dy = p.y - playerY;

        const invDet = 1.0 / (planeX * dirY - dirX * planeY);
        const transformX = invDet * (dirY * dx - dirX * dy);
        const transformY = invDet * (-planeY * dx + planeX * dy);

        if (transformY <= 0.1) return;

        const px = Math.floor((screenW / 2) * (1 + transformX / transformY));
        const py = Math.floor(screenH / 2 - (p.z * screenH) / transformY);
        const size = Math.max(1, Math.floor(10 / transformY));

        if (px >= 0 && px < screenW && transformY < wallZBuffer[px]) {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI*2);
            ctx.fill();
        }
    });

    // DRAW FIRST-PERSON WEAPON WITH BOUNCING & KICKBACKS
    // Shrink the first-person coffee grinder size down to a compact, beautiful, balanced scale (31%)
    const gunImg = shootAnimFrame > 0 ? sprites.gunFire : sprites.gunIdle;
    const gunWidth = Math.floor(screenW * 0.31);
    const gunHeight = gunWidth * (gunImg.height / gunImg.width);

    let bobX = 0;
    let bobY = 0;
    if (keys['KeyW'] || keys['KeyS'] || keys['KeyA'] || keys['KeyD']) {
        const speedFactor = Date.now() * 0.008;
        bobX = Math.cos(speedFactor) * 5;
        bobY = Math.abs(Math.sin(speedFactor)) * 5;
    }

    if (shootAnimFrame > 0) {
        bobX += (Math.random() - 0.5) * 6;
        bobY += (Math.random() - 0.5) * 6;
    }

    ctx.drawImage(
        gunImg,
        screenW / 2 - gunWidth / 2 + bobX,
        screenH - gunHeight + 10 + bobY,
        gunWidth,
        gunHeight
    );

    // RETRO HUD CROSSHAIR
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(screenW / 2 - 2, screenH / 2 - 1, 4, 2);
    ctx.fillRect(screenW / 2 - 1, screenH / 2 - 2, 2, 4);

    // DRAW SCREEN JUICE FLASH OVERLAYS
    if (screenFlashColor) {
        ctx.fillStyle = screenFlashColor;
        ctx.fillRect(0, 0, screenW, screenH);
    }
}


// Landing screen DOM interactions
document.addEventListener('DOMContentLoaded', () => {
    initGame();

    const lvlBtns = document.querySelectorAll('.level-btn');
    lvlBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            lvlBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateGlobalHighScoreDisplay();
            playSound('pickup_caffeine');
        });
    });

    document.getElementById('start-btn').addEventListener('click', () => {
        const activeBtn = document.querySelector('.level-btn.active');
        const lvl = activeBtn ? parseInt(activeBtn.dataset.level) : 1;
        startGame(lvl);
    });

    document.getElementById('resume-btn').addEventListener('click', () => {
        togglePause();
    });

    const quitHandler = () => {
        gameActive = false;
        isPaused = false;
        stopBackgroundMusic();
        document.getElementById('menu-screen').classList.remove('hidden');
        document.getElementById('pause-screen').classList.add('hidden');
        document.getElementById('gameover-screen').classList.add('hidden');
    };
    document.getElementById('quit-btn').addEventListener('click', quitHandler);
    document.getElementById('gameover-quit-btn').addEventListener('click', quitHandler);

    document.getElementById('restart-btn').addEventListener('click', () => {
        const activeBtn = document.querySelector('.level-btn.active');
        const lvl = activeBtn ? parseInt(activeBtn.dataset.level) : 1;
        startGame(lvl);
    });
});
