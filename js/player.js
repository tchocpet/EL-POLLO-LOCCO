"use strict";

class Player extends window.BaseEntity {
  constructor(x = 140, y = 140) {
    super(x, y, 50, 70);
    this.speed = 300;
    this.jumpPower = 500;
    this.gravity = 1350;
    this.grounded = false;
  }

  update(dt, input, world) {
    // links / rechts
    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    this.vx = dir * this.speed;

    // springen
    if (input.jump && this.grounded) {
      this.vy = -this.jumpPower;
      this.grounded = false;
    }

    // gravity
    this.vy += this.gravity * dt;

    // bewegen
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // clamp X im Level
    this.x = window.Util.clamp(this.x, 0, world.levelW - this.w);

    // Boden
    if (this.y + this.h >= world.groundY) {
      this.y = world.groundY - this.h;
      this.vy = 0;
      this.grounded = true;
    }
  }

  draw(ctx, camX = 0) {
    // einfacher Placeholder
    ctx.fillStyle = "rgba(255,255,255,0.90)";
    ctx.fillRect(this.x - camX, this.y, this.w, this.h);

    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(this.x - camX + 8, this.y + 10, 12, 12);
  }
}

window.Player = Player;
