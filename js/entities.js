"use strict";

window.Util = {
  clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  },
};

class BaseEntity {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.vx = 0;
    this.vy = 0;
  }
}

window.BaseEntity = BaseEntity;
