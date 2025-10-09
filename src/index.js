let baseTimer = null;
let selectedTimer = null;

function formatDate(m) {
  return m.format("MMMM Do YYYY");
}
function formatTime(m) {
  return `${m.format("h:mm:ss")} <small>${m.format("A")}</small>`;
}
function lastSegmentName(tz) {
  const parts = tz.split("/");
  return (parts[parts.length - 1] || tz).replace(/_/g, " ");
}

function updateBaseTime() {
  const la = document.querySelector("#los-angeles");
  if (la) {
    const m = moment().tz("America/Los_Angeles");
    la.querySelector(".date").innerHTML = formatDate(m);
    la.querySelector(".time").innerHTML = formatTime(m);
  }
  const paris = document.querySelector("#paris");
  if (paris) {
    const m = moment().tz("Europe/Paris");
    paris.querySelector(".date").innerHTML = formatDate(m);
    paris.querySelector(".time").innerHTML = formatTime(m);
  }
}

function startBaseTimer() {
  if (baseTimer) clearInterval(baseTimer);
  updateBaseTime();
  baseTimer = setInterval(updateBaseTime, 1000);
}

function renderSelectedCity(tz) {
  const name = lastSegmentName(tz);
  const m = moment().tz(tz);
  const wrap = document.querySelector("#cities");
  wrap.innerHTML = `
    <div class="city">
      <div>
        <h2>${name}</h2>
        <div class="date">${formatDate(m)}</div>
      </div>
      <div class="time">${formatTime(m)}</div>
    </div>
  `;
}

function startSelectedTimer(tz) {
  if (selectedTimer) clearInterval(selectedTimer);
  renderSelectedCity(tz);
  selectedTimer = setInterval(() => renderSelectedCity(tz), 1000);
}

function restoreBaseLayout() {
  const wrap = document.querySelector("#cities");
  wrap.innerHTML = `
    <div class="city" id="los-angeles">
      <div>
        <h2>Los Angeles</h2>
        <div class="date"></div>
      </div>
      <div class="time"></div>
    </div>
    <div class="city" id="paris">
      <div>
        <h2>Paris</h2>
        <div class="date"></div>
      </div>
      <div class="time"></div>
    </div>
  `;
}

function handleSelectChange(e) {
  const value = e.target.value;
  if (!value) {
    if (selectedTimer) clearInterval(selectedTimer);
    restoreBaseLayout();
    startBaseTimer();
    return;
  }
  if (baseTimer) clearInterval(baseTimer);
  let tz = value === "current" ? moment.tz.guess() : value;
  startSelectedTimer(tz);
}

document.addEventListener("DOMContentLoaded", () => {
  startBaseTimer();
  const sel = document.querySelector("#city");
  if (sel) sel.addEventListener("change", handleSelectChange);
});
