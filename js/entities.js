/**
 * Registers the entities module API.
 */
registerEntitiesApi();

/**
 * Initializes the entities module.
 */
function initEntitiesModule() {
  registerEntitiesApi();
}

/**
 * Registers entity helpers on the global window object.
 */
function registerEntitiesApi() {
  window.BaseEntity = createBaseEntityClass();
  window.Util = createUtilApi();
}

/**
 * Creates the BaseEntity class.
 *
 * @returns {typeof BaseEntity}
 */
function createBaseEntityClass() {
  return class BaseEntity {
    /**
     * Creates a new base entity.
     *
     * @param {number} x - Initial x position.
     * @param {number} y - Initial y position.
     * @param {number} w - Entity width.
     * @param {number} h - Entity height.
     */
    constructor(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.vx = 0;
      this.vy = 0;
    }
  };
}

/**
 * Creates the utility API object.
 *
 * @returns {{clamp: Function}}
 */
function createUtilApi() {
  return {
    clamp: clampValue,
  };
}

/**
 * Clamps a value between a minimum and a maximum.
 *
 * @param {number} value - Input value.
 * @param {number} min - Minimum allowed value.
 * @param {number} max - Maximum allowed value.
 * @returns {number}
 */
function clampValue(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
