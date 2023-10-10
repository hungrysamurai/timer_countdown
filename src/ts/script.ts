// Import type
import { DOMElementsList } from "./types";

// Import utils
import {
  getElement,
  transformDOM,
  setInputsLimits,
  updateProgressBar,
  getTotalTimeFromInputs,
  deactivateInputs,
  reset,
} from "./utils";

// Import timer functions
import { TimerState, timerUpdate } from "./timer";

// Import save timer functions
import { getSavedTimers, saveTimer, resetSavedTimers } from "./saveTimer";

// Import countdown functions
import { CountdownState, countdownUpdate } from "./countdown";

// Mode switch container
const modeContainer = getElement(".mode-container");
const modeSwitcher = getElement(".mode-switcher");
const progressBar = getElement(".progress-bar");
const modeLabels = modeSwitcher.querySelectorAll(".mode-switcher label");

// Saved timers elements
const savedCloseBtn = getElement(".saved-timers-container button");
const savedTimersEl = getElement(".saved-timers");

/**
 * Object of DOM elements that relates to save time functionality
 */
const saveTimerElements: DOMElementsList = {
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

/**
 * Object of DOM elements related to timer functionality
 */
const timerElements: DOMElementsList = {
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
const hoursInput = getElement("#hours-input") as HTMLInputElement;
const minutesInput = getElement("#minutes-input") as HTMLInputElement;
const secondsInput = getElement("#seconds-input") as HTMLInputElement;

/**
 * Array of DOM elements - input fields for hours, minutes and seconds for countdown
 */
const inputsArray: HTMLInputElement[] = [
  hoursInput,
  minutesInput,
  secondsInput,
];

/**
 * Object of DOM elements related to countdown functionality
 */
const countdownElements: DOMElementsList = {
  countdownButtonsContainer,
  countdownPlayBtn,
  countdownPlayIcon,
  countdownStopBtn,
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

/**
 * Object of DOM elements - digits of timer/countdown
 */
let digitsElements: DOMElementsList = {
  hoursEl,
  minutesEl,
  secondsEl,
  millisecondsEl,
};

/**
 * Current interval id
 */
let globalInterval: number;

/**
 * Current timer state object
 */
let timerState: TimerState | null;

/**
 * Current countdown state object
 */
let countdownState: CountdownState | null;

// Switch modes
modeLabels.forEach((label) => {
  label.addEventListener("click", (e) => {
    if (e.target instanceof Element) {
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

      reset(
        globalInterval,
        timerElements,
        countdownElements,
        digitsElements,
        inputsArray
      );

      timerState = null;
      countdownState = null;
    }
  });
});

///////////////////////////////////////   TIMER

// Play/pause
timerPlayBtn.addEventListener("click", () => {
  if (!timerState) {
    timerPlayIcon.className = "bi bi-pause";
    timerPlayBtn.classList.add("active");

    timerState = new TimerState();

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
    timerState.freeze();
    timerPlayIcon.className = "bi bi-play";
    clearInterval(globalInterval);
  }

  // Resume timer
  else if (timerState.status === "paused") {
    timerState.unFreeze();

    timerPlayIcon.className = "bi bi-pause";
    timerPlayBtn.classList.add("active");

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
  reset(
    globalInterval,
    timerElements,
    countdownElements,
    digitsElements,
    inputsArray
  );
  timerState = null;
});

// Save Timer
saveBtn.addEventListener("click", () => {
  saveTimer(timerState as TimerState, saveTimerElements);
});

// Remove all saved timers
savedContainer.addEventListener("click", (e) => {
  if (e.target instanceof Element) {
    if (e.target.tagName === "I" || e.target.tagName === "BUTTON") {
      resetSavedTimers(saveTimerElements);
    }
  }
});

///////////////////////////////////////   COUNTDOWN

// Init/Resume countdown
countdownPlayBtn.addEventListener("click", () => {
  // Initialize countdown
  if (!countdownState || countdownState.status === "done") {
    const totalTimeFromInputs = getTotalTimeFromInputs(inputsArray);

    if (totalTimeFromInputs === 0 || totalTimeFromInputs >= 359_999_999) return;

    deactivateInputs(inputsArray, true);
    updateProgressBar(progressBar, 0);

    countdownState = new CountdownState(totalTimeFromInputs);

    countdownPlayIcon.className = "bi bi-pause";
    countdownPlayBtn.classList.add("active");

    globalInterval = setInterval(() => {
      countdownUpdate(
        countdownState as CountdownState,
        globalInterval,
        countdownElements,
        digitsElements,
        inputsArray
      );
    }, 4);

    return;
  }

  // Pause countdown
  if (countdownState.status === "active") {
    countdownState.freeze();
    countdownPlayIcon.className = "bi bi-play";
    // Clear interval
    clearInterval(globalInterval);
  }
  // Resume countdown
  else if (countdownState.status === "paused") {
    countdownState.unFreeze();
    countdownPlayIcon.className = "bi bi-pause";

    // Refresh interval
    globalInterval = setInterval(() => {
      countdownUpdate(
        countdownState as CountdownState,
        globalInterval,
        countdownElements,
        digitsElements,
        []
      );
    }, 4);
  }
});

// Reset countdown
countdownStopBtn.addEventListener("click", () => {
  reset(
    globalInterval,
    timerElements,
    countdownElements,
    digitsElements,
    inputsArray
  );

  countdownState = null;

  updateProgressBar(progressBar, 0);
});

// Init
getSavedTimers(saveTimerElements);
setInputsLimits(inputsArray);
