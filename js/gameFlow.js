/**
 * Loads all player images.
 *
 * @param {object} natur - Player instance.
 */
function loadNaturImages(natur) {
  loadNaturWalkImages(natur);
  loadNaturJumpImages(natur);
  loadNaturHurtImages(natur);
  loadNaturThrowImages(natur);
  loadNaturIdleImage(natur);
  loadNaturSleepImage(natur);
}

/**
 * Loads all walk images.
 *
 * @param {object} natur - Player instance.
 */
function loadNaturWalkImages(natur) {
  getNaturWalkPaths().forEach((src) => {
    pushNaturImage(natur.images.walk, src);
  });
}

/**
 * Loads all jump images.
 *
 * @param {object} natur - Player instance.
 */
function loadNaturJumpImages(natur) {
  getNaturJumpPaths().forEach((src) => {
    pushNaturImage(natur.images.jump, src);
  });
}

/**
 * Loads all hurt images.
 *
 * @param {object} natur - Player instance.
 */
function loadNaturHurtImages(natur) {
  getNaturHurtPaths().forEach((src) => {
    pushNaturImage(natur.images.hurt, src);
  });
}

/**
 * Loads all throw images.
 *
 * @param {object} natur - Player instance.
 */
function loadNaturThrowImages(natur) {
  getNaturThrowPaths().forEach((src) => {
    pushNaturImage(natur.images.throw, src);
  });
}

/**
 * Loads the idle image.
 *
 * @param {object} natur - Player instance.
 */
function loadNaturIdleImage(natur) {
  natur.images.idle = createNaturImage(
    "img/2_character_pepe/1_idle/idle/I-1.png",
  );
}

/**
 * Loads all sleep images.
 *
 * @param {object} natur - Player instance.
 */
function loadNaturSleepImage(natur) {
  getNaturSleepPaths().forEach((src) => {
    pushNaturImage(natur.images.sleep, src);
  });
}

/**
 * Pushes one image into a target list.
 *
 * @param {HTMLImageElement[]} list - Target list.
 * @param {string} src - Image source path.
 */
function pushNaturImage(list, src) {
  list.push(createNaturImage(src));
}

/**
 * Creates one image element.
 *
 * @param {string} src - Image source path.
 * @returns {HTMLImageElement}
 */
function createNaturImage(src) {
  const image = new Image();
  image.src = src;
  return image;
}

/**
 * Returns walk image paths.
 *
 * @returns {string[]}
 */
function getNaturWalkPaths() {
  return [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];
}

/**
 * Returns jump image paths.
 *
 * @returns {string[]}
 */
function getNaturJumpPaths() {
  return [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];
}

/**
 * Returns hurt image paths.
 *
 * @returns {string[]}
 */
function getNaturHurtPaths() {
  return [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];
}

/**
 * Returns throw image paths.
 *
 * @returns {string[]}
 */
function getNaturThrowPaths() {
  return [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
  ];
}

/**
 * Returns sleep image paths.
 *
 * @returns {string[]}
 */
function getNaturSleepPaths() {
  return [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];
}
