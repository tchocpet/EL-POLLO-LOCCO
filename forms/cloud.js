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
  /**
   * Updates the cloud position and handles looping.
   * @param {number} dtSec - Delta time in seconds
   * @param {object} world - World object
   */
  /**
   * Updates the cloud position and handles looping.
   * Splits logic into helpers for movement and looping.
   * @param {number} dtSec - Delta time in seconds
   * @param {object} world - World object
   */
  update(dtSec, world) {
    this.moveCloud(dtSec);
    this.handleCloudLoop(world);
  }

  /**
   * Moves the cloud horizontally.
   * @param {number} dtSec - Delta time in seconds
   */
  /**
   * Moves the cloud horizontally based on speed and delta time.
   * @param {number} dtSec - Delta time in seconds
   */
  moveCloud(dtSec) {
    this.x -= this.speed * dtSec;
  }

  /**
   * Loops the cloud to the right if it leaves the screen.
   * @param {object} world - World object
   */
  handleCloudLoop(world) {
    if (this.x + this.w < 0) {
      this.x = world.levelW + Math.random() * 600;
    }
  }

  /**
   * Draws the cloud on the canvas.
   * @param {CanvasRenderingContext2D} ctx - Canvas context
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
