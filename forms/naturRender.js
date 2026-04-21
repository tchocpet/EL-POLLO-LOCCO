/**
 * Draws the player sprite.
 *
 * @param {object} natur - Player instance.
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 * @param {HTMLImageElement} image - Current sprite image.
 */
function drawNaturSprite(natur, ctx, image) {
  ctx.save();

  if (natur.facing < 0) {
    ctx.translate(natur.x + natur.w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(image, 0, natur.y, natur.w, natur.h);
    ctx.restore();
    return;
  }

  ctx.drawImage(image, natur.x, natur.y, natur.w, natur.h);
  ctx.restore();
}

/**
 * Draws a fallback rectangle if no sprite is available.
 *
 * @param {object} natur - Player instance.
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 */
function drawNaturFallback(natur, ctx) {
  ctx.fillStyle = "#e74c3c";
  ctx.fillRect(natur.x, natur.y, natur.w, natur.h);
}

/**
 * Draws the sleep label above the player.
 *
 * @param {object} natur - Player instance.
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 */
function drawNaturSleepText(natur, ctx) {
  if (!natur.sleepMode) return;

  const yOffset = Math.sin(natur.sleepFloat) * 3;
  const xOffset = Math.sin(natur.sleepWave) * 2;

  ctx.save();
  ctx.font = "20px Arial";
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.fillText("Zzz", natur.x + 108 + xOffset, natur.y - 42 + yOffset);
  ctx.fillText("😴", natur.x + 128 + xOffset, natur.y - 72 + yOffset);
  ctx.restore();
}
