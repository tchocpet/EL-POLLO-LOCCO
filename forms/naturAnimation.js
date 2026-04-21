/**
 * Updates all player animations.
 *
 * @param {object} natur - Player instance.
 * @param {number} dtMs - Delta time in milliseconds.
 * @param {object} assets - Asset collection.
 */
function updateNaturAnimation(natur, dtMs, assets) {
  updateNaturWalkAnimation(natur, dtMs, assets);
  updateNaturJumpAnimation(natur, dtMs);
  updateNaturHurtAnimation(natur, dtMs);
  updateNaturThrowAnimation(natur, dtMs);
  updateNaturSleepAnimation(natur, dtMs);
}

/**
 * Updates the walk animation.
 *
 * @param {object} natur - Player instance.
 * @param {number} dtMs - Delta time in milliseconds.
 * @param {object} assets - Asset collection.
 */
function updateNaturWalkAnimation(natur, dtMs, assets) {
  if (!isNaturWalking(natur)) {
    resetNaturWalkAnimation(natur);
    return;
  }

  if (!hasNaturWalkFrames(natur, assets)) {
    resetNaturWalkAnimation(natur);
    return;
  }

  natur.anim.walkTimer += dtMs;

  if (natur.anim.walkTimer < 1000 / natur.anim.walkFps) return;

  natur.anim.walkTimer = 0;
  advanceNaturWalkFrame(natur, assets);
}

/**
 * Returns whether the player is walking.
 *
 * @param {object} natur - Player instance.
 * @returns {boolean}
 */
function isNaturWalking(natur) {
  if (Math.abs(natur.vx) <= 1) return false;
  if (!natur.onGround) return false;
  return natur.throwTime <= 0;
}

/**
 * Returns whether walk frames are available.
 *
 * @param {object} natur - Player instance.
 * @param {object} assets - Asset collection.
 * @returns {boolean}
 */
function hasNaturWalkFrames(natur, assets) {
  if (natur.images.walk.length > 0) return true;
  return assets.playerWalk.length > 0;
}

/**
 * Resets the walk animation.
 *
 * @param {object} natur - Player instance.
 */
function resetNaturWalkAnimation(natur) {
  natur.anim.walkFrame = 0;
  natur.anim.walkTimer = 0;
}

/**
 * Advances the walk frame.
 *
 * @param {object} natur - Player instance.
 * @param {object} assets - Asset collection.
 */
function advanceNaturWalkFrame(natur, assets) {
  const count = natur.images.walk.length || assets.playerWalk.length;
  natur.anim.walkFrame = (natur.anim.walkFrame + 1) % count;
}

/**
 * Updates the jump animation.
 *
 * @param {object} natur - Player instance.
 * @param {number} dtMs - Delta time in milliseconds.
 */
function updateNaturJumpAnimation(natur, dtMs) {
  if (!isNaturJumping(natur)) {
    resetNaturJumpAnimation(natur);
    return;
  }

  natur.anim.jumpTimer += dtMs;

  if (natur.anim.jumpTimer < 1000 / natur.anim.jumpFps) return;

  natur.anim.jumpTimer = 0;
  natur.anim.jumpFrame = (natur.anim.jumpFrame + 1) % natur.images.jump.length;
}

/**
 * Returns whether the player is jumping.
 *
 * @param {object} natur - Player instance.
 * @returns {boolean}
 */
function isNaturJumping(natur) {
  if (natur.onGround) return false;
  if (natur.throwTime > 0) return false;
  return natur.images.jump.length > 0;
}

/**
 * Resets the jump animation.
 *
 * @param {object} natur - Player instance.
 */
function resetNaturJumpAnimation(natur) {
  natur.anim.jumpFrame = 0;
  natur.anim.jumpTimer = 0;
}

/**
 * Updates the hurt animation.
 *
 * @param {object} natur - Player instance.
 * @param {number} dtMs - Delta time in milliseconds.
 */
function updateNaturHurtAnimation(natur, dtMs) {
  if (!isNaturHurt(natur)) {
    resetNaturHurtAnimation(natur);
    return;
  }

  natur.anim.hurtTimer += dtMs;

  if (natur.anim.hurtTimer < 1000 / natur.anim.hurtFps) return;

  natur.anim.hurtTimer = 0;
  natur.anim.hurtFrame = (natur.anim.hurtFrame + 1) % natur.images.hurt.length;
}

/**
 * Returns whether the player is hurt.
 *
 * @param {object} natur - Player instance.
 * @returns {boolean}
 */
