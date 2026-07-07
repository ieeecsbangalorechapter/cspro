const eventTime = new Date("2026-07-26T09:00:00+05:30").getTime();
const units = {
  days: document.querySelector('[data-unit="days"]'),
  hours: document.querySelector('[data-unit="hours"]'),
  minutes: document.querySelector('[data-unit="minutes"]'),
  seconds: document.querySelector('[data-unit="seconds"]'),
};

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const remaining = Math.max(0, eventTime - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);

  units.days.textContent = pad(Math.floor(totalSeconds / 86400));
  units.hours.textContent = pad(Math.floor((totalSeconds % 86400) / 3600));
  units.minutes.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
  units.seconds.textContent = pad(totalSeconds % 60);
}

updateCountdown();
setInterval(updateCountdown, 1000);

const canvas = document.getElementById("constellation");
const ctx = canvas.getContext("2d");
let stars = [];

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(canvas.offsetWidth * ratio);
  canvas.height = Math.floor(canvas.offsetHeight * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.min(120, Math.max(55, Math.floor(canvas.offsetWidth / 12)));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.offsetWidth,
    y: Math.random() * canvas.offsetHeight,
    r: Math.random() * 1.7 + 0.4,
    vx: (Math.random() - 0.5) * 0.14,
    vy: (Math.random() - 0.5) * 0.14,
    glow: Math.random() * 0.65 + 0.25,
  }));
}

function drawConstellation() {
  ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

  const gradient = ctx.createRadialGradient(
    canvas.offsetWidth / 2,
    canvas.offsetHeight * 0.28,
    0,
    canvas.offsetWidth / 2,
    canvas.offsetHeight * 0.3,
    canvas.offsetWidth * 0.65
  );
  gradient.addColorStop(0, "rgba(42, 105, 165, 0.22)");
  gradient.addColorStop(1, "rgba(4, 13, 28, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

  for (let i = 0; i < stars.length; i += 1) {
    const star = stars[i];
    star.x += star.vx;
    star.y += star.vy;

    if (star.x < 0 || star.x > canvas.offsetWidth) star.vx *= -1;
    if (star.y < 0 || star.y > canvas.offsetHeight) star.vy *= -1;

    for (let j = i + 1; j < stars.length; j += 1) {
      const other = stars[j];
      const dx = star.x - other.x;
      const dy = star.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 115) {
        ctx.strokeStyle = `rgba(226, 197, 126, ${0.12 * (1 - distance / 115)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    }

    ctx.fillStyle = `rgba(247, 223, 157, ${star.glow})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(drawConstellation);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawConstellation();

// -----------------------------
// Session Tabs
// -----------------------------
const sessionTabs = document.querySelectorAll("[data-session-tab]");
const sessionPanels = document.querySelectorAll("[data-session-panel]");

sessionTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const selected = tab.dataset.sessionTab;

    // Update cards
    sessionTabs.forEach(t => {
      const active = t === tab;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", active);
    });

    // Update content
    sessionPanels.forEach(panel => {
      const active = panel.dataset.sessionPanel === selected;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
  });
});
