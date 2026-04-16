/**
 * Initializes the UI module and registers its public API.
 */
function initUiModule() {
  const uiModule = createUiModule();
  uiModule.registerUiApi();
}

/**
 * Creates the full UI module.
 *
 * @returns {{registerUiApi: Function}}
 */
function createUiModule() {
  const state = createUiState();
  const screenIds = createScreenIds();
  const storyLines = createStoryLines();

  return {
    registerUiApi() {
      registerUiApi(state, screenIds, storyLines);
    },
  };
}

/**
 * Creates the UI state object.
 *
 * @returns {object}
 */
function createUiState() {
  return {
    typingTimer: null,
    storyIndex: 0,
    charIndex: 0,
    skipRequested: false,
  };
}

/**
 * Returns an element by id.
 *
 * @param {string} id - Element id.
 * @returns {HTMLElement|null}
 */
function $(id) {
  return document.getElementById(id);
}

/**
 * Registers public UI functions.
 *
 * @param {object} state - UI state.
 * @param {string[]} screenIds - Known screen ids.
 * @param {string[]} storyLines - Story lines.
 */
function registerUiApi(state, screenIds, storyLines) {
  window.initUi = () => runUiInit(screenIds);
  window.toggleMobileBtns = toggleMobileBtns;
  window.goToControlScreen = () => goToControlScreen(screenIds);
  window.goToBgstoryScreen = () =>
    goToBgstoryScreen(state, screenIds, storyLines);
  window.storyScreenGoBack = () => storyScreenGoBack(state, screenIds);
  window.goBackToStartScreen = () => goBackToStartScreen(screenIds);
  window.skipTyping = () => skipTyping(state);
  window.startStoryTelling = () => startStoryTelling(state, storyLines);
  window.setLoadingBtnText = setLoadingBtnText;
}

/**
 * Runs all UI initialization behavior.
 *
 * @param {string[]} screenIds - Known screen ids.
 */
function runUiInit(screenIds) {
  updateResponsiveUi(screenIds);
  bindResponsiveEvents(screenIds);
  addButtonHoverEventListener();
}

/**
 * Hides all known screens.
 *
 * @param {string[]} screenIds - Known screen ids.
 */
function hideAllScreens(screenIds) {
  screenIds.forEach(hideScreen);
}

/**
 * Hides one screen.
 *
 * @param {string} id - Screen id.
 */
function hideScreen(id) {
  $(id)?.classList.add("d-none");
}

/**
 * Shows one screen.
 *
 * @param {string[]} screenIds - Known screen ids.
 * @param {string} id - Screen id.
 */
function showScreen(screenIds, id) {
  if (window.Screen?.showById) {
    window.Screen.showById(id);
    return;
  }

  hideAllScreens(screenIds);
  $(id)?.classList.remove("d-none");
}

/**
 * Updates mobile button visibility.
 */
function toggleMobileBtns() {
  const element = $("game-area-bottom");
  if (!element) return;
  element.style.display = shouldShowMobileBtns() ? "block" : "none";
}

/**
 * Returns whether mobile buttons should be shown.
 *
 * @returns {boolean}
 */
function shouldShowMobileBtns() {
  return Math.min(window.innerWidth, window.innerHeight) <= 760;
}

/**
 * Returns whether the screen is small.
 *
 * @returns {boolean}
 */
function isSmallScreen() {
  return Math.min(window.innerWidth, window.innerHeight) <= 900;
}

/**
 * Returns whether the current device is touch-enabled.
 *
 * @returns {boolean}
 */
function isTouchDevice() {
  if ("ontouchstart" in window) return true;
  if ((navigator.maxTouchPoints || 0) > 0) return true;
  return /Android|iPhone|iPad|Mobi/i.test(navigator.userAgent);
}

/**
 * Decides which initial screen should be shown.
 *
 * @param {string[]} screenIds - Known screen ids.
 */
function decideInitialView(screenIds) {
  if (shouldShowRotateScreen()) {
    handleRotateScreen(screenIds);
    return;
  }

  handleStartScreen(screenIds);
}

/**
 * Handles the rotate screen state.
 *
 * @param {string[]} screenIds - Known screen ids.
 */
function handleRotateScreen(screenIds) {
  stopRunningGameForRotate();
  showScreen(screenIds, "screen-rotate");
}

/**
 * Handles the normal start screen state.
 *
 * @param {string[]} screenIds - Known screen ids.
 */
function handleStartScreen(screenIds) {
  if (isAnyGameScreenActive()) return;
  showScreen(screenIds, "screen-start");
}

/**
 * Stops the running game before showing the rotate screen.
 */
