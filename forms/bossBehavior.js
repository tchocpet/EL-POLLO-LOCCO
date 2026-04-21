/**
 * Returns whether the boss is dead and updates the dead state.
 *
 * @param {object} boss - Boss instance.
 * @param {number} dtMs - Delta time in milliseconds.
 * @param {number} dtSec - Delta time in seconds.
 * @returns {boolean}
 */
function isBossDeadState(boss, dtMs, dtSec) {
  if (!boss.dead) return false;
  updateDeadBossState(boss, dtMs, dtSec);
  return true;
}

/**
 * Updates the alive boss state.
 *
 * @param {object} boss - Boss instance.
 * @param {number} dtMs - Delta time in milliseconds.
 * @param {number} dtSec - Delta time in seconds.
 * @param {object} world - World state.
 * @param {object} player - Player state.
 * @param {number} health - Boss health.
 */
function updateAliveBossState(boss, dtMs, dtSec, world, player, health) {
  updateBossStateFlags(boss, dtSec, health);

  const distance = getBossDistanceToPlayer(boss, player);

  activateBossIfNeeded(boss, distance);

  if (!boss.active) return;

  updateActiveBossState(boss, dtMs, dtSec, world, player, distance);
}

/**
 * Updates important state flags.
 *
 * @param {object} boss - Boss instance.
 * @param {number} dtSec - Delta time in seconds.
 * @param {number} health - Boss health.
 */
function updateBossStateFlags(boss, dtSec, health) {
  updateBossHurtState(boss, dtSec);
  updateBossPhase(boss, health);
  updateBossTimers(boss, dtSec);
}

/**
 * Returns the horizontal distance to the player.
 *
 * @param {object} boss - Boss instance.
 * @param {object} player - Player state.
 * @returns {number}
 */
function getBossDistanceToPlayer(boss, player) {
  return boss.x - player.x;
}

/**
 * Activates the boss if the player is close enough.
 *
 * @param {object} boss - Boss instance.
 * @param {number} distance - Distance to the player.
 */
function activateBossIfNeeded(boss, distance) {
  if (Math.abs(distance) < 750) {
    boss.active = true;
  }
}

/**
 * Updates the active boss state.
 *
 * @param {object} boss - Boss instance.
 * @param {number} dtMs - Delta time in milliseconds.
 * @param {number} dtSec - Delta time in seconds.
 * @param {object} world - World state.
 * @param {object} player - Player state.
 * @param {number} distance - Distance to the player.
 */
function updateActiveBossState(boss, dtMs, dtSec, world, player, distance) {
  tryStartBossRush(boss, distance);
  moveBoss(boss, dtSec, world, player);
  animateBoss(boss, dtMs);
}

/**
 * Updates the hurt timer and state.
 *
 * @param {object} boss - Boss instance.
 * @param {number} dtSec - Delta time in seconds.
 */
function updateBossHurtState(boss, dtSec) {
  if (boss.hurtTime > 0) {
    boss.hurtTime -= dtSec;
  }

  if (boss.hurtTime > 0) return;

  boss.hurt = false;
  boss.hurtTime = 0;
}

/**
 * Updates the dead state.
 *
 * @param {object} boss - Boss instance.
 * @param {number} dtMs - Delta time in milliseconds.
 * @param {number} dtSec - Delta time in seconds.
 */
function updateDeadBossState(boss, dtMs, dtSec) {
  boss.deadTime += dtMs;
  boss.y += 90 * dtSec;

  if (boss.deadTime > 1400) {
    boss.removable = true;
  }
}

/**
 * Updates the current phase.
 *
 * @param {object} boss - Boss instance.
 * @param {number} health - Boss health.
 */
function updateBossPhase(boss, health) {
  boss.phaseTwo = health <= 50;
}

/**
 * Updates all boss timers.
 *
 * @param {object} boss - Boss instance.
 * @param {number} dtSec - Delta time in seconds.
 */
function updateBossTimers(boss, dtSec) {
  lowerBossAttackCooldown(boss, dtSec);
  lowerBossRushTime(boss, dtSec);

  if (boss.rushTime > 0) return;

  boss.isRushing = false;
}

/**
 * Lowers the attack cooldown.
 *
 * @param {object} boss - Boss instance.
 * @param {number} dtSec - Delta time in seconds.
 */
