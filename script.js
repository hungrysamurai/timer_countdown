// DOM elements
const playBtn = document.querySelector(".play-btn");
const playIcon = document.querySelector(".bi.bi-play");
const stopBtn = document.querySelector(".stop-btn");
const saveBtn = document.querySelector(".save-btn");

// Timer digits
const hoursEl = document.querySelector("#hours");
const minutesEl = document.querySelector("#minutes");
const secondsEl = document.querySelector("#seconds");
const millisecondsEl = document.querySelector("#milliseconds");

let timerInterval;
let timerState;

// Play/pause timer
playBtn.addEventListener("click", () => {
  if (!timerState) {
    initializeTimer();
    return;
  }

  if (timerState.status === "active") freezeTimer();
  else unFreezeTimer();
});

// Reset timer
stopBtn.addEventListener("click", () => {
  timerState = undefined;
  clearInterval(timerInterval);
  playIcon.className = "bi bi-play";
  playBtn.classList.remove("active");
  updateDOMTimer(0, 0, 0, 0);
});

function initializeTimer() {
  // Set initial timer state object
  timerState = {
    status: "active",
    timerProgress: 0,
    initialTimestamp: Date.now(),
  };

  // Change button
  playIcon.className = "bi bi-pause";
  playBtn.classList.add("active");

  // Initialize interval
  timerInterval = setInterval(timerUpdate, 4, timerState.initialTimestamp);
}

function freezeTimer() {
  // Update status
  timerState.status = "paused";
  timerState.timerProgress = Date.now() - timerState.initialTimestamp;

  // Change DOM
  playIcon.className = "bi bi-play";

  // Stop Interval
  clearInterval(timerInterval);
  console.log(timerState);
}

function unFreezeTimer() {
  // Update status
  timerState.status = "active";
  timerState.initialTimestamp = Date.now() - timerState.timerProgress;

  // Change DOM
  playIcon.className = "bi bi-pause";
  playBtn.classList.add("active");

  // Initialize interval
  timerInterval = setInterval(timerUpdate, 4, timerState.initialTimestamp);
  console.log(timerState);
}

function timerUpdate(startTime) {
  const t = Date.now() - startTime;

  const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((t / 1000 / 60) % 60);
  const seconds = Math.floor((t / 1000) % 60);
  const milliseconds = Math.floor((t / 10) % 100);

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

function updateDOMTimer(hours, minutes, seconds, milliseconds) {
  hoursEl.textContent = getZero(hours);
  minutesEl.textContent = getZero(minutes);
  secondsEl.textContent = getZero(seconds);
  millisecondsEl.textContent = getZero(milliseconds);
}
