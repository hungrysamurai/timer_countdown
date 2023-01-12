import { updateDOMTimer, convertTime, updateProgressBar } from "./utils.js";

// Init countdown from 00
const initializeCountdown = (countdownState, { inputsArray, countdownPlayIcon, countdownPlayBtn, progressBar }) => {

 const [hoursInput, minutesInput, secondsInput] = inputsArray;

 const totalTime =
  secondsInput.value * 1000 +
  minutesInput.value * 60 * 1000 +
  hoursInput.value * 60 * 60 * 1000;

 if (totalTime === 0 || totalTime >= 359_999_999) return;

 deActivateInputs(inputsArray, true);
 updateProgressBar(progressBar, 0);
 countdownState = {
  status: "active",
  countdownTime: totalTime,
  endTime: Date.now() + totalTime,
  totalTime: totalTime
 };

 countdownPlayIcon.className = "bi bi-pause";
 countdownPlayBtn.classList.add("active");

 return countdownState;
}

// Pause countdown
const freezeCountdown = (countdownState, interval, { countdownPlayIcon }) => {
 countdownState.status = "paused";
 countdownPlayIcon.className = "bi bi-play";

 clearInterval(interval);

 return countdownState;
}

// Resume countdown
const unFreezeCountdown = (countdownState, { countdownPlayIcon }) => {
 countdownState.status = "active";
 countdownState.endTime = countdownState.countdownTime + Date.now();
 countdownPlayIcon.className = "bi bi-pause";

 return countdownState;
}

// Reset countdown to 00
const resetCountdown = (countdownState, interval, { inputsArray, countdownPlayIcon, countdownPlayBtn }, digitsElements) => {

 clearInterval(interval);
 countdownState = undefined;

 countdownPlayIcon.className = "bi bi-play";
 countdownPlayBtn.classList.remove("active");

 deActivateInputs(inputsArray, false);

 updateDOMTimer(undefined, digitsElements);

 inputsArray.forEach(
  (input) => (input.value = "")
 );

 return countdownState;
}

// Countdown update function
const countdownUpdate = (countdownState, interval, countdownElements, digitsElements) => {

 const { endTime } = countdownState;
 const { progressBar } = countdownElements;

 let t = endTime - Date.now();
 countdownState.countdownTime = t;

 updateDOMTimer(convertTime(t), digitsElements);

 const progress = (((countdownState.totalTime - t) / countdownState.totalTime) * 100).toFixed(2);

 updateProgressBar(progressBar, progress)
 if (countdownState.countdownTime <= 4) {
  countdownState.status = 'done';
  resetCountdown(countdownState, interval, countdownElements, digitsElements);
 }
}

function deActivateInputs(inputs, mode) {
 inputs.forEach((input) => {
  input.disabled = mode;
  input.style.color = mode ? "lightgray" : "var(--color-dark)";
 });
}



export { initializeCountdown, freezeCountdown, unFreezeCountdown, resetCountdown, countdownUpdate }