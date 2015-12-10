"use strict";

System.register(["aurelia-dependency-injection"], function (_export) {
  var transient, _createClass, _dec, _class, AutoScroll;

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
      _createClass = (function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();

      _export("AutoScroll", AutoScroll = (_dec = transient(), _dec(_class = (function () {
        function AutoScroll() {
          _classCallCheck(this, AutoScroll);

          this.ticks = [0, 0];
          this.rAFId = -1;
          this.axis = "";
          this.speed = 10;
          this.sensitivity = 10;
          this.active = false;
        }

        _createClass(AutoScroll, [{
          key: "start",
          value: function start() {
            var axis = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
            var speed = arguments.length <= 1 || arguments[1] === undefined ? 10 : arguments[1];
            var sensitivity = arguments.length <= 2 || arguments[2] === undefined ? 10 : arguments[2];
            this.axis = axis;
            this.speed = speed;
            this.sensitivity = sensitivity;
          }
        }, {
          key: "update",
          value: function update(element, x, y, scrollWidth, scrollHeight, scrollRect) {
            var _this = this;

            var rAF = arguments.length <= 6 || arguments[6] === undefined ? requestAnimationFrame : arguments[6];
            var cAF = arguments.length <= 7 || arguments[7] === undefined ? cancelAnimationFrame : arguments[7];
            var d = this.getScrollDirection(x, y, scrollRect);

            if (this.active) {
              if (d[0] === 0 && d[1] === 0) {
                cAF(this.rAFId);
                this.active = false;
              }

              return;
            }

            if (d[0] === 0 && d[1] === 0) {
              return;
            }

            this.ticks = this.getTicks(d, element.scrollLeft, element.scrollTop, scrollWidth, scrollHeight, scrollRect.width, scrollRect.height);

            if (this.ticks[0] <= 0 && this.ticks[1] <= 0) {
              return;
            }

            var scrollDeltaX = d[0] * this.speed;
            var scrollDeltaY = d[1] * this.speed;

            var autoScroll = function autoScroll() {
              if (_this.ticks[0] > 0) {
                element.scrollLeft += scrollDeltaX;
              }

              if (_this.ticks[1] > 0) {
                element.scrollTop += scrollDeltaY;
              }

              --_this.ticks[0];
              --_this.ticks[1];

              if (_this.ticks[0] <= 0 && _this.ticks[1] <= 0) {
                _this.active = false;
                return;
              }

              _this.rAFId = rAF(autoScroll);
            };

            this.active = true;
            autoScroll();
          }
        }, {
          key: "end",
          value: function end() {
            var cAF = arguments.length <= 0 || arguments[0] === undefined ? cancelAnimationFrame : arguments[0];
            cAF(this.rAFId);
            this.ticks = [0, 0];
          }
        }, {
          key: "getTicks",
          value: function getTicks(d, scrollLeft, scrollTop, scrollWidth, scrollHeight, width, height) {
            var ticks = [];
            ticks[0] = d[0] > 0 ? Math.ceil((scrollWidth - width - scrollLeft) / this.speed) : d[0] < 0 ? scrollLeft / this.speed : 0;
            ticks[1] = d[1] > 0 ? Math.ceil((scrollHeight - height - scrollTop) / this.speed) : d[1] < 0 ? scrollTop / this.speed : 0;
            return ticks;
          }
        }, {
          key: "getScrollDirection",
          value: function getScrollDirection(x, y, scrollRect) {
            var left = scrollRect.left;
            var top = scrollRect.top;
            var right = scrollRect.right;
            var _scrollRect$bottom = scrollRect.bottom;
            var bottom = _scrollRect$bottom === undefined ? 0 : _scrollRect$bottom;
            var d = [0, 0];
            d[0] = this.axis === "y" ? 0 : x >= right - this.sensitivity ? 1 : x <= left + this.sensitivity ? -1 : 0;
            d[1] = this.axis === "x" ? 0 : y >= bottom - this.sensitivity ? 1 : y <= top + this.sensitivity ? -1 : 0;
            return d;
          }
        }]);

        return AutoScroll;
      })()) || _class));

      _export("AutoScroll", AutoScroll);
    }
  };
});