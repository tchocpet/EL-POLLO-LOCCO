/**
 * Initializes the boss module and registers its public API.
 */
function initBossModule() {
  registerBossApi();
}

/**
 * Registers the Boss class on the global window object.
 */
function registerBossApi() {
  window.Boss = createBossClass();
}

/**
 * Creates the Boss class.
 *
 * @returns {typeof Boss}
 */
function createBossClass() {
  return class Boss {
    /**
     * Creates a new boss instance.
     *
     * @param {number} x - Start x position.
     * @param {number} y - Start y position.
     */
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.w = 280;
      this.h = 280;
      this.vx = -90;
      this.dead = false;
      this.removable = false;
      this.hurt = false;
      this.facing = -1;
      this.frame = 0;
      this.animT = 0;
      this.deadTime = 0;
      this.hurtTime = 0;
      this.active = false;
      this.phaseTwo = false;
      this.attackCooldown = 0;
      this.rushTime = 0;
      this.isRushing = false;
      this.offset = createBossOffset();
      this.walkImages = [];
      this.hurtImages = [];
      this.deadImages = [];
      loadBossImages(this);
    }

    /**
     * Updates the boss state for one frame.
     *
     * @param {number} dtMs - Delta time in milliseconds.
     * @param {number} dtSec - Delta time in seconds.
     * @param {object} world - World state.
     * @param {object} player - Player state.
     * @param {number} health - Boss health.
     */
    update(dtMs, dtSec, world, player, health) {
      if (isBossDeadState(this, dtMs, dtSec)) return;
      updateAliveBossState(this, dtMs, dtSec, world, player, health);
    }

    /**
     * Sets the boss to hurt state.
     */
    takeHit() {
      if (this.dead) return;
      this.hurt = true;
      this.hurtTime = 0.35;
    }

    /**
     * Kills the boss.
     */
    die() {
      if (this.dead) return;
      this.dead = true;
      this.vx = 0;
      this.deadTime = 0;
      this.isRushing = false;
      this.hurt = false;
    }

    /**
     * Draws the boss.
     *
     * @param {CanvasRenderingContext2D} ctx - Canvas context.
     */
    draw(ctx) {
      const image = getCurrentBossImage(this);

      if (!isBossImageDrawable(image)) {
        drawBossFallback(this, ctx);
        return;
      }

      drawBossSprite(this, ctx, image);
    }
  };
}

/**
 * Creates the boss hitbox offset object.
 *
 * @returns {{top:number,left:number,right:number,bottom:number}}
 */
function createBossOffset() {
  return {
    top: 70,
    left: 40,
    right: 40,
    bottom: 25,
  };
}
