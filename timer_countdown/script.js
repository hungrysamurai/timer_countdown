"use strict";

// DOM elements

// Timer elements
const timerButtonsContainer = document.querySelector(
  ".timer-buttons-container"
);
const timerPlayBtn = document.querySelector(".timer-play-btn");
const timerPlayIcon = document.querySelector(".timer-play-btn .bi.bi-play");
const timerStopBtn = document.querySelector(".timer-stop-btn");
const saveBtn = document.querySelector(".save-btn");
const savedContainer = document.querySelector(".saved-timers-container");
const savedTimersEl = document.querySelector(".saved-timers");
const savedCloseBtn = document.querySelector(".saved-timers-container button");

// Countdown elements
const countdownButtonsContainer = document.querySelector(
  ".countdown-buttons-container"
);
const countdownPlayBtn = document.querySelector(".countdown-play-btn");
const countdownPlayIcon = document.querySelector(
  ".countdown-play-btn .bi.bi-play"
);
const countdownStopBtn = document.querySelector(".countdown-stop-btn");
const hoursInput = document.querySelector("#hours-input");
const minutesInput = document.querySelector("#minutes-input");
const secondsInput = document.querySelector("#seconds-input");

const inputsArray = [hoursInput, minutesInput, secondsInput];

// Mode switch container
const modeContainer = document.querySelector(".mode-container");
const modeSwitcher = document.querySelector(".mode-switcher");
const progressBar = document.querySelector(".progress-bar");
const timerRadio = document.querySelector("#timer-radio");
const countdownRadio = document.querySelector("#countdown-radio");

// Timer digits
const clockContainer = document.querySelector(".clock-container");
const hoursEl = document.querySelector("#hours");
const minutesEl = document.querySelector("#minutes");
const secondsEl = document.querySelector("#seconds");
const millisecondsEl = document.querySelector("#milliseconds");

let globalInterval;

// States variables
let timerState;
let countdownState;

// Switch modes
modeSwitcher.addEventListener("click", (e) => {
  if (e.pointerId === 1 || e.pointerId === 0) return;

  const currentMode = e.target.id.split("-")[0];
  transformDOM(currentMode);

  // Reset timer & countdown
  stopTimer();
  resetCountdown();
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
  const { hours, minutes, seconds, milliseconds } = convertTime(t);

  updateDOMTimer(hours, minutes, seconds, milliseconds);
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
  updateDOMTimer(0, 0, 0, 0);
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

////////////////////////////////////////   TIMER

// Check localStorage for saved timers
if (!localStorage.getItem("savedTimers")) {
  localStorage.setItem("savedTimers", JSON.stringify([]));
}
let savedTimers = JSON.parse(localStorage.getItem("savedTimers"));

// Retrieve saved timers from localStorage and render them to DOM
savedTimers.forEach((time, i) => {
  // Add close button to container
  if (i === 0) {
    savedCloseBtn.classList.remove("hidden");
  }
  updateDOMSavedTimers(convertTime(time));
});

// Play/pause timer
timerPlayBtn.addEventListener("click", () => {
  if (!timerState) {
    initializeTimer();
    return;
  }

  if (timerState.status === "active") freezeTimer();
  else unFreezeTimer();
});

// Reset timer
timerStopBtn.addEventListener("click", stopTimer);

// Save Timer
saveBtn.addEventListener("click", saveTimer);

// Remove all saved timers
savedContainer.addEventListener("click", (e) => {
  if (e.target.tagName === "I" || e.target.tagName === "BUTTON") {
    resetSavedTimers();
  }
});

function initializeTimer() {
  // Set initial timer state object
  timerState = {
    status: "active",
    timerProgress: 0,
    initialTimestamp: Date.now(),
  };

  // Change button
  timerPlayIcon.className = "bi bi-pause";
  timerPlayBtn.classList.add("active");

  // Initialize interval
  globalInterval = setInterval(timerUpdate, 4, timerState.initialTimestamp);
}

function freezeTimer() {
  // Update status
  timerState.status = "paused";
  timerState.timerProgress = Date.now() - timerState.initialTimestamp;

  // Change DOM
  timerPlayIcon.className = "bi bi-play";

  // Stop Interval
  clearInterval(globalInterval);
}

function unFreezeTimer() {
  // Update status
  timerState.status = "active";
  timerState.initialTimestamp = Date.now() - timerState.timerProgress;

  // Change DOM
  timerPlayIcon.className = "bi bi-pause";
  timerPlayBtn.classList.add("active");

  // Initialize interval
  globalInterval = setInterval(timerUpdate, 4, timerState.initialTimestamp);
}

function stopTimer() {
  timerState = undefined;
  clearInterval(globalInterval);
  timerPlayIcon.className = "bi bi-play";
  timerPlayBtn.classList.remove("active");
  updateDOMTimer(0, 0, 0, 0);
}

// Save timer

function saveTimer() {
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
}

function timerUpdate(startTime) {
  const t = Date.now() - startTime;
  const { hours, minutes, seconds, milliseconds } = convertTime(t);

  updateDOMTimer(hours, minutes, seconds, milliseconds);
}

// Make 00 instead of 0

function getZero(num) {
  if (num >= 0 && num < 10) {
    return `0${num}`;
  } else {
    return num;
  }
}

// Convert ms to hours, minutes, seconds, ms (00)

function convertTime(timeStamp) {
  const hours = Math.floor(timeStamp / (1000 * 60 * 60));
  const minutes = Math.floor((timeStamp / 1000 / 60) % 60);
  const seconds = Math.floor((timeStamp / 1000) % 60);
  const milliseconds = Math.floor((timeStamp / 10) % 100);

  return { hours, minutes, seconds, milliseconds };
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

function updateDOMTimer(hours, minutes, seconds, milliseconds) {
  hoursEl.textContent = getZero(hours);
  minutesEl.textContent = getZero(minutes);
  secondsEl.textContent = getZero(seconds);
  millisecondsEl.textContent = getZero(milliseconds);
}

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
