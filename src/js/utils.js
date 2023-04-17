/**
 * @property {Function} getElement - Get DOM element by providing selector. If no such element - throw new error
 * @param {string} selection - selector of element
 * @returns {HTMLElement} - DOM element
 */
function getElement(selection) {
  const element = document.querySelector(selection);
  if (element) return element;

  throw new Error(
    `Please check "${selection}" selector, no such element exist`
  );
}

/**
 * @property {Function} updateDOMTimer - Update timer/countdown digits in DOM
 * @param {Object} convertedTimeObject - object with hours, minutes, seconds and milliseconds. By default all values is 0 when called with undefined
 * @param {Object} digitsObject - object od DOM elements to update
 *
 * @returns {void}
 */
function updateDOMTimer(
  { hours = 0, minutes = 0, seconds = 0, milliseconds = 0 } = {},
  digitsObject
) {
  digitsObject.hoursEl.textContent = getZero(hours);
  digitsObject.minutesEl.textContent = getZero(minutes);
  digitsObject.secondsEl.textContent = getZero(seconds);
  digitsObject.millisecondsEl.textContent = getZero(milliseconds);
}

/**
 * @property {Function} convertTime - Convert timestamp in hours:minutes:seconds:milliseconds
 * @param {number} timeStamp - time in ms
 * @returns {Object} - object with hours, minutes, seconds and milliseconds.
 */
function convertTime(timeStamp) {
  const hours = Math.floor(timeStamp / (1000 * 60 * 60));
  const minutes = Math.floor((timeStamp / 1000 / 60) % 60);
  const seconds = Math.floor((timeStamp / 1000) % 60);
  const milliseconds = Math.floor((timeStamp / 10) % 100);

  return { hours, minutes, seconds, milliseconds };
}

/**
 * @property {Function} getZero - Make 00 instead of 0
 * @param {number} num - number
 * @returns {string|number}
 */
function getZero(num) {
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
 * @returns {void}
 */
const transformDOM = (mode, elementsObject) => {
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

  document.querySelector(`.${mode}-buttons-container`).classList.add("show");
};

/**
 * @property {Function} updateProgressBar - Change width of progress bar according to countdown progress
 * @param {HTMLElement} el - element to change
 * @param {number} width
 * @returns {void}
 */
function updateProgressBar(el, width) {
  el.style.width = `${width}%`;
}

/**
 * @property {Function} setInputsLimits - Limit values of input fields
 * @param {Array} inputsArray - DOM elements - input fields
 * @returns {void}
 */
function setInputsLimits(inputsArray) {
  inputsArray.forEach((input) => {
    input.addEventListener("input", () => {
      setUpInput(input);
    });
  });
}

/**
 * @property {Function} setUpInput - Set value of passed input to min or max
 * @param {HTMLElement} el - input element to change
 * @returns {void}
 */
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

/**
 * @property {Function} getTotalTimeFromInputs - Calculate total time to count down
 * @param {Array} inputs - DOM elements - input fields
 * @returns {number}
 */
function getTotalTimeFromInputs(inputs) {
  const [hoursInput, minutesInput, secondsInput] = inputs;

  const totalTime =
    secondsInput.value * 1000 +
    minutesInput.value * 60 * 1000 +
    hoursInput.value * 60 * 60 * 1000;

  return totalTime;
}

/**
 * @property {Function} deactivateInputs - Activate/deactivate input fields
 * @param {Array} inputs - DOM elements - input fields
 * @param {boolean} mode
 * @returns {void}
 */
function deactivateInputs(inputs, mode) {
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
 * @returns {void}
 */
function reset(
  globalInterval,
  timerElements,
  countdownElements,
  digitsElements,
  inputsArray
) {
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
