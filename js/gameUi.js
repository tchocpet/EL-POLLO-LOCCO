/**
 * Toggles the pause state and updates music playback.
 */
function pauseGame() {
  if (!App.running) return;
  App.paused = !App.paused;
  window.Screen.setPauseIcon(App.paused);
  syncPauseAudio();
}

/**
 * Opens the quit dialog and pauses the game.
 */
function quitGame() {
  if (!App.running) return;
  App.paused = true;
  showQuitDialog();
  stopBackgroundMusic(App);
}

/**
 * Resumes the game after pause or quit dialog.
 */
function resumeGame() {
  hideQuitDialog();
  App.paused = false;
  window.Screen.overlay(false);
  window.Screen.setPauseIcon(false);
  startBackgroundMusic(App);
}

/**
 * Returns to the start screen and resets the game state.
 */
function goBackToHome() {
  App.running = false;
  stopLoop();
  stopBackgroundMusic(App);
  resetHomeScreenUi();
  resetGameState(App);
}

/**
 * Restarts the game.
 */
function playAgain() {
  startGame();
}

/**
 * Handles the lose state.
 */
function loseGame() {
  App.running = false;
  stopLoop();
  stopBackgroundMusic(App);
  showEndScreen("screen-end-lose");
  revealEndButtons("#screen-end-lose button");
}

/**
 * Handles the win state.
 */
function winGame() {
  App.running = false;
  App.gameWon = true;
  stopLoop();
  stopBackgroundMusic(App);
  showEndScreen("screen-end-win");
  revealEndButtons("#screen-end-win button");
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
  if (dialog) dialog.classList.add("d-none");
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
 * Shows an end screen and updates its statistics.
 *
 * @param {string} screenId - End screen id.
 */
function showEndScreen(screenId) {
  setEndStats(App, screenId);
  window.Screen.showById(screenId);
  window.Screen.overlay(true);
}

/**
 * Reveals all buttons inside an end screen.
 *
 * @param {string} selector - CSS selector for the buttons.
 */
function revealEndButtons(selector) {
  document.querySelectorAll(selector).forEach((button) => {
    button.classList.remove("d-none");
  });
}

/**
 * Updates the end screen statistics.
 *
 * @param {object} state - Main application state.
 * @param {string} screenId - End screen id.
 */
function setEndStats(state, screenId) {
  const screen = document.getElementById(screenId);
  if (!screen) return;
  const stats = findOrCreateEndStats(screen);
  stats.innerHTML = buildEndStatsMarkup(state);
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
 * Builds the end stats HTML markup.
 *
 * @param {object} state - Main application state.
 * @returns {string}
 */
function buildEndStatsMarkup(state) {
  return `
    <p>Coins: ${state.coinCount} / ${state.maxCoins}</p>
    <p>Kills: ${state.killedEnemies}</p>
    <p>Thrown Bottles: ${state.thrownBottles}</p>
    <p>Boss HP Left: ${state.bossHealth}</p>
  `;
}

/**
 * Returns whether the player can take damage.
 *
 * @param {number} currentTime - Current timestamp.
 * @returns {boolean}
 */
function canTakeDamage(currentTime) {
  return currentTime - App.lastHitTime > App.invulnerableMs;
}

/**
 * Safely plays an audio element if sound is enabled.
 *
 * @param {HTMLAudioElement|null} audio - Audio element.
 */
function safePlay(audio) {
  if (!audio || !App.soundOn) return;

  try {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch (_) {}
}

/**
 * Applies player damage and triggers game over if needed.
 *
 * @param {number} amount - Damage amount.
 */
function applyDamage(amount) {
  if (!canTakeDamage(nowMs())) return;
  App.playerHealth -= amount;
  App.playerHealth = Math.max(0, App.playerHealth);
  App.lastHitTime = nowMs();
  safePlay(App.audio.hurt);

  if (App.playerHealth <= 0) {
    loseGame();
  }
}

/**
 * Syncs pause state and music playback.
 */
function syncPauseAudio() {
  if (App.paused) stopBackgroundMusic(App);
  if (!App.paused) startBackgroundMusic(App);
}

/**
 * Syncs sound state with UI and audio system.
 */
function enableSound() {
  App.soundOn = !App.soundOn;
  localStorage.setItem("soundOn", String(App.soundOn));
  applyMuteState(App);
  window.Screen.setSoundIcons(App.soundOn);

  if (App.soundOn) startBackgroundMusic(App);
  if (!App.soundOn) stopBackgroundMusic(App);
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
 * Toggles fullscreen mode for the game container.
 */
function toggleFullScreen() {
  const element = document.getElementById("fullscreen") || document.body;

  if (document.fullscreenElement) {
    document.exitFullscreen?.();
    return;
  }

  element.requestFullscreen?.();
}
