/**
 * Initializes the Natur module and registers its public API.
 */
function initNaturModule() {
  registerNaturApi();
}

/**
 * Registers the Natur class on the global window object.
 */
function registerNaturApi() {
  window.Natur = createNaturClass();
}

/**
 * Creates the Natur class.
 *
 * @returns {typeof Natur}
 */
function createNaturClass() {
  return class Natur {
    /**
     * Creates a new player character instance.
     *
     * @param {number} x - Start x position.
     * @param {number} y - Start y position.
     */
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.w = 170;
      this.h = 230;
      this.vx = 0;
      this.vy = 0;
      this.onGround = false;
      this.facing = 1;
      this.speed = 330;
      this.gravity = 1100;
      this.jumpVelocity = 500;
      this.idleTime = 0;
      this.sleepMode = false;
      this.sleepFloat = 0;
      this.sleepWave = 0;
      this.hurtTime = 0;
      this.throwTime = 0;
      this.isIntroDropping = false;
      this.introDone = false;
      this.anim = createNaturAnimationState();
      this.images = createNaturImageState();
      loadNaturImages(this);
    }

    /**
     * Resets the player to the initial state.
     *
     * @param {number} groundY - Ground y position.
     */
    reset(groundY) {
      resetNaturPosition(this);
      resetNaturVelocity(this);
      resetNaturStateFlags(this);
      resetNaturTimers(this);
      resetNaturAnimation(this);
      void groundY;
    }

    /**
     * Updates the player for one frame.
     *
     * @param {number} dtMs - Delta time in milliseconds.
     * @param {number} dtSec - Delta time in seconds.
     * @param {object} input - Input state.
     * @param {object} world - World state.
     * @param {object} assets - Asset collection.
     */
    update(dtMs, dtSec, input, world, assets) {
      if (this.isIntroDropping) {
        updateNaturIntro(this, dtMs, dtSec, world, assets);
        return;
      }

      updateNaturActionTimers(this, dtSec);
      updateNaturSleepMotion(this, dtSec);
      updateNaturIdleState(this, dtSec, input);
      updateNaturMovement(this, dtSec, input, world);
      updateNaturAnimation(this, dtMs, assets);
    }

    /**
     * Sets the player to hurt state.
     */
    takeHit() {
      this.hurtTime = 0.35;
      this.anim.hurtFrame = 0;
      this.anim.hurtTimer = 0;
    }

    /**
     * Sets the player to throw state.
     */
    startThrow() {
      this.throwTime = 0.3;
      this.anim.throwFrame = 0;
      this.anim.throwTimer = 0;
    }

    /**
     * Draws the player.
     *
     * @param {CanvasRenderingContext2D} ctx - Canvas context.
     * @param {object} assets - Asset collection.
     */
    draw(ctx, assets) {
      const image = getCurrentNaturImage(this, assets);

      if (!image) {
        drawNaturFallback(this, ctx);
        return;
      }

      drawNaturSprite(this, ctx, image);
      drawNaturSleepText(this, ctx);
    }
  };
}

/**
 * Creates the animation state object.
 *
 * @returns {object}
 */
function createNaturAnimationState() {
  return {
    walkFrame: 0,
    walkTimer: 0,
    walkFps: 10,
    jumpFrame: 0,
    jumpTimer: 0,
    jumpFps: 8,
    hurtFrame: 0,
    hurtTimer: 0,
    hurtFps: 8,
    throwFrame: 0,
    throwTimer: 0,
    throwFps: 10,
    sleepFrame: 0,
    sleepTimer: 0,
    sleepFps: 6,
  };
}

/**
 * Creates the image state object.
 *
 * @returns {object}
 */
function createNaturImageState() {
  return {
    walk: [],
    jump: [],
    hurt: [],
    throw: [],
    idle: null,
    sleep: [],
  };
}
