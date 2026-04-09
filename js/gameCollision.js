"use strict";

function handleBottleEnemyHits(App) {
  App.projectiles.forEach((bottle) => {
    App.enemies.forEach((enemy) => {
      if (enemy.dead || bottle.dead || bottle.splashing) return;
      if (!isColliding(bottle, enemy)) return;

      enemy.die();
      bottle.startSplash(enemy.y + enemy.h - bottle.h / 2);
      App.killedEnemies += 1;
    });
  });
}

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

function checkPlayerEnemyHits(App, currentTime) {
  App.enemies.forEach((enemy) => {
    if (enemy.dead) return;
    if (!isColliding(App.player, enemy)) return;

    if (isStompHit(App.player, enemy)) {
      enemy.die();
      App.player.vy = -320;
      App.killedEnemies += 1;
      return;
    }

    if (!canTakeDamage(currentTime)) return;

    const damage = enemy.type === "big" ? 30 : 20;
    App.playerHealth = Math.max(0, App.playerHealth - damage);
    App.lastHitTime = currentTime;
    App.world.shakeTime = 0.15;
    App.player.takeHit();
    safePlay(App.audio.hurt);

    if (App.playerHealth <= 0) {
      loseGame();
    }
  });

  App.enemies = App.enemies.filter((enemy) => !enemy.dead);
}

function checkPlayerBossHit(App, currentTime) {
  const boss = App.endboss;
  if (!boss || boss.dead) return;
  if (!isColliding(App.player, boss)) return;
  if (!canTakeDamage(currentTime)) return;

  const damage = boss.isRushing ? 35 : 25;

  App.playerHealth = Math.max(0, App.playerHealth - damage);
  App.lastHitTime = currentTime;
  App.world.shakeTime = 0.22;
  App.player.takeHit();
  safePlay(App.audio.hurt);

  App.player.vx = boss.x < App.player.x ? 180 : -180;
  App.player.vy = -180;

  if (App.playerHealth <= 0) {
    loseGame();
  }
}

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
