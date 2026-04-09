"use strict";

/**
 * Player character.
 */
class Natur {
  /**
   * @param {number} x - Start position X
   * @param {number} y - Start position Y
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

    this.anim = {
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
    };

    this.images = {
      walk: [],
      jump: [],
      hurt: [],
      throw: [],
      idle: null,
      sleep: null,
    };

    this.loadImages();
  }

  /**
   * Loads images.
   */
  loadImages() {
    const walkPaths = [
      "img/2_character_pepe/2_walk/W-21.png",
      "img/2_character_pepe/2_walk/W-22.png",
      "img/2_character_pepe/2_walk/W-23.png",
      "img/2_character_pepe/2_walk/W-24.png",
      "img/2_character_pepe/2_walk/W-25.png",
      "img/2_character_pepe/2_walk/W-26.png",
    ];

    const jumpPaths = [
      "img/2_character_pepe/3_jump/J-31.png",
      "img/2_character_pepe/3_jump/J-32.png",
      "img/2_character_pepe/3_jump/J-33.png",
      "img/2_character_pepe/3_jump/J-34.png",
      "img/2_character_pepe/3_jump/J-35.png",
      "img/2_character_pepe/3_jump/J-36.png",
      "img/2_character_pepe/3_jump/J-37.png",
      "img/2_character_pepe/3_jump/J-38.png",
      "img/2_character_pepe/3_jump/J-39.png",
    ];

    const hurtPaths = [
      "img/2_character_pepe/4_hurt/H-41.png",
      "img/2_character_pepe/4_hurt/H-42.png",
      "img/2_character_pepe/4_hurt/H-43.png",
    ];

    const throwPaths = [
      "img/2_character_pepe/2_walk/W-21.png",
      "img/2_character_pepe/2_walk/W-22.png",
      "img/2_character_pepe/2_walk/W-23.png",
    ];

    walkPaths.forEach((src) => {
      const img = new Image();
      img.src = src;
      this.images.walk.push(img);
    });

    jumpPaths.forEach((src) => {
      const img = new Image();
      img.src = src;
      this.images.jump.push(img);
    });

    hurtPaths.forEach((src) => {
      const img = new Image();
      img.src = src;
      this.images.hurt.push(img);
    });

    throwPaths.forEach((src) => {
      const img = new Image();
      img.src = src;
      this.images.throw.push(img);
    });

    this.images.idle = new Image();
    this.images.idle.src = "img/2_character_pepe/1_idle/idle/I-1.png";

    this.images.sleep = new Image();
    this.images.sleep.src = "img/2_character_pepe/1_idle/long_idle/I-11.png";
  }

  /**
   * Resets the player character.
   * @param {number} groundY - Ground height
   */
  reset(groundY) {
    this.x = 60;
    this.y = -this.h - 40;

    this.vx = 0;
    this.vy = 0;

    this.onGround = false;
    this.isIntroDropping = true;
    this.introDone = false;
    this.facing = 1;

    this.idleTime = 0;
    this.sleepMode = false;
    this.hurtTime = 0;
    this.throwTime = 0;

    this.sleepFloat = 0;
    this.sleepWave = 0;

    this.anim.walkFrame = 0;
    this.anim.walkTimer = 0;
    this.anim.jumpFrame = 0;
    this.anim.jumpTimer = 0;
    this.anim.hurtFrame = 0;
    this.anim.hurtTimer = 0;
    this.anim.throwFrame = 0;
    this.anim.throwTimer = 0;
  }

  /**
   * Updates the intro drop sequence.
   * @param {number} dtSec - Delta time in seconds
   * @param {object} world - World object
   */
  updateIntro(dtSec, world) {
    if (!this.isIntroDropping) {
      return;
    }

    const floorY = world.groundY - this.h;

    this.vy += this.gravity * dtSec;
    this.y += this.vy * dtSec;

    if (this.y < floorY) {
      return;
    }

    this.y = floorY;
    this.vy = 0;
    this.onGround = true;
    this.isIntroDropping = false;
    this.introDone = true;
    this.idleTime = 0;
    this.sleepMode = false;
  }

  /**
   * Player takes damage.
   */
  takeHit() {
    this.hurtTime = 0.35;
    this.anim.hurtFrame = 0;
    this.anim.hurtTimer = 0;
  }

  /**
   * Player throws a bottle.
   */
  startThrow() {
    this.throwTime = 0.3;
    this.anim.throwFrame = 0;
    this.anim.throwTimer = 0;
  }

  /**
   * Updates the player character.
   * @param {number} dtMs - Delta in milliseconds
   * @param {number} dtSec - Delta in seconds
   * @param {object} input - Loaded inputs
   * @param {object} world - World object
   * @param {object} assets - Loaded assets
   */
  update(dtMs, dtSec, input, world, assets) {
    if (this.isIntroDropping) {
      this.updateIntro(dtSec, world);
      this.updateAnimation(dtMs, assets);
      return;
    }
    this.updateHurt(dtSec);
    this.updateThrow(dtSec);
    this.sleepFloat += dtSec * 2.2;
    this.sleepWave += dtSec * 3.5;
    this.updateIdleState(dtSec, input);
    this.updateMovement(dtSec, input, world);
    this.updateAnimation(dtMs, assets);
  }