function lowerBossAttackCooldown(boss, dtSec) {
  if (boss.attackCooldown > 0) {
    boss.attackCooldown -= dtSec;
  }
}

/**
 * Lowers the rush timer.
 *
 * @param {object} boss - Boss instance.
 * @param {number} dtSec - Delta time in seconds.
 */
function lowerBossRushTime(boss, dtSec) {
  if (boss.rushTime > 0) {
    boss.rushTime -= dtSec;
  }
}

/**
 * Starts a rush attack if all conditions match.
 *
 * @param {object} boss - Boss instance.
 * @param {number} distance - Distance to the player.
 */
function tryStartBossRush(boss, distance) {
  if (!boss.phaseTwo) return;
  if (boss.attackCooldown > 0) return;
  if (boss.isRushing) return;
  if (Math.abs(distance) > 280) return;

  boss.isRushing = true;
  boss.rushTime = 0.85;
  boss.attackCooldown = 2.2;
}

/**
 * Moves the boss and updates direction.
 *
 * @param {object} boss - Boss instance.
 * @param {number} dtSec - Delta time in seconds.
 * @param {object} world - World state.
 * @param {object} player - Player state.
 */
function moveBoss(boss, dtSec, world, player) {
  const speed = getBossMoveSpeed(boss);
  const distance = player.x - boss.x;

  if (isBossCloseToPlayer(distance)) {
    stopBossMovement(boss);
    return;
  }

  updateBossDirection(boss, distance, speed, dtSec);
  clampBossPosition(boss, world);
}

/**
 * Returns the current movement speed.
 *
 * @param {object} boss - Boss instance.
 * @returns {number}
 */
function getBossMoveSpeed(boss) {
  if (boss.isRushing) return 255;
  if (boss.phaseTwo) return 155;
  return 100;
}

/**
 * Returns whether the boss is very close to the player.
 *
 * @param {number} distance - Distance to the player.
 * @returns {boolean}
 */
function isBossCloseToPlayer(distance) {
  return Math.abs(distance) < 20;
}

/**
 * Stops horizontal boss movement.
 *
 * @param {object} boss - Boss instance.
 */
function stopBossMovement(boss) {
  boss.vx = 0;
}

/**
 * Updates boss direction and horizontal movement.
 *
 * @param {object} boss - Boss instance.
 * @param {number} distance - Distance to the player.
 * @param {number} speed - Current speed.
 * @param {number} dtSec - Delta time in seconds.
 */
function updateBossDirection(boss, distance, speed, dtSec) {
  boss.vx = distance < 0 ? -speed : speed;
  boss.facing = boss.vx < 0 ? -1 : 1;
  boss.x += boss.vx * dtSec;
}

/**
 * Clamps the boss inside the world bounds.
 *
 * @param {object} boss - Boss instance.
 * @param {object} world - World state.
 */
function clampBossPosition(boss, world) {
  const minX = 0;
  const maxX = world.levelW - boss.w;

  if (boss.x < minX) boss.x = minX;
  if (boss.x > maxX) boss.x = maxX;
}

/**
 * Updates the boss animation.
 *
 * @param {object} boss - Boss instance.
 * @param {number} dtMs - Delta time in milliseconds.
 */
function animateBoss(boss, dtMs) {
  const limit = getBossAnimationLimit(boss);

  boss.animT += dtMs;

  if (boss.animT < limit) return;

  boss.animT = 0;
  advanceBossFrame(boss);
}

/**
 * Returns the current animation interval.
 *
 * @param {object} boss - Boss instance.
 * @returns {number}
 */
function getBossAnimationLimit(boss) {
  if (boss.isRushing) return 90;
  if (boss.phaseTwo) return 120;
  return 180;
}

/**
 * Advances the current frame.
 *
 * @param {object} boss - Boss instance.
 */
function advanceBossFrame(boss) {
  const maxFrames = getBossFrameCount(boss);
  boss.frame = (boss.frame + 1) % Math.max(1, maxFrames);
}

/**
 * Returns the number of frames for the current state.
 *
 * @param {object} boss - Boss instance.
 * @returns {number}
 */
function getBossFrameCount(boss) {
  if (boss.dead) return boss.deadImages.length;
  if (boss.hurt) return boss.hurtImages.length;
  return boss.walkImages.length;
}
