"use strict";

/**
 * Kleiner Chicken-Gegner.
 */
class SmallEnemy {
  /**
   * @param {number} x - Startposition X
   * @param {number} y - Startposition Y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.w = 42;
    this.h = 42;

    this.vx = -130;
    this.dead = false;
    this.removable = false;

    this.frame = 0;
    this.animTime = 0;
    this.deadTime = 0;

    this.walkImages = [];
    this.deadImage = null;
    this.loadImages();
  }

  /**
   * Lädt Bilder.
   */
  loadImages() {
    const walkPaths = [
      "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
      "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
      "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
    ];

    walkPaths.forEach((src) => {
      const img = new Image();
      img.src = src;
      this.walkImages.push(img);
    });

    this.deadImage = new Image();
    this.deadImage.src = "img/3_enemies_chicken/chicken_small/2_dead/dead.png";
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
    this.y += 160 * dtSec;

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

    if (this.x < 200) {
      this.vx = 130;
    }

    if (this.x > world.levelW - 200) {
      this.vx = -130;
    }
  }

  /**
   * Aktualisiert Animation.
   * @param {number} dtMs - Delta in Millisekunden
   */
  animate(dtMs) {
    this.animTime += dtMs;

    if (this.animTime < 120) {
      return;
    }

    this.animTime = 0;
    this.frame = (this.frame + 1) % this.walkImages.length;
  }

  /**
   * Draws the small enemy (main entry point).
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  /**
   * Draws the small enemy on the canvas.
   * Splits logic into helpers for dead, alive, and fallback drawing.
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  draw(ctx) {
    if (this.dead) {
      this.drawDead(ctx);
      return;
    }
    const img = this.walkImages[this.frame];
    if (this.isImageDrawable(img)) {
      this.drawAliveImage(ctx, img);
      return;
    }
    this.drawFallback(ctx);
  }

  /**
   * Checks if an image is drawable.
   * @param {HTMLImageElement} img - Image to check
   * @returns {boolean} True if drawable
   */
  isImageDrawable(img) {
    return img && img.complete;
  }

  /**
   * Draws the alive enemy image.
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {HTMLImageElement} img - Image to draw
   */
  drawAliveImage(ctx, img) {
    ctx.drawImage(img, this.x, this.y, this.w, this.h);
  }

  /**
   * Draws a fallback rectangle if no image is available.
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  drawFallback(ctx) {
    ctx.fillStyle = "#f39c12";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  /**
   * Zeichnet Dead-Bild.
   * @param {CanvasRenderingContext2D} ctx - Canvas Kontext
   */
  drawDead(ctx) {
    if (this.deadImage && this.deadImage.complete) {
      ctx.drawImage(this.deadImage, this.x, this.y, this.w, this.h);
      return;
    }

    ctx.fillStyle = "#999";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

window.SmallEnemy = SmallEnemy;
