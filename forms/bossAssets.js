/**
 * Loads all boss images.
 *
 * @param {object} boss - Boss instance.
 */
function loadBossImages(boss) {
  loadBossWalkImages(boss);
  loadBossHurtImages(boss);
  loadBossDeadImages(boss);
}

/**
 * Loads all boss walk images.
 *
 * @param {object} boss - Boss instance.
 */
function loadBossWalkImages(boss) {
  getBossWalkPaths().forEach((src) => {
    pushBossImage(boss.walkImages, src);
  });
}

/**
 * Loads all boss hurt images.
 *
 * @param {object} boss - Boss instance.
 */
function loadBossHurtImages(boss) {
  getBossHurtPaths().forEach((src) => {
    pushBossImage(boss.hurtImages, src);
  });
}

/**
 * Loads all boss dead images.
 *
 * @param {object} boss - Boss instance.
 */
function loadBossDeadImages(boss) {
  getBossDeadPaths().forEach((src) => {
    pushBossImage(boss.deadImages, src);
  });
}

/**
 * Pushes one image into an image list.
 *
 * @param {HTMLImageElement[]} list - Target image list.
 * @param {string} src - Image source path.
 */
function pushBossImage(list, src) {
  const image = new Image();
  image.src = src;
  list.push(image);
}

/**
 * Returns all walk image paths.
 *
 * @returns {string[]}
 */
function getBossWalkPaths() {
  return [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];
}

/**
 * Returns all hurt image paths.
 *
 * @returns {string[]}
 */
function getBossHurtPaths() {
  return [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];
}

/**
 * Returns all dead image paths.
 *
 * @returns {string[]}
 */
function getBossDeadPaths() {
  return [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];
}
