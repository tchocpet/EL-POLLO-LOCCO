"use strict";

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image failed: " + src));
    img.src = src;
  });
}

function createAudio(src) {
  const audio = new Audio(src);
  audio.preload = "auto";
  return audio;
}

function nowMs() {
  return performance.now();
}

window.loadImage = loadImage;
window.createAudio = createAudio;
window.nowMs = nowMs;
