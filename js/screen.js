"use strict";

window.Screen = (function () {
  function hideAll() {
    document
      .querySelectorAll(".game-screen")
      .forEach((s) => s.classList.add("d-none"));
  }

  function showById(id) {
    const el = document.getElementById(id);
    if (!el) return;
    hideAll();
    el.classList.remove("d-none");
    window.lastShowedScreen = el;
  }

  function overlay(on) {
    const wrap = document.querySelector(".game-area");
    if (wrap) wrap.classList.toggle("show-overlay", !!on);
  }

  function setPauseIcon(paused) {
    const img = document.getElementById("pause-img");
    if (!img) return;
    img.src = paused
      ? "img/10_controls/continue.png"
      : "img/10_controls/pause.png";
  }

  function setSoundIcons(on) {
    document.querySelectorAll(".sound-img").forEach((img) => {
      img.src = on
        ? "img/10_controls/sound-on.png"
        : "img/10_controls/sound-off.png";
    });
  }

  return { showById, hideAll, overlay, setPauseIcon, setSoundIcons };
})();
