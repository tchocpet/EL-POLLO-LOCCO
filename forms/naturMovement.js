/**
 * Updates the intro drop animation.
 *
 * @param {object} natur - Player instance.
 * @param {number} dtMs - Delta time in milliseconds.
 * @param {number} dtSec - Delta time in seconds.
 * @param {object} world - World state.
 * @param {object} assets - Asset collection.
 */
function updateNaturIntro(natur, dtMs, dtSec, world, assets) {
  const floorY = world.groundY - natur.h;

  natur.vy += natur.gravity * dtSec;
  natur.y += natur.vy * dtSec;

  if (natur.y < floorY) {
    updateNaturAnimation(natur, dtMs, assets);
    return;
  }

  finishNaturIntro(natur, floorY);
  updateNaturAnimation(natur, dtMs, assets);
}

/**
 * Finishes the intro drop state.
 *
 * @param {object} natur - Player instance.
 * @param {number} floorY - Ground position.
 */
function finishNaturIntro(natur, floorY) {
  natur.y = floorY;
  natur.vy = 0;
  natur.onGround = true;
  natur.isIntroDropping = false;
  natur.introDone = true;
  natur.idleTime = 0;
  natur.sleepMode = false;
}

/**
 * Updates action timers.
 *
 * @param {object} natur - Player instance.
 * @param {number} dtSec - Delta time in seconds.
 */
function updateNaturActionTimers(natur, dtSec) {
  lowerNaturHurtTime(natur, dtSec);
  lowerNaturThrowTime(natur, dtSec);
}

/**
 * Lowers the hurt timer.
 *
 * @param {object} natur - Player instance.
 * @param {number} dtSec - Delta time in seconds.
 */
function lowerNaturHurtTime(natur, dtSec) {
  if (natur.hurtTime <= 0) return;

  natur.hurtTime -= dtSec;

  if (natur.hurtTime < 0) {
    natur.hurtTime = 0;
  }
}

/**
 * Lowers the throw timer.
 *
 * @param {object} natur - Player instance.
 * @param {number} dtSec - Delta time in seconds.
 */
function lowerNaturThrowTime(natur, dtSec) {
  if (natur.throwTime <= 0) return;

  natur.throwTime -= dtSec;

  if (natur.throwTime < 0) {
    natur.throwTime = 0;
  }
}

/**
 * Updates helper values for the sleep effect.
 *
 * @param {object} natur - Player instance.
 * @param {number} dtSec - Delta time in seconds.
 */
function updateNaturSleepMotion(natur, dtSec) {
  natur.sleepFloat += dtSec * 2.2;
  natur.sleepWave += dtSec * 3.5;
}

/**
 * Updates idle and sleep state.
 *
 * @param {object} natur - Player instance.
 * @param {number} dtSec - Delta time in seconds.
 * @param {object} input - Input state.
 */
function updateNaturIdleState(natur, dtSec, input) {
  if (isNaturMoving(natur, input)) {
    resetNaturIdleState(natur);
    return;
  }

  natur.idleTime += dtSec;

  if (natur.idleTime > 3) {
    natur.sleepMode = true;
  }
}

/**
 * Returns whether the player is currently active.
 *
 * @param {object} natur - Player instance.
 * @param {object} input - Input state.
 * @returns {boolean}
 */
function isNaturMoving(natur, input) {
  if (input.left || input.right) return true;
  if (input.jump || input.fire) return true;
  if (!natur.onGround) return true;
  if (natur.throwTime > 0) return true;
  return natur.hurtTime > 0;
}

/**
 * Resets idle related values.
 *
 * @param {object} natur - Player instance.
 */
function resetNaturIdleState(natur) {
  natur.idleTime = 0;
  natur.sleepMode = false;
}

/**
 * Updates movement and physics.
 *
 * @param {object} natur - Player instance.
 * @param {number} dtSec - Delta time in seconds.
 * @param {object} input - Input state.
 * @param {object} world - World state.
 */
function updateNaturMovement(natur, dtSec, input, world) {
  const direction = getNaturDirection(input);
  const floorY = world.groundY - natur.h;

  natur.vx = direction * natur.speed;
  updateNaturFacing(natur, direction);
  natur.x += natur.vx * dtSec;

  handleNaturJump(natur, input, floorY);
  applyNaturGravity(natur, dtSec, floorY);
  clampNaturInsideWorld(natur, world, floorY);
}

/**
 * Returns the horizontal movement direction.
 *
 * @param {object} input - Input state.
 * @returns {number}
 */
function getNaturDirection(input) {
  return (input.right ? 1 : 0) - (input.left ? 1 : 0);
}

/**
 * Updates the facing direction.
 *
 * @param {object} natur - Player instance.
 * @param {number} direction - Horizontal input direction.
 */
function updateNaturFacing(natur, direction) {
  if (direction !== 0) {
    natur.facing = direction;
  }
}

/**
 * Handles jump start and ground state.
 *
 * @param {object} natur - Player instance.
 * @param {object} input - Input state.
 * @param {number} floorY - Ground position.
 */
function handleNaturJump(natur, input, floorY) {
  const grounded = natur.y >= floorY - 0.5;

  if (!grounded) {
    setNaturAirborne(natur);
    return;
  }

  prepareNaturGroundState(natur, floorY);

  if (!input.jump) return;

  natur.vy = -natur.jumpVelocity;
  natur.onGround = false;
}

/**
 * Sets the airborne state.
 *
 * @param {object} natur - Player instance.
 */
function setNaturAirborne(natur) {
  natur.onGround = false;
}

/**
 * Applies grounded values.
 *
 * @param {object} natur - Player instance.
 * @param {number} floorY - Ground position.
 */
function prepareNaturGroundState(natur, floorY) {
  natur.y = floorY;
  natur.vy = 0;
  natur.onGround = true;
}

/**
 * Applies gravity and vertical movement.
 *
 * @param {object} natur - Player instance.
 * @param {number} dtSec - Delta time in seconds.
 * @param {number} floorY - Ground position.
 */
function applyNaturGravity(natur, dtSec, floorY) {
  natur.vy += natur.gravity * dtSec;
  natur.y += natur.vy * dtSec;

  if (natur.y < floorY) return;

  prepareNaturGroundState(natur, floorY);
}

/**
 * Clamps the player inside world limits.
 *
 * @param {object} natur - Player instance.
 * @param {object} world - World state.
 * @param {number} floorY - Ground position.
 */
function clampNaturInsideWorld(natur, world, floorY) {
  natur.x = Math.max(0, Math.min(world.levelW - natur.w, natur.x));
  natur.y = Math.min(natur.y, floorY);
}
