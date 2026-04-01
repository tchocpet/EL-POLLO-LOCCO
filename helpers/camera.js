"use strict";

/**
 * Clamp helper.
 * @param {number} v - Wert
 * @param {number} min - Minimum
 * @param {number} max - Maximum
 * @returns {number}
 */
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

/**
 * Aktualisiert Kamera.
 * @param {object} world - Welt
 * @param {object} player - Spieler
 */
function updateCamera(world, player) {
  world.camX = clamp(
    player.x - world.w / 2 + player.w / 2,
    0,
    world.levelW - world.w,
  );
}

window.clamp = clamp;
window.updateCamera = updateCamera;
