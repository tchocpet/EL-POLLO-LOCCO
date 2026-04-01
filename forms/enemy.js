"use strict";

/**
 * Chicken-Gegner.
 */
class Enemy {
  /**
   * @param {number} x - Startposition X
   * @param {number} y - Startposition Y
   * @param {string} type - Typ
   */
  constructor(x, y, type = "big") {
    this.x = x;
    this.y = y;
    this.type = type;

    if (type === "small") {
      this.w = 42;
      this.h = 42;
      this.vx = -85;
    } else {
      this.w = 75;
      this.h = 75;
      this.vx = -70;
    }

    this.dead = false;
    this.removable = false;

    this.frame = 0;
    this.animTime = 0;
    this.deadTime = 0;
    this.facing = -1;

    this.walkImages = [];
    this.deadImage = null;
    this.loadImages();
  }

  /**
   * Lädt Bilder.
   */
  loadImages() {
    let walkPaths = [];
    let deadPath = "";

    if (this.type === "small") {
      walkPaths = [
        "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
      ];
      deadPath = "img/3_enemies_chicken/chicken_small/2_dead/dead.png";
    } else {
      walkPaths = [
        "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
      ];
      deadPath = "img/3_enemies_chicken/chicken_normal/2_dead/dead.png";
    }

    walkPaths.forEach((src) => {
      const img = new Image();
      img.src = src;
      this.walkImages.push(img);
    });

    this.deadImage = new Image();
    this.deadImage.src = deadPath;
  }

  /**
   * Aktualisiert den Gegner.
   * @param {number} dtMs - Delta in Millisekunden
   * @param {number} dtSec - Delta in Sekunden
   * @param {object} world - Welt
   */
  update(dtMs, dtSec, world) {
    if (this.dead) {
      this.updateDead(dtMs, dtSec);
      return;
    }

    this.move(dtSec, world);
    this.animate(dtMs);
  }

  /**
   * Aktualisiert Dead-Zustand.
   * @param {number} dtMs - Delta in Millisekunden
   * @param {number} dtSec - Delta in Sekunden
   */
  updateDead(dtMs, dtSec) {
    this.deadTime += dtMs;
    this.y += 140 * dtSec;

    if (this.deadTime > 650) {
      this.removable = true;
    }
  }

  /**
   * Markiert den Gegner als tot.
   */
  die() {
    if (this.dead) return;
    this.dead = true;
    this.vx = 0;
    this.deadTime = 0;
  }

  /**
   * Bewegt den Gegner.
   * @param {number} dtSec - Delta in Sekunden
   * @param {object} world - Welt
   */
  move(dtSec, world) {
    this.x += this.vx * dtSec;
    this.facing = this.vx < 0 ? -1 : 1;

    if (this.x < 200) {
      this.vx = this.type === "small" ? 70 : 55;
    }

    if (this.x > world.levelW - 200) {
      this.vx = this.type === "small" ? -70 : -55;
    }
  }

  /**
   * Aktualisiert Animation.
   * @param {number} dtMs - Delta in Millisekunden
   */
  animate(dtMs) {
    this.animTime += dtMs;

    const speed = this.type === "small" ? 120 : 180;

    if (this.animTime < speed) {
      return;
    }

    this.animTime = 0;
    this.frame = (this.frame + 1) % this.walkImages.length;
  }

  /**
   * Zeichnet den Gegner.
   * @param {CanvasRenderingContext2D} ctx - Canvas Kontext
   */
  draw(ctx) {
    if (this.dead) {
      this.drawDead(ctx);
      return;
    }

    const img = this.walkImages[this.frame];

    if (img && img.complete && img.naturalWidth > 0) {
      ctx.save();

      if (this.facing > 0) {
        ctx.translate(this.x + this.w, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(img, 0, this.y, this.w, this.h);
      } else {
        ctx.drawImage(img, this.x, this.y, this.w, this.h);
      }

      ctx.restore();
      return;
    }

    ctx.fillStyle = "#8b4513";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  /**
   * Zeichnet Dead-Bild.
   * @param {CanvasRenderingContext2D} ctx - Canvas Kontext
   */
  drawDead(ctx) {
    if (
      this.deadImage &&
      this.deadImage.complete &&
      this.deadImage.naturalWidth > 0
    ) {
      ctx.save();

      if (this.facing > 0) {
        ctx.translate(this.x + this.w, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(this.deadImage, 0, this.y, this.w, this.h);
      } else {
        ctx.drawImage(this.deadImage, this.x, this.y, this.w, this.h);
      }

      ctx.restore();
      return;
    }

    ctx.fillStyle = "#999";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

window.Enemy = Enemy;
