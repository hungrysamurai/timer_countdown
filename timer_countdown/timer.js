import { getElement, convertTime, getZero } from "./utils.js";

// Saved timers elements
const savedCloseBtn = getElement(".saved-timers-container button");
const savedTimersEl = getElement(".saved-timers");

let savedTimers;

const getSavedTimers = () => {
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
    updateDOMSavedTimers(convertTime(time));
  });
};

// Save timer
const saveTimer = (timerState) => {
  let currentTime;
  if (!timerState) return;

  if (timerState.status === "active")
    currentTime = Date.now() - timerState.initialTimestamp;
  else currentTime = timerState.timerProgress;

  savedTimers.push(currentTime);

  if (savedTimers.length === 1) {
    savedCloseBtn.classList.remove("hidden");
  }

  localStorage.setItem("savedTimers", JSON.stringify(savedTimers));
  updateDOMSavedTimers(convertTime(currentTime));
};

function updateDOMSavedTimers({ hours, minutes, seconds, milliseconds }) {
  const element = document.createElement("div");
  element.className = "saved-timer m-1";
  element.innerHTML = `
  <span>
  ${getZero(hours)}:${getZero(minutes)}:${getZero(seconds)}:${getZero(
    milliseconds
  )}
  </span>
  `;

  savedTimersEl.append(element);
}

function resetSavedTimers() {
  // Clear DOM
  savedTimersEl.innerHTML = "";

  // Purge savedTimers array
  savedTimers = [];

  // Purge localStorage
  localStorage.removeItem("savedTimers");

  // Hide button
  savedCloseBtn.classList.add("hidden");
}

// Timer fucntions

export { getSavedTimers, saveTimer, resetSavedTimers };
