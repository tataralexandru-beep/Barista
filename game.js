/*
 * ESPRESSO DOOM: CAFFEINE RUSH
 * A coffee-themed 3D Raycaster survival game written in vanilla JS.
 * Support for PC & Mobile out of the box, with synthesized chiptune audio.
 * Everything runs efficiently on HTML5 canvas and fits well under the 10 MB limit.
 */

// Global Configuration & Constants
const MAP_WIDTH = 24;
const MAP_HEIGHT = 24;

// 1: Cozy Cafe map grid (0 = empty space, >0 = textured walls)
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

// 2: The Office Grind map grid
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

// 3: Coffee Warehouse map grid
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

// Audio Synthesizer (Web Audio API)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    switch (type) {
        case 'shoot': {
            // High-pressure espresso steam burst sound
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(350, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);

            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.15);

            // Noise overlay for steam sizzle
            const bufferSize = audioCtx.sampleRate * 0.12;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;
            const noiseGain = audioCtx.createGain();
            noiseGain.gain.setValueAtTime(0.2, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
            noise.connect(noiseGain);
            noiseGain.connect(audioCtx.destination);
            noise.start(now);
            noise.stop(now + 0.12);
            break;
        }
        case 'zombie_groan': {
            // Low disheveled yawn/groan
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(110, now);
            osc.frequency.linearRampToValueAtTime(70, now + 0.5);

            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.6);
            break;
        }
        case 'zombie_hit': {
            // Wet splash / espresso hit sound
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(250, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);

            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.1);
            break;
        }
        case 'pickup_caffeine': {
            // Retro chime sound
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
            // Low-pitched thump
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(80, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.2);

            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.2);
            break;
        }
        case 'level_clear': {
            // Uplifting melody fanfare
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

// Background Chiptune Music Synthesizer
let musicInterval = null;
let musicTempo = 135; // bpm
function startBackgroundMusic() {
    if (musicInterval) clearInterval(musicInterval);
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    // Coffee chiptune baseline pattern
    const scale = [130.81, 146.83, 164.81, 196.00, 220.00]; // Pentatonic scale (C, D, E, G, A)
    const melody = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    let step = 0;

    const intervalMs = (60 / musicTempo) * 1000 / 2; // Eighth notes

    musicInterval = setInterval(() => {
        const now = audioCtx.currentTime;

        // Bassline (always active)
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

        // Random coffee melody notes for texture
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
    // We create tiny dynamic canvas contexts and draw stylized textures onto them

    const createTextureCanvas = (type) => {
        const cv = document.createElement('canvas');
        cv.width = 64;
        cv.height = 64;
        const ctx = cv.getContext('2d');

        if (type === 1) {
            // Cozy Cafe - Retro Dark Roasted Brick / Mahogany Wood Panels
            ctx.fillStyle = '#2c1b18'; // Mahogany wood
            ctx.fillRect(0, 0, 64, 64);

            // Draw horizontal wood panels
            ctx.strokeStyle = '#1e110f';
            ctx.lineWidth = 2;
            for (let y = 0; y < 64; y += 16) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(64, y);
                ctx.stroke();

                // Add tiny vertical wood lines
                for (let x = 8; x < 64; x += 16) {
                    ctx.beginPath();
                    ctx.moveTo(x + (y % 32 === 0 ? 8 : 0), y);
                    ctx.lineTo(x + (y % 32 === 0 ? 8 : 0), y + 16);
                    ctx.stroke();
                }
            }

            // Warm latte highlights
            ctx.fillStyle = 'rgba(215, 204, 200, 0.15)';
            ctx.fillRect(0, 0, 64, 4);

        } else if (type === 2) {
            // The Office Grind - Sleek beige/grey partition wall with a clock/charts
            ctx.fillStyle = '#cfd8dc';
            ctx.fillRect(0, 0, 64, 64);

            // Metal frames
            ctx.strokeStyle = '#78909c';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, 64, 64);

            // Blue sticky notes
            ctx.fillStyle = '#90caf9';
            ctx.fillRect(10, 15, 12, 12);
            // Yellow coffee spill
            ctx.fillStyle = 'rgba(121, 85, 72, 0.4)';
            ctx.fillRect(14, 23, 8, 4);

            // White clock at the top
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(45, 20, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#37474f';
            ctx.lineWidth = 1;
            ctx.stroke();
            // Clock hands
            ctx.beginPath();
            ctx.moveTo(45, 20);
            ctx.lineTo(45, 15);
            ctx.moveTo(45, 20);
            ctx.lineTo(49, 20);
            ctx.stroke();

        } else if (type === 3) {
            // Coffee Warehouse - Coffee sack texture (Burlap) / Stacked crates
            ctx.fillStyle = '#8d6e63'; // Burlap brown
            ctx.fillRect(0, 0, 64, 64);

            // Draw cross-hatch fibers
            ctx.strokeStyle = '#5d4037';
            ctx.lineWidth = 1;
            for (let i = 0; i < 64; i += 4) {
                // Horizontal fibers
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(64, i);
                ctx.stroke();
                // Vertical fibers
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, 64);
                ctx.stroke();
            }

            // Coffee sack text label
            ctx.fillStyle = '#3e2723';
            ctx.font = 'bold 10px monospace';
            ctx.fillText("COFFEE", 14, 25);
            ctx.fillText("BEANS", 17, 37);
            ctx.fillText("100%", 20, 49);

        } else if (type === 4) {
            // Neon Cafe neon sign / Glass shelf with coffee makers
            ctx.fillStyle = '#1a0f0d';
            ctx.fillRect(0, 0, 64, 64);

            // Glowing neon sign "OPEN / HOT"
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#ff9800';
            ctx.strokeStyle = '#ff9800';
            ctx.lineWidth = 2;
            ctx.strokeRect(8, 8, 48, 48);

            // Inside the neon coffee mug outline
            ctx.fillStyle = 'transparent';
            ctx.beginPath();
            ctx.moveTo(24, 28);
            ctx.lineTo(40, 28);
            ctx.lineTo(38, 44);
            ctx.lineTo(26, 44);
            ctx.closePath();
            ctx.stroke();

            // Handle
            ctx.beginPath();
            ctx.arc(40, 36, 4, -Math.PI/2, Math.PI/2);
            ctx.stroke();

            // Coffee steam
            ctx.strokeStyle = '#ffcc80';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(28, 24);
            ctx.bezierCurveTo(26, 20, 30, 18, 28, 14);
            ctx.moveTo(34, 24);
            ctx.bezierCurveTo(32, 20, 36, 18, 34, 14);
            ctx.stroke();

            // Reset shadows
            ctx.shadowBlur = 0;
        }

        return cv;
    };

    // Load textures
    for (let i = 1; i <= 4; i++) {
        textures[i] = createTextureCanvas(i);
    }

    // CREATE SPRITES

    // 1. Sleep-deprived Zombie (Yawning Office Worker with Mug)
    const zombieSprite = document.createElement('canvas');
    zombieSprite.width = 64;
    zombieSprite.height = 128;
    const zCtx = zombieSprite.getContext('2d');

    // Draw body (Disheveled Pajamas / Business Suit)
    zCtx.fillStyle = '#37474f'; // Slate blue/grey suit
    zCtx.fillRect(16, 48, 32, 60);
    // Arms reaching forward sleepwalker style
    zCtx.fillStyle = '#cfd8dc'; // sleeves
    zCtx.fillRect(12, 55, 12, 10);
    zCtx.fillRect(40, 55, 12, 10);

    // Empty Coffee Mug clutching
    zCtx.fillStyle = '#f44336'; // Red mug
    zCtx.fillRect(44, 60, 10, 12);
    zCtx.fillStyle = '#d32f2f';
    zCtx.fillRect(52, 63, 4, 6);

    // Head / Face
    zCtx.fillStyle = '#ffcc80'; // Skin tone
    zCtx.fillRect(20, 20, 24, 28);

    // Tired dark eye-bags
    zCtx.fillStyle = '#b0bec5';
    zCtx.fillRect(22, 28, 8, 6);
    zCtx.fillRect(34, 28, 8, 6);

    // Red sleep-deprived eyes
    zCtx.fillStyle = '#f44336';
    zCtx.fillRect(24, 29, 2, 2);
    zCtx.fillRect(36, 29, 2, 2);

    // Giant Yawning Mouth (Black void)
    zCtx.fillStyle = '#000000';
    zCtx.fillRect(27, 38, 10, 8);

    // Messy bedhead hair
    zCtx.fillStyle = '#4e342e';
    zCtx.fillRect(16, 14, 32, 8);
    zCtx.fillRect(14, 20, 6, 15);
    zCtx.fillRect(44, 20, 6, 15);

    // Slippers / Shoes
    zCtx.fillStyle = '#795548';
    zCtx.fillRect(14, 108, 16, 12);
    zCtx.fillRect(34, 108, 16, 12);

    sprites.zombie = zombieSprite;

    // 2. Coffee Beans / Caffeine Collectible Ammo/Health
    const caffeineSprite = document.createElement('canvas');
    caffeineSprite.width = 64;
    caffeineSprite.height = 64;
    const cCtx = caffeineSprite.getContext('2d');

    // Draw golden floating coffee bean with nice glowing aura
    cCtx.fillStyle = 'rgba(255, 152, 0, 0.3)';
    cCtx.beginPath();
    cCtx.arc(32, 32, 24, 0, Math.PI*2);
    cCtx.fill();

    cCtx.fillStyle = '#5d4037'; // Coffee Bean body
    cCtx.beginPath();
    cCtx.ellipse(32, 32, 14, 20, Math.PI / 6, 0, Math.PI*2);
    cCtx.fill();

    // Center fold wave of the coffee bean
    cCtx.strokeStyle = '#ffe0b2';
    cCtx.lineWidth = 2;
    cCtx.beginPath();
    cCtx.moveTo(25, 16);
    cCtx.bezierCurveTo(28, 24, 36, 40, 39, 48);
    cCtx.stroke();

    sprites.caffeine = caffeineSprite;

    // 3. Hot Croissant / Donut for Health
    const donutSprite = document.createElement('canvas');
    donutSprite.width = 64;
    donutSprite.height = 64;
    const dCtx = donutSprite.getContext('2d');

    // Glow
    dCtx.fillStyle = 'rgba(233, 30, 99, 0.25)';
    dCtx.beginPath();
    dCtx.arc(32, 32, 22, 0, Math.PI * 2);
    dCtx.fill();

    // Donut dough
    dCtx.fillStyle = '#ffb74d';
    dCtx.beginPath();
    dCtx.arc(32, 32, 16, 0, Math.PI * 2);
    dCtx.fill();

    // Pink Frosting
    dCtx.fillStyle = '#f06292';
    dCtx.beginPath();
    dCtx.arc(32, 32, 13, 0, Math.PI * 2);
    dCtx.fill();

    // Hole in the middle
    dCtx.globalCompositeOperation = 'destination-out';
    dCtx.beginPath();
    dCtx.arc(32, 32, 5, 0, Math.PI * 2);
    dCtx.fill();
    dCtx.globalCompositeOperation = 'source-over';

    // Tiny sprinkles
    dCtx.fillStyle = '#00e676';
    dCtx.fillRect(24, 24, 3, 2);
    dCtx.fillStyle = '#29b6f6';
    dCtx.fillRect(36, 22, 3, 2);
    dCtx.fillStyle = '#ffeb3b';
    dCtx.fillRect(30, 38, 2, 3);
    dCtx.fillStyle = '#ffffff';
    dCtx.fillRect(22, 34, 3, 2);

    sprites.donut = donutSprite;

    // 4. First-Person Espresso Gun animation frames
    // Drawn directly on the screen at runtime, but let's build the assets anyway
    const gunIdle = document.createElement('canvas');
    gunIdle.width = 128;
    gunIdle.height = 128;
    const gCtx = gunIdle.getContext('2d');

    // Draw dual steam wands, sleek espresso dispenser, espresso tubes
    // Centered gun with heavy machinery retro Doom layout
    gCtx.fillStyle = '#546e7a'; // Metallic frame
    gCtx.fillRect(40, 60, 48, 68);
    gCtx.fillStyle = '#37474f';
    gCtx.fillRect(48, 40, 32, 20); // Gun muzzle / dispenser

    // Shiny gold espresso nozzle dials
    gCtx.fillStyle = '#ffd54f';
    gCtx.fillRect(52, 45, 6, 8);
    gCtx.fillRect(70, 45, 6, 8);

    // Espresso steam pressure dial
    gCtx.fillStyle = '#ffffff';
    gCtx.beginPath();
    gCtx.arc(64, 80, 10, 0, Math.PI*2);
    gCtx.fill();
    gCtx.strokeStyle = '#b71c1c'; // Red zones
    gCtx.lineWidth = 1.5;
    gCtx.beginPath();
    gCtx.moveTo(64, 80);
    gCtx.lineTo(70, 75);
    gCtx.stroke();

    sprites.gunIdle = gunIdle;

    const gunFire = document.createElement('canvas');
    gunFire.width = 128;
    gunFire.height = 128;
    const gfCtx = gunFire.getContext('2d');
    gfCtx.drawImage(gunIdle, 0, 5); // Shift down slightly

    // Overlap bright neon steaming espresso splash
    gfCtx.fillStyle = 'rgba(255, 152, 0, 0.4)';
    gfCtx.beginPath();
    gfCtx.arc(64, 30, 20, 0, Math.PI * 2);
    gfCtx.fill();

    // Hot steaming stream lines
    gfCtx.strokeStyle = '#ffe0b2';
    gfCtx.lineWidth = 3;
    gfCtx.beginPath();
    gfCtx.moveTo(60, 35); gfCtx.lineTo(58, 10);
    gfCtx.moveTo(64, 35); gfCtx.lineTo(64, 5);
    gfCtx.moveTo(68, 35); gfCtx.lineTo(70, 10);
    gfCtx.stroke();

    sprites.gunFire = gunFire;
}


// Engine Game State
let canvas, ctx;
let playerX = 3.5, playerY = 3.5; // Player start position
let playerAngle = 0; // Direction looking (radians)
let playerHealth = 100;
let playerAmmo = 50;
let playerScore = 0;
let currentWave = 1;
let currentLevel = 1;
let levelGrid = MAP_COZY_CAFE;
let gameActive = false;
let isPaused = false;
let highScores = { 1: 0, 2: 0, 3: 0 };

// Controls Tracking
const keys = {};
let mouseLocked = false;
let turnSpeed = 0.05;
let moveSpeed = 0.08;

// Entities (Zombies & Pickups)
let entities = [];

// Screen buffers / Resolution scaler
const RENDER_SCALE = 2; // Render at 1/2 size for high frame rate, pixel-art retro doom feels
let screenW, screenH;

// Touch Control State
let activeTouchId = null;
let touchStartX = 0;
let touchStartY = 0;
let touchCurX = 0;
let touchCurY = 0;
const joystickMaxRadius = 60;

// Input listeners setup
function setupInput() {
    // Keyboard
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

    // Mouse Controls (Pointer lock for Doom layout)
    canvas.addEventListener('click', (e) => {
        if (!gameActive || isPaused) return;

        // Mobile doesn't have pointer lock, so we detect if it is indeed mouse
        if (window.matchMedia('(pointer: coarse)').matches) {
            // Touch device, we do fire via button or touch
            return;
        }

        if (document.pointerLockElement !== canvas) {
            canvas.requestPointerLock();
        } else {
            triggerShoot();
        }
    });

    document.addEventListener('pointerlockchange', () => {
        if (document.pointerLockElement !== canvas && gameActive && !isPaused) {
            // Auto-pause if pointer lock exited
            togglePause();
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (document.pointerLockElement === canvas && gameActive && !isPaused) {
            playerAngle += e.movementX * 0.003;
        }
    });

    // Mobile Controls Setup
    const leftJoy = document.getElementById('left-joystick-base');
    const knob = document.getElementById('left-joystick-knob');
    const fireBtn = document.getElementById('right-shoot-button');

    leftJoy.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        activeTouchId = touch.identifier;
        const rect = leftJoy.getBoundingClientRect();
        touchStartX = rect.left + rect.width / 2;
        touchStartY = rect.top + rect.height / 2;
        touchCurX = touch.clientX;
        touchCurY = touch.clientY;
    });

    leftJoy.addEventListener('touchmove', (e) => {
        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            if (touch.identifier === activeTouchId) {
                touchCurX = touch.clientX;
                touchCurY = touch.clientY;

                // Position the knob
                let dx = touchCurX - touchStartX;
                let dy = touchCurY - touchStartY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist > joystickMaxRadius) {
                    dx = (dx / dist) * joystickMaxRadius;
                    dy = (dy / dist) * joystickMaxRadius;
                }

                knob.style.transform = `translate(${dx}px, ${dy}px)`;
            }
        }
    });

    const resetJoystick = () => {
        activeTouchId = null;
        touchStartX = 0;
        touchStartY = 0;
        touchCurX = 0;
        touchCurY = 0;
        knob.style.transform = 'translate(0px, 0px)';
    };

    leftJoy.addEventListener('touchend', resetJoystick);
    leftJoy.addEventListener('touchcancel', resetJoystick);

    // Mobile shoot button
    fireBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        triggerShoot();
    });

    // Resize Event
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    screenW = Math.floor(window.innerWidth / RENDER_SCALE);
    screenH = Math.floor((window.innerHeight - 90) / RENDER_SCALE); // Reserve room for HUD

    canvas.width = screenW;
    canvas.height = screenH;

    // Check if we are on a coarse pointer device (mobile)
    const mobileUI = document.getElementById('mobile-controls');
    if (window.matchMedia('(pointer: coarse)').matches) {
        mobileUI.classList.remove('hidden');
    } else {
        mobileUI.classList.add('hidden');
    }
}


// Game loop and Logic
let lastTime = 0;
let shootAnimFrame = 0; // 0 = idle, 1..10 = firing animation

function initGame() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    buildProceduralAssets();
    setupInput();
    resizeCanvas();

    // Load local highscore
    const storedScores = localStorage.getItem('espresso_doom_highscores');
    if (storedScores) {
        highScores = JSON.parse(storedScores);
    }
    updateGlobalHighScoreDisplay();

    // Main loop binder
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

    // Initialize Player
    playerX = 3.5;
    playerY = 3.5;
    playerAngle = 0;
    playerHealth = 100;
    playerAmmo = 60;
    playerScore = 0;
    currentWave = 1;

    // Wipe entities
    entities = [];

    // Spawn initial pick-ups
    spawnStaticItems();

    // Start Spawning wave 1
    spawnWave(currentWave);

    // UI swaps
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
    // Distribute delicious treats (donuts) and espresso coffee bean sacks / pickups programmatically
    // Select open coordinates in the grid to place donuts and ammo
    for (let r = 2; r < MAP_HEIGHT - 2; r += 4) {
        for (let c = 2; c < MAP_WIDTH - 2; c += 4) {
            if (levelGrid[r][c] === 0 && (r > 6 || c > 6)) {
                const rand = Math.random();
                if (rand < 0.25) {
                    entities.push({
                        type: 'caffeine',
                        x: c + 0.5,
                        y: r + 0.5,
                        sprite: 'caffeine',
                        scale: 0.45,
                        pickupType: 'ammo',
                        active: true
                    });
                } else if (rand < 0.45) {
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

    // Let's spawn zombies in areas far away from the player
    let spawned = 0;
    let attempts = 0;

    while (spawned < numZombies && attempts < 100) {
        attempts++;
        const rx = Math.floor(Math.random() * (MAP_WIDTH - 2)) + 1;
        const ry = Math.floor(Math.random() * (MAP_HEIGHT - 2)) + 1;

        if (levelGrid[ry][rx] === 0) {
            // Distance check to player to avoid spawn camping
            const dist = Math.hypot(rx + 0.5 - playerX, ry + 0.5 - playerY);
            if (dist > 5) {
                entities.push({
                    type: 'zombie',
                    x: rx + 0.5,
                    y: ry + 0.5,
                    sprite: 'zombie',
                    scale: 0.8,
                    health: 10 + wave * 5,
                    speed: 0.02 + Math.min(0.02, wave * 0.005),
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
    shootAnimFrame = 1;
    updateHUD();
    playSound('shoot');

    // Bullet/Espresso splash raycast
    // Shoot ray exactly down player angle and check which entity or wall it hits
    let minT = Infinity;
    let hitZombie = null;

    // Bullet trace
    entities.forEach(ent => {
        if (ent.type === 'zombie' && ent.active) {
            // Simple circle collision against ray
            const dx = ent.x - playerX;
            const dy = ent.y - playerY;

            // Project entity onto looking vector
            const lookX = Math.cos(playerAngle);
            const lookY = Math.sin(playerAngle);
            const projection = dx * lookX + dy * lookY;

            if (projection > 0) {
                const perpDistSq = (dx * dx + dy * dy) - projection * projection;
                if (perpDistSq < 0.2) { // Hit box radius
                    if (projection < minT) {
                        minT = projection;
                        hitZombie = ent;
                    }
                }
            }
        }
    });

    // Also raycast wall to ensure we don't shoot zombies behind walls
    let wallT = Infinity;
    const sinA = Math.sin(playerAngle);
    const cosA = Math.cos(playerAngle);

    // Simple raycast to find nearest wall
    for (let d = 0.1; d < 20; d += 0.1) {
        const wx = Math.floor(playerX + cosA * d);
        const wy = Math.floor(playerY + sinA * d);
        if (wx < 0 || wx >= MAP_WIDTH || wy < 0 || wy >= MAP_HEIGHT || levelGrid[wy][wx] > 0) {
            wallT = d;
            break;
        }
    }

    if (hitZombie && minT < wallT) {
        // Hit!
        hitZombie.health -= 15;
        playSound('zombie_hit');

        // Spawn temporary blood/caffeine splash particles
        spawnSplashParticles(hitZombie.x, hitZombie.y);

        if (hitZombie.health <= 0) {
            hitZombie.active = false;
            playerScore += 100;
            updateHUD();

            // Check if wave is fully cleared
            const aliveZombies = entities.filter(e => e.type === 'zombie' && e.active).length;
            if (aliveZombies === 0) {
                currentWave++;
                playSound('level_clear');
                spawnWave(currentWave);
                // Replenish partial ammo/health per wave clear
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
            vx: (Math.random() - 0.5) * 0.1,
            vy: (Math.random() - 0.5) * 0.1,
            vz: (Math.random()) * 0.1,
            color: '#4e3629', // Coffee drop splash!
            life: 1.0
        });
    }
}

function updateHUD() {
    document.getElementById('health-val').textContent = playerHealth;
    document.getElementById('health-bar').style.width = playerHealth + '%';
    document.getElementById('ammo-val').textContent = playerAmmo;
    document.getElementById('ammo-bar').style.width = playerAmmo + '%';
    document.getElementById('hud-score').textContent = String(playerScore).padStart(6, '0');
    document.getElementById('hud-wave').textContent = currentWave;

    // Fills/empties coffee cup HUD status based on health
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

    // Update personal/global high scores
    if (playerScore > highScores[currentLevel]) {
        highScores[currentLevel] = playerScore;
        localStorage.setItem('espresso_doom_highscores', JSON.stringify(highScores));
        updateGlobalHighScoreDisplay();
    }

    // Fill final statistics
    document.getElementById('final-score').textContent = playerScore;
    document.getElementById('final-waves').textContent = currentWave - 1;

    const totalKills = entities.filter(e => e.type === 'zombie' && !e.active).length;
    document.getElementById('final-kills').textContent = totalKills;

    document.getElementById('gameover-screen').classList.remove('hidden');
}


// Engine Game Loop & Raycasting Renderer
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

function updateLogic(dt) {
    // 1. ESPRESSO GUN ANIMATION
    if (shootAnimFrame > 0) {
        shootAnimFrame++;
        if (shootAnimFrame > 8) shootAnimFrame = 0;
    }

    // 2. MOVEMENT CONTROLS
    let moveX = 0;
    let moveY = 0;
    let rotation = 0;

    // PC inputs
    if (keys['KeyW'] || keys['ArrowUp']) {
        moveX += Math.cos(playerAngle);
        moveY += Math.sin(playerAngle);
    }
    if (keys['KeyS'] || keys['ArrowDown']) {
        moveX -= Math.cos(playerAngle);
        moveY -= Math.sin(playerAngle);
    }
    if (keys['KeyA']) {
        // Strafe Left
        moveX += Math.sin(playerAngle);
        moveY -= Math.cos(playerAngle);
    }
    if (keys['KeyD']) {
        // Strafe Right
        moveX -= Math.sin(playerAngle);
        moveY += Math.cos(playerAngle);
    }
    if (keys['KeyQ'] || keys['ArrowLeft']) {
        rotation -= 1.2 * turnSpeed;
    }
    if (keys['KeyE'] || keys['ArrowRight']) {
        rotation += 1.2 * turnSpeed;
    }

    // Mobile Virtual Joystick input
    if (activeTouchId !== null) {
        const dx = touchCurX - touchStartX;
        const dy = touchCurY - touchStartY;
        const dist = Math.hypot(dx, dy);

        if (dist > 10) {
            const angle = Math.atan2(dy, dx);
            const intensity = Math.min(1, dist / joystickMaxRadius);

            // Let the joystick act as movement/rotation
            // Forward/Back based on vertical intensity
            const forward = -Math.sin(angle) * intensity;
            // Strafe based on horizontal intensity
            const strafe = Math.cos(angle) * intensity;

            // Combine with forward / strafe components
            moveX += Math.cos(playerAngle) * forward + Math.sin(playerAngle) * strafe;
            moveY += Math.sin(playerAngle) * forward - Math.cos(playerAngle) * strafe;
        }
    }

    // Handle Rotation update
    playerAngle += rotation;

    // Sliding collision check
    if (moveX !== 0 || moveY !== 0) {
        // Normalize
        const len = Math.hypot(moveX, moveY);
        const dx = (moveX / len) * moveSpeed;
        const dy = (moveY / len) * moveSpeed;

        // Simple bounding box checks against walls
        const nextX = playerX + dx;
        const nextY = playerY + dy;
        const radius = 0.35;

        // X Check
        const wallXLeft = Math.floor(nextX - radius);
        const wallXRight = Math.floor(nextX + radius);
        const currentYGrid = Math.floor(playerY);

        if (levelGrid[currentYGrid][wallXLeft] === 0 && levelGrid[currentYGrid][wallXRight] === 0) {
            playerX = nextX;
        }

        // Y Check
        const wallYTop = Math.floor(nextY - radius);
        const wallYBottom = Math.floor(nextY + radius);
        const currentXGrid = Math.floor(playerX);

        if (levelGrid[wallYTop][currentXGrid] === 0 && levelGrid[wallYBottom][currentXGrid] === 0) {
            playerY = nextY;
        }
    }

    // 3. UPDATE ENTITIES (Zombies, Pickups)
    const now = Date.now();
    entities.forEach(ent => {
        if (!ent.active) return;

        const distToPlayer = Math.hypot(playerX - ent.x, playerY - ent.y);

        // Zombie logic
        if (ent.type === 'zombie') {
            // Periodic Sleep Groaning
            if (now > ent.lastGroan) {
                playSound('zombie_groan');
                ent.lastGroan = now + 4000 + Math.random() * 5000;
            }

            // Move toward player
            if (distToPlayer > 0.45) {
                const angleToPlayer = Math.atan2(playerY - ent.y, playerX - ent.x);
                const stepX = Math.cos(angleToPlayer) * ent.speed;
                const stepY = Math.sin(angleToPlayer) * ent.speed;

                // Zombie wall collision check
                const nX = ent.x + stepX;
                const nY = ent.y + stepY;
                if (levelGrid[Math.floor(ent.y)][Math.floor(nX)] === 0) {
                    ent.x = nX;
                }
                if (levelGrid[Math.floor(nY)][Math.floor(ent.x)] === 0) {
                    ent.y = nY;
                }
            } else {
                // Inside attack range! Hit player
                playerHealth -= ent.damage;
                playSound('player_hit');
                // Knockback player slightly
                const attackAngle = Math.atan2(playerY - ent.y, playerX - ent.x);
                playerX += Math.cos(attackAngle) * 0.15;
                playerY += Math.sin(attackAngle) * 0.15;

                updateHUD();

                if (playerHealth <= 0) {
                    playerHealth = 0;
                    updateHUD();
                    gameOver();
                }
            }
        }

        // Collectibles pickup check
        if (ent.pickupType && distToPlayer < 0.6) {
            ent.active = false;
            playSound('pickup_caffeine');

            if (ent.pickupType === 'health') {
                playerHealth = Math.min(100, playerHealth + 25);
            } else if (ent.pickupType === 'ammo') {
                playerAmmo = Math.min(100, playerAmmo + 30);
            }
            updateHUD();
        }
    });

    // 4. PARTICLES UPDATE
    particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.vz -= 0.01; // Gravity
        p.life -= dt * 2.0;
        if (p.life <= 0) {
            particles.splice(idx, 1);
        }
    });
}

function render3D() {
    // 1. CLEAR SCREEN WITH COFFEE BAR FLOOR & CEILING
    // Ceiling: Dark Roasted Espresso Bean Brown
    ctx.fillStyle = '#1c100e';
    ctx.fillRect(0, 0, screenW, screenH / 2);
    // Floor: Cozy Cream Latte shade
    ctx.fillStyle = '#422a22';
    ctx.fillRect(0, screenH / 2, screenW, screenH / 2);

    // 2. RAYCAST WALLS
    const fov = Math.PI / 3; // 60 degrees
    const halfFov = fov / 2;
    const numRays = screenW;
    const wallZBuffer = new Float32Array(numRays);

    for (let r = 0; r < numRays; r++) {
        // Calculate ray angle based on FOV
        const rayAngle = playerAngle - halfFov + (r / numRays) * fov;
        const cosR = Math.cos(rayAngle);
        const sinR = Math.sin(rayAngle);

        // DDA (Digital Differential Analysis) algorithm for precise grid intersections
        let mapX = Math.floor(playerX);
        let mapY = Math.floor(playerY);

        let sideDistX, sideDistY;
        const deltaDistX = Math.abs(1 / cosR);
        const deltaDistY = Math.abs(1 / sinR);

        let stepX, stepY;
        let hit = 0;
        let side = 0; // 0 = NS wall, 1 = EW wall

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

        // Loop to find wall collision
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
            // Check wall grid coordinates
            if (mapX >= 0 && mapX < MAP_WIDTH && mapY >= 0 && mapY < MAP_HEIGHT) {
                if (levelGrid[mapY][mapX] > 0) {
                    hit = levelGrid[mapY][mapX];
                }
            } else {
                break;
            }
        }

        // Calculate perpendicular ray distance to eliminate fisheye distortion
        let perpWallDist;
        if (side === 0) {
            perpWallDist = (mapX - playerX + (1 - stepX) / 2) / cosR;
        } else {
            perpWallDist = (mapY - playerY + (1 - stepY) / 2) / sinR;
        }

        if (perpWallDist <= 0) perpWallDist = 0.01;
        wallZBuffer[r] = perpWallDist;

        // Height of line to draw on screen
        const lineHeight = Math.floor(screenH / perpWallDist);

        // Calculate texture coordinates
        let wallX;
        if (side === 0) wallX = playerY + perpWallDist * sinR;
        else wallX = playerX + perpWallDist * cosR;
        wallX -= Math.floor(wallX);

        let texX = Math.floor(wallX * 64);
        if (side === 0 && cosR > 0) texX = 64 - texX - 1;
        if (side === 1 && sinR < 0) texX = 64 - texX - 1;

        // Calculate draw coordinates
        let drawStart = -lineHeight / 2 + screenH / 2;
        let drawEnd = lineHeight / 2 + screenH / 2;

        // Slice column from wall texture canvas
        const texCanvas = textures[hit] || textures[1];

        ctx.drawImage(
            texCanvas,
            texX, 0, 1, 64, // Source texture rect
            r, drawStart, 1, drawEnd - drawStart // Screen target rect
        );

        // Add shadowing based on side and depth to give beautiful 3D atmospheric perspective
        const depthOpacity = Math.min(0.85, perpWallDist / 12);
        ctx.fillStyle = `rgba(13, 8, 7, ${side === 1 ? depthOpacity * 0.5 + 0.2 : depthOpacity})`;
        ctx.fillRect(r, drawStart, 1, drawEnd - drawStart);
    }

    // 3. DRAW DEPTH-SORTED SPRITES (Zombies, Coffee beans, donuts)
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
        .sort((a, b) => b.dist - a.dist); // Render back-to-front

    sortedSprites.forEach(({ ent }) => {
        // Translate sprite position relative to camera
        const spriteX = ent.x - playerX;
        const spriteY = ent.y - playerY;

        // Transform coordinates using inverse camera matrix
        const invDet = 1.0 / (Math.cos(playerAngle + Math.PI/2) * Math.sin(playerAngle) - Math.cos(playerAngle) * Math.sin(playerAngle + Math.PI/2));

        // Rotate sprite to camera view
        const cosA = Math.cos(-playerAngle);
        const sinA = Math.sin(-playerAngle);
        const rotX = spriteX * cosA - spriteY * sinA;
        const rotY = spriteX * sinA + spriteY * cosA;

        // Sprite is behind camera
        if (rotY <= 0.1) return;

        const spriteScreenX = Math.floor((screenW / 2) * (1 + rotX / rotY));

        // Height and width on screen
        const spriteH = Math.abs(Math.floor(screenH / rotY)) * ent.scale;
        const spriteW = spriteH * (sprites[ent.sprite].width / sprites[ent.sprite].height);

        const drawStartY = -spriteH / 2 + screenH / 2;
        const drawStartX = spriteScreenX - spriteW / 2;

        // Render sprite pixel column by column with Z-Buffering
        const img = sprites[ent.sprite];
        for (let col = 0; col < spriteW; col++) {
            const screenX = Math.floor(drawStartX + col);
            if (screenX >= 0 && screenX < screenW && rotY < wallZBuffer[screenX]) {
                const texX = Math.floor((col / spriteW) * img.width);

                // Draw single pixel column
                ctx.drawImage(
                    img,
                    texX, 0, 1, img.height,
                    screenX, drawStartY, 1, spriteH
                );
            }
        }
    });

    // 4. DRAW COFFEE SPLASH PARTICLES (2D Billboards)
    particles.forEach(p => {
        const dx = p.x - playerX;
        const dy = p.y - playerY;
        const cosA = Math.cos(-playerAngle);
        const sinA = Math.sin(-playerAngle);
        const rotX = dx * cosA - dy * sinA;
        const rotY = dx * sinA + dy * cosA;

        if (rotY <= 0.1) return;

        const px = Math.floor((screenW / 2) * (1 + rotX / rotY));
        const py = Math.floor(screenH / 2 - (p.z * screenH) / rotY);
        const size = Math.max(1, Math.floor(10 / rotY));

        if (px >= 0 && px < screenW && rotY < wallZBuffer[px]) {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI*2);
            ctx.fill();
        }
    });

    // 5. DRAW FIRST-PERSON GUN WITH VIBRATION
    const gunImg = shootAnimFrame > 0 ? sprites.gunFire : sprites.gunIdle;
    const gunWidth = Math.floor(screenW * 0.45);
    const gunHeight = gunWidth * (gunImg.height / gunImg.width);

    // Add retro breathing/walking bobbing bounce
    let bobX = 0;
    let bobY = 0;
    if (keys['KeyW'] || keys['KeyS'] || keys['KeyA'] || keys['KeyD']) {
        const speedFactor = Date.now() * 0.008;
        bobX = Math.cos(speedFactor) * 6;
        bobY = Math.abs(Math.sin(speedFactor)) * 6;
    }

    // Slight firing vibration offset
    if (shootAnimFrame > 0) {
        bobX += (Math.random() - 0.5) * 8;
        bobY += (Math.random() - 0.5) * 8;
    }

    ctx.drawImage(
        gunImg,
        screenW / 2 - gunWidth / 2 + bobX,
        screenH - gunHeight + 10 + bobY,
        gunWidth,
        gunHeight
    );

    // 6. DRAW RETRO HUD MINI CROSSHAIR
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(screenW / 2 - 2, screenH / 2 - 1, 4, 2);
    ctx.fillRect(screenW / 2 - 1, screenH / 2 - 2, 2, 4);
}


// Landing screen interactions
document.addEventListener('DOMContentLoaded', () => {
    initGame();

    // Select Level triggers
    const lvlBtns = document.querySelectorAll('.level-btn');
    lvlBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            lvlBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateGlobalHighScoreDisplay();
            playSound('pickup_caffeine');
        });
    });

    // Start Game button
    document.getElementById('start-btn').addEventListener('click', () => {
        const activeBtn = document.querySelector('.level-btn.active');
        const lvl = activeBtn ? parseInt(activeBtn.dataset.level) : 1;
        startGame(lvl);
    });

    // Resume button
    document.getElementById('resume-btn').addEventListener('click', () => {
        togglePause();
    });

    // Quit buttons
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

    // Restart button
    document.getElementById('restart-btn').addEventListener('click', () => {
        const activeBtn = document.querySelector('.level-btn.active');
        const lvl = activeBtn ? parseInt(activeBtn.dataset.level) : 1;
        startGame(lvl);
    });
});