  /**
   * Updates hurt state.
   * @param {number} dtSec - Delta in seconds
   */
  updateHurt(dtSec) {
    if (this.hurtTime > 0) {
      this.hurtTime -= dtSec;
    }

    if (this.hurtTime < 0) {
      this.hurtTime = 0;
    }
  }

  /**
   * Updates throw state.
   * @param {number} dtSec - Delta in seconds
   */
  updateThrow(dtSec) {
    if (this.throwTime > 0) {
      this.throwTime -= dtSec;
    }

    if (this.throwTime < 0) {
      this.throwTime = 0;
    }
  }

  /**
   * Updates idle and sleep state.
   * @param {number} dtSec - Delta in seconds
   * @param {object} input - Input
   */
  updateIdleState(dtSec, input) {
    const moving =
      input.left ||
      input.right ||
      input.jump ||
      input.fire ||
      !this.onGround ||
      this.throwTime > 0 ||
      this.hurtTime > 0;

    if (moving) {
      this.idleTime = 0;
      this.sleepMode = false;
      return;
    }

    this.idleTime += dtSec;

    if (this.idleTime > 1.5) {
      this.sleepMode = true;
    }
  }

  /**
   * Updates movement.
   * @param {number} dtSec - Delta in seconds
   * @param {object} input - Input
   * @param {object} world - World object
   */
  updateMovement(dtSec, input, world) {
    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    const floorY = world.groundY - this.h;

    this.vx = dir * this.speed;

    if (dir !== 0) {
      this.facing = dir;
    }

    this.x += this.vx * dtSec;
    this.handleJump(input, floorY);
    this.applyGravity(dtSec, floorY);
    this.clampInsideWorld(world, floorY);
  }

  /**
   * Handles jump.
   * @param {object} input - Input
   * @param {number} floorY - Floor height
   */
  handleJump(input, floorY) {
    const grounded = this.y >= floorY - 0.5;

    if (!grounded) {
      this.onGround = false;
      return;
    }

    this.y = floorY;
    this.vy = 0;
    this.onGround = true;

    if (!input.jump) {
      return;
    }

    this.vy = -this.jumpVelocity;
    this.onGround = false;
  }

  /**
   * Applies gravity.
   * @param {number} dtSec - Delta in seconds
   * @param {number} floorY - Floor height
   */
  applyGravity(dtSec, floorY) {
    this.vy += this.gravity * dtSec;
    this.y += this.vy * dtSec;

    if (this.y < floorY) {
      return;
    }

    this.y = floorY;
    this.vy = 0;
    this.onGround = true;
  }

  /**
   * Clamps the character inside the level.
   * @param {object} world - World object
   * @param {number} floorY - Floor height
   */
  clampInsideWorld(world, floorY) {
    this.x = Math.max(0, Math.min(world.levelW - this.w, this.x));
    this.y = Math.min(this.y, floorY);
  }

  /**
   * Updates animation.
   * @param {number} dtMs - Delta in milliseconds
   * @param {object} assets - Assets
   */
  updateAnimation(dtMs, assets) {
    this.updateWalkAnimation(dtMs, assets);
    this.updateJumpAnimation(dtMs);
    this.updateHurtAnimation(dtMs);
    this.updateThrowAnimation(dtMs);
  }

  /**
   * Updates walk animation.
   * @param {number} dtMs - Delta in milliseconds
   * @param {object} assets - Assets
   */
  updateWalkAnimation(dtMs, assets) {
    const walking =
      Math.abs(this.vx) > 1 && this.onGround && this.throwTime <= 0;
    const hasWalkFrames =
      assets.playerWalk.length > 0 || this.images.walk.length > 0;

    if (!walking || !hasWalkFrames) {
      this.anim.walkFrame = 0;
      this.anim.walkTimer = 0;
      return;
    }

    this.anim.walkTimer += dtMs;

    if (this.anim.walkTimer < 1000 / this.anim.walkFps) {
      return;
    }

    this.anim.walkTimer = 0;

    const count = this.images.walk.length || assets.playerWalk.length;
    this.anim.walkFrame = (this.anim.walkFrame + 1) % count;
  }

  /**
   * Updates jump animation.
   * @param {number} dtMs - Delta in milliseconds
   */
  updateJumpAnimation(dtMs) {
    if (this.onGround || this.throwTime > 0 || this.images.jump.length === 0) {
      this.anim.jumpFrame = 0;
      this.anim.jumpTimer = 0;
      return;
    }

    this.anim.jumpTimer += dtMs;

    if (this.anim.jumpTimer < 1000 / this.anim.jumpFps) {
      return;
    }

    this.anim.jumpTimer = 0;
    this.anim.jumpFrame = (this.anim.jumpFrame + 1) % this.images.jump.length;
  }

