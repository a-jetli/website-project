let glowEnabled = localStorage.getItem('glow') !== 'false';

const glow = document.createElement('div');
glow.style.cssText = `
  position: fixed;
  width: 800px;
  height: 800px;
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(circle, rgba(100, 160, 255, 0.04) 0%, transparent 70%);
  z-index: 9999;
  top: 0;
  left: 0;
`;
document.body.appendChild(glow);

function updateGlow(e) {
  if (!glowEnabled) return;
  glow.style.transform = `translate(${e.clientX - 400}px, ${e.clientY - 400}px)`;
}

function setGlowVisibility() {
  glow.style.opacity = glowEnabled ? '1' : '0';
  const btn = document.getElementById('glow-toggle');
  if (btn) btn.textContent = glowEnabled ? 'Glow: On' : 'Glow: Off';
}

document.addEventListener('mousemove', updateGlow);

document.getElementById('glow-toggle').addEventListener('click', (e) => {
  e.stopPropagation();
  glowEnabled = !glowEnabled;
  localStorage.setItem('glow', glowEnabled);
  setGlowVisibility();
});

setGlowVisibility();