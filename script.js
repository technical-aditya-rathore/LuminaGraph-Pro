const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const pointsSlider = document.getElementById('pointsSlider');
const sizeSlider = document.getElementById('sizeSlider');
const pointValLabel = document.getElementById('pointVal');

// State variables
let drawing = false;
let symmetry = 12;
let lastX = 0;
let lastY = 0;

// Initialize Canvas
function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Fill initial background for clean export
    ctx.fillStyle = '#050507';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener('resize', init);
init();

// The Core Drawing Algorithm
function draw(e) {
    if (!drawing) return;

    // Normalize coordinates to the center of the screen
    const currX = (e.clientX || e.touches[0].clientX);
    const currY = (e.clientY || e.touches[0].clientY);
    
    // Pro Feature: Velocity-based thickness (Optional logic)
    // We calculate distance from last point to adjust stroke
    const dist = Math.hypot(currX - lastX, currY - lastY);
    
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);

    const angle = (Math.PI * 2) / symmetry;
    const startX = lastX - canvas.width / 2;
    const startY = lastY - canvas.height / 2;
    const endX = currX - canvas.width / 2;
    const endY = currY - canvas.height / 2;

    // Set Brush Style
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = sizeSlider.value;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Pro Feature: Neon Glow
    ctx.shadowBlur = 12;
    ctx.shadowColor = colorPicker.value;
    ctx.globalCompositeOperation = 'lighter'; // Additive blending for glow

    for (let i = 0; i < symmetry; i++) {
        ctx.rotate(angle);
        
        // Draw Primary Symmetry
        renderStroke(startX, startY, endX, endY);
        
        // Draw Mirror/Reflection Symmetry
        ctx.save();
        ctx.scale(1, -1);
        renderStroke(startX, startY, endX, endY);
        ctx.restore();
    }

    ctx.restore();
    
    lastX = currX;
    lastY = currY;
}

function renderStroke(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// Event Listeners
canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    lastX = e.clientX;
    lastY = e.clientY;
});

canvas.addEventListener('mousemove', draw);
window.addEventListener('mouseup', () => drawing = false);

// Mobile Support
canvas.addEventListener('touchstart', (e) => {
    drawing = true;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
});
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    draw(e);
}, { passive: false });

// UI Controls
pointsSlider.oninput = (e) => {
    symmetry = e.target.value;
    pointValLabel.innerText = symmetry;
};

document.getElementById('clearBtn').onclick = () => {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#050507';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};

document.getElementById('saveBtn').onclick = () => {
    const link = document.createElement('a');
    link.download = 'symmetry-art.png';
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
};