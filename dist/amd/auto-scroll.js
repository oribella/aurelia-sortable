define(["exports", "aurelia-dependency-injection"], function (exports, _aureliaDependencyInjection) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AutoScroll = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AutoScroll = exports.AutoScroll = (_dec = (0, _aureliaDependencyInjection.transient)(), _dec(_class = function () {
    function AutoScroll() {
      _classCallCheck(this, AutoScroll);

      this.rAFId = -1;
      this.speed = 10;
      this.active = false;
    }

    AutoScroll.prototype.start = function start() {
      var speed = arguments.length <= 0 || arguments[0] === undefined ? 10 : arguments[0];

      this.speed = speed;
    };

    AutoScroll.prototype.update = function update(element, dirX, dirY, frameCntX, frameCntY) {
      var _this = this;

      if (this.active) {
        if (dirX === 0 && dirY === 0) {
          cancelAnimationFrame(this.rAFId);
          this.active = false;
        }
        return;
      }
      if (dirX === 0 && dirY === 0) {
        return;
      }

      if (frameCntX === 0 && frameCntY === 0) {
        return;
      }

      var scrollDeltaX = dirX * this.speed;
      var scrollDeltaY = dirY * this.speed;

      var autoScroll = function autoScroll() {

        if (!_this.active) {
          return;
        }
        if (frameCntX > 0) {
          element.scrollLeft += scrollDeltaX;
        }
        if (frameCntY > 0) {
          element.scrollTop += scrollDeltaY;
        }

        --frameCntX;
        --frameCntY;
        if (frameCntX <= 0 && frameCntY <= 0) {
          _this.active = false;
          return;
        }

        _this.rAFId = requestAnimationFrame(autoScroll);
      };

      this.active = true;
      autoScroll();
    };

    AutoScroll.prototype.end = function end() {
      var cAF = arguments.length <= 0 || arguments[0] === undefined ? cancelAnimationFrame : arguments[0];

      cAF(this.rAFId);
      this.active = false;
    };

    return AutoScroll;
  }()) || _class);
});
//# sourceMappingURL=auto-scroll.js.map