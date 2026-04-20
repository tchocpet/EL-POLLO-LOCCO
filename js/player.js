/**
 * Initializes the player module and registers its public API.
 */
function initPlayerModule() {
  ensureBaseEntityExists();
  registerPlayerApi();
}

/**
 * Creates the player class after BaseEntity is available.
 *
 * @returns {typeof window.BaseEntity}
 */
function createPlayerClass() {
  return class Player extends window.BaseEntity {
    constructor(x = 140, y = 140) {
      super(x, y, 50, 70);
      applyPlayerDefaults(this);
    }

    update(dt, input, world) {
      updatePlayerState(this, dt, input, world);
    }

    draw(ctx, camX = 0) {
      drawPlayerState(this, ctx, camX);
    }
  };
}

/**
 * Throws an error when BaseEntity is missing.
 */
function ensureBaseEntityExists() {
  if (window.BaseEntity) return;
  throw new Error(
    "BaseEntity is not available. Load and register entities.js before player.js init.",
  );
}

/**
 * Registers the player class on the global window object.
 *
 * @param {Function} PlayerClass - Player class.
 */
function registerPlayerApi(PlayerClass) {
  window.Player = PlayerClass;
}

/**
 * Applies default player values.
 *
 * @param {object} player - Player instance.
 */
function applyPlayerDefaults(player) {
  player.speed = 300;
  player.jumpPower = 500;
  player.gravity = 1350;
  player.grounded = false;
}

/**
 * Updates the full player state.
 *
 * @param {object} player - Player instance.
 * @param {number} dt - Delta time in seconds.
 * @param {object} input - Input state.
 * @param {object} world - World state.
 */
function updatePlayerState(player, dt, input, world) {
  updatePlayerMovement(player, input);
  applyPlayerPhysics(player, dt);
  movePlayer(player, dt);
  player.grounded = false;
  clampPlayerInsideWorld(player, world);
  resolvePlayerGroundCollision(player, world);
}

/**
 * Draws the full player state.
 *
 * @param {object} player - Player instance.
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 * @param {number} camX - Camera x offset.
 */
function drawPlayerState(player, ctx, camX) {
  drawPlayerBody(player, ctx, camX);
  drawPlayerShadowMark(player, ctx, camX);
}

/**
 * Updates player movement input.
 *
 * @param {object} player - Player instance.
 * @param {object} input - Input state.
 */
function updatePlayerMovement(player, input) {
  const direction = getPlayerDirection(input);
  player.vx = direction * player.speed;
  if (!shouldStartJump(player, input)) return;
  startPlayerJump(player);
}

/**
 * Returns the movement direction.
 *
 * @param {object} input - Input state.
 * @returns {number}
 */
function getPlayerDirection(input) {
  return (input.right ? 1 : 0) - (input.left ? 1 : 0);
}

/**
 * Returns whether the player should start jumping.
 *
 * @param {object} player - Player instance.
 * @param {object} input - Input state.
 * @returns {boolean}
 */
function shouldStartJump(player, input) {
  if (!input.jump) return false;
  return player.grounded;
}

/**
 * Starts a player jump.
 *
 * @param {object} player - Player instance.
 */
function startPlayerJump(player) {
  player.vy = -player.jumpPower;
  player.grounded = false;
}

/**
 * Applies gravity to the player.
 *
 * @param {object} player - Player instance.
 * @param {number} dt - Delta time in seconds.
 */
function applyPlayerPhysics(player, dt) {
  player.vy += player.gravity * dt;
}

/**
 * Moves the player by velocity.
 *
 * @param {object} player - Player instance.
 * @param {number} dt - Delta time in seconds.
 */
function movePlayer(player, dt) {
  player.x += player.vx * dt;
  player.y += player.vy * dt;
}

/**
 * Clamps the player inside world bounds.
 *
 * @param {object} player - Player instance.
 * @param {object} world - World state.
 */
function clampPlayerInsideWorld(player, world) {
  const maxX = Math.max(0, world.levelW - player.w);
  player.x = window.Util.clamp(player.x, 0, maxX);
}

/**
 * Resolves collision with the ground.
 *
 * @param {object} player - Player instance.
 * @param {object} world - World state.
 */
function resolvePlayerGroundCollision(player, world) {
  if (!hasGroundCollision(player, world)) return;
  setPlayerOnGround(player, world);
}

/**
 * Returns whether the player touches the ground.
 *
 * @param {object} player - Player instance.
 * @param {object} world - World state.
 * @returns {boolean}
 */
function hasGroundCollision(player, world) {
  return player.y + player.h >= world.groundY;
}

/**
 * Places the player on the ground.
 *
 * @param {object} player - Player instance.
 * @param {object} world - World state.
 */
function setPlayerOnGround(player, world) {
  player.y = world.groundY - player.h;
  player.vy = 0;
  player.grounded = true;
}

/**
 * Draws the player body.
 *
 * @param {object} player - Player instance.
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 * @param {number} camX - Camera x offset.
 */
function drawPlayerBody(player, ctx, camX) {
  const img = window.ASSETS.playerIdle;

  if (!img) return;

  ctx.drawImage(img, player.x - camX, player.y, 120, 160);
}

/**
 * Draws the player detail marker.
 *
 * @param {object} player - Player instance.
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 * @param {number} camX - Camera x offset.
 */
function drawPlayerShadowMark(player, ctx, camX) {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(player.x - camX + 8, player.y + 10, 12, 12);
}
