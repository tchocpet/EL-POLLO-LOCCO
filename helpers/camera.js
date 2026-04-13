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
/**
 * Updates the camera position based on the player position.
 * @param {object} world - World object
 * @param {object} player - Player object
 */
function updateCamera(world, player) {
  world.camX = calculateCameraX(world, player);
  world.camX = clampCameraX(world.camX, world);
}

/**
 * Calculates the desired camera X position.
 * @param {object} world - World object
 * @param {object} player - Player object
 * @returns {number} Camera X position
 */
function calculateCameraX(world, player) {
  return player.x - world.w / 2;
}

/**
 * Clamps the camera X position within world bounds.
 * @param {number} camX - Camera X position
 * @param {object} world - World object
 * @returns {number} Clamped camera X position
 */
function clampCameraX(camX, world) {
  return Math.max(0, Math.min(camX, world.levelW - world.w));
}

window.clamp = clamp;
window.updateCamera = updateCamera;
