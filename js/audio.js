"use strict";

function ensureAudio(App, PATHS) {
  if (App.audio.bgMusic) return;

  App.audio.walk = createAudio(PATHS.audio.walk);
  App.audio.walk.volume = 0.2;
  App.audio.bgMusic = createAudio(PATHS.audio.bgMusic);
  App.audio.coin = createAudio(PATHS.audio.coin);
  App.audio.bottleCollect = createAudio(PATHS.audio.bottleCollect);
  App.audio.throw = createAudio(PATHS.audio.throw);
  App.audio.hurt = createAudio(PATHS.audio.hurt);
  App.audio.bossHit = createAudio(PATHS.audio.bossHit);

  App.audio.bgMusic.loop = true;
  App.audio.bgMusic.volume = 0.25;

  App.audio.coin.volume = 0.35;
  App.audio.bottleCollect.volume = 0.35;
  App.audio.throw.volume = 0.35;
  App.audio.hurt.volume = 0.35;
  App.audio.bossHit.volume = 0.35;

  applyMuteState(App);
}

function applyMuteState(App) {
  const muted = !App.soundOn;

  Object.values(App.audio).forEach((audio) => {
    if (!audio) return;
    audio.muted = muted;
  });
}

function startBackgroundMusic(App) {
  if (!App.audio.bgMusic || !App.soundOn) return;
  App.audio.bgMusic.currentTime = 0;
  App.audio.bgMusic.play().catch(() => {});
}

function stopBackgroundMusic(App) {
  if (!App.audio.bgMusic) return;
  App.audio.bgMusic.pause();
  App.audio.bgMusic.currentTime = 0;
}

window.ensureAudio = ensureAudio;
window.applyMuteState = applyMuteState;
window.startBackgroundMusic = startBackgroundMusic;
window.stopBackgroundMusic = stopBackgroundMusic;
