"use strict";

/**
 * Handles collisions between thrown bottles and regular enemies.
 * @param {object} App - Main game state object.
 */

/**
 * Handles collisions between all bottles and all enemies.
 * @param {object} App - Main game state object.
 */
function handleBottleEnemyHits(App) {
  App.projectiles.forEach((bottle) => {
    handleBottleHitsEnemies(App, bottle);
  });
}

/**
 * Handles collisions for a single bottle with all enemies.
 * @param {object} App - Main game state object.
 * @param {object} bottle - The bottle projectile
 */
function handleBottleHitsEnemies(App, bottle) {
  App.enemies.forEach((enemy) => {
    handleBottleHitsEnemy(App, bottle, enemy);
  });
}

/**
 * Handles collision for a single bottle and a single enemy.
 * @param {object} App - Main game state object.
 * @param {object} bottle - The bottle projectile
 * @param {object} enemy - The enemy
 */
function handleBottleHitsEnemy(App, bottle, enemy) {
  if (enemy.dead || bottle.dead || bottle.splashing) return;
  if (!isColliding(bottle, enemy)) return;
  enemy.die();
  bottle.startSplash(enemy.y + enemy.h - bottle.h / 2);
  App.killedEnemies += 1;
}

/**
 * Handles collisions between thrown bottles and the boss.
 * @param {object} App - Main game state object.
 */
function handleBottleBossHits(App) {
  const boss = App.endboss;
  if (!boss || boss.dead) return;

  App.projectiles.forEach((bottle) => {
    if (bottle.dead || bottle.splashing) return;
    if (!isColliding(bottle, boss)) return;

    bottle.startSplash(boss.y + boss.h * 0.6);
    App.bossHealth = Math.max(0, App.bossHealth - 20);
    App.world.shakeTime = 0.18;
    boss.takeHit();
    safePlay(App.audio.bossHit);
  });

  if (App.bossHealth <= 0) {
    boss.die();
    setTimeout(() => {
      winGame();
    }, 900);
  }
}

/**
 * Checks collisions between the player and regular enemies.
 * @param {object} App - Main game state object.
 * @param {number} currentTime - Current timestamp.
 */
function checkPlayerEnemyHits(App, currentTime) {
  App.enemies.forEach((enemy) => {
    if (enemy.dead) return;
    if (!isColliding(App.player, enemy)) return;

    const playerBottom = App.player.y + App.player.h;
    const enemyTop = enemy.y;
    const isFalling = App.player.vy > 0;
    const stompOffset = 25;

    const isStompHit =
      isFalling && playerBottom - stompOffset < enemyTop + enemy.h * 0.5;

    if (isStompHit) {
      enemy.die();
      App.killedEnemies += 1;
      App.player.vy = -320;
      return;
    }

    if (!canTakeDamage(currentTime)) return;

    const damage = enemy.damage || 20;

    applyDamage(damage);
    App.world.shakeTime = 0.2;
    App.player.takeHit();
    App.player.vx = enemy.x < App.player.x ? 150 : -150;
    App.player.vy = -150;
  });
}

/**
 * Checks collisions between the player and the boss.
 * @param {object} App - Main game state object.
 * @param {number} currentTime - Current timestamp.
 */
function checkPlayerBossHit(App, currentTime) {
  const boss = App.endboss;
  if (!boss || boss.dead) return;
  if (!isColliding(App.player, boss)) return;
  if (!canTakeDamage(currentTime)) return;

  const damage = boss.isRushing ? 35 : 25;

  applyDamage(damage);
  App.world.shakeTime = 0.22;
  App.player.takeHit();
  App.player.vx = boss.x < App.player.x ? 180 : -180;
  App.player.vy = -180;
}

/**
 * Checks whether the player collects coins.
 * @param {object} App - Main game state object.
 */
function checkCoinCollection(App) {
  App.coins.forEach((coin) => {
    if (coin.collected) return;
    if (!isColliding(App.player, coin)) return;

    coin.collected = true;
    App.coinCount += 1;
    safePlay(App.audio.coin);
  });

  App.coins = App.coins.filter((coin) => !coin.collected);
}

/**
 * Checks whether the player collects ground bottles.
 * @param {object} App - Main game state object.
 */
function checkBottleCollection(App) {
  App.groundBottles.forEach((bottle) => {
    if (bottle.collected) return;
    if (!isColliding(App.player, bottle)) return;
    if (App.bottleCount >= App.maxBottles) return;

    bottle.collected = true;
    App.bottleCount += 1;
    safePlay(App.audio.bottleCollect);
  });

  App.groundBottles = App.groundBottles.filter((bottle) => !bottle.collected);
}

window.handleBottleEnemyHits = handleBottleEnemyHits;
window.handleBottleBossHits = handleBottleBossHits;
window.checkPlayerEnemyHits = checkPlayerEnemyHits;
window.checkPlayerBossHit = checkPlayerBossHit;
window.checkCoinCollection = checkCoinCollection;
window.checkBottleCollection = checkBottleCollection;