  /**
   * Updates hurt animation.
   * @param {number} dtMs - Delta in milliseconds
   */
  updateHurtAnimation(dtMs) {
    if (this.hurtTime <= 0 || this.images.hurt.length === 0) {
      this.anim.hurtFrame = 0;
      this.anim.hurtTimer = 0;
      return;
    }

    this.anim.hurtTimer += dtMs;

    if (this.anim.hurtTimer < 1000 / this.anim.hurtFps) {
      return;
    }

    this.anim.hurtTimer = 0;
    this.anim.hurtFrame = (this.anim.hurtFrame + 1) % this.images.hurt.length;
  }

  /**
   * Updates throw animation.
   * @param {number} dtMs - Delta in milliseconds
   */
  updateThrowAnimation(dtMs) {
    if (this.throwTime <= 0 || this.images.throw.length === 0) {
      this.anim.throwFrame = 0;
      this.anim.throwTimer = 0;
      return;
    }

    this.anim.throwTimer += dtMs;

    if (this.anim.throwTimer < 1000 / this.anim.throwFps) {
      return;
    }

    this.anim.throwTimer = 0;
    this.anim.throwFrame =
      (this.anim.throwFrame + 1) % this.images.throw.length;
  }

  /**
   * Draws the character.
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {object} assets - Assets
   */
  draw(ctx, assets) {
    const img = this.getCurrentImage(assets);

    if (!img) {
      this.drawFallback(ctx);
      return;
    }

    this.drawSprite(ctx, img);
    this.drawSleepText(ctx);
  }

  /**
   * Gibt aktuelles Bild zurück.
   * @param {object} assets - Assets
   * @returns {HTMLImageElement|null}
   */
  getCurrentImage(assets) {
    if (
      this.throwTime > 0 &&
      this.images.throw.length > 0 &&
      this.images.throw[this.anim.throwFrame] &&
      this.images.throw[this.anim.throwFrame].complete &&
      this.images.throw[this.anim.throwFrame].naturalWidth > 0
    ) {
      return this.images.throw[this.anim.throwFrame];
    }

    if (
      this.hurtTime > 0 &&
      this.images.hurt.length > 0 &&
      this.images.hurt[this.anim.hurtFrame]
    ) {
      return this.images.hurt[this.anim.hurtFrame];
    }

    if (this.throwTime > 0 && this.images.throw.length > 0) {
      return this.images.throw[this.anim.throwFrame] || null;
    }

    if (!this.onGround && this.images.jump.length > 0) {
      return this.images.jump[this.anim.jumpFrame] || null;
    }

    if (Math.abs(this.vx) > 1 && this.onGround) {
      if (this.images.walk.length > 0) {
        return this.images.walk[this.anim.walkFrame] || null;
      }

      if (assets.playerWalk.length > 0) {
        return assets.playerWalk[this.anim.walkFrame] || null;
      }
    }

    if (
      this.sleepMode &&
      this.images.sleep &&
      this.images.sleep.complete &&
      this.images.sleep.naturalWidth > 0
    ) {
      return this.images.sleep;
    }

    if (
      this.images.idle &&
      this.images.idle.complete &&
      this.images.idle.naturalWidth > 0
    ) {
      return this.images.idle;
    }

    if (assets.playerIdle) {
      return assets.playerIdle;
    }

    return null;
  }

  /**
   * Draws the sprite.
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {HTMLImageElement} img - Image
   */
  drawSprite(ctx, img) {
    if (!img || !img.complete || img.naturalWidth === 0) {
      this.drawFallback(ctx);
      return;
    }

    ctx.save();

    if (this.facing < 0) {
      ctx.translate(this.x + this.w, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, this.y, this.w, this.h);
    } else {
      ctx.drawImage(img, this.x, this.y, this.w, this.h);
    }
    ctx.restore();
  }

  /**
   * Draws fallback rectangle.
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  drawFallback(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  /**
   * Draws sleep text.
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  drawSleepText(ctx) {
    if (!this.sleepMode) {
      return;
    }

    const z1x = this.x + this.w * 0.78 + Math.sin(this.sleepWave) * 4;
    const z1y = this.y - 18 + Math.sin(this.sleepFloat) * 6;

    const z2x = this.x + this.w * 0.92 + Math.sin(this.sleepWave + 0.8) * 5;
    const z2y = this.y - 46 + Math.sin(this.sleepFloat + 0.6) * 7;

    const z3x = this.x + this.w * 1.05 + Math.sin(this.sleepWave + 1.4) * 6;
    const z3y = this.y - 78 + Math.sin(this.sleepFloat + 1.1) * 8;

    ctx.save();
    ctx.textAlign = "center";
    ctx.strokeStyle = "rgba(0,0,0,0.28)";
    ctx.fillStyle = "rgba(255,255,255,0.96)";
    ctx.lineWidth = 3;

    ctx.font = "bold 22px Arial";
    ctx.strokeText("Z", z1x, z1y);
    ctx.fillText("Z", z1x, z1y);

    ctx.font = "bold 18px Arial";
    ctx.strokeText("z", z2x, z2y);
    ctx.fillText("z", z2x, z2y);

    ctx.font = "bold 26px Arial";
    ctx.strokeText("Z", z3x, z3y);
    ctx.fillText("Z", z3x, z3y);

    ctx.restore();
  }
}

window.Natur = Natur;
