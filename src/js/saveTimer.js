import { convertTime, getZero } from "./utils.js";

/**
 * Array of saved timer values
 * @type {Array}
 */
let savedTimers;

/**
 * @property {Function} getSavedTimers - Load saved timers from localStorage
 * @param {Object} saveTimerElements - Object of DOM elements that relates to save time functionality
 * @returns {void}
 */
const getSavedTimers = ({ savedCloseBtn, savedTimersEl }) => {
  // Check localStorage for saved timers
  if (!localStorage.getItem("savedTimers")) {
    localStorage.setItem("savedTimers", JSON.stringify([]));
  }

  savedTimers = JSON.parse(localStorage.getItem("savedTimers"));
  console.log(savedTimers);
  // Retrieve saved timers from localStorage and render them to DOM
  savedTimers.forEach((time, i) => {
    // Add close button to container
    if (i === 0) {
      savedCloseBtn.classList.remove("hidden");
    }
    updateDOMSavedTimers(convertTime(time), savedTimersEl);
  });
};

/**
 * @property {Function} saveTimer - Save timer value
 * @param {Object} timerState - current timer state object
 * @param {Object} saveTimerElements - Object of DOM elements that relates to save time functionality
 * @returns {void}
 */
const saveTimer = (timerState, { savedCloseBtn, savedTimersEl }) => {
  let currentTime;
  if (!timerState) return;

  if (timerState.status === "active")
    currentTime = Date.now() - timerState.initialTimestamp;
  else currentTime = timerState.timerProgress;

  // Set limit to 12 timers
  if (savedTimers.length < 12) {
    if (savedTimers[savedTimers.length - 1] === currentTime) {
      return;
    } else {
      savedTimers.push(currentTime);
    }
  } else {
    return;
  }
  if (savedTimers.length === 1) {
    savedCloseBtn.classList.remove("hidden");
  }

  localStorage.setItem("savedTimers", JSON.stringify(savedTimers));
  updateDOMSavedTimers(convertTime(currentTime), savedTimersEl);
};

/**
 * @property {Function} resetSavedTimers - Reset all saved timers
 * @param {Object} saveTimerElements - Object of DOM elements that relates to save time functionality
 * @returns {void}
 */
const resetSavedTimers = ({ savedCloseBtn, savedTimersEl }) => {
  // Clear DOM
  savedTimersEl.innerHTML = "";

  // Purge savedTimers array
  savedTimers = [];

  // Purge localStorage
  localStorage.removeItem("savedTimers");

  // Hide button
  savedCloseBtn.classList.add("hidden");
};

/**
 * @property {Function} updateDOMSavedTimers - Add new value to saved timer values
 * @param {Object} - Object with hh:mm:ss:mm
 * @param {HTMLElement} savedTimersEl - DOM element, container for save timer values
 * @returns {void}
 */
function updateDOMSavedTimers(
  { hours, minutes, seconds, milliseconds },
  savedTimersEl
) {
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

export { getSavedTimers, saveTimer, resetSavedTimers };
