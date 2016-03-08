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
    value: function pin(element, rect, dragZIndex) {
      this.element = element;

      var style = {};
      style.position = element.style.position;
      style.left = element.style.left;
      style.top = element.style.top;
      style.width = element.style.width;
      style.height = element.style.height;
      style.pointerEvents = element.style.pointerEvents;
      style.zIndex = element.style.zIndex;

      element.style.position = "absolute";
      element.style.width = rect.width + "px";
      element.style.height = rect.height + "px";
      element.style.pointerEvents = "none";
      element.style.zIndex = dragZIndex;

      return function () {
        Object.keys(style).forEach(function (key) {
          element.style[key] = style[key];
        });
      };
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
    value: function start(element, pageX, pageY, scrollContainsOffsetParent, sortableContainsScroll, scrollLeft, scrollTop, dragZIndex, axis, sortableRect) {
      var rect = this.rect = element.getBoundingClientRect();

      this.startParentLeft = 0;
      this.startParentTop = 0;
      if (scrollContainsOffsetParent) {
        this.startParentLeft = scrollLeft;
        this.startParentTop = scrollTop;
      }
      this.startLeft = rect.left;
      this.startTop = rect.top;
      if (sortableContainsScroll) {
        var offsetParentRect = element.offsetParent.getBoundingClientRect();
        this.startLeft -= offsetParentRect.left;
        this.startTop -= offsetParentRect.top;
      }
      this.offsetX = this.startParentLeft + this.startLeft - pageX - scrollLeft;
      this.offsetY = this.startParentTop + this.startTop - pageY - scrollTop;

      this.unpin = this.pin(element, rect, dragZIndex);

      this.update(pageX, pageY, scrollLeft, scrollTop, axis, sortableRect);
    }
  }, {
    key: "update",
    value: function update(x, y, scrollLeft, scrollTop, axis, _ref) {
      var left = _ref.left;
      var top = _ref.top;
      var bottom = _ref.bottom;
      var right = _ref.right;

      x += this.offsetX + scrollLeft;
      y += this.offsetY + scrollTop;

      if (x < left) {
        x = left;
      }
      if (x > right - this.rect.width) {
        x = right - this.rect.width;
      }
      if (y < top) {
        y = top;
      }
      if (y > bottom - this.rect.height) {
        y = bottom - this.rect.height;
      }

      switch (axis) {
        case "x":
          y = this.startTop;
          break;
        case "y":
          x = this.startLeft;
          break;
      }

      this.element.style.left = x + "px";
      this.element.style.top = y + "px";
    }
  }, {
    key: "end",
    value: function end() {
      if (this.element) {
        if (typeof this.unpin === "function") {
          this.unpin();
        }
        this.element = null;
      }
    }
  }]);

  var _Drag = Drag;
  Drag = (0, _aureliaDependencyInjection.transient)()(Drag) || Drag;
  return Drag;
})();

exports.Drag = Drag;