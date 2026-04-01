"use strict";

/**
 * Endboss.
 */
class Boss {
  /**
   * @param {number} x - Startposition X
   * @param {number} y - Startposition Y
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

    this.offset = {
      top: 70,
      left: 40,
      right: 40,
      bottom: 25,
    };

    this.walkImages = [];
    this.hurtImages = [];
    this.deadImages = [];
    this.loadImages();
  }

  /**
   * Lädt Bilder.
   */
  loadImages() {
    const walkPaths = [
      "img/4_enemie_boss_chicken/1_walk/G1.png",
      "img/4_enemie_boss_chicken/1_walk/G2.png",
      "img/4_enemie_boss_chicken/1_walk/G3.png",
      "img/4_enemie_boss_chicken/1_walk/G4.png",
    ];

    const hurtPaths = [
      "img/4_enemie_boss_chicken/4_hurt/G21.png",
      "img/4_enemie_boss_chicken/4_hurt/G22.png",
      "img/4_enemie_boss_chicken/4_hurt/G23.png",
    ];

    const deadPaths = [
      "img/4_enemie_boss_chicken/5_dead/G24.png",
      "img/4_enemie_boss_chicken/5_dead/G25.png",
      "img/4_enemie_boss_chicken/5_dead/G26.png",
    ];

    walkPaths.forEach((src) => {
      const img = new Image();
      img.src = src;
      this.walkImages.push(img);
    });

    hurtPaths.forEach((src) => {
      const img = new Image();
      img.src = src;
      this.hurtImages.push(img);
    });

    deadPaths.forEach((src) => {
      const img = new Image();
      img.src = src;
      this.deadImages.push(img);
    });
  }

  /**
   * Aktualisiert den Boss.
   * @param {number} dtMs - Delta in Millisekunden
   * @param {number} dtSec - Delta in Sekunden
   * @param {object} world - Welt
   * @param {object} player - Spieler
   * @param {number} health - Boss-Leben
   */
  update(dtMs, dtSec, world, player, health) {
    if (this.dead) {
      this.updateDead(dtMs, dtSec);
      return;
    }

    this.updateHurt(dtSec);
    this.updatePhase(health);
    this.updateAttackTimers(dtSec);

    const distanceToPlayer = this.x - player.x;

    if (Math.abs(distanceToPlayer) < 750) {
      this.active = true;
    }

    if (!this.active) {
      return;
    }

    this.tryStartRush(distanceToPlayer);
    this.move(dtSec, world, player);
    this.animate(dtMs);
  }

  /**
   * Aktualisiert Hurt-Zeit.
   * @param {number} dtSec - Delta in Sekunden
   */
  updateHurt(dtSec) {
    if (this.hurtTime > 0) {
      this.hurtTime -= dtSec;
    }

    if (this.hurtTime <= 0) {
      this.hurt = false;
      this.hurtTime = 0;
    }
  }

  /**
   * Aktualisiert Dead-Zustand.
   * @param {number} dtMs - Delta in Millisekunden
   * @param {number} dtSec - Delta in Sekunden
   */
  updateDead(dtMs, dtSec) {
    this.deadTime += dtMs;
    this.y += 90 * dtSec;

    if (this.deadTime > 1400) {
      this.removable = true;
    }
  }

  /**
   * Boss bekommt Schaden.
   */
  takeHit() {
    if (this.dead) return;

    this.hurt = true;
    this.hurtTime = 0.35;
  }

  /**
   * Boss stirbt.
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
   * Aktualisiert Boss-Phase.
   * @param {number} health - Boss-Leben
   */
  updatePhase(health) {
    this.phaseTwo = health <= 50;
  }

  /**
   * Aktualisiert Angriff-Timer.
   * @param {number} dtSec - Delta in Sekunden
   */
  updateAttackTimers(dtSec) {
    if (this.attackCooldown > 0) {
      this.attackCooldown -= dtSec;
    }

    if (this.rushTime > 0) {
      this.rushTime -= dtSec;
    }

    if (this.rushTime <= 0) {
      this.isRushing = false;
    }
  }

  /**
   * Startet Rush-Angriff.
   * @param {number} distanceToPlayer - Distanz zum Spieler
   */
  tryStartRush(distanceToPlayer) {
    if (!this.phaseTwo) {
      return;
    }

    if (this.attackCooldown > 0 || this.isRushing) {
      return;
    }

    if (Math.abs(distanceToPlayer) > 280) {
      return;
    }

    this.isRushing = true;
    this.rushTime = 0.85;
    this.attackCooldown = 2.2;
  }

  /**
   * Bewegt den Boss.
   * @param {number} dtSec - Delta in Sekunden
   * @param {object} world - Welt
   * @param {object} player - Spieler
   */
  move(dtSec, world, player) {
    let speed = this.phaseTwo ? 155 : 100;

    if (this.isRushing) {
      speed = 255;
    }

    const leftLimit = 0;
    const rightLimit = world.levelW - this.w;

    const distanceX = player.x - this.x;
    const closeToPlayer = Math.abs(distanceX) < 20;

    if (!closeToPlayer) {
      this.vx = distanceX < 0 ? -speed : speed;
      this.facing = this.vx < 0 ? -1 : 1;
      this.x += this.vx * dtSec;
    } else {
      this.vx = 0;
    }

    if (this.x < leftLimit) {
      this.x = leftLimit;
    }

    if (this.x > rightLimit) {
      this.x = rightLimit;
    }
  }

  /**
   * Aktualisiert Boss-Animation.
   * @param {number} dtMs - Delta in Millisekunden
   */
  animate(dtMs) {
    const limit = this.isRushing ? 90 : this.phaseTwo ? 120 : 180;

    this.animT += dtMs;

    if (this.animT < limit) {
      return;
    }

    this.animT = 0;

    const maxFrames = this.hurt
      ? this.hurtImages.length
      : this.walkImages.length;
    this.frame = (this.frame + 1) % Math.max(1, maxFrames);
  }

  /**
   * Zeichnet den Boss.
   * @param {CanvasRenderingContext2D} ctx - Canvas Kontext
   */
  draw(ctx) {
    const img = this.getCurrentImage();

    if (!img || !img.complete || img.naturalWidth === 0) {
      ctx.fillStyle = "#c0392b";
      ctx.fillRect(this.x, this.y, this.w, this.h);
      return;
    }

    ctx.save();

    if (this.facing > 0) {
      ctx.translate(this.x + this.w, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, this.y, this.w, this.h);
    } else {
      ctx.drawImage(img, this.x, this.y, this.w, this.h);
    }

    ctx.restore();
  }

  /**
   * Gibt aktuelles Boss-Bild zurück.
   * @returns {HTMLImageElement|null}
   */
  getCurrentImage() {
    if (this.dead) {
      return (
        this.deadImages[
          Math.min(this.deadImages.length - 1, Math.floor(this.deadTime / 180))
        ] || null
      );
    }

    if (this.hurt) {
      return this.hurtImages[this.frame % this.hurtImages.length] || null;
    }

    return this.walkImages[this.frame % this.walkImages.length] || null;
  }
}

window.Boss = Boss;
