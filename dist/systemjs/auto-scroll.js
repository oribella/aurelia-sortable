"use strict";

System.register(["aurelia-dependency-injection"], function (_export, _context) {
  "use strict";

  var transient, _dec, _class, AutoScroll;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaDependencyInjection) {
      transient = _aureliaDependencyInjection.transient;
    }],
    execute: function () {
      _export("AutoScroll", AutoScroll = (_dec = transient(), _dec(_class = function () {
        function AutoScroll() {
          _classCallCheck(this, AutoScroll);

          this.rAFId = -1;
          this.speed = 10;
          this.active = false;
        }

        AutoScroll.prototype.start = function start() {
          var speed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;

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
          var cAF = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : cancelAnimationFrame;

          cAF(this.rAFId);
          this.active = false;
        };

        return AutoScroll;
      }()) || _class));

      _export("AutoScroll", AutoScroll);
    }
  };
});
//# sourceMappingURL=auto-scroll.js.map