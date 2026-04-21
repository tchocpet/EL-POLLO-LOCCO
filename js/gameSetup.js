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
 * Initializes the game UI and input setup.
 */
function init() {
  if (!ensureCanvasReady()) return;
  ensurePlayerExists();
  bindGameEventsOnce();
  showStartScreen();
}

/**
 * Ensures that the canvas is ready for rendering.
 *
 * @returns {boolean}
 */
function ensureCanvasReady() {
  App.canvas = $("canvas");

  if (!(App.canvas instanceof HTMLCanvasElement)) {
    return false;
  }

  App.ctx = App.canvas.getContext("2d");

  if (!App.ctx) return false;

  setupCanvas();
  return true;
}

/**
 * Applies base canvas settings.
 */
function setupCanvas() {
  App.ctx.imageSmoothingEnabled = false;
  App.canvas.width = App.world.w;
  App.canvas.height = App.world.h;
  App.canvas.tabIndex = 0;
  App.canvas.style.outline = "none";
}

/**
 * Ensures that a player instance exists.
 */
function ensurePlayerExists() {
  if (App.player) return;
  App.player = new Natur(60, App.world.groundY - 230);
}

/**
 * Binds keyboard and mobile events only once.
 */
function bindGameEventsOnce() {
  if (App.eventsBound) return;
  bindKeyboard(App);
  bindMobile(App);
  App.eventsBound = true;
}

/**
 * Shows the start screen.
 */
function showStartScreen() {
  window.Screen.hideAll();
  window.Screen.showById("screen-start");
  window.Screen.overlay(false);
  window.Screen.setPauseIcon(false);
  window.Screen.setSoundIcons(App.soundOn);
}

/**
 * Updates the loading button label.
 */
function updateLoadingLabel() {
  const button = $("loading-btn");
  if (!button) return;
  button.textContent = "Loading...";
}

/**
 * Activates runtime flags for a new game.
 */
function activateGame() {
  App.running = true;
  App.paused = false;
  App.gameWon = false;
}

/**
 * Prepares the screen for gameplay.
 */
function prepareGameScreen() {
  window.Screen.hideAll();
  window.Screen.overlay(false);
  window.Screen.setPauseIcon(false);
}

/**
 * Focuses the canvas for keyboard input.
 */
function focusCanvas() {
  App.canvas.focus();
}

/**
 * Starts the animation loop.
 */
function startLoop() {
  stopLoop();
  App.lastTime = performance.now();
  App.rafId = requestAnimationFrame(loop);
}

/**
 * Stops the current animation loop.
 */
function stopLoop() {
  if (!App.rafId) return;
  cancelAnimationFrame(App.rafId);
  App.rafId = null;
}

/**
 * Runs the main animation loop.
 *
 * @param {number} now - Current frame timestamp.
 */
function loop(now) {
  if (!App.running) return;

  const dtMs = getDeltaMs(now);
  const dtSec = dtMs / 1000;

  if (!App.paused) {
    update(dtMs, dtSec);
  }

  render();
  App.rafId = requestAnimationFrame(loop);
}

/**
 * Returns a clamped frame delta.
 *
 * @param {number} now - Current frame timestamp.
 * @returns {number}
 */
function getDeltaMs(now) {
  const raw = now - App.lastTime;
  App.lastTime = now;
  return Math.min(40, Math.max(8, raw || 16));
}

/**
 * Updates the game for one frame.
 *
 * @param {number} dtMs - Delta time in milliseconds.
 * @param {number} dtSec - Delta time in seconds.
 */
function update(dtMs, dtSec) {
  updateGameWorld(App, ASSETS, dtMs, dtSec);
}

/**
 * Renders the current frame.
 */
function render() {
  renderGameWorld(App, ASSETS);
}

/**
 * Stops the running game for rotate mode.
 */
function stopGameForRotate() {
  if (!App.running) return;
  App.running = false;
  App.paused = false;
  stopLoop();
  stopBackgroundMusic(App);
}

/**
 * Returns whether the game is currently running.
 *
 * @returns {boolean}
 */
function isGameRunning() {
  return !!App.running;
}

/**
 * Shows the quit dialog.
 */
function showQuitDialog() {
  window.Screen.setPauseIcon(true);
  window.Screen.showById("confirm-dialog");
  window.Screen.overlay(true);
}

/**
 * Hides the quit dialog.
 */
function hideQuitDialog() {
  const dialog = document.getElementById("confirm-dialog");
  if (!dialog) return;
  dialog.classList.add("d-none");
}

/**
 * Resets the home screen UI.
 */
function resetHomeScreenUi() {
  window.Screen.overlay(false);
  window.Screen.setPauseIcon(false);
  window.Screen.showById("screen-start");
}

/**
 * Shows one end screen and updates its stats.
 *
 * @param {string} screenId - End screen id.
 */
function showEndScreen(screenId) {
  setEndStats(screenId);
  window.Screen.showById(screenId);
  window.Screen.overlay(true);
}

/**
 * Reveals all buttons in an end screen.
 *
 * @param {string} selector - Button selector.
 */
function revealEndButtons(selector) {
  document.querySelectorAll(selector).forEach((button) => {
    button.classList.remove("d-none");
  });
}

/**
 * Updates the end screen statistics.
 *
 * @param {string} screenId - End screen id.
 */
function setEndStats(screenId) {
  const screen = document.getElementById(screenId);
  if (!screen) return;

  const stats = findOrCreateEndStats(screen);
  stats.innerHTML = buildEndStatsMarkup();
}

/**
 * Finds or creates the end stats element.
 *
 * @param {HTMLElement} screen - End screen element.
 * @returns {HTMLElement}
 */
function findOrCreateEndStats(screen) {
  let stats = screen.querySelector(".end-stats");

  if (stats) return stats;

  stats = document.createElement("div");
  stats.className = "end-stats";
  screen.appendChild(stats);
  return stats;
}

/**
 * Builds the end stats markup.
 *
 * @returns {string}
 */
function buildEndStatsMarkup() {
  return `
    <div>Killed enemies: ${App.killedEnemies}</div>
    <div>Collected coins: ${App.coinCount}/${App.maxCoins}</div>
    <div>Thrown bottles: ${App.thrownBottles}</div>
  `;
}
