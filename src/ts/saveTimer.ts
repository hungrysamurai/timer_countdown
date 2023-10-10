import { ConvertedTimeObject, DOMElementsList } from "./types";
import { TimerState } from "./timer";
import { convertTime, getZero } from "./utils";

/**
 * Array of saved timer values
 * @type {Array}
 */
let savedTimers: number[];

/**
 * @property {Function} getSavedTimers - Load saved timers from localStorage
 * @param {Object} saveTimerElements - Object of DOM elements that relates to save time functionality
 */
const getSavedTimers = ({
  savedCloseBtn,
  savedTimersEl,
}: DOMElementsList): void => {
  // Check localStorage for saved timers
  if (!localStorage.getItem("savedTimers")) {
    localStorage.setItem("savedTimers", JSON.stringify([]));
  }

  savedTimers = JSON.parse(localStorage.getItem("savedTimers") as string);
  if (savedTimers) {
    // Retrieve saved timers from localStorage and render them to DOM
    savedTimers.forEach((time, i) => {
      // Add close button to container
      if (i === 0) {
        savedCloseBtn.classList.remove("hidden");
      }
      updateDOMSavedTimers(convertTime(time), savedTimersEl);
    });
  }
};

/**
 * @property {Function} saveTimer - Save timer value
 * @param {Object} timerState - current timer state object
 * @param {Object} saveTimerElements - Object of DOM elements that relates to save time functionality
 */
const saveTimer = (
  timerState: TimerState,
  { savedCloseBtn, savedTimersEl }: DOMElementsList
): void => {
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
 */
const resetSavedTimers = ({
  savedCloseBtn,
  savedTimersEl,
}: DOMElementsList): void => {
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
 */
function updateDOMSavedTimers(
  { hours, minutes, seconds, milliseconds }: ConvertedTimeObject,
  savedTimersEl: HTMLElement
): void {
  const element = document.createElement("div");
  element.className = "saved-timer m-1";
  element.innerHTML = `
  <span>
  ${getZero(hours as number)}:${getZero(minutes as number)}:${getZero(
    seconds as number
  )}:${getZero(milliseconds as number)}
  </span>
  `;

  savedTimersEl.append(element);
}

export { getSavedTimers, saveTimer, resetSavedTimers };