function isNaturHurt(natur) {
  if (natur.hurtTime <= 0) return false;
  return natur.images.hurt.length > 0;
}

/**
 * Resets the hurt animation.
 *
 * @param {object} natur - Player instance.
 */
function resetNaturHurtAnimation(natur) {
  natur.anim.hurtFrame = 0;
  natur.anim.hurtTimer = 0;
}

/**
 * Updates the throw animation.
 *
 * @param {object} natur - Player instance.
 * @param {number} dtMs - Delta time in milliseconds.
 */
function updateNaturThrowAnimation(natur, dtMs) {
  if (!isNaturThrowing(natur)) {
    resetNaturThrowAnimation(natur);
    return;
  }

  natur.anim.throwTimer += dtMs;

  if (natur.anim.throwTimer < 1000 / natur.anim.throwFps) return;

  natur.anim.throwTimer = 0;
  natur.anim.throwFrame =
    (natur.anim.throwFrame + 1) % natur.images.throw.length;
}

/**
 * Returns whether the player is throwing.
 *
 * @param {object} natur - Player instance.
 * @returns {boolean}
 */
function isNaturThrowing(natur) {
  if (natur.throwTime <= 0) return false;
  return natur.images.throw.length > 0;
}

/**
 * Resets the throw animation.
 *
 * @param {object} natur - Player instance.
 */
function resetNaturThrowAnimation(natur) {
  natur.anim.throwFrame = 0;
  natur.anim.throwTimer = 0;
}

/**
 * Updates the sleep animation.
 *
 * @param {object} natur - Player instance.
 * @param {number} dtMs - Delta time in milliseconds.
 */
function updateNaturSleepAnimation(natur, dtMs) {
  if (!natur.sleepMode) return;

  natur.anim.sleepTimer += dtMs;

  if (natur.anim.sleepTimer < 1000 / natur.anim.sleepFps) return;

  natur.anim.sleepTimer = 0;
  natur.anim.sleepFrame =
    (natur.anim.sleepFrame + 1) % natur.images.sleep.length;
}

/**
 * Returns the current image for the player.
 *
 * @param {object} natur - Player instance.
 * @param {object} assets - Asset collection.
 * @returns {HTMLImageElement|null}
 */
function getCurrentNaturImage(natur, assets) {
  if (hasNaturThrowImage(natur)) {
    return natur.images.throw[natur.anim.throwFrame];
  }

  if (hasNaturHurtImage(natur)) {
    return natur.images.hurt[natur.anim.hurtFrame];
  }

  if (isNaturJumping(natur)) {
    return natur.images.jump[natur.anim.jumpFrame] || null;
  }

  if (isNaturWalking(natur)) {
    return getNaturWalkImage(natur, assets);
  }

  if (hasNaturSleepImage(natur)) {
    return natur.images.sleep[natur.anim.sleepFrame];
  }

  if (hasNaturIdleImage(natur)) {
    return natur.images.idle;
  }

  if (assets.playerIdle) {
    return assets.playerIdle;
  }

  return null;
}

/**
 * Returns whether a throw image is available.
 *
 * @param {object} natur - Player instance.
 * @returns {boolean}
 */
function hasNaturThrowImage(natur) {
  if (natur.throwTime <= 0) return false;
  return !!natur.images.throw[natur.anim.throwFrame];
}

/**
 * Returns whether a hurt image is available.
 *
 * @param {object} natur - Player instance.
 * @returns {boolean}
 */
function hasNaturHurtImage(natur) {
  if (natur.hurtTime <= 0) return false;
  return !!natur.images.hurt[natur.anim.hurtFrame];
}

/**
 * Returns whether a sleep image is available.
 *
 * @param {object} natur - Player instance.
 * @returns {boolean}
 */
function hasNaturSleepImage(natur) {
  if (!natur.sleepMode) return false;
  return !!natur.images.sleep[natur.anim.sleepFrame];
}

/**
 * Returns whether an idle image is available.
 *
 * @param {object} natur - Player instance.
 * @returns {boolean}
 */
function hasNaturIdleImage(natur) {
  return !!natur.images.idle;
}

/**
 * Returns the current walk image.
 *
 * @param {object} natur - Player instance.
 * @param {object} assets - Asset collection.
 * @returns {HTMLImageElement|null}
 */
function getNaturWalkImage(natur, assets) {
  if (natur.images.walk.length > 0) {
    return natur.images.walk[natur.anim.walkFrame] || null;
  }

  return assets.playerWalk[natur.anim.walkFrame] || null;
}
