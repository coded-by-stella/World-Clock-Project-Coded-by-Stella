let baseTimer = null;
let selectedTimer = null;

const baseCities = [
  { id: "oslo", name: "Oslo", tz: "Europe/Oslo", flag: "🇳🇴" },
  { id: "tokyo", name: "Tokyo", tz: "Asia/Tokyo", flag: "🇯🇵" },
  { id: "rome", name: "Rome", tz: "Europe/Rome", flag: "🇮🇹" },
  { id: "sydney", name: "Sydney", tz: "Australia/Sydney", flag: "🇦🇺" },
  { id: "madrid", name: "Madrid", tz: "Europe/Madrid", flag: "🇪🇸" },
  { id: "new-york", name: "New York", tz: "America/New_York", flag: "🇺🇸" },
  { id: "berlin", name: "Berlin", tz: "Europe/Berlin", flag: "🇩🇪" },
  { id: "paris", name: "Paris", tz: "Europe/Paris", flag: "🇫🇷" }
];

const tzToDisplay = Object.fromEntries(baseCities.map(c => [c.tz, c.name]));
const tzToFlag = Object.fromEntries(baseCities.map(c => [c.tz, c.flag]));

function formatDate(m) { return m.format("MMMM Do YYYY"); }
function formatTime(m) { return `${m.format("h:mm:ss")} <small>${m.format("A")}</small>`; }
function nameFromTz(tz) { return tz.split("/").pop().replace(/_/g, " "); }

function applyTwemoji() {
  const container = document.getElementById("cities");
  if (window.twemoji && container) {
    twemoji.parse(container, { folder: "svg", ext: ".svg" });
  }
}

function renderBaseLayout() {
  const wrap = document.querySelector("#cities");
  wrap.innerHTML = baseCities.map(c => `
    <div class="city" id="${c.id}">
      <div>
        <h2><span class="flag">${c.flag}</span>${c.name}</h2>
        <div class="date"></div>
      </div>
      <div class="time"></div>
    </div>
  `).join("");
  applyTwemoji();
}

function updateBaseTime() {
  baseCities.forEach(c => {
    const el = document.querySelector(`#${c.id}`);
    if (!el) return;
    const m = moment().tz(c.tz);
    el.querySelector(".date").innerHTML = formatDate(m);
    el.querySelector(".time").innerHTML = formatTime(m);
  });
}

function startBaseTimer() {
  if (selectedTimer) clearInterval(selectedTimer);
  renderBaseLayout();
  updateBaseTime();
  if (baseTimer) clearInterval(baseTimer);
  baseTimer = setInterval(updateBaseTime, 1000);
}

function goHome() {
  const sel = document.getElementById("city");
  if (sel) sel.value = "";
  startBaseTimer();
}

function renderSelectedCity(tz) {
  const m = moment().tz(tz);
  const name = tzToDisplay[tz] || nameFromTz(tz);
  const flag = tzToFlag[tz] || "🧭";
  const wrap = document.querySelector("#cities");
  wrap.innerHTML = `
    <div class="city">
      <div>
        <h2><span class="flag">${flag}</span>${name}</h2>
        <div class="date">${formatDate(m)}</div>
      </div>
      <div class="time">${formatTime(m)}</div>
      <button id="back-home" class="back-btn">← Back to homepage</button>
    </div>
  `;
  applyTwemoji();
  const back = document.getElementById("back-home");
  if (back) {
    back.addEventListener("click", function(e){
      e.preventDefault();
      goHome();
    });
  }
}

function startSelectedTimer(tz) {
  if (baseTimer) clearInterval(baseTimer);
  if (selectedTimer) clearInterval(selectedTimer);
  renderSelectedCity(tz);
  selectedTimer = setInterval(() => renderSelectedCity(tz), 1000);
}

function handleSelectChange(e) {
  const value = e.target.value;
  if (!value) { startBaseTimer(); return; }
  const tz = value === "current" ? moment.tz.guess() : value;
  startSelectedTimer(tz);
}

document.addEventListener("DOMContentLoaded", () => {
  startBaseTimer();
  const sel = document.querySelector("#city");
  if (sel) sel.addEventListener("change", handleSelectChange);
});
