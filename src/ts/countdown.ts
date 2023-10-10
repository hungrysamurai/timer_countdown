import { DOMElementsList } from "./types";
import {
  updateDOMTimer,
  convertTime,
  updateProgressBar,
  deactivateInputs,
} from "./utils";

/**
 * Class that generates countdown state object
 */
class CountdownState {
  status: string;
  countdownTime: number;
  endTime: number;
  totalTime: number;
  /**
   *
   * @param {number} totalTime - time in milliseconds
   * @this CountdownState
   */
  constructor(totalTime: number) {
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
 */
const countdownUpdate = (
  countdownState: CountdownState,
  interval: number,
  countdownElements: DOMElementsList,
  digitsElements: DOMElementsList,
  inputsArray: HTMLInputElement[]
): void => {
  const { endTime } = countdownState;
  const { progressBar } = countdownElements;

  let t = endTime - Date.now();
  countdownState.countdownTime = t;

  updateDOMTimer(convertTime(t), digitsElements);

  const progress = Number(
    (((countdownState.totalTime - t) / countdownState.totalTime) * 100).toFixed(
      2
    )
  );

  updateProgressBar(progressBar as Element, progress);

  if (countdownState.countdownTime <= 4) {
    countdownState.status = "done";

    const { countdownPlayIcon, countdownPlayBtn } = countdownElements;

    countdownPlayIcon.className = "bi bi-play";
    countdownPlayBtn.classList.remove("active");

    clearInterval(interval);

    updateDOMTimer(undefined, digitsElements);

    if (inputsArray.length) {
      inputsArray.forEach((input) => (input.value = ""));
      deactivateInputs(inputsArray, false);
    }
  }
};

export { CountdownState, countdownUpdate };
