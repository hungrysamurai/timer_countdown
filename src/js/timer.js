import { updateDOMTimer, convertTime } from "./utils.js";

/**
 * Class that generates timer state object
 */
class TimerState {
  /**
   *
   * @this TimerState
   */
  constructor() {
    this.status = "active";
    this.timerProgress = 0;
    this.initialTimestamp = Date.now();
  }

  freeze() {
    this.status = "paused";
    this.timerProgress = Date.now() - this.initialTimestamp;
  }

  unFreeze() {
    this.status = "active";
    this.initialTimestamp = Date.now() - this.timerProgress;
  }
}

/**
 * @property {Function} timerUpdate - Timer update function
 * @param {number} startTime - initial time value
 * @param {Object} digitsElements - timer digits DOM elements
 * @returns {void}
 */
const timerUpdate = (startTime, digitsElements) => {
  const t = Date.now() - startTime;
  updateDOMTimer(convertTime(t), digitsElements);
};

export { TimerState, timerUpdate };
