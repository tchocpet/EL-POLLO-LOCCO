/**
 * Resets the player x and y position.
 *
 * @param {object} natur - Player instance.
 */
function resetNaturPosition(natur) {
  natur.x = 60;
  natur.y = -natur.h - 40;
}

/**
 * Resets the player velocity values.
 *
 * @param {object} natur - Player instance.
 */
function resetNaturVelocity(natur) {
  natur.vx = 0;
  natur.vy = 0;
}

/**
 * Resets important state flags.
 *
 * @param {object} natur - Player instance.
 */
function resetNaturStateFlags(natur) {
  natur.onGround = false;
  natur.isIntroDropping = true;
  natur.introDone = false;
  natur.facing = 1;
  natur.sleepMode = false;
}

/**
 * Resets timers and floating helper values.
 *
 * @param {object} natur - Player instance.
 */
function resetNaturTimers(natur) {
  natur.idleTime = 0;
  natur.hurtTime = 0;
  natur.throwTime = 0;
  natur.sleepFloat = 0;
  natur.sleepWave = 0;
}

/**
 * Resets all animation counters.
 *
 * @param {object} natur - Player instance.
 */
function resetNaturAnimation(natur) {
  natur.anim.walkFrame = 0;
  natur.anim.walkTimer = 0;
  natur.anim.jumpFrame = 0;
  natur.anim.jumpTimer = 0;
  natur.anim.hurtFrame = 0;
  natur.anim.hurtTimer = 0;
  natur.anim.throwFrame = 0;
  natur.anim.throwTimer = 0;
  natur.anim.sleepFrame = 0;
  natur.anim.sleepTimer = 0;
}
