System.register([], function (_export) {
  "use strict";

  var Drag;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  return {
    setters: [],
    execute: function () {
      Drag = (function () {
        function Drag() {
          _classCallCheck(this, Drag);

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
          value: function start(element, pageX, pageY, _ref, dragZIndex, placeholder) {
            var scrollLeft = _ref.scrollLeft;
            var scrollTop = _ref.scrollTop;

            var rect = this.rect = element.getBoundingClientRect();
            var offsetParentRect = element.offsetParent.getBoundingClientRect();

            this.startLeft = rect.left - offsetParentRect.left;
            this.startTop = rect.top - offsetParentRect.top;

            this.offsetX = this.startLeft - pageX - scrollLeft;
            this.offsetY = this.startTop - pageY - scrollTop;

            this.unpin = this.pin(element, rect, dragZIndex);

            if (typeof placeholder.style !== "object") {
              placeholder.style = {};
            }
            placeholder.style.width = rect.width + "px";
            placeholder.style.height = rect.height + "px";

            this.update(pageX, pageY, { scrollLeft: scrollLeft, scrollTop: scrollTop });
          }
        }, {
          key: "update",
          value: function update(pageX, pageY, _ref2, axis) {
            var scrollLeft = _ref2.scrollLeft;
            var scrollTop = _ref2.scrollTop;

            var left = pageX + this.offsetX + scrollLeft;
            var top = pageY + this.offsetY + scrollTop;

            switch (axis) {
              case "x":
                top = this.startTop;
                break;
              case "y":
                left = this.startLeft;
                break;
              default:
                break;
            }

            this.element.style.left = left + "px";
            this.element.style.top = top + "px";
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

        return Drag;
      })();

      _export("Drag", Drag);
    }
  };
});