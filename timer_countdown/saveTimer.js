import { getElement, convertTime, getZero } from "./utils.js";

let savedTimers;

const getSavedTimers = ({ savedCloseBtn, savedTimersEl }) => {
  // Check localStorage for saved timers
  if (!localStorage.getItem("savedTimers")) {
    localStorage.setItem("savedTimers", JSON.stringify([]));
  }

  savedTimers = JSON.parse(localStorage.getItem("savedTimers"));

  // Retrieve saved timers from localStorage and render them to DOM
  savedTimers.forEach((time, i) => {
    // Add close button to container
    if (i === 0) {
      savedCloseBtn.classList.remove("hidden");
    }
    updateDOMSavedTimers(convertTime(time), savedTimersEl);
  });
};

// Save timer
const saveTimer = (timerState, { savedCloseBtn, savedTimersEl }) => {
  let currentTime;
  if (!timerState) return;

  if (timerState.status === "active")
    currentTime = Date.now() - timerState.initialTimestamp;
  else currentTime = timerState.timerProgress;
  console.log(savedTimers);

  // Set limit to 12 timers
  if (savedTimers.length < 10) {
    savedTimers.push(currentTime);
  } else {
    return;
  }
  if (savedTimers.length === 1) {
    savedCloseBtn.classList.remove("hidden");
  }

  localStorage.setItem("savedTimers", JSON.stringify(savedTimers));
  updateDOMSavedTimers(convertTime(currentTime), savedTimersEl);
};

// Reset all saved timers
const resetSavedTimers = ({ savedCloseBtn, savedTimersEl }) => {
  // Clear DOM
  savedTimersEl.innerHTML = "";

  // Purge savedTimers array
  savedTimers = [];

  // Purge localStorage
  localStorage.removeItem("savedTimers");

  // Hide button
  savedCloseBtn.classList.add("hidden");
}

// Update seved timers container
function updateDOMSavedTimers({ hours, minutes, seconds, milliseconds }, savedTimersEl) {
  const element = document.createElement("div");
  element.className = "saved-timer m-1";
  element.innerHTML = `
  <span>
  ${getZero(hours)}:${getZero(minutes)}:${getZero(seconds)}:${getZero(milliseconds)}
  </span>
  `;

  savedTimersEl.append(element);
}

export { getSavedTimers, saveTimer, resetSavedTimers };
