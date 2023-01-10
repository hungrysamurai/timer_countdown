// Import utils
import { getElement, getZero, convertTime, updateDOMTimer } from "./utils.js";

// Import timer functions
import {
  initializeTimer,
  freezeTimer,
  unFreezeTimer,
  resetTimer,
  timerUpdate,
} from "./timer.js";

// Import save timer functions
import { getSavedTimers, saveTimer, resetSavedTimers } from "./saveTimer.js";

// Import countdown functions
import {} from "./countdown.js";

// Timer elements
const timerButtonsContainer = getElement(".timer-buttons-container");
const timerPlayBtn = getElement(".timer-play-btn");
const timerPlayIcon = getElement(".timer-play-btn .bi.bi-play");
const timerStopBtn = getElement(".timer-stop-btn");
const saveBtn = getElement(".save-btn");
const savedContainer = getElement(".saved-timers-container");

const timerElements = {
  timerButtonsContainer,
  timerPlayBtn,
  timerPlayIcon,
  timerStopBtn,
  saveBtn,
  savedContainer,
};

// Countdown elements
const countdownButtonsContainer = getElement(".countdown-buttons-container");
const countdownPlayBtn = getElement(".countdown-play-btn");
const countdownPlayIcon = getElement(".countdown-play-btn .bi.bi-play");
const countdownStopBtn = getElement(".countdown-stop-btn");
const hoursInput = getElement("#hours-input");
const minutesInput = getElement("#minutes-input");
const secondsInput = getElement("#seconds-input");

const inputsArray = [hoursInput, minutesInput, secondsInput];

// Mode switch container
const modeContainer = getElement(".mode-container");
const modeSwitcher = getElement(".mode-switcher");
const progressBar = getElement(".progress-bar");

// Timer digits
const clockContainer = getElement(".clock-container");
const hoursEl = getElement("#hours");
const minutesEl = getElement("#minutes");
const secondsEl = getElement("#seconds");
const millisecondsEl = getElement("#milliseconds");

let digitsObject = { hoursEl, minutesEl, secondsEl, millisecondsEl };

let globalInterval;

let timerState;
let countdownState;

// Switch modes
modeSwitcher.addEventListener("click", (e) => {
  if (e.pointerId === 1 || e.pointerId === 0) return;

  const currentMode = e.target.id.split("-")[0];
  transformDOM(currentMode);

  // Reset timer & countdown
  resetTimer(timerState, timerElements, digitsObject, globalInterval);
  resetCountdown();
});

////////////////////////////////////////   TIMER

// Play/pause
timerPlayBtn.addEventListener("click", () => {
  if (!timerState) {
    // Initialize timer
    timerState = initializeTimer(timerState, timerElements);

    // Initialize interval
    globalInterval = setInterval(
      timerUpdate,
      4,
      timerState.initialTimestamp,
      digitsObject
    );
    return;
  }

  if (timerState.status === "active") {
    timerState = freezeTimer(timerState, timerElements, globalInterval);
  } else if (timerState.status === "paused") {
    timerState = unFreezeTimer(timerState, timerElements);
    // Initialize interval again
    globalInterval = setInterval(
      timerUpdate,
      4,
      timerState.initialTimestamp,
      digitsObject
    );
  }
});

// Reset timer
timerStopBtn.addEventListener("click", () => {
  resetTimer(timerState, timerElements, digitsObject, globalInterval);
});

// Save Timer
saveBtn.addEventListener("click", () => {
  saveTimer(timerState);
});

// Remove all saved timers
savedContainer.addEventListener("click", (e) => {
  if (e.target.tagName === "I" || e.target.tagName === "BUTTON") {
    resetSavedTimers();
  }
});

///////////////////////////////////////   COUNTDOWN

// Init/Resume countdown
countdownPlayBtn.addEventListener("click", () => {
  // Init
  if (!countdownState) {
    initializeCountdown();
    return;
  }
  // Pause
  if (countdownState.status === "active") freezeCountdown();
  // Resume
  else unFreezeCountdown();
});

// Reset countdown
countdownStopBtn.addEventListener("click", resetCountdown);

function initializeCountdown() {
  const totalTime =
    secondsInput.value * 1000 +
    minutesInput.value * 60 * 1000 +
    hoursInput.value * 60 * 60 * 1000;

  if (totalTime === 0 || totalTime >= 359_999_999) return;

  deActivateInputs(true);

  countdownState = {
    status: "active",
    countdownTime: totalTime,
  };

  countdownState.endTime = Date.now() + totalTime;

  countdownPlayIcon.className = "bi bi-pause";
  countdownPlayBtn.classList.add("active");

  globalInterval = setInterval(countdownUpdate, 4, countdownState.endTime);
}

function freezeCountdown() {
  countdownState.status = "paused";
  countdownPlayIcon.className = "bi bi-play";

  clearInterval(globalInterval);
}

function unFreezeCountdown() {
  countdownState.status = "active";
  countdownState.endTime = countdownState.countdownTime + Date.now();
  countdownPlayIcon.className = "bi bi-pause";

  globalInterval = setInterval(countdownUpdate, 4, countdownState.endTime);
}

function countdownUpdate(endTime) {
  const t = endTime - Date.now();
  countdownState.countdownTime = t;

  updateDOMTimer(convertTime(t), digitsObject);
  if (t <= 4) {
    resetCountdown();
  }
}

function resetCountdown() {
  clearInterval(globalInterval);
  countdownState = undefined;

  countdownPlayIcon.className = "bi bi-play";
  countdownPlayBtn.classList.remove("active");

  deActivateInputs(false);

  [(hoursInput, minutesInput, secondsInput)].forEach(
    (input) => (input.value = "")
  );
  updateDOMTimer(undefined, digitsObject);
  inputsArray.forEach((input) => (input.value = ""));
}

// set inputs numeric limitations
inputsArray.forEach((input) => {
  input.addEventListener("input", () => {
    setUpInput(input);
  });
});

function setUpInput(el) {
  if (el.value != "") {
    if (parseInt(el.value) < parseInt(el.min)) {
      el.value = el.min;
    }
    if (parseInt(el.value) > parseInt(el.max)) {
      el.value = el.max;
    }
  }
}

function deActivateInputs(mode) {
  inputsArray.forEach((input) => {
    input.disabled = mode;
    input.style.color = mode ? "lightgray" : "var(--color-dark)";
  });
}

// Update DOM

function transformDOM(mode) {
  // Change digits colors
  clockContainer.className = `clock-container ${mode} d-flex w-100 h-auto`;

  // Transform mode container
  modeContainer.className = `mode-container ${mode}`;

  // Progress bar re-color
  progressBar.className = `progress-bar ${mode}`;

  // Switch buttons containers
  timerButtonsContainer.classList.remove("show");
  countdownButtonsContainer.classList.remove("show");

  document.querySelector(`.${mode}-buttons-container`).classList.add("show");
}

// Init
getSavedTimers();