function stopRunningGameForRotate() {
  if (typeof window.isGameRunning !== "function") return;
  if (!window.isGameRunning()) return;
  if (typeof window.stopGameForRotate === "function") {
    window.stopGameForRotate();
  }
}

/**
 * Returns whether any gameplay-related screen is active.
 *
 * @returns {boolean}
 */
function isAnyGameScreenActive() {
  return isVisible("screen-loading") || isVisible("confirm-dialog");
}

/**
 * Returns whether one screen is currently visible.
 *
 * @param {string} id - Screen id.
 * @returns {boolean}
 */
function isVisible(id) {
  const element = $(id);
  if (!element) return false;
  return !element.classList.contains("d-none");
}

/**
 * Returns whether the rotate screen should be shown.
 *
 * @returns {boolean}
 */
function shouldShowRotateScreen() {
  return isPortraitMode() && shouldUseMobileLayout();
}

/**
 * Returns whether the display is in portrait mode.
 *
 * @returns {boolean}
 */
function isPortraitMode() {
  return window.innerHeight > window.innerWidth;
}

/**
 * Returns whether mobile layout rules should apply.
 *
 * @returns {boolean}
 */
function shouldUseMobileLayout() {
  return isSmallScreen() || isTabletDevice();
}

/**
 * Returns whether the current device looks like a tablet.
 *
 * @returns {boolean}
 */
function isTabletDevice() {
  return /iPad|Tablet|Android(?!.*Mobile)/i.test(navigator.userAgent);
}

/**
 * Updates all responsive UI parts.
 *
 * @param {string[]} screenIds - Known screen ids.
 */
function updateResponsiveUi(screenIds) {
  toggleMobileBtns();
  decideInitialView(screenIds);
}

/**
 * Clears the current typing interval.
 *
 * @param {object} state - UI state.
 */
function clearTyping(state) {
  if (!state.typingTimer) return;
  clearInterval(state.typingTimer);
  state.typingTimer = null;
}

/**
 * Requests skipping the current typing animation.
 *
 * @param {object} state - UI state.
 */
function skipTyping(state) {
  state.skipRequested = true;
}

/**
 * Types one story line.
 *
 * @param {object} state - UI state.
 * @param {string} line - Story line text.
 * @param {Function} onDone - Callback after the line is done.
 */
function typeLine(state, line, onDone) {
  const textElement = $("story-p");
  if (!textElement) return;

  prepareTyping(state, textElement);
  state.typingTimer = setInterval(() => {
    runTypingStep(state, line, textElement, onDone);
  }, 32);
}

/**
 * Prepares the typing state.
 *
 * @param {object} state - UI state.
 * @param {HTMLElement} textElement - Story text element.
 */
function prepareTyping(state, textElement) {
  clearTyping(state);
  textElement.textContent = "";
  state.charIndex = 0;
}

/**
 * Runs one typing step.
 *
 * @param {object} state - UI state.
 * @param {string} line - Story line text.
 * @param {HTMLElement} textElement - Story text element.
 * @param {Function} onDone - Callback after the line is done.
 */
function runTypingStep(state, line, textElement, onDone) {
  if (handleSkipRequested(state, line, textElement, onDone)) return;
  typeNextChar(state, line, textElement, onDone);
}

/**
 * Handles skip behavior during typing.
 *
 * @param {object} state - UI state.
 * @param {string} line - Story line text.
 * @param {HTMLElement} textElement - Story text element.
 * @param {Function} onDone - Callback after the line is done.
 * @returns {boolean}
 */
function handleSkipRequested(state, line, textElement, onDone) {
  if (!state.skipRequested) return false;

  state.skipRequested = false;
  clearTyping(state);
  textElement.textContent = line;
  setTimeout(onDone, 700);
  return true;
}

/**
 * Types the next character.
 *
 * @param {object} state - UI state.
 * @param {string} line - Story line text.
 * @param {HTMLElement} textElement - Story text element.
 * @param {Function} onDone - Callback after the line is done.
 */
function typeNextChar(state, line, textElement, onDone) {
  textElement.textContent += line.charAt(state.charIndex);
  state.charIndex += 1;

  if (state.charIndex < line.length) return;

  clearTyping(state);
  setTimeout(onDone, 500);
}

/**
 * Starts the full story flow.
 *
 * @param {object} state - UI state.
 * @param {string[]} storyLines - Story lines.
 */
function startStoryTelling(state, storyLines) {
  showNextLine(state, storyLines);
}

/**
 * Shows the next story line.
 *
 * @param {object} state - UI state.
 * @param {string[]} storyLines - Story lines.
 */
function showNextLine(state, storyLines) {
  if (state.storyIndex >= storyLines.length) {
    setupStoryStartButton();
    return;
  }

  const line = storyLines[state.storyIndex];
  state.storyIndex += 1;
  typeLine(state, line, () => showNextLine(state, storyLines));
}

/**
 * Configures the story button as start button.
 */
function setupStoryStartButton() {
  const button = $("skip-btn");
  if (!button) return;
  button.innerText = "Start";
  button.onclick = handleStoryStartClick;
}

/**
 * Starts the game from the story screen.
 */
function handleStoryStartClick() {
  if (typeof window.startLoading === "function") {
    window.startLoading();
  }
}

/**
 * Opens the controls screen.
 *
 * @param {string[]} screenIds - Known screen ids.
 */
function goToControlScreen(screenIds) {
  showScreen(screenIds, "screen-controls");
}

/**
 * Opens the story screen.
 *
 * @param {object} state - UI state.
 * @param {string[]} screenIds - Known screen ids.
 * @param {string[]} storyLines - Story lines.
 */
function goToBgstoryScreen(state, screenIds, storyLines) {
  showScreen(screenIds, "screen--story");
  resetStoryState(state);
  setupSkipButton(state);
  startStoryTelling(state, storyLines);
}

/**
 * Resets story state values.
 *
 * @param {object} state - UI state.
 */
function resetStoryState(state) {
  state.storyIndex = 0;
  state.charIndex = 0;
  state.skipRequested = false;
  clearTyping(state);
}

/**
 * Configures the skip button.
 *
 * @param {object} state - UI state.
 */
function setupSkipButton(state) {
  const button = $("skip-btn");
  if (!button) return;
  button.innerText = "Skip";
  button.onclick = () => skipTyping(state);
}

/**
 * Leaves the story screen.
 *
 * @param {object} state - UI state.
 * @param {string[]} screenIds - Known screen ids.
 */
function storyScreenGoBack(state, screenIds) {
  clearTyping(state);
  showScreen(screenIds, "screen-start");
}

/**
 * Returns to the start screen.
 *
 * @param {string[]} screenIds - Known screen ids.
 */
function goBackToStartScreen(screenIds) {
  showScreen(screenIds, "screen-start");
}

/**
 * Updates the loading button text.
 *
 * @param {number} percent - Loading percentage.
 * @param {string} text - Loading label.
 */
function setLoadingBtnText(percent, text) {
  const button = $("loading-btn");
  if (!button) return;
  button.innerText = `${text} ... ${percent}%`;
}

/**
 * Adds hover audio behavior to sound buttons.
 */
function addButtonHoverEventListener() {
  document.querySelectorAll(".sound-btn").forEach(addHoverHandler);
}

/**
 * Adds one hover handler.
 *
 * @param {HTMLElement} button - Button element.
 */
function addHoverHandler(button) {
  button.addEventListener("mouseenter", playHoverSoundIfUnlocked);
}

/**
 * Plays the hover sound if audio is unlocked.
 */
function playHoverSoundIfUnlocked() {
  if (!isAudioUnlocked()) return;
  playHoverSound();
}

/**
 * Returns whether UI audio is unlocked.
 *
 * @returns {boolean}
 */
function isAudioUnlocked() {
  return localStorage.getItem("audioUnlocked") === "true";
}

/**
 * Plays the hover sound.
 */
function playHoverSound() {
  const audio = new Audio("audio/button-hover.mp3");
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

/**
 * Binds responsive event listeners.
 *
 * @param {string[]} screenIds - Known screen ids.
 */
function bindResponsiveEvents(screenIds) {
  window.addEventListener("resize", () => updateResponsiveUi(screenIds), {
    passive: true,
  });

  window.addEventListener(
    "orientationchange",
    () => updateResponsiveUi(screenIds),
    { passive: true },
  );
}

/**
 * Returns the list of screen ids.
 *
 * @returns {string[]}
 */
function createScreenIds() {
  return [
    "screen-start",
    "screen-loading",
    "screen--story",
    "screen-controls",
    "screen-rotate",
    "confirm-dialog",
    "screen-end-lose",
    "screen-end-win",
  ];
}

/**
 * Returns the list of story lines.
 *
 * @returns {string[]}
 */
function createStoryLines() {
  return [
    "Long ago, in a dusty desert village, chickens lived peacefully under the blazing sun.",
    "But everything changed when a strange glowing egg crashed from the sky.",
    "One chicken touched it... and transformed into something unstoppable.",
    "El Pollo Loco was born — faster, stronger, and completely out of control.",
    "Now she commands an army of wild chickens, guarding her territory with chaos and fury.",
    "You are the last brave adventurer who dares to challenge her.",
    "Fight your way through the desert, survive the madness, and defeat El Pollo Loco.",
    "Only then will peace return to the land.",
  ];
}
