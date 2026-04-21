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
 * Initializes all modules and starts the UI.
 */
function initApp() {
  initHelpersModule();
  initEntitiesModule();
  initEngineModule();
  initAudioModule();
  initScreenModule();
  initCameraModule();
  initCollisionHelperModule();
  initCollisionModule();
  initHudModule();
  initSpawnerModule();
  initPlayerModule();
  initBossModule();
  initBottleModule();
  initCloudModule();
  initCoinModule();
  initEnemyModule();
  initGroundBottleModule();
  initNaturModule();
  initGameModule();
  init();
  initUiModule();
  initUi();
}

/**
 * Starts the loading screen before the game begins.
 */
function startLoading() {
  if (App.running) return;
  window.Screen.showById("screen-loading");
  updateLoadingLabel();
  setTimeout(startGame, 1000);
}

/**
 * Starts a fresh game session.
 *
 * @returns {Promise<void>}
 */
async function startGame() {
  if (!ensureCanvasReady()) return;
  activateGame();
  await ensureAssets(App, ASSETS, PATHS);
  resetGameState(App);
  spawnGameObjects();
  prepareGameScreen();
  startBackgroundMusic(App);
  focusCanvas();
  render();
  startLoop();
}

/**
 * Ensures that the canvas is ready for rendering.
 *
 * @returns {boolean}
 */
function ensureCanvasReady() {
  App.canvas = $("canvas");
  if (!(App.canvas instanceof HTMLCanvasElement)) return false;
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
  if (button) button.textContent = "Loading...";
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
 * Spawns all game entities.
 */
function spawnGameObjects() {
  spawnClouds(App);
  spawnEnemies(App);
  spawnCoins(App);
  spawnGroundBottles(App);
  spawnEndboss(App);
}

/**
 * Focuses the canvas so keyboard input works immediately.
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
 * Stops the animation loop.
 */
function stopLoop() {
  if (!App.rafId) return;
  cancelAnimationFrame(App.rafId);
  App.rafId = null;
}

/**
 * Main animation loop.
 *
 * @param {number} now - Current animation frame timestamp.
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
 * @param {number} now - Current animation frame timestamp.
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
