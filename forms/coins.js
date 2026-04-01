"use strict";

/**
 * Coin zum Einsammeln.
 */
class Coin {
  /**
   * @param {number} x - Startposition X
   * @param {number} y - Startposition Y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.w = 26;
    this.h = 26;

    this.collected = false;
    this.frame = 0;
    this.animT = 0;
  }

  /**
   * Aktualisiert die Coin.
   * @param {number} dtMs - Delta in Millisekunden
   */
  update(dtMs) {
    if (this.collected) {
      return;
    }

    this.animT += dtMs;

    if (this.animT > 220) {
      this.animT = 0;
      this.frame = this.frame === 0 ? 1 : 0;
    }
  }

  /**
   * Zeichnet die Coin.
   * @param {CanvasRenderingContext2D} ctx - Canvas Kontext
   */
  draw(ctx) {
    const size = this.frame === 0 ? 26 : 22;
    const offset = this.frame === 0 ? 0 : 2;

    ctx.fillStyle = "#f1c40f";
    ctx.beginPath();
    ctx.arc(this.x + 13, this.y + 13, size / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#d4ac0d";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fillRect(this.x + 6 + offset, this.y + 6, 6, 3);
  }
}

window.Coin = Coin;
