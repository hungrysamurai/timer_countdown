// Get DOM element
const getElement = (selection) => {
  const element = document.querySelector(selection);
  if (element) return element;
  throw new Error(
    `Please check "${selection}" selector, no such element exist`
  );
};

// Update timer/countdown digits in DOM
const updateDOMTimer = (
  { hours = 0, minutes = 0, seconds = 0, milliseconds = 0 } = {},
  digitsObject
) => {
  digitsObject.hoursEl.textContent = getZero(hours);
  digitsObject.minutesEl.textContent = getZero(minutes);
  digitsObject.secondsEl.textContent = getZero(seconds);
  digitsObject.millisecondsEl.textContent = getZero(milliseconds);
};

// Make 00 instead of 0
const getZero = (num) => {
  if (num >= 0 && num < 10) {
    return `0${num}`;
  } else {
    return num;
  }
};

// Convert timestamp in hours:minutes:seconds:milliseconds
const convertTime = (timeStamp) => {
  const hours = Math.floor(timeStamp / (1000 * 60 * 60));
  const minutes = Math.floor((timeStamp / 1000 / 60) % 60);
  const seconds = Math.floor((timeStamp / 1000) % 60);
  const milliseconds = Math.floor((timeStamp / 10) % 100);

  return { hours, minutes, seconds, milliseconds };
};

// Switch modes in DOM
const transformDOM = (mode, elementsObject) => {
  // Get elements to transform
  const { clockContainer, modeContainer, progressBar, timerButtonsContainer, countdownButtonsContainer } = elementsObject

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

const setInputs = (inputsArray) => {
  // set inputs numeric limitations
  inputsArray.forEach((input) => {
    input.addEventListener("input", () => {
      setUpInput(input);
    });
  });
}

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


export { getElement, getZero, convertTime, updateDOMTimer, transformDOM, setInputs };
