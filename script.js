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

let timerInterval;
let timerState;

let countdownInterval;
let countdownState;

let globalState = {
  mode: "timer",
};

// Switch modes
modeSwitcher.addEventListener("click", (e) => {
  if (e.pointerId !== 1) return;

  const currentMode = e.target.id.split("-")[0];
  globalState.mode = currentMode;
  transformDOM(currentMode);
  console.log(globalState);
});

////////////////////////////////////////TIMER

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
timerStopBtn.addEventListener("click", () => {
  timerState = undefined;
  clearInterval(timerInterval);
  timerPlayIcon.className = "bi bi-play";
  timerPlayBtn.classList.remove("active");
  updateDOMTimer(0, 0, 0, 0);
});

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
  timerInterval = setInterval(timerUpdate, 4, timerState.initialTimestamp);
}

function freezeTimer() {
  // Update status
  timerState.status = "paused";
  timerState.timerProgress = Date.now() - timerState.initialTimestamp;

  // Change DOM
  timerPlayIcon.className = "bi bi-play";

  // Stop Interval
  clearInterval(timerInterval);
  console.log(timerState);
}

function unFreezeTimer() {
  // Update status
  timerState.status = "active";
  timerState.initialTimestamp = Date.now() - timerState.timerProgress;

  // Change DOM
  timerPlayIcon.className = "bi bi-pause";
  timerPlayBtn.classList.add("active");

  // Initialize interval
  timerInterval = setInterval(timerUpdate, 4, timerState.initialTimestamp);
  console.log(timerState);
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
  const hours = Math.floor((timeStamp / (1000 * 60 * 60)) % 24);
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
