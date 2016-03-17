"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _aureliaDependencyInjection = require("aurelia-dependency-injection");

var Drag = (function () {
  function Drag() {
    _classCallCheck(this, _Drag);

    this.startLeft = 0;
    this.startTop = 0;
    this.rect = { left: 0, top: 0, width: 0, height: 0 };
    this.offsetX = 0;
    this.offsetY = 0;
  }

  _createClass(Drag, [{
    key: "pin",
    value: function pin() {
      this.item.sortingClass = this.sortingClass;
      this.clone = this.element.cloneNode(true);
      this.clone.style.position = "absolute";
      this.clone.style.width = this.rect.width + "px";
      this.clone.style.height = this.rect.height + "px";
      this.clone.style.pointerEvents = "none";
      this.clone.style.margin = 0;
      this.clone.style.zIndex = this.dragZIndex;
      document.body.appendChild(this.clone);
    }
  }, {
    key: "unpin",
    value: function unpin() {
      this.item.sortingClass = "";
      document.body.removeChild(this.clone);
      this.clone = null;
    }
  }, {
    key: "getCenterX",
    value: function getCenterX() {
      return this.rect.left + this.rect.width / 2;
    }
  }, {
    key: "getCenterY",
    value: function getCenterY() {
      return this.rect.top + this.rect.height / 2;
    }
  }, {
    key: "start",
    value: function start(element, item, x, y, viewportScroll, scrollLeft, scrollTop, dragZIndex, axis, sortingClass, minPosX, maxPosX, minPosY, maxPosY) {
      this.element = element;
      this.item = item;
      this.sortingClass = sortingClass;
      this.dragZIndex = dragZIndex;
      var rect = this.rect = element.getBoundingClientRect();

      this.startLeft = rect.left;
      this.startTop = rect.top;

      this.offsetX = this.startLeft - x;
      this.offsetY = this.startTop - y;

      this.pin();

      this.update(x, y, viewportScroll, scrollLeft, scrollTop, axis, minPosX, maxPosX, minPosY, maxPosY);
    }
  }, {
    key: "update",
    value: function update(x, y, viewportScroll, scrollLeft, scrollTop, axis, minPosX, maxPosX, minPosY, maxPosY) {
      x += this.offsetX;
      y += this.offsetY;
      if (viewportScroll) {
        x += scrollLeft;
        y += scrollTop;
      }

      if (x < minPosX) {
        x = minPosX;
      }
      if (x > maxPosX - this.rect.width) {
        x = maxPosX - this.rect.width;
      }
      console.log(y, scrollTop, minPosY, maxPosY);
      if (y < minPosY) {
        y = minPosY;
      }
      if (y > maxPosY - this.rect.height) {
        y = maxPosY - this.rect.height;
      }

      switch (axis) {
        case "x":
          y = this.startTop;
          break;
        case "y":
          x = this.startLeft;
          break;
      }

      this.clone.style.left = x + "px";
      this.clone.style.top = y + "px";
    }
  }, {
    key: "end",
    value: function end() {
      if (this.element === null) {
        return;
      }
      this.unpin();
      this.element = null;
      this.item = null;
    }
  }]);

  var _Drag = Drag;
  Drag = (0, _aureliaDependencyInjection.transient)()(Drag) || Drag;
  return Drag;
})();

exports.Drag = Drag;