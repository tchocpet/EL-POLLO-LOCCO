let App;
let ASSETS;
let PATHS;

/**
 * Initializes the game module state and registers the public API.
 */
function initGameModule() {
  App = createAppState();
  ASSETS = createAssetState();
  PATHS = createPathState();
  registerGlobalApi();
}

/**
 * Creates the main application state object.
 *
 * @returns {object}
 */
function createAppState() {
  return {
    running: false,
    paused: false,
    eventsBound: false,
    rafId: null,
    lastTime: 0,
    soundOn: localStorage.getItem("soundOn") === "true",
    canvas: null,
    ctx: null,
    world: createWorldState(),
    input: createInputState(),
    player: null,
    audio: createAudioState(),
    gameWon: false,
    walkSoundCooldown: 0,
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
    bottleCount: 0,
    maxBottles: 10,
    groundBottles: [],
    clouds: [],
    endboss: null,
    bossHealth: 100,
    maxBossHealth: 100,
    bossActive: false,
    bossAreaShown: false,
    bossPhaseTextTime: 0,
  };
}

/**
 * Creates the world state object.
 *
 * @returns {object}
 */
function createWorldState() {
  return {
    w: 720,
    h: 480,
    levelW: 3200,
    groundY: 432,
    camX: 0,
    shakeX: 0,
    shakeY: 0,
    shakeTime: 0,
  };
}

/**
 * Creates the input state object.
 *
 * @returns {{left:boolean,right:boolean,jump:boolean,fire:boolean}}
 */
function createInputState() {
  return {
    left: false,
    right: false,
    jump: false,
    fire: false,
  };
}

/**
 * Creates the audio state object.
 *
 * @returns {object}
 */
function createAudioState() {
  return {
    bgMusic: null,
    coin: null,
    bottleCollect: null,
    throw: null,
    hurt: null,
    bossHit: null,
    walk: null,
  };
}

/**
 * Creates the asset state object.
 *
 * @returns {object}
 */
function createAssetState() {
  return {
    playerWalk: [],
    playerIdle: null,
    fullBackground: null,
  };
}

/**
 * Creates the path configuration object.
 *
 * @returns {object}
 */
function createPathState() {
  return {
    bg: {
      full: "img/5_background/complete_background.png",
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
      walk: "audio/running.wav",
    },
  };
}

/**
 * Registers the public API on the global window object.
 */
function registerGlobalApi() {
  window.init = init;
  window.initApp = initApp;
  window.startLoading = startLoading;
  window.startGame = startGame;
  window.pauseGame = pauseGame;
  window.quitGame = quitGame;
  window.resumeGame = resumeGame;
  window.goBackToHome = goBackToHome;
  window.playAgain = playAgain;
  window.enableSound = enableSound;
  window.toggleFullScreen = toggleFullScreen;
  window.loseGame = loseGame;
  window.winGame = winGame;
  window.canTakeDamage = canTakeDamage;
  window.safePlay = safePlay;
  window.applyDamage = applyDamage;
  window.stopGameForRotate = stopGameForRotate;
  window.isGameRunning = isGameRunning;
}
