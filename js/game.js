(function () {
  const $ = (id) => document.getElementById(id);

  const ASSETS = {
    sky: null,
    layer3: null,
    layer2: null,
    layer1: null,
    playerWalk: [],
    playerIdle: null,
  };

  const PATHS = {
    bg: {
      sky: "img/5_background/layers/air.png",
      layer3: "img/5_background/layers/3_third_layer/1.png",
      layer2: "img/5_background/layers/2_second_layer/1.png",
      layer1: "img/5_background/layers/1_first_layer/1.png",
    },
    idle: "img/2_character_pepe/1_idle/idle/I-1.png",
    walk: [
      "img/2_character_pepe/2_walk/W-21.png",
      "img/2_character_pepe/2_walk/W-22.png",
      "img/2_character_pepe/2_walk/W-23.png",
      "img/2_character_pepe/2_walk/W-24.png",
      "img/2_character_pepe/2_walk/W-25.png",
      "img/2_character_pepe/2_walk/W-26.png",
    ],
    audio: {
      bgMusic: "audio/bg_music.wav",
      coin: "audio/coin.mp3",
      bottleCollect: "audio/bottle_collect.wav",
      throw: "audio/bottle_throw.mp3",
      hurt: "audio/hurt.mp3",
      bossHit: "audio/chicken_hurt.mp3",
    },
  };

  const App = {
    running: false,
    paused: false,
    eventsBound: false,
    rafId: null,
    lastTime: 0,

    soundOn: localStorage.getItem("soundOn") === "true",

    canvas: null,
    ctx: null,

    world: {
      w: 720,
      h: 480,
      levelW: 3200,
      groundY: 432,
      camX: 0,
      shakeX: 0,
      shakeY: 0,
      shakeTime: 0,
    },

    input: {
      left: false,
      right: false,
      jump: false,
      fire: false,
    },

    player: null,

    projectiles: [],
    fireCooldown: 0,

    enemies: [],
    playerHealth: 100,
    maxHealth: 100,
    lastHitTime: 0,
    invulnerableMs: 1000,

    coins: [],
    coinCount: 0,
    maxCoins: 0,
    killedEnemies: 0,
    thrownBottles: 0,

    bottleCount: 10,
    maxBottles: 10,
    groundBottles: [],

    endboss: null,
    bossHealth: 100,
    maxBossHealth: 100,
    bossActive: false,
    bossAreaShown: false,
    bossPhaseTextTime: 0,
    gameWon: false,

    audio: {
      bgMusic: null,
      coin: null,
      bottleCollect: null,
      throw: null,
      hurt: null,
      bossHit: null,
    },
  };

  /**
   * Lädt ein Bild.
   * @param {string} src - Bildpfad
   * @returns {Promise<HTMLImageElement>}
   */
  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Image failed: " + src));
      img.src = src;
    });
  }

  /**
   * Erstellt Audio.
   * @param {string} src - Audio-Pfad
   * @returns {HTMLAudioElement}
   */
  function createAudio(src) {
    const audio = new Audio(src);
    audio.preload = "auto";
    return audio;
  }

  /**
   * Gibt Screen API zurück.
   * @returns {object}
   */
  function getScreenApi() {
    if (window.Screen) {
      return window.Screen;
    }

    return {
      hideAll() {
        document
          .querySelectorAll(".game-screen")
          .forEach((el) => el.classList.add("d-none"));
      },
      showById(id) {
        this.hideAll();
        $(id)?.classList.remove("d-none");
      },
      overlay(on) {
        document
          .querySelector(".game-area")
          ?.classList.toggle("show-overlay", !!on);
      },
      setPauseIcon(paused) {
        const img = $("pause-img");
        if (!img) return;
        img.src = paused
          ? "img/10_controls/continue.png"
          : "img/10_controls/pause.png";
      },
      setSoundIcons(on) {
        document.querySelectorAll(".sound-img").forEach((img) => {
          img.src = on
            ? "img/10_controls/sound-on.png"
            : "img/10_controls/sound-off.png";
        });
      },
    };
  }

  /**
   * Prüft Canvas.
   * @returns {boolean}
   */
  function ensureCanvasReady() {
    App.canvas = $("canvas");
    if (!(App.canvas instanceof HTMLCanvasElement)) return false;

    App.ctx = App.canvas.getContext("2d");
    if (!App.ctx) return false;

    App.canvas.width = App.world.w;
    App.canvas.height = App.world.h;
    App.canvas.tabIndex = 0;
    App.canvas.style.outline = "none";

    return true;
  }

  /**
   * Initialisiert das Spiel.
   */
  function init() {
    if (!ensureCanvasReady()) {
      console.error("Canvas konnte nicht initialisiert werden.");
      return;
    }

    if (!App.player) {
      App.player = new Natur(60, App.world.groundY - 230);
    }

    if (!App.eventsBound) {
      bindKeyboard();
      bindMobile();
      window.addEventListener("resize", resizeCanvasToWindow);
      App.eventsBound = true;
    }

    resizeCanvasToWindow();

    const screens = getScreenApi();
    screens.hideAll();
    screens.showById("screen-start");
    screens.overlay(false);
    screens.setPauseIcon(false);
    screens.setSoundIcons(App.soundOn);
  }

  // Funktionen global verfügbar machen
  window.init = init;
  window.startLoading = startLoading;

  /**
   * Passt Canvas CSS an.
   */
  function resizeCanvasToWindow() {
    if (!App.canvas) return;
  }

  /**
   * Startet Loading Screen.
   */
  function startLoading() {
    if (App.running) return;

    const screens = getScreenApi();
    screens.showById("screen-loading");

    const btn = $("loading-btn");
    if (btn) btn.textContent = "Loading.....";

    setTimeout(startGame, 1000);
  }

  /**
   * Startet das Spiel.
   */
  async function startGame() {
    if (!ensureCanvasReady()) return;

    App.running = true;
    App.paused = false;

    const screens = getScreenApi();
    screens.hideAll();
    screens.overlay(false);
    screens.setPauseIcon(false);

    await ensureAssets();
    resetGameState();
    spawnClouds();
    spawnEnemies();
    spawnCoins();
    spawnGroundBottles();
    spawnEndboss();
    startBackgroundMusic();

    App.canvas.focus();

    if (App.rafId) cancelAnimationFrame(App.rafId);
    App.lastTime = performance.now();
    App.rafId = requestAnimationFrame(loop);
  }

  /**
   * Lädt Assets.
   */
  async function ensureAssets() {
    if (!ASSETS.sky) {
      try {
        ASSETS.sky = await loadImage(PATHS.bg.sky);
      } catch (_) {
        ASSETS.sky = null;
      }
    }

    if (!ASSETS.layer3) {
      try {
        ASSETS.layer3 = await loadImage(PATHS.bg.layer3);
      } catch (_) {
        ASSETS.layer3 = null;
      }
    }

    if (!ASSETS.layer2) {
      try {
        ASSETS.layer2 = await loadImage(PATHS.bg.layer2);
      } catch (_) {
        ASSETS.layer2 = null;
      }
    }

    if (!ASSETS.layer1) {
      try {
        ASSETS.layer1 = await loadImage(PATHS.bg.layer1);
      } catch (_) {
        ASSETS.layer1 = null;
      }
    }

    if (!ASSETS.playerIdle) {
      try {
        ASSETS.playerIdle = await loadImage(PATHS.idle);
      } catch (_) {
        ASSETS.playerIdle = null;
      }
    }

    if (ASSETS.playerWalk.length === 0) {
      for (const src of PATHS.walk) {
        try {
          ASSETS.playerWalk.push(await loadImage(src));
        } catch (_) {}
      }
    }

    ensureAudio();
  }

  /**
   * Initialisiert Audio.
   */
  function ensureAudio() {
    if (App.audio.bgMusic) return;

    App.audio.bgMusic = createAudio(PATHS.audio.bgMusic);
    App.audio.coin = createAudio(PATHS.audio.coin);
    App.audio.bottleCollect = createAudio(PATHS.audio.bottleCollect);
    App.audio.throw = createAudio(PATHS.audio.throw);
    App.audio.hurt = createAudio(PATHS.audio.hurt);
    App.audio.bossHit = createAudio(PATHS.audio.bossHit);

    App.audio.bgMusic.loop = true;
    App.audio.bgMusic.volume = 0.25;

    App.audio.coin.volume = 0.35;
    App.audio.bottleCollect.volume = 0.35;
    App.audio.throw.volume = 0.35;
    App.audio.hurt.volume = 0.35;
    App.audio.bossHit.volume = 0.35;

    applyMuteState();
  }

  /**
   * Setzt Mute-Zustand.
   */
  function applyMuteState() {
    const muted = !App.soundOn;

    Object.values(App.audio).forEach((audio) => {
      if (!audio) return;
      audio.muted = muted;
    });
  }

  /**
   * Spielt Sound sicher ab.
   * @param {HTMLAudioElement|null} audio - Audio
   */
  function safePlay(audio) {
    if (!audio || !App.soundOn) return;

    try {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch (_) {}
  }

  /**
   * Startet Hintergrundmusik.
   */
  function startBackgroundMusic() {
    if (!App.audio.bgMusic || !App.soundOn) return;
    App.audio.bgMusic.currentTime = 0;
    App.audio.bgMusic.play().catch(() => {});
  }

  /**
   * Stoppt Hintergrundmusik.
   */
  function stopBackgroundMusic() {
    if (!App.audio.bgMusic) return;
    App.audio.bgMusic.pause();
    App.audio.bgMusic.currentTime = 0;
  }

  /**
   * Setzt Spielzustand zurück.
   */
  function resetGameState() {
    if (!App.player) {
      App.player = new Natur(60, App.world.groundY - 210);
    }
    App.player.reset(App.world.groundY);

    App.world.camX = 0;
    App.projectiles = [];
    App.fireCooldown = 0;

    App.enemies = [];
    App.playerHealth = App.maxHealth;
    App.lastHitTime = 0;

    App.coins = [];
    App.coinCount = 0;
    App.maxCoins = 0;
    App.killedEnemies = 0;
    App.thrownBottles = 0;

    App.clouds = [];

    App.bottleCount = 10;
    App.maxBottles = 10;
    App.groundBottles = [];

    App.endboss = null;
    App.bossHealth = 100;
    App.maxBossHealth = 100;
    App.bossActive = false;
    App.bossAreaShown = false;
    App.bossPhaseTextTime = 0;
    App.gameWon = false;
  }
  /**
   * Erzeugt Endboss.
   */
  function spawnEndboss() {
    App.endboss = new Boss(App.world.levelW - 360, App.world.groundY - 280);

    App.bossHealth = 100;
    App.maxBossHealth = 100;
    App.bossActive = false;
  }

  /**
   * Erzeugt Coins.
   */
  function spawnCoins() {
    App.coins = [];

    const positions = [
      { x: 260, y: App.world.groundY - 120 },
      { x: 320, y: App.world.groundY - 165 },
      { x: 380, y: App.world.groundY - 120 },

      { x: 760, y: App.world.groundY - 100 },
      { x: 820, y: App.world.groundY - 140 },
      { x: 880, y: App.world.groundY - 180 },
      { x: 940, y: App.world.groundY - 140 },
      { x: 1000, y: App.world.groundY - 100 },

      { x: 1420, y: App.world.groundY - 120 },
      { x: 1500, y: App.world.groundY - 120 },

      { x: 1960, y: App.world.groundY - 110 },
      { x: 2020, y: App.world.groundY - 150 },
      { x: 2080, y: App.world.groundY - 110 },

      { x: 2550, y: App.world.groundY - 130 },
      { x: 2630, y: App.world.groundY - 170 },
      { x: 2710, y: App.world.groundY - 130 },
    ];

    positions.forEach((pos) => {
      App.coins.push(new Coin(pos.x, pos.y));
    });

    App.maxCoins = App.coins.length;
  }

  /**
   * Erzeugt Gegner.
   */
  function spawnEnemies() {
    App.enemies = [];

    const bigEnemies = [
      { x: 700, y: App.world.groundY - 75 },
      { x: 1500, y: App.world.groundY - 75 },
      { x: 2300, y: App.world.groundY - 75 },
    ];

    const smallEnemies = [
      { x: 1050, y: App.world.groundY - 42 },
      { x: 1850, y: App.world.groundY - 42 },
      { x: 2550, y: App.world.groundY - 42 },
    ];

    bigEnemies.forEach((pos) => {
      App.enemies.push(new Enemy(pos.x, pos.y, "big"));
    });

    smallEnemies.forEach((pos) => {
      App.enemies.push(new Enemy(pos.x, pos.y, "small"));
    });
  }

  /**
   * Erzeugt Bodenflaschen.
   */
  function spawnGroundBottles() {
    App.groundBottles = [];

    const positions = [
      { x: 320, y: App.world.groundY - 52 },
      { x: 520, y: App.world.groundY - 52 },
      { x: 760, y: App.world.groundY - 52 },
      { x: 980, y: App.world.groundY - 52 },
      { x: 1180, y: App.world.groundY - 52 },
      { x: 1380, y: App.world.groundY - 52 },
      { x: 1580, y: App.world.groundY - 52 },
      { x: 1780, y: App.world.groundY - 52 },
      { x: 1980, y: App.world.groundY - 52 },
      { x: 2180, y: App.world.groundY - 52 },
      { x: 2380, y: App.world.groundY - 52 },
      { x: 2580, y: App.world.groundY - 52 },
      { x: 2780, y: App.world.groundY - 52 },
      { x: 2950, y: App.world.groundY - 52 },
      { x: 3100, y: App.world.groundY - 52 },
    ];

    positions.forEach((pos) => {
      App.groundBottles.push(new GroundBottle(pos.x, pos.y));
    });
  }

  /**
   * Erzeugt Wolken.
   */
  function spawnClouds() {
    App.clouds = [
      new Cloud(0),
      new Cloud(900),
      new Cloud(1800),
      new Cloud(2700),
    ];
  }

  /**
   * Hauptloop.
   * @param {number} now - Zeitstempel
   */
  function loop(now) {
    if (!App.running) return;

    let dtMs = now - App.lastTime;
    App.lastTime = now;
    dtMs = Math.min(40, Math.max(8, dtMs || 16));

    const dtSec = dtMs / 1000;

    if (!App.paused) {
      update(dtMs, dtSec);
    }

    render();
    App.rafId = requestAnimationFrame(loop);
  }

  /**
   * Update pro Frame.
   * @param {number} dtMs - Delta ms
   * @param {number} dtSec - Delta sec
   */
  function update(dtMs, dtSec) {
    const introInput =
      App.player && App.player.isIntroDropping
        ? { left: false, right: false, jump: false, fire: false }
        : App.input;

    App.player.update(dtMs, dtSec, introInput, App.world, ASSETS);
    updateCamera(App.world, App.player);

    if (App.player.isIntroDropping) {
      return;
    }

    updateClouds(dtSec);
    updateScreenShake(dtSec);
    updateBottleThrow(dtSec);
    updateProjectiles(dtSec);
    updateEnemies(dtMs, dtSec);
    updateEndboss(dtMs, dtSec);
    updateCoins(dtMs);
    updateGroundBottles(dtMs);
    handleBottleEnemyHits();
    handleBottleBossHits();
    checkPlayerEnemyHits(nowMs());
    checkPlayerBossHit(nowMs());
    checkCoinCollection();
    checkBottleCollection();
  }

  /**
   * Aktualisiert Screen Shake.
   * @param {number} dtSec - Delta sec
   */
  function updateScreenShake(dtSec) {
    if (App.world.shakeTime > 0) {
      App.world.shakeTime -= dtSec;
      App.world.shakeX = (Math.random() - 0.5) * 10;
      App.world.shakeY = (Math.random() - 0.5) * 10;
      return;
    }

    App.world.shakeTime = 0;
    App.world.shakeX = 0;
    App.world.shakeY = 0;
  }

  /**
   * Aktualisiert Bottle-Wurf.
   * @param {number} dtSec - Delta sec
   */
  function updateBottleThrow(dtSec) {
    if (App.fireCooldown > 0) {
      App.fireCooldown -= dtSec;
    }

    if (!App.input.fire || App.fireCooldown > 0 || App.bottleCount <= 0) {
      return;
    }

    throwBottle();
    App.player.startThrow();
    safePlay(App.audio.throw);
    App.bottleCount -= 1;
    App.thrownBottles += 1;
    App.fireCooldown = 0.35;
  }

  /**
   * Erzeugt Projektil.
   */
  function throwBottle() {
    const p = App.player;

    App.projectiles.push(
      new Bottle(
        p.x + (p.facing === 1 ? p.w - 18 : -18),
        p.y + p.h * 0.52,
        p.facing,
      ),
    );
  }

  /**
   * Aktualisiert Projektile.
   * @param {number} dtSec - Delta sec
   */
  function updateProjectiles(dtSec) {
    App.projectiles.forEach((bottle) => {
      bottle.update(dtSec, App.world);
    });

    App.projectiles = App.projectiles.filter((bottle) => !bottle.dead);
  }

  /**
   * Aktualisiert Wolken.
   * @param {number} dtSec - Delta sec
   */
  function updateClouds(dtSec) {
    App.clouds.forEach((cloud) => {
      cloud.update(dtSec, App.world);
    });
  }

  /**
   * Zeichnet Projektile.
   * @param {CanvasRenderingContext2D} ctx - Context
   */
  function drawProjectiles(ctx) {
    App.projectiles.forEach((bottle) => {
      bottle.draw(ctx);
    });
  }

  /**
   * Aktualisiert Gegner.
   * @param {number} dtMs - Delta ms
   * @param {number} dtSec - Delta sec
   */
  function updateEnemies(dtMs, dtSec) {
    App.enemies.forEach((enemy) => {
      enemy.update(dtMs, dtSec, App.world);
    });

    App.enemies = App.enemies.filter((enemy) => !enemy.removable);
  }

  /**
   * Aktualisiert Endboss.
   * @param {number} dtMs - Delta ms
   * @param {number} dtSec - Delta sec
   */
  function updateEndboss(dtMs, dtSec) {
    const boss = App.endboss;
    if (!boss) return;

    const wasActive = boss.active;
    const wasPhaseTwo = boss.phaseTwo;

    boss.update(dtMs, dtSec, App.world, App.player, App.bossHealth);
    App.bossActive = boss.active;

    if (!wasActive && boss.active) {
      App.bossAreaShown = true;
    }

    if (!wasPhaseTwo && boss.phaseTwo) {
      App.bossPhaseTextTime = 2;
    }

    if (App.bossPhaseTextTime > 0) {
      App.bossPhaseTextTime -= dtSec;
    }
  }

  /**
   * Aktualisiert Coins.
   * @param {number} dtMs - Delta ms
   */
  function updateCoins(dtMs) {
    App.coins.forEach((coin) => {
      coin.update(dtMs);
    });
  }

  /**
   * Aktualisiert Bodenflaschen.
   * @param {number} dtMs - Delta ms
   */
  function updateGroundBottles(dtMs) {
    App.groundBottles.forEach((bottle) => {
      bottle.update(dtMs);
    });
  }

  /**
   * Bottle vs Enemy.
   */
  function handleBottleEnemyHits() {
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

  /**
   * Bottle vs Boss.
   */
  function handleBottleBossHits() {
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
   * Player vs Enemy.
   * @param {number} currentTime - Zeit
   */
  function checkPlayerEnemyHits(currentTime) {
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

  /**
   * Player vs Boss.
   * @param {number} currentTime - Zeit
   */
  function checkPlayerBossHit(currentTime) {
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

  /**
   * Coin einsammeln.
   */
  function checkCoinCollection() {
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
   * Bottle einsammeln.
   */
  function checkBottleCollection() {
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

  /**
   * Rendert alles.
   */
  function render() {
    if (!App.ctx) return;

    const ctx = App.ctx;
    ctx.clearRect(0, 0, App.world.w, App.world.h);

    drawBackground(ctx);

    ctx.save();
    ctx.translate(-App.world.camX, 0);

    drawClouds(ctx);
    drawGround(ctx);
    drawShadows(ctx);
    drawCoins(ctx);
    drawGroundBottles(ctx);
    drawPlayer(ctx);
    drawEnemies(ctx);
    drawEndboss(ctx);
    drawProjectiles(ctx);

    ctx.restore();

    drawHUD(ctx);
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.restore();

    drawHUD(ctx);
    drawBossAreaText(ctx);
    drawBossPhaseText(ctx);
    drawDamageOverlay(ctx);

    if (App.paused) {
      drawPauseOverlay(ctx);
    }
  }

  /**
   * Zeichnet Hintergrund.
   * @param {CanvasRenderingContext2D} ctx - Context
   */
  function drawBackground(ctx) {
    if (!ASSETS.sky && !ASSETS.layer3 && !ASSETS.layer2 && !ASSETS.layer1) {
      ctx.fillStyle = "#87ceeb";
      ctx.fillRect(0, 0, App.world.w, App.world.h);
      return;
    }

    drawParallaxLayer(ctx, ASSETS.sky, 0.15);
    drawParallaxLayer(ctx, ASSETS.layer3, 0.35);
    drawParallaxLayer(ctx, ASSETS.layer2, 0.55);
    drawParallaxLayer(ctx, ASSETS.layer1, 0.8);
  }

  /**
   * Zeichnet Wolken.
   * @param {CanvasRenderingContext2D} ctx - Context
   */
  function drawClouds(ctx) {
    App.clouds.forEach((cloud) => {
      cloud.draw(ctx);
    });
  }

  /**
   * Zeichnet Parallax-Layer.
   * @param {CanvasRenderingContext2D} ctx - Context
   * @param {HTMLImageElement|null} img - Bild
   * @param {number} speedFactor - Geschwindigkeitsfaktor
   */
  function drawParallaxLayer(ctx, img, speedFactor) {
    if (!img || !img.complete || img.naturalWidth === 0) {
      return;
    }

    const imgW = App.world.w;
    const imgH = App.world.h;
    const offset = -(App.world.camX * speedFactor) % imgW;

    ctx.drawImage(img, offset, 0, imgW, imgH);
    ctx.drawImage(img, offset + imgW, 0, imgW, imgH);
    ctx.drawImage(img, offset - imgW, 0, imgW, imgH);
  }

  /**
   * Zeichnet Boden.
   * @param {CanvasRenderingContext2D} ctx - Context
   */
  function drawGround(ctx) {
    const groundY = App.world.groundY;

    // Hauptboden
    ctx.fillStyle = "rgba(214, 170, 95, 0.55)";
    ctx.fillRect(0, groundY, App.world.levelW, App.world.h - groundY);

    // dunklere obere Bodenkante
    ctx.fillStyle = "rgba(120, 82, 36, 0.35)";
    ctx.fillRect(0, groundY, App.world.levelW, 8);

    // leichte Sandlinie
    ctx.fillStyle = "rgba(255, 226, 163, 0.22)";
    ctx.fillRect(0, groundY + 10, App.world.levelW, 4);
  }

  /**
   * Zeichnet Coins.
   * @param {CanvasRenderingContext2D} ctx - Context
   */
  function drawCoins(ctx) {
    App.coins.forEach((coin) => {
      if (!coin.collected) {
        coin.draw(ctx);
      }
    });
  }

  /**
   * Zeichnet Schatten unter Figuren und Objekten.
   * @param {CanvasRenderingContext2D} ctx - Context
   */
  function drawShadows(ctx) {
    drawEntityShadow(ctx, App.player, 0.32);

    App.enemies.forEach((enemy) => {
      if (!enemy.dead) {
        drawEntityShadow(ctx, enemy, 0.28);
      }
    });

    if (App.endboss && !App.endboss.dead) {
      drawEntityShadow(ctx, App.endboss, 0.42);
    }

    App.groundBottles.forEach((bottle) => {
      if (!bottle.collected) {
        drawEntityShadow(ctx, bottle, 0.22);
      }
    });

    App.coins.forEach((coin) => {
      if (!coin.collected) {
        drawEntityShadow(ctx, coin, 0.16);
      }
    });
  }

  /**
   * Zeichnet Schatten für ein Objekt.
   * @param {CanvasRenderingContext2D} ctx - Context
   * @param {object} obj - Objekt
   * @param {number} scale - Schattenbreite
   */
  function drawEntityShadow(ctx, obj, scale) {
    if (!obj) return;

    const groundDistance = Math.max(0, App.world.groundY - (obj.y + obj.h));
    const liftFactor = Math.min(1, groundDistance / 180);

    const shadowW = obj.w * (scale - liftFactor * 0.08);
    const shadowH = Math.max(6, obj.h * (0.08 - liftFactor * 0.025));
    const shadowX = obj.x + obj.w / 2 - shadowW / 2;
    const shadowY = App.world.groundY + 6 - liftFactor * 10;

    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${0.18 - liftFactor * 0.08})`;
    ctx.beginPath();
    ctx.ellipse(
      shadowX + shadowW / 2,
      shadowY,
      shadowW / 2,
      shadowH / 2,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.restore();
  }

  /**
   * Zeichnet Bodenflaschen.
   * @param {CanvasRenderingContext2D} ctx - Context
   */
  function drawGroundBottles(ctx) {
    App.groundBottles.forEach((bottle) => {
      if (!bottle.collected) {
        bottle.draw(ctx);
      }
    });
  }

  /**
   * Zeichnet Spieler.
   * @param {CanvasRenderingContext2D} ctx - Context
   */
  function drawPlayer(ctx) {
    App.player.draw(ctx, ASSETS);
  }

  /**
   * Zeichnet Gegner.
   * @param {CanvasRenderingContext2D} ctx - Context
   */
  function drawEnemies(ctx) {
    App.enemies.forEach((enemy) => {
      if (!enemy.dead) {
        enemy.draw(ctx);
      }
    });
  }

  /**
   * Zeichnet Endboss.
   * @param {CanvasRenderingContext2D} ctx - Context
   */
  function drawEndboss(ctx) {
    const boss = App.endboss;
    if (!boss || boss.dead) return;

    boss.draw(ctx);
  }

  /**
   * Zeichnet HUD mit Icons.
   * @param {CanvasRenderingContext2D} ctx - Context
   */
  function drawHUD(ctx) {
    drawHealthHUD(ctx);
    drawCoinHUD(ctx);
    drawBottleHUD(ctx);
  }

  function drawHealthHUD(ctx) {
    const x = 20;
    const y = 20;

    // Icon
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(x, y, 28, 20);

    // Bar Hintergrund
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(x + 40, y, 160, 20);

    // Bar Inhalt
    const ratio = App.playerHealth / App.maxHealth;
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(x + 40, y, 160 * ratio, 20);

    ctx.strokeStyle = "#fff";
    ctx.strokeRect(x + 40, y, 160, 20);
  }

  function drawCoinHUD(ctx) {
    const x = 20;
    const y = 55;

    // Coin Kreis
    ctx.fillStyle = "#f1c40f";
    ctx.beginPath();
    ctx.arc(x + 10, y + 10, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = "18px Arial";
    ctx.fillText(`x ${App.coinCount}`, x + 30, y + 16);
  }

  function drawBottleHUD(ctx) {
    const x = 20;
    const y = 90;

    // Bottle Icon
    ctx.fillStyle = "#27ae60";
    ctx.fillRect(x, y, 12, 18);

    ctx.fillStyle = "#d35400";
    ctx.fillRect(x + 3, y - 6, 6, 6);
    ctx.fillStyle = "#fff";
    ctx.font = "18px Arial";
    ctx.fillText(`x ${App.bottleCount}`, x + 20, y + 16);
  }

  /**
   * Zeichnet Healthbar.
   * @param {CanvasRenderingContext2D} ctx - Context
   */
  function drawHealthBar(ctx) {
    const x = 20;
    const y = 20;
    const w = 200;
    const h = 18;
    const ratio = App.playerHealth / App.maxHealth;
    const percent = Math.round(ratio * 100);

    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(x, y, w * ratio, h);

    ctx.strokeStyle = "#ffffff";
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = "#ffffff";
    ctx.font = "14px Arial";
    ctx.fillText(`${percent}%`, x + w + 10, y + 14);
  }

  /**
   * Zeichnet Coinbar.
   * @param {CanvasRenderingContext2D} ctx - Context
   */
  function drawCoinBar(ctx) {
    const x = 20;
    const y = 60;
    ctx.fillStyle = "#f1c40f";
    ctx.beginPath();
    ctx.arc(x + 10, y - 10, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#d4ac0d";
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px Arial";
    ctx.fillText(`x ${App.coinCount}`, x + 25, y - 5);
  }

  /**
   * Zeichnet Bottlebar.
   * @param {CanvasRenderingContext2D} ctx - Context
   */
  function drawBottleBar(ctx) {
    const x = 20;
    const y = 95;
    ctx.fillStyle = "#27ae60";
    ctx.fillRect(x, y - 18, 12, 18);

    ctx.fillStyle = "#d35400";
    ctx.fillRect(x + 3, y - 24, 6, 6);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px Arial";
    ctx.fillText(`x ${App.bottleCount}`, x + 20, y - 5);
  }

  /**
   * Zeichnet Boss-Area Text.
   * @param {CanvasRenderingContext2D} ctx - Context
   */
  function drawBossAreaText(ctx) {
    if (!App.bossActive || App.gameWon || !App.bossAreaShown) return;

    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(App.world.w / 2 - 110, 55, 220, 32);

    ctx.fillStyle = "#ffffff";
    ctx.font = "18px Arial";
    ctx.textAlign = "center";
    ctx.fillText("BOSS AREA", App.world.w / 2, 77);
    ctx.restore();
  }

  /**
   * Zeichnet Boss-Phase-2 Text.
   * @param {CanvasRenderingContext2D} ctx - Context
   */
  function drawBossPhaseText(ctx) {
    if (App.bossPhaseTextTime <= 0) return;

    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(App.world.w / 2 - 150, 100, 300, 40);

    ctx.fillStyle = "#ff7675";
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "center";
    ctx.fillText("BOSS PHASE 2!", App.world.w / 2, 128);
    ctx.restore();
  }

  /**
   * Zeichnet Damage-Overlay.
   * @param {CanvasRenderingContext2D} ctx - Context
   */
  function drawDamageOverlay(ctx) {
    const sinceHit = nowMs() - App.lastHitTime;
    if (sinceHit > 120) return;

    ctx.fillStyle = "rgba(255, 0, 0, 0.15)";
    ctx.fillRect(0, 0, App.world.w, App.world.h);
  }

  /**
   * Zeichnet Pause Overlay.
   * @param {CanvasRenderingContext2D} ctx - Context
   */
  function drawPauseOverlay(ctx) {
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(0, 0, App.world.w, App.world.h);
    ctx.fillStyle = "#fff";
    ctx.font = "22px system-ui, sans-serif";
    ctx.fillText("PAUSED", App.world.w / 2 - 45, App.world.h / 2);
  }

  /**
   * Setzt Endscreen Statistik.
   * @param {string} screenId - Screen ID
   */
  function setEndStats(screenId) {
    const screen = $(screenId);
    if (!screen) return;

    let stats = screen.querySelector(".end-stats");

    if (!stats) {
      stats = document.createElement("div");
      stats.className = "end-stats";
      screen.appendChild(stats);
    }

    stats.innerHTML = `
    <p>Coins: ${App.coinCount} / ${App.maxCoins}</p>
    <p>Kills: ${App.killedEnemies}</p>
    <p>Thrown Bottles: ${App.thrownBottles}</p>
    <p>Boss HP Left: ${App.bossHealth}</p>
  `;
  }

  /**
   * Bindet Keyboard.
   */
  function bindKeyboard() {
    window.addEventListener("keydown", onKeyDown, { capture: true });
    window.addEventListener("keyup", onKeyUp, { capture: true });
    window.addEventListener("blur", resetInput);
  }

  /**
   * Keydown.
   * @param {KeyboardEvent} e - Event
   */
  function onKeyDown(e) {
    const c = e.code;

    if (
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"].includes(c)
    ) {
      e.preventDefault();
    }

    if (c === "ArrowLeft" || c === "KeyA") App.input.left = true;
    if (c === "ArrowRight" || c === "KeyD") App.input.right = true;
    if (c === "Space" || c === "KeyW" || c === "ArrowUp") App.input.jump = true;
    if (c === "KeyJ") App.input.fire = true;
  }

  /**
   * Keyup.
   * @param {KeyboardEvent} e - Event
   */
  function onKeyUp(e) {
    const c = e.code;

    if (c === "ArrowLeft" || c === "KeyA") App.input.left = false;
    if (c === "ArrowRight" || c === "KeyD") App.input.right = false;
    if (c === "Space" || c === "KeyW" || c === "ArrowUp")
      App.input.jump = false;
    if (c === "KeyJ") App.input.fire = false;
  }

  /**
   * Resetet Input.
   */
  function resetInput() {
    App.input.left = false;
    App.input.right = false;
    App.input.jump = false;
    App.input.fire = false;
  }

  /**
   * Bindet Mobile Buttons.
   */
  function bindMobile() {
    const buttons = document.querySelectorAll(".mobile-control-btn");

    buttons.forEach((btn) => {
      const press = (e) => {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
        setMobileInput(btn.id, true);
      };

      const release = (e) => {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
        setMobileInput(btn.id, false);
      };

      btn.addEventListener("pointerdown", press, { passive: false });
      btn.addEventListener("pointerup", release, { passive: false });
      btn.addEventListener("pointercancel", release, { passive: false });
      btn.addEventListener("pointerleave", release, { passive: false });

      btn.addEventListener("touchstart", press, { passive: false });
      btn.addEventListener("touchend", release, { passive: false });
      btn.addEventListener("touchcancel", release, { passive: false });

      btn.addEventListener("mousedown", press);
      btn.addEventListener("mouseup", release);
      btn.addEventListener("mouseleave", release);
    });
  }

  /**
   * Setzt Mobile Input.
   * @param {string} id - Button ID
   * @param {boolean} down - Status
   */
  function setMobileInput(id, down) {
    if (id === "mobile-left") App.input.left = down;
    if (id === "mobile-right") App.input.right = down;
    if (id === "mobile-jump") App.input.jump = down;
    if (id === "mobile-throw") App.input.fire = down;
  }

  /**
   * Pausiert oder setzt fort.
   */
  function pauseGame() {
    if (!App.running) return;

    App.paused = !App.paused;
    getScreenApi().setPauseIcon(App.paused);

    if (App.paused) {
      stopBackgroundMusic();
    } else {
      startBackgroundMusic();
    }
  }

  /**
   * Zeigt Confirm Screen.
   */
  function quitGame() {
    if (!App.running) return;

    App.paused = true;
    getScreenApi().setPauseIcon(true);
    getScreenApi().showById("confirm-dialog");
    getScreenApi().overlay(true);
    stopBackgroundMusic();
  }

  /**
   * Setzt fort.
   */
  function resumeGame() {
    $("confirm-dialog")?.classList.add("d-none");
    getScreenApi().overlay(false);
    App.paused = false;
    getScreenApi().setPauseIcon(false);
    startBackgroundMusic();
  }

  /**
   * Zurück zum Startscreen.
   */
  function goBackToHome() {
    App.running = false;

    if (App.rafId) {
      cancelAnimationFrame(App.rafId);
    }

    stopBackgroundMusic();
    getScreenApi().overlay(false);
    getScreenApi().setPauseIcon(false);
    getScreenApi().showById("screen-start");
    resetGameState();
  }

  /**
   * Restart.
   */
  function playAgain() {
    startGame();
  }

  /**
   * Sound an/aus.
   */
  function enableSound() {
    App.soundOn = !App.soundOn;
    localStorage.setItem("soundOn", String(App.soundOn));

    applyMuteState();
    getScreenApi().setSoundIcons(App.soundOn);

    if (App.soundOn) {
      startBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }
  }

  /**
   * Game Over.
   */
  function loseGame() {
    App.running = false;

    if (App.rafId) {
      cancelAnimationFrame(App.rafId);
    }

    stopBackgroundMusic();
    setEndStats("screen-end-lose");
    getScreenApi().showById("screen-end-lose");
    getScreenApi().overlay(true);

    document
      .querySelectorAll("#screen-end-lose button")
      .forEach((btn) => btn.classList.remove("d-none"));
  }

  /**
   * Game Won.
   */
  function winGame() {
    App.running = false;
    App.gameWon = true;

    if (App.rafId) {
      cancelAnimationFrame(App.rafId);
    }

    stopBackgroundMusic();
    setEndStats("screen-end-win");
    getScreenApi().showById("screen-end-win");
    getScreenApi().overlay(true);

    document
      .querySelectorAll("#screen-end-win button")
      .forEach((btn) => btn.classList.remove("d-none"));
  }

  /**
   * Fullscreen.
   */
  function toggleFullScreen() {
    const elem = $("fullscreen") || document.body;

    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      elem.requestFullscreen?.();
    }

    setTimeout(resizeCanvasToWindow, 300);
  }

  /**
   * Prüft Damage Cooldown.
   * @param {number} currentTime - Zeit
   * @returns {boolean}
   */
  function canTakeDamage(currentTime) {
    return currentTime - App.lastHitTime > App.invulnerableMs;
  }

  /**
   * Aktuelle Zeit.
   * @returns {number}
   */
  function nowMs() {
    return performance.now();
  }

  window.init = init;
  window.startLoading = startLoading;
  window.startGame = startGame;
  window.pauseGame = pauseGame;
  window.quitGame = quitGame;
  window.resumeGame = resumeGame;
  window.goBackToHome = goBackToHome;
  window.playAgain = playAgain;
  window.enableSound = enableSound;
  window.toggleFullScreen = toggleFullScreen;
})();
