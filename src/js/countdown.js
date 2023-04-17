import {
  updateDOMTimer,
  convertTime,
  updateProgressBar,
  deactivateInputs,
} from "./utils.js";

/**
 * Class that generates countdown state object
 */
class CountdownState {
  /**
   *
   * @param {number} totalTime - time in milliseconds
   * @this CountdownState
   */
  constructor(totalTime) {
    this.status = "active";
    this.countdownTime = totalTime;
    this.endTime = Date.now() + totalTime;
    this.totalTime = totalTime;
  }

  freeze() {
    this.status = "paused";
  }

  unFreeze() {
    this.status = "active";
    this.endTime = this.countdownTime + Date.now();
  }
}

/**
 * @property {Function} countdownUpdate - Countdown update function
 * @param {Object} countdownState - Current countdown state object
 * @param {number} interval - current global interval id
 * @param {Object} countdownElements - countdown DOM elements
 * @param {Object} digitsElements - timer digits DOM elements
 * @param {Array} inputsArray - array of DOM elements - input fields
 * @returns {void}
 */
const countdownUpdate = (
  countdownState,
  interval,
  countdownElements,
  digitsElements,
  inputsArray
) => {
  const { endTime } = countdownState;
  const { progressBar } = countdownElements;

  let t = endTime - Date.now();
  countdownState.countdownTime = t;

  updateDOMTimer(convertTime(t), digitsElements);

  const progress = (
    ((countdownState.totalTime - t) / countdownState.totalTime) *
    100
  ).toFixed(2);

  updateProgressBar(progressBar, progress);

  if (countdownState.countdownTime <= 4) {
    countdownState.status = "done";

    countdownElements.countdownPlayIcon.className = "bi bi-play";
    countdownElements.countdownPlayBtn.classList.remove("active");

    clearInterval(interval);

    updateDOMTimer(undefined, digitsElements);

    inputsArray.forEach((input) => (input.value = ""));
    deactivateInputs(inputsArray, false);
  }
};

export { CountdownState, countdownUpdate };
