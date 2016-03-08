"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _aureliaDependencyInjection = require("aurelia-dependency-injection");

var AutoScroll = (function () {
  function AutoScroll() {
    _classCallCheck(this, _AutoScroll);

    this.rAFId = -1;
    this.speed = 10;
    this.active = false;
  }

  _createClass(AutoScroll, [{
    key: "start",
    value: function start() {
      var speed = arguments.length <= 0 || arguments[0] === undefined ? 10 : arguments[0];

      this.speed = speed;
    }
  }, {
    key: "update",
    value: function update(element, dirX, dirY, frameCntX, frameCntY) {
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
    }
  }, {
    key: "end",
    value: function end() {
      var cAF = arguments.length <= 0 || arguments[0] === undefined ? cancelAnimationFrame : arguments[0];

      cAF(this.rAFId);
      this.active = false;
    }
  }]);

  var _AutoScroll = AutoScroll;
  AutoScroll = (0, _aureliaDependencyInjection.transient)()(AutoScroll) || AutoScroll;
  return AutoScroll;
})();

exports.AutoScroll = AutoScroll;