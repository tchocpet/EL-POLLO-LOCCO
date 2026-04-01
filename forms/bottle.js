"use strict";

/**
 * Wurf-Flasche.
 */
class Bottle {
  /**
   * @param {number} x - Startposition X
   * @param {number} y - Startposition Y
   * @param {number} direction - Wurfrichtung
   */
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;

    this.w = 55;
    this.h = 65;

    this.vx = direction * 420;
    this.vy = -180;
    this.gravity = 700;

    this.dead = false;
    this.splashing = false;
    this.splashTime = 0;
    this.frame = 0;
    this.animT = 0;
    this.direction = direction;

    this.rotationImages = [];
    this.splashImages = [];
    this.loadImages();
  }

  /**
   * Lädt Bilder.
   */
  loadImages() {
    const rotationPaths = [
      "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
      "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
      "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
      "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
    ];

    const splashPaths = [
      "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
      "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
      "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
      "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
      "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
      "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
    ];

    rotationPaths.forEach((src) => {
      const img = new Image();
      img.src = src;
      this.rotationImages.push(img);
    });

    splashPaths.forEach((src) => {
      const img = new Image();
      img.src = src;
      this.splashImages.push(img);
    });
  }

  /**
   * Aktualisiert die Flasche.
   * @param {number} dtSec - Delta in Sekunden
   * @param {object} world - Welt
   */
  update(dtSec, world) {
    if (this.dead) {
      return;
    }

    if (this.splashing) {
      this.updateSplash(dtSec);
      return;
    }

    this.vy += this.gravity * dtSec;
    this.x += this.vx * dtSec;
    this.y += this.vy * dtSec;

    this.animT += dtSec;

    if (this.animT >= 0.08) {
      this.animT = 0;
      this.frame = (this.frame + 1) % this.rotationImages.length;
    }

    if (this.y + this.h >= world.groundY) {
      this.startSplash(world.groundY - this.h + 10);
      return;
    }

    if (this.isOutsideWorld(world)) {
      this.dead = true;
    }
  }

  /**
   * Startet Splash.
   * @param {number} splashY - Bodenhöhe
   */
  startSplash(splashY) {
    this.splashing = true;
    this.splashTime = 0;
    this.vx = 0;
    this.vy = 0;
    this.y = splashY;
    this.frame = 0;
    this.animT = 0;
  }

  /**
   * Aktualisiert Splash.
   * @param {number} dtSec - Delta in Sekunden
   */
  updateSplash(dtSec) {
    this.splashTime += dtSec;
    this.animT += dtSec;

    if (this.animT >= 0.06) {
      this.animT = 0;
      this.frame += 1;
    }

    if (this.frame >= this.splashImages.length || this.splashTime > 0.4) {
      this.dead = true;
    }
  }

  /**
   * Prüft, ob Flasche außerhalb der Welt ist.
   * @param {object} world - Welt
   * @returns {boolean}
   */
  isOutsideWorld(world) {
    return (
      this.x < -100 || this.x > world.levelW + 100 || this.y > world.h + 220
    );
  }

  /**
   * Zeichnet die Flasche.
   * @param {CanvasRenderingContext2D} ctx - Canvas Kontext
   */
  draw(ctx) {
    if (this.splashing) {
      this.drawSplash(ctx);
      return;
    }

    this.drawRotation(ctx);
  }

  /**
   * Zeichnet rotierende Flasche.
   * @param {CanvasRenderingContext2D} ctx - Canvas Kontext
   */
  drawRotation(ctx) {
    const img = this.rotationImages[this.frame];

    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, this.x, this.y, this.w, this.h);
      return;
    }

    ctx.fillStyle = "#7b3f00";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  /**
   * Zeichnet Splash.
   * @param {CanvasRenderingContext2D} ctx - Canvas Kontext
   */
  drawSplash(ctx) {
    const splashIndex = Math.min(this.frame, this.splashImages.length - 1);
    const img = this.splashImages[splashIndex];

    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, this.x - 10, this.y - 10, this.w + 25, this.h + 20);
      return;
    }

    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.fillRect(this.x, this.y, this.w, this.h / 2);
  }
}

window.Bottle = Bottle;
