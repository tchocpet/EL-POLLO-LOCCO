/**
 * Initializes the HUD module and registers its public API.
 */
function initHudModule() {
  const hudState = createHudState();
  loadHudAssets(hudState);
  registerHudApi(hudState);
}

/**
 * Creates the HUD state object.
 *
 * @returns {{healthImages: object, coinImages: object, bottleImages: object}}
 */
function createHudState() {
  return {
    healthImages: createStatusImages(),
    coinImages: createStatusImages(),
    bottleImages: createStatusImages(),
  };
}

/**
 * Registers public HUD functions on the global window object.
 *
 * @param {object} hudState - HUD state object.
 */
function registerHudApi(hudState) {
  window.drawHUD = (ctx, app) => renderHUD(ctx, app, hudState);
  window.drawBossHealthBar = drawBossHealthBar;
  window.drawBossAreaText = drawBossAreaText;
  window.drawBossPhaseText = drawBossPhaseText;
  window.drawDamageOverlay = drawDamageOverlay;
  window.drawPauseOverlay = drawPauseOverlay;
}

/**
 * Creates one status image map.
 *
 * @returns {object}
 */
function createStatusImages() {
  return {
    0: new Image(),
    20: new Image(),
    40: new Image(),
    60: new Image(),
    80: new Image(),
    100: new Image(),
  };
}

/**
 * Loads all HUD image assets.
 *
 * @param {object} hudState - HUD state object.
 */
function loadHudAssets(hudState) {
  loadCoinImages(hudState);
  loadHealthImages(hudState);
  loadHudBottleImages(hudState);
}

/**
 * Loads all coin status bar images.
 *
 * @param {object} hudState - HUD state object.
 */
function loadCoinImages(hudState) {
  setStatusImageSources(hudState.coinImages, getCoinImagePaths());
}

/**
 * Loads all health status bar images.
 *
 * @param {object} hudState - HUD state object.
 */
function loadHealthImages(hudState) {
  setStatusImageSources(hudState.healthImages, getHealthImagePaths());
}

/**
 * Loads all bottle status bar images.
 *
 * @param {object} hudState - HUD state object.
 */
function loadHudBottleImages(hudState) {
  setStatusImageSources(hudState.bottleImages, getHudBottleImagePaths());
}

/**
 * Assigns image sources to a status image map.
 *
 * @param {object} images - Image map.
 * @param {object} paths - Path map.
 */
function setStatusImageSources(images, paths) {
  images[0].src = paths[0];
  images[20].src = paths[20];
  images[40].src = paths[40];
  images[60].src = paths[60];
  images[80].src = paths[80];
  images[100].src = paths[100];
}

/**
 * Returns coin HUD image paths.
 *
 * @returns {object}
 */
function getCoinImagePaths() {
  return {
    0: "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    20: "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
    40: "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    60: "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    80: "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
    100: "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
  };
}

/**
 * Returns health HUD image paths.
 *
 * @returns {object}
 */
function getHealthImagePaths() {
  return {
    0: "img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
    20: "img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
    40: "img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    60: "img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    80: "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    100: "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
  };
}

/**
 * Returns bottle HUD image paths.
 *
 * @returns {object}
 */
function getHudBottleImagePaths() {
  return {
    0: "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
    20: "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
    40: "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
    60: "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
    80: "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
    100: "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
  };
}

/**
 * Draws the full HUD.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 * @param {object} app - Main application state.
 * @param {object} hudState - HUD state object.
 */
function renderHUD(ctx, app, hudState) {
  drawBottleHUD(ctx, app, hudState);
  drawHealthHUD(ctx, app, hudState);
  drawCoinHUD(ctx, app, hudState);
}

/**
 * Draws the health bar.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 * @param {object} app - Main application state.
 * @param {object} hudState - HUD state object.
 */
function drawHealthHUD(ctx, app, hudState) {
  const percent = getPercent(app.playerHealth, app.maxHealth);
  const image = getStatusBarImage(percent, hudState.healthImages);
  drawStatusImage(ctx, image, 20, 70);
}

/**
 * Draws the bottle bar.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 * @param {object} app - Main application state.
 * @param {object} hudState - HUD state object.
 */
function drawBottleHUD(ctx, app, hudState) {
  const percent = getPercent(app.bottleCount, app.maxBottles);
  const image = getStatusBarImage(percent, hudState.bottleImages);
  drawStatusImage(ctx, image, 20, 20);
}

/**
 * Draws the coin bar.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 * @param {object} app - Main application state.
 * @param {object} hudState - HUD state object.
 */
function drawCoinHUD(ctx, app, hudState) {
  const percent = getPercent(app.coinCount, app.maxCoins);
  const image = getStatusBarImage(percent, hudState.coinImages);
  drawStatusImage(ctx, image, 20, 120);
}

/**
 * Draws one HUD status image.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 * @param {HTMLImageElement} image - Status image.
 * @param {number} x - Draw x position.
 * @param {number} y - Draw y position.
 */
function drawStatusImage(ctx, image, x, y) {
  if (!image || !image.complete) return;
  ctx.drawImage(image, x, y, 220, 60);
}

