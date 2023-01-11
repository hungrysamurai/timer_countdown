import { updateDOMTimer, convertTime } from "./utils.js";

// Init timer from 00
const initializeTimer = (timerState, { timerPlayIcon, timerPlayBtn }) => {
  // Set initial timer state object
  timerState = {
    status: "active",
    timerProgress: 0,
    initialTimestamp: Date.now(),
  };

  // Change button
  timerPlayIcon.className = "bi bi-pause";
  timerPlayBtn.classList.add("active");

  return timerState;
};

// Pause timer
const freezeTimer = (timerState, { timerPlayIcon }, interval) => {
  // Update status
  timerState.status = "paused";
  timerState.timerProgress = Date.now() - timerState.initialTimestamp;

  // Change DOM
  timerPlayIcon.className = "bi bi-play";

  // Stop Interval
  clearInterval(interval);

  return timerState;
};

// Resume Timer
const unFreezeTimer = (timerState, { timerPlayIcon, timerPlayBtn }) => {
  // Update status
  timerState.status = "active";
  timerState.initialTimestamp = Date.now() - timerState.timerProgress;

  // Change DOM
  timerPlayIcon.className = "bi bi-pause";
  timerPlayBtn.classList.add("active");

  return timerState;
};

// Reset timer to 00
const resetTimer = (
  timerState,
  { timerPlayIcon, timerPlayBtn },
  digitsElements,
  interval
) => {
  timerState = undefined;
  clearInterval(interval);
  timerPlayIcon.className = "bi bi-play";
  timerPlayBtn.classList.remove("active");
  updateDOMTimer(undefined, digitsElements);

  return timerState;
};

// Update timer function
const timerUpdate = (startTime, digitsElements) => {
  const t = Date.now() - startTime;
  updateDOMTimer(convertTime(t), digitsElements);
};

export { initializeTimer, freezeTimer, unFreezeTimer, resetTimer, timerUpdate };
