import { ConvertedTimeObject, DOMElementsList } from "./types";

/**
 * @property {Function} getElement - Get DOM element by providing selector. If no such element - throw new error
 * @param {string} selection - selector of element
 * @returns {HTMLElement} - DOM element
 */
function getElement(selection: string): HTMLElement {
  const element = document.querySelector(selection);
  if (element && element instanceof HTMLElement) return element;

  throw new Error(
    `Please check "${selection}" selector, no such element exist`
  );
}

/**
 * @property {Function} updateDOMTimer - Update timer/countdown digits in DOM
 * @param {Object} convertedTimeObject - object with hours, minutes, seconds and milliseconds. By default all values is 0 when called with undefined
 * @param {Object} digitsObject - object of DOM elements to update
 *
 */
function updateDOMTimer(
  {
    hours = 0,
    minutes = 0,
    seconds = 0,
    milliseconds = 0,
  }: ConvertedTimeObject = {},
  digitsObject: DOMElementsList
): void {
  digitsObject.hoursEl.textContent = getZero(hours).toString();
  digitsObject.minutesEl.textContent = getZero(minutes).toString();
  digitsObject.secondsEl.textContent = getZero(seconds).toString();
  digitsObject.millisecondsEl.textContent = getZero(milliseconds).toString();
}

/**
 * @property {Function} convertTime - Convert timestamp in hours:minutes:seconds:milliseconds
 * @param {number} timeStamp - time in ms
 * @returns {Object} - object with hours, minutes, seconds and milliseconds.
 */
function convertTime(timeStamp: number): ConvertedTimeObject {
  const hours = Math.floor(timeStamp / (1000 * 60 * 60));
  const minutes = Math.floor((timeStamp / 1000 / 60) % 60);
  const seconds = Math.floor((timeStamp / 1000) % 60);
  const milliseconds = Math.floor((timeStamp / 10) % 100);

  return { hours, minutes, seconds, milliseconds };
}

/**
 * @property {Function} getZero - Make 00 instead of 0
 * @param {number} num - number
 */
function getZero(num: number): string | number {
  if (num >= 0 && num < 10) {
    return `0${num}`;
  } else {
    return num;
  }
}

/**
 * @property {Function} transformDOM - Switch modes in DOM
 * @param {string} mode - countdown or timer mode
 * @param {Object} elementsObject - object of DOM elements to change
 */
const transformDOM = (mode: string, elementsObject: DOMElementsList): void => {
  // Get elements to transform
  const {
    clockContainer,
    modeContainer,
    progressBar,
    timerButtonsContainer,
    countdownButtonsContainer,
  } = elementsObject;

  // Change digits colors
  clockContainer.className = `clock-container ${mode} d-flex w-100 h-auto`;

  // Transform mode container
  modeContainer.className = `mode-container ${mode}`;

  // Progress bar re-color
  progressBar.className = `progress-bar ${mode}`;

  // Switch buttons containers
  timerButtonsContainer.classList.remove("show");
  countdownButtonsContainer.classList.remove("show");

  const currentModeButtonsContainer = getElement(`.${mode}-buttons-container`);
  currentModeButtonsContainer.classList.add("show");
};

/**
 * @property {Function} updateProgressBar - Change width of progress bar according to countdown progress
 * @param {HTMLElement} el - element to change
 * @param {number} width
 */
function updateProgressBar(el: Element, width: number): void {
  if (el instanceof HTMLElement) {
    el.style.width = `${width}%`;
  }
}

/**
 * @property {Function} setInputsLimits - Limit values of input fields
 * @param {Array} inputsArray - DOM elements - input fields
 */
function setInputsLimits(inputsArray: HTMLInputElement[]): void {
  inputsArray.forEach((input) => {
    input.addEventListener("input", () => {
      setUpInput(input);
    });
  });
}

/**
 * @property {Function} setUpInput - Set value of passed input to min or max
 * @param {HTMLElement} el - input element to change
 */
function setUpInput(el: HTMLInputElement): void {
  if (el.value != "") {
    if (parseInt(el.value) < parseInt(el.min)) {
      el.value = el.min;
    }
    if (parseInt(el.value) > parseInt(el.max)) {
      el.value = el.max;
    }
  }
}

/**
 * @property {Function} getTotalTimeFromInputs - Calculate total time to count down
 * @param {Array} inputs - DOM elements - input fields
 * @returns {number}
 */
function getTotalTimeFromInputs(inputs: HTMLInputElement[]) {
  const [hoursInput, minutesInput, secondsInput] = inputs;

  const totalTime =
    Number(secondsInput.value) * 1000 +
    Number(minutesInput.value) * 60 * 1000 +
    Number(hoursInput.value) * 60 * 60 * 1000;

  return totalTime;
}

/**
 * @property {Function} deactivateInputs - Activate/deactivate input fields
 * @param {Array} inputs - DOM elements - input fields
 * @param {boolean} mode
 */
function deactivateInputs(inputs: HTMLInputElement[], mode: boolean): void {
  inputs.forEach((input) => {
    input.disabled = mode;
    input.style.color = mode ? "lightgray" : "var(--color-dark)";
  });
}

/**
 * @property {Function} reset - Reset all DOM elements to default, clear interval
 * @param {number} globalInterval - id of global interval
 * @param {Object} timerElements - timer DOM elements
 * @param {Object} countdownElements - countdown DOM elements
 * @param {Object} digitsElements - timer digits DOM elements
 * @param {Array} inputsArray - array of DOM elements - input fields
 */
function reset(
  globalInterval: number,
  timerElements: DOMElementsList,
  countdownElements: DOMElementsList,
  digitsElements: DOMElementsList,
  inputsArray: HTMLInputElement[]
): void {
  timerElements.timerPlayIcon.className = "bi bi-play";
  timerElements.timerPlayBtn.classList.remove("active");

  countdownElements.countdownPlayIcon.className = "bi bi-play";
  countdownElements.countdownPlayBtn.classList.remove("active");

  clearInterval(globalInterval);

  updateDOMTimer(undefined, digitsElements);

  inputsArray.forEach((input) => (input.value = ""));
  deactivateInputs(inputsArray, false);
}

export {
  getElement,
  getZero,
  convertTime,
  updateDOMTimer,
  transformDOM,
  setInputsLimits,
  updateProgressBar,
  getTotalTimeFromInputs,
  deactivateInputs,
  reset,
};
