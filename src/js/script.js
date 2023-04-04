
// Import utils
import {
  getElement,
  transformDOM,
  setInputs,
  updateProgressBar,
} from "./utils.js";

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
import {
  initializeCountdown,
  freezeCountdown,
  unFreezeCountdown,
  resetCountdown,
  countdownUpdate,
} from "./countdown.js";

// Mode switch container
const modeContainer = getElement(".mode-container");
const modeSwitcher = getElement(".mode-switcher");
const progressBar = getElement(".progress-bar");

// Saved timers elements
const savedCloseBtn = getElement(".saved-timers-container button");
const savedTimersEl = getElement(".saved-timers");

const saveTimerElements = {
  savedCloseBtn,
  savedTimersEl,
};

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

const countdownElements = {
  countdownButtonsContainer,
  countdownPlayBtn,
  countdownPlayIcon,
  countdownStopBtn,
  inputsArray,
  progressBar,
};

// Timer digits

// Container
const clockContainer = getElement(".clock-container");
// Digits
const hoursEl = getElement("#hours");
const minutesEl = getElement("#minutes");
const secondsEl = getElement("#seconds");
const millisecondsEl = getElement("#milliseconds");

let digitsElements = { hoursEl, minutesEl, secondsEl, millisecondsEl };

let globalInterval;
let timerState;
let countdownState;

// Switch modes
modeSwitcher.addEventListener("click", (e) => {
  if (e.pointerId === 1 || e.pointerId === 0) return;

  const currentMode = e.target.id.split("-")[0];
  transformDOM(currentMode, {
    clockContainer,
    modeContainer,
    progressBar,
    timerButtonsContainer,
    countdownButtonsContainer,
  });

  // Update progress bar
  currentMode === "timer"
    ? updateProgressBar(progressBar, 100)
    : updateProgressBar(progressBar, 0);

  // Reset timer & countdown
  timerState = resetTimer(
    timerState,
    timerElements,
    digitsElements,
    globalInterval
  );

  countdownState = resetCountdown(
    countdownState,
    globalInterval,
    countdownElements,
    digitsElements
  );
});

///////////////////////////////////////   TIMER

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
      digitsElements
    );
    return;
  }

  // Pause timer
  if (timerState.status === "active") {
    timerState = freezeTimer(timerState, timerElements, globalInterval);
  }
  // Resume timer
  else if (timerState.status === "paused") {
    timerState = unFreezeTimer(timerState, timerElements);

    // Refresh interval
    globalInterval = setInterval(
      timerUpdate,
      4,
      timerState.initialTimestamp,
      digitsElements
    );
  }
});

// Reset timer
timerStopBtn.addEventListener("click", () => {
  timerState = resetTimer(
    timerState,
    timerElements,
    digitsElements,
    globalInterval
  );
});

// Save Timer
saveBtn.addEventListener("click", () => {
  saveTimer(timerState, saveTimerElements);
});

// Remove all saved timers
savedContainer.addEventListener("click", (e) => {
  if (e.target.tagName === "I" || e.target.tagName === "BUTTON") {
    resetSavedTimers(saveTimerElements);
  }
});

///////////////////////////////////////   COUNTDOWN

// Init/Resume countdown
countdownPlayBtn.addEventListener("click", () => {
  // Initialize countdown
  if (!countdownState || countdownState.status === "done") {
    countdownState = initializeCountdown(countdownState, countdownElements);

    // If inputs empty
    if (!countdownState) return;

    globalInterval = setInterval(() => {
      countdownUpdate(
        countdownState,
        globalInterval,
        countdownElements,
        digitsElements
      );
    }, 4);

    return;
  }
  // Pause countdown
  if (countdownState.status === "active") {
    countdownState = freezeCountdown(
      countdownState,
      globalInterval,
      countdownElements
    );
  }
  // Resume countdown
  else if (countdownState.status === "paused") {
    countdownState = unFreezeCountdown(countdownState, countdownElements);

    // Refresh interval
    globalInterval = setInterval(() => {
      countdownUpdate(
        countdownState,
        globalInterval,
        countdownElements,
        digitsElements
      );
    }, 4);
  }
});

// Reset countdown
countdownStopBtn.addEventListener("click", () => {
  countdownState = resetCountdown(
    countdownState,
    globalInterval,
    countdownElements,
    digitsElements
  );
  updateProgressBar(progressBar, 0);
});

// Init
getSavedTimers(saveTimerElements);
setInputs(inputsArray);
