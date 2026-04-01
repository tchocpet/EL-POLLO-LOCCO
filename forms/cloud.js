"use strict";

/**
 * Bewegte Wolke.
 */
class Cloud {
  /**
   * @param {number} x - Startposition X
   */
  constructor(x = 0) {
    this.x = x;
    this.y = 40;
    this.w = 500;
    this.h = 250;
    this.speed = 18;

    this.img = new Image();
    this.img.src = "img/5_background/layers/4_clouds/1.png";
  }

  /**
   * Aktualisiert die Wolke.
   * @param {number} dtSec - Delta in Sekunden
   * @param {object} world - Welt
   */
  update(dtSec, world) {
    this.x -= this.speed * dtSec;

    if (this.x + this.w < 0) {
      this.x = world.levelW + Math.random() * 600;
    }
  }

  /**
   * Zeichnet die Wolke.
   * @param {CanvasRenderingContext2D} ctx - Canvas Kontext
   */
  draw(ctx) {
    if (this.img.complete && this.img.naturalWidth > 0) {
      ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
      return;
    }

    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.fillRect(this.x, this.y, this.w, this.h * 0.4);
  }
}

window.Cloud = Cloud;
