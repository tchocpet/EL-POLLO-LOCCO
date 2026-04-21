/**
 * Returns the current boss image.
 *
 * @param {object} boss - Boss instance.
 * @returns {HTMLImageElement|null}
 */
function getCurrentBossImage(boss) {
  if (boss.dead) {
    return boss.deadImages[boss.frame] || boss.deadImages.at(-1) || null;
  }

  if (boss.hurt) {
    return boss.hurtImages[boss.frame] || boss.hurtImages[0] || null;
  }

  return boss.walkImages[boss.frame] || null;
}

/**
 * Returns whether the image can be drawn.
 *
 * @param {HTMLImageElement|null} image - Boss image.
 * @returns {boolean}
 */
function isBossImageDrawable(image) {
  return !!image && image.complete && image.naturalWidth > 0;
}

/**
 * Draws a fallback rectangle for the boss.
 *
 * @param {object} boss - Boss instance.
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 */
function drawBossFallback(boss, ctx) {
  ctx.fillStyle = "#8e2f2f";
  ctx.fillRect(boss.x, boss.y, boss.w, boss.h);
}

/**
 * Draws the boss sprite.
 *
 * @param {object} boss - Boss instance.
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 * @param {HTMLImageElement} image - Current boss image.
 */
function drawBossSprite(boss, ctx, image) {
  ctx.save();

  if (boss.facing > 0) {
    ctx.translate(boss.x + boss.w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(image, 0, boss.y, boss.w, boss.h);
    ctx.restore();
    return;
  }

  ctx.drawImage(image, boss.x, boss.y, boss.w, boss.h);
  ctx.restore();
}
