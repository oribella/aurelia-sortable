"use strict";

System.register(["aurelia-dependency-injection"], function (_export, _context) {
  "use strict";

  var transient, _dec, _class, Drag;

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
      _export("Drag", Drag = (_dec = transient(), _dec(_class = function () {
        function Drag() {
          _classCallCheck(this, Drag);

          this.startLeft = 0;
          this.startTop = 0;
          this.rect = { left: 0, top: 0, width: 0, height: 0 };
          this.offsetX = 0;
          this.offsetY = 0;
        }

        Drag.prototype.pin = function pin() {
          this.item.sortingClass = this.sortingClass;
          this.clone = this.element.cloneNode(true);
          this.clone.style.position = "absolute";
          this.clone.style.width = this.rect.width + "px";
          this.clone.style.height = this.rect.height + "px";
          this.clone.style.pointerEvents = "none";
          this.clone.style.margin = 0;
          this.clone.style.zIndex = this.dragZIndex;
          document.body.appendChild(this.clone);
        };

        Drag.prototype.unpin = function unpin() {
          this.item.sortingClass = "";
          document.body.removeChild(this.clone);
          this.clone = null;
        };

        Drag.prototype.getCenterX = function getCenterX() {
          return this.rect.left + this.rect.width / 2;
        };

        Drag.prototype.getCenterY = function getCenterY() {
          return this.rect.top + this.rect.height / 2;
        };

        Drag.prototype.start = function start(element, item, x, y, viewportScroll, scrollLeft, scrollTop, dragZIndex, axis, sortingClass, minPosX, maxPosX, minPosY, maxPosY) {
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
        };

        Drag.prototype.update = function update(x, y, viewportScroll, scrollLeft, scrollTop, axis, minPosX, maxPosX, minPosY, maxPosY) {
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
        };

        Drag.prototype.end = function end() {
          if (this.element === null) {
            return;
          }
          this.unpin();
          this.element = null;
          this.item = null;
        };

        return Drag;
      }()) || _class));

      _export("Drag", Drag);
    }
  };
});
//# sourceMappingURL=drag.js.map