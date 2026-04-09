"use strict";

/**
 * Health status bar images
 */
const healthImages = {
  0: new Image(),
  20: new Image(),
  40: new Image(),
  60: new Image(),
  80: new Image(),
  100: new Image(),
};

const coinImages = {
  0: new Image(),
  20: new Image(),
  40: new Image(),
  60: new Image(),
  80: new Image(),
  100: new Image(),
};

coinImages[0].src = "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png";
coinImages[20].src =
  "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png";
coinImages[40].src =
  "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png";
coinImages[60].src =
  "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png";
coinImages[80].src =
  "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png";
coinImages[100].src =
  "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png";

healthImages[0].src =
  "img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png";
healthImages[20].src =
  "img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png";
healthImages[40].src =
  "img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png";
healthImages[60].src =
  "img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png";
healthImages[80].src =
  "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png";
healthImages[100].src =
  "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png";

/**
 * Bottle status bar images
 */
const bottleImages = {
  0: new Image(),
  20: new Image(),
  40: new Image(),
  60: new Image(),
  80: new Image(),
  100: new Image(),
};

bottleImages[0].src =
  "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png";
bottleImages[20].src =
  "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png";
bottleImages[40].src =
  "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png";
bottleImages[60].src =
  "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png";
bottleImages[80].src =
  "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png";
bottleImages[100].src =
  "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png";

/**
 * Coin icon
 */
const coinHudImg = new Image();
coinHudImg.src = "img/8_coin/coin_1.png";

/**
 * Draws the complete HUD.
 */
function drawHUD(ctx, App) {
  drawBottleHUD(ctx, App);
  drawHealthHUD(ctx, App);
  drawCoinHUD(ctx, App);
}

/**
 * Draws the health status bar.
 */
function drawHealthHUD(ctx, App) {
  const x = 20;
  const y = 70;

  const percent = Math.max(
    0,
    Math.min(100, (App.playerHealth / App.maxHealth) * 100),
  );

  const img = getStatusBarImage(percent, healthImages);

  if (img && img.complete) {
    ctx.drawImage(img, x, y, 220, 60);
  }
}

function getStatusBarImage(percent, images) {
  const steps = [0, 20, 40, 60, 80, 100];
  let closest = steps.reduce((prev, curr) =>
    Math.abs(curr - percent) < Math.abs(prev - percent) ? curr : prev,
  );

  return images[closest];
}

/**
 * Draws the bottle status bar.
 */

function drawBottleHUD(ctx, App) {
  const x = 20;
  const y = 20;

  const percent = Math.max(
    0,
    Math.min(100, (App.bottleCount / App.maxBottles) * 100),
  );

  const img = getStatusBarImage(percent, bottleImages);

  if (img && img.complete) {
    ctx.drawImage(img, x, y, 220, 60);
  }
}

/**
 * Draws the coin counter.
 */
function drawCoinHUD(ctx, App) {
  const x = 20;
  const y = 120;

  const percent = Math.max(
    0,
    Math.min(100, (App.coinCount / App.maxCoins) * 100),
  );

  const img = getStatusBarImage(percent, coinImages);

  if (img && img.complete) {
    ctx.drawImage(img, x, y, 220, 60);
  }
}

function drawBossAreaText(ctx, App) {
  if (!App.bossActive || App.gameWon || !App.bossAreaShown) return;

  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.fillRect(App.world.w / 2 - 110, 55, 220, 32);

  ctx.fillStyle = "#ffffff";
  ctx.font = "18px Arial";
  ctx.textAlign = "center";
  ctx.fillText("BOSS AREA", App.world.w / 2, 77);
  ctx.restore();
}

function drawBossPhaseText(ctx, App) {
  if (App.bossPhaseTextTime <= 0) return;

  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.fillRect(App.world.w / 2 - 150, 100, 300, 40);

  ctx.fillStyle = "#ff7675";
  ctx.font = "bold 22px Arial";
  ctx.textAlign = "center";
  ctx.fillText("BOSS PHASE 2!", App.world.w / 2, 128);
  ctx.restore();
}

function drawDamageOverlay(ctx, App, nowMs) {
  const sinceHit = nowMs() - App.lastHitTime;
  if (sinceHit > 120) return;

  ctx.fillStyle = "rgba(255, 0, 0, 0.15)";
  ctx.fillRect(0, 0, App.world.w, App.world.h);
}

function drawPauseOverlay(ctx, App) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.fillRect(0, 0, App.world.w, App.world.h);

  ctx.fillStyle = "#ffffff";
  ctx.font = "22px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("PAUSED", App.world.w / 2, App.world.h / 2);
}

/**
 * Helper function to map percentage to status bar image.
 */
function getStatusKey(percent) {
  if (percent >= 100) return 100;
  if (percent >= 80) return 80;
  if (percent >= 60) return 60;
  if (percent >= 40) return 40;
  if (percent >= 20) return 20;
  return 0;
}

/**
 * Export functions to global scope
 */
window.drawHUD = drawHUD;
window.drawBossAreaText = drawBossAreaText;
window.drawBossPhaseText = drawBossPhaseText;
window.drawDamageOverlay = drawDamageOverlay;
window.drawPauseOverlay = drawPauseOverlay;
