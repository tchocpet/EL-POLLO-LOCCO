"use strict";

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
  if (!isTouchDevice()) return false;
  if (shouldShowRotateScreen()) return false;
  return true;
}

/**
 * Returns whether the screen is small enough for mobile UI.
 *
 * @returns {boolean}
 */
function isSmallScreen() {
  return Math.min(window.innerWidth, window.innerHeight) <= 1024;
}

/**
 * Returns whether the current device is touch-enabled.
 *
 * @returns {boolean}
 */
function isTouchDevice() {
  if ("ontouchstart" in window) return true;
  if ((navigator.maxTouchPoints || 0) > 0) return true;
  return /Android|iPhone|iPad|Mobi|Tablet/i.test(navigator.userAgent);
}

/**
 * Updates all responsive UI parts.
 *
 * @param {string[]} screenIds - Screen ids.
 */
function updateResponsiveUi(screenIds) {
  toggleMobileBtns();
  decideInitialView(screenIds);
}

/**
 * Decides which initial screen should be shown.
 *
 * @param {string[]} screenIds - Screen ids.
 */
function decideInitialView(screenIds) {
  if (shouldShowRotateScreen()) {
    showRotateScreen(screenIds);
    return;
  }

  showStartScreenIfNeeded(screenIds);
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
  return isTouchDevice() && isSmallScreen();
}

/**
 * Shows the rotate screen.
 *
 * @param {string[]} screenIds - Screen ids.
 */
function showRotateScreen(screenIds) {
  stopRunningGameForRotate();
  hideAllScreens(screenIds);
  showScreen(screenIds, "screen-rotate");
}

/**
 * Shows the start screen when no blocking screen is active.
 *
 * @param {string[]} screenIds - Screen ids.
 */
function showStartScreenIfNeeded(screenIds) {
  if (isAnyGameScreenActive()) return;
  hideAllScreens(screenIds);
  showScreen(screenIds, "screen-start");
}

/**
 * Stops the running game before showing the rotate screen.
 */
function stopRunningGameForRotate() {
  if (typeof window.isGameRunning !== "function") return;
  if (!window.isGameRunning()) return;
  if (typeof window.stopGameForRotate !== "function") return;
  window.stopGameForRotate();
}

/**
 * Returns whether any gameplay-related screen is active.
 *
 * @returns {boolean}
 */
function isAnyGameScreenActive() {
  if (isVisible("screen-loading")) return true;
  return isVisible("confirm-dialog");
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
 * Binds responsive event listeners.
 *
 * @param {string[]} screenIds - Screen ids.
 */
function bindResponsiveEvents(screenIds) {
  addResizeHandler(screenIds);
  addOrientationHandler(screenIds);
}

/**
 * Adds the resize handler.
 *
 * @param {string[]} screenIds - Screen ids.
 */
function addResizeHandler(screenIds) {
  window.addEventListener("resize", () => updateResponsiveUi(screenIds), {
    passive: true,
  });
}

/**
 * Adds the orientation handler.
 *
 * @param {string[]} screenIds - Screen ids.
 */
function addOrientationHandler(screenIds) {
  window.addEventListener(
    "orientationchange",
    () => updateResponsiveUi(screenIds),
    { passive: true },
  );
}