/**
 * Returns a clamped percentage value.
 *
 * @param {number} value - Current value.
 * @param {number} maxValue - Maximum value.
 * @returns {number}
 */
function getPercent(value, maxValue) {
  if (maxValue <= 0) return 0;
  return Math.max(0, Math.min(100, (value / maxValue) * 100));
}

/**
 * Returns the correct status image.
 *
 * @param {number} percent - Percentage value.
 * @param {object} images - Image map.
 * @returns {HTMLImageElement}
 */
function getStatusBarImage(percent, images) {
  if (percent >= 100) return images[100];
  if (percent >= 80) return images[80];
  if (percent >= 60) return images[60];
  if (percent >= 40) return images[40];
  if (percent >= 20) return images[20];
  return images[0];
}

/**
 * Draws the boss health bar.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 * @param {object} app - Main application state.
 */
function drawBossHealthBar(ctx, app) {
  if (!app.bossActive) return;
  const box = createBossBarBox(app.world.w);
  const percent = app.bossHealth / app.maxBossHealth;
  drawBossBarFrame(ctx, box);
  drawBossBarFill(ctx, box, percent);
}

/**
 * Draws the boss area label.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 * @param {object} app - Main application state.
 */
function drawBossAreaText(ctx, app) {
  if (!shouldDrawBossAreaText(app)) return;
  ctx.save();
  drawBossAreaBox(ctx, app);
  drawBossAreaLabel(ctx, app);
  ctx.restore();
}

/**
 * Draws the boss phase label.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 * @param {object} app - Main application state.
 */
function drawBossPhaseText(ctx, app) {
  if (app.bossPhaseTextTime <= 0) return;
  ctx.save();
  drawBossPhaseBox(ctx, app);
  drawBossPhaseLabel(ctx, app);
  ctx.restore();
}

/**
 * Draws the player damage overlay.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 * @param {object} app - Main application state.
 * @param {Function} nowMs - Timestamp function.
 */
function drawDamageOverlay(ctx, app, nowMs) {
  const sinceHit = nowMs() - app.lastHitTime;
  if (sinceHit > 120) return;
  ctx.fillStyle = "rgba(255, 0, 0, 0.15)";
  ctx.fillRect(0, 0, app.world.w, app.world.h);
}

/**
 * Draws the pause overlay.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 * @param {object} app - Main application state.
 */
function drawPauseOverlay(ctx, app) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.fillRect(0, 0, app.world.w, app.world.h);
  drawPauseLabel(ctx, app);
}

/**
 * Draws the pause label.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 * @param {object} app - Main application state.
 */
function drawPauseLabel(ctx, app) {
  ctx.fillStyle = "#ffffff";
  ctx.font = "22px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("PAUSED", app.world.w / 2, app.world.h / 2);
}

/**
 * Returns whether the boss area label should be drawn.
 *
 * @param {object} app - Main application state.
 * @returns {boolean}
 */
function shouldDrawBossAreaText(app) {
  if (!app.bossActive) return false;
  if (app.gameWon) return false;
  return app.bossAreaShown;
}

/**
 * Draws the boss area box.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 * @param {object} app - Main application state.
 */
function drawBossAreaBox(ctx, app) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.fillRect(app.world.w / 2 - 110, 55, 220, 32);
}

/**
 * Draws the boss area label text.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 * @param {object} app - Main application state.
 */
function drawBossAreaLabel(ctx, app) {
  ctx.fillStyle = "#ffffff";
  ctx.font = "18px Arial";
  ctx.textAlign = "center";
  ctx.fillText("BOSS AREA", app.world.w / 2, 77);
}

/**
 * Draws the boss phase box.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 * @param {object} app - Main application state.
 */
function drawBossPhaseBox(ctx, app) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.fillRect(app.world.w / 2 - 150, 100, 300, 40);
}

/**
 * Draws the boss phase label text.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 * @param {object} app - Main application state.
 */
function drawBossPhaseLabel(ctx, app) {
  ctx.fillStyle = "#ff7675";
  ctx.font = "bold 22px Arial";
  ctx.textAlign = "center";
  ctx.fillText("BOSS PHASE 2!", app.world.w / 2, 128);
}

/**
 * Creates the boss bar box data.
 *
 * @param {number} worldWidth - World width.
 * @returns {{x:number,y:number,width:number,height:number}}
 */
function createBossBarBox(worldWidth) {
  return {
    width: 300,
    height: 25,
    x: (worldWidth - 300) / 2,
    y: 20,
  };
}

/**
 * Draws the boss bar frame.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 * @param {{x:number,y:number,width:number,height:number}} box - Box data.
 */
function drawBossBarFrame(ctx, box) {
  ctx.fillStyle = "black";
  ctx.fillRect(box.x, box.y, box.width, box.height);
  ctx.strokeStyle = "white";
  ctx.strokeRect(box.x, box.y, box.width, box.height);
}

/**
 * Draws the boss bar fill.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 * @param {{x:number,y:number,width:number,height:number}} box - Box data.
 * @param {number} percent - Fill percentage.
 */
function drawBossBarFill(ctx, box, percent) {
  ctx.fillStyle = "red";
  ctx.fillRect(box.x, box.y, box.width * percent, box.height);
}
