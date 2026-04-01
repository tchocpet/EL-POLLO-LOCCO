"use strict";

/**
 * Bodenflasche zum Einsammeln.
 */
class GroundBottle {
  /**
   * @param {number} x - Startposition X
   * @param {number} y - Startposition Y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.w = 38;
    this.h = 52;

    this.collected = false;
    this.frame = 0;
    this.animT = 0;

    this.images = [];
    this.loadImages();
  }

  /**
   * Lädt Bilder.
   */
  loadImages() {
    const paths = [
      "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
      "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
    ];

    paths.forEach((src) => {
      const img = new Image();
      img.src = src;
      this.images.push(img);
    });
  }

  /**
   * Aktualisiert die Bodenflasche.
   * @param {number} dtMs - Delta in Millisekunden
   */
  update(dtMs) {
    if (this.collected) {
      return;
    }

    this.animT += dtMs;

    if (this.animT > 260) {
      this.animT = 0;
      this.frame = this.frame === 0 ? 1 : 0;
    }
  }

  /**
   * Zeichnet die Bodenflasche.
   * @param {CanvasRenderingContext2D} ctx - Canvas Kontext
   */
  draw(ctx) {
    const img = this.images[this.frame];

    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, this.x, this.y, this.w, this.h);
      return;
    }

    ctx.fillStyle = "#27ae60";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

window.GroundBottle = GroundBottle;
