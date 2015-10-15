define(["exports", "aurelia-templating", "aurelia-dependency-injection", "oribella-default-gestures"], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _oribellaDefaultGestures) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === "function") { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer.call(target); Object.defineProperty(target, key, descriptor); }

  var Sortable = (function () {
    var _instanceInitializers = {};
    var _instanceInitializers = {};

    _createDecoratedClass(Sortable, [{
      key: "scroll",
      decorators: [_aureliaTemplating.bindable],
      initializer: function initializer() {
        return null;
      },
      enumerable: true
    }, {
      key: "scrollSpeed",
      decorators: [_aureliaTemplating.bindable],
      initializer: function initializer() {
        return 10;
      },
      enumerable: true
    }, {
      key: "scrollSensitivity",
      decorators: [_aureliaTemplating.bindable],
      initializer: function initializer() {
        return 10;
      },
      enumerable: true
    }, {
      key: "items",
      decorators: [_aureliaTemplating.bindable],
      initializer: function initializer() {
        return [];
      },
      enumerable: true
    }, {
      key: "placeholder",
      decorators: [_aureliaTemplating.bindable],
      initializer: function initializer() {
        return { placeholderClass: "placeholder", style: {} };
      },
      enumerable: true
    }, {
      key: "axis",
      decorators: [_aureliaTemplating.bindable],
      initializer: function initializer() {
        return "";
      },
      enumerable: true
    }, {
      key: "moved",
      decorators: [_aureliaTemplating.bindable],
      initializer: function initializer() {
        return function () {};
      },
      enumerable: true
    }, {
      key: "dragZIndex",
      decorators: [_aureliaTemplating.bindable],
      initializer: function initializer() {
        return 1;
      },
      enumerable: true
    }, {
      key: "disallowedDragTagNames",
      decorators: [_aureliaTemplating.bindable],
      initializer: function initializer() {
        return ["INPUT", "SELECT", "TEXTAREA"];
      },
      enumerable: true
    }, {
      key: "allowDrag",
      decorators: [_aureliaTemplating.bindable],
      initializer: function initializer() {
        var _this = this;

        return function (args) {
          if (_this.disallowedDragTagNames.indexOf(args.event.target.tagName) !== -1) {
            return false;
          }
          if (args.event.target.isContentEditable) {
            return false;
          }
          return true;
        };
      },
      enumerable: true
    }, {
      key: "allowMove",
      decorators: [_aureliaTemplating.bindable],
      initializer: function initializer() {
        return function () {
          return true;
        };
      },
      enumerable: true
    }], null, _instanceInitializers);

    function Sortable(element) {
      _classCallCheck(this, _Sortable);

      _defineDecoratedPropertyDescriptor(this, "scroll", _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, "scrollSpeed", _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, "scrollSensitivity", _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, "items", _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, "placeholder", _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, "axis", _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, "moved", _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, "dragZIndex", _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, "disallowedDragTagNames", _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, "allowDrag", _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, "allowMove", _instanceInitializers);

      this.element = element;
      this.selector = "[sortable-item]";
      /*this.options = {
        strategy: STRATEGY_FLAG.REMOVE_IF_POINTERS_GT
      };*/
      this.fromIx = -1;
      this.toIx = -1;
      this.dragX = 0;
      this.dragY = 0;
      this.isAutoScrollingX = false;
      this.isAutoScrollingY = false;
    }

    _createDecoratedClass(Sortable, [{
      key: "bindScroll",
      value: function bindScroll(scroll, fn) {
        scroll.addEventListener("scroll", fn, false);
        return function () {
          scroll.removeEventListener("scroll", fn, false);
        };
      }
    }, {
      key: "activate",
      value: function activate() {
        this.removeListener = _oribellaDefaultGestures.oribella.on(this.element, "swipe", this);
        if (typeof this.scroll === "string") {
          this.scroll = this.closest(this.element, this.scroll, document);
        }
        if (!(this.scroll instanceof Element)) {
          this.scroll = this.element;
        }
      }
    }, {
      key: "deactivate",
      value: function deactivate() {
        this.removeListener();
      }
    }, {
      key: "attached",
      value: function attached() {
        this.activate();
      }
    }, {
      key: "detached",
      value: function detached() {
        if (typeof this.removeListener === "function") {
          this.removeListener();
        }
      }
    }, {
      key: "dragStyle",
      value: function dragStyle() {
        var _this2 = this;

        var style = {};
        style.position = this.dragElement.style.position;
        style.left = this.dragElement.style.left;
        style.top = this.dragElement.style.top;
        style.width = this.dragElement.style.width;
        style.height = this.dragElement.style.height;
        style.pointerEvents = this.dragElement.style.pointerEvents;
        style.zIndex = this.dragElement.style.zIndex;

        this.dragElement.style.position = "absolute";
        this.dragElement.style.width = this.dragRect.width + "px";
        this.dragElement.style.height = this.dragRect.height + "px";
        this.dragElement.style.pointerEvents = "none";
        this.dragElement.style.zIndex = this.dragZIndex;

        return function () {
          Object.keys(style).forEach(function (key) {
            _this2.dragElement.style[key] = style[key];
          });
        };
      }
    }, {
      key: "dragStart",
      value: function dragStart(element) {
        this.removeScroll = this.bindScroll(this.scroll, this.onScroll.bind(this));
        this.dragElement = element;
        this.scrollRect = this.scroll.getBoundingClientRect();
        this.scrollWidth = this.scroll.scrollWidth;
        this.scrollHeight = this.scroll.scrollHeight;
        this.dragRect = element.getBoundingClientRect();
        this.offsetParentRect = element.offsetParent.getBoundingClientRect();

        this.dragX = this.dragRect.left - this.offsetParentRect.left;
        this.dragY = this.dragRect.top - this.offsetParentRect.top;

        this.updateDragWhenScrolling = this.scroll.contains(element.offsetParent);
        if (element.offsetParent === this.scroll) {
          this.dragX += this.scroll.scrollLeft;
          this.dragY += this.scroll.scrollTop;
        }

        this.removeDragStyle = this.dragStyle();

        if (!this.placeholder.style) {
          this.placeholder.style = {};
        }
        this.placeholder.style.width = this.dragRect.width + "px";
        this.placeholder.style.height = this.dragRect.height + "px";

        this.moveTo(element, 0, 0);
      }
    }, {
      key: "dragEnd",
      value: function dragEnd() {
        this.stopAutoScroll();
        if (this.dragElement) {
          if (typeof this.removeDragStyle === "function") {
            this.removeDragStyle();
          }
          this.dragElement = null;
        }
        if (typeof this.removeScroll === "function") {
          this.removeScroll();
        }
      }
    }, {
      key: "onScroll",
      value: function onScroll() {
        var display = this.hide(this.dragElement);
        this.tryMove(this.x, this.y);
        this.show(this.dragElement, display);
      }
    }, {
      key: "getScrollDX",
      value: function getScrollDX(x) {
        if (x >= this.scrollRect.right - this.scrollSensitivity) {
          return 1;
        } else if (x <= this.scrollRect.left + this.scrollSensitivity) {
          return -1;
        } else {
          return 0;
        }
      }
    }, {
      key: "getScrollDY",
      value: function getScrollDY(y) {
        if (y >= this.scrollRect.bottom - this.scrollSensitivity) {
          return 1;
        } else if (y <= this.scrollRect.top + this.scrollSensitivity) {
          return -1;
        } else {
          return 0;
        }
      }
    }, {
      key: "canAutoScrollX",
      value: function canAutoScrollX(x) {
        return this.getScrollDX(x) !== 0;
      }
    }, {
      key: "canAutoScrollY",
      value: function canAutoScrollY(y) {
        return this.getScrollDY(y) !== 0;
      }
    }, {
      key: "autoScrollX",
      value: function autoScrollX(x, y) {
        var dx = this.getScrollDX(x);
        var ticks;
        if (dx > 0) {
          //down
          ticks = Math.ceil((this.scrollWidth - this.scrollRect.width - this.scroll.scrollLeft) / this.scrollSpeed);
        } else if (dx < 0) {
          //up
          ticks = this.scroll.scrollLeft / this.scrollSpeed;
        } else {
          return null;
        }
        var autoScroll = (function loop() {
          if (ticks <= 0) {
            this.isAutoScrollingX = false;
            return;
          }

          this.scroll.scrollLeft += dx * this.scrollSpeed;
          if (this.updateDragWhenScrolling) {
            this.moveTo(this.dragElement, dx * this.scrollSpeed, 0);
          }

          this.tryMove(x, y);

          --ticks;
          if (ticks <= 0) {
            this.isAutoScrollingX = false;
            return;
          }

          requestAnimationFrame(autoScroll);
        }).bind(this);

        if (ticks > 0) {
          this.isAutoScrollingX = true;
          autoScroll();
        }

        return function () {
          ticks = 0;
        };
      }
    }, {
      key: "autoScrollY",
      value: function autoScrollY(x, y) {
        var dy = this.getScrollDY(y);
        var ticks;
        if (dy > 0) {
          //down
          ticks = Math.ceil((this.scrollHeight - this.scrollRect.height - this.scroll.scrollTop) / this.scrollSpeed);
        } else if (dy < 0) {
          //up
          ticks = this.scroll.scrollTop / this.scrollSpeed;
        } else {
          return null;
        }
        var autoScroll = (function loop() {
          if (ticks <= 0) {
            this.isAutoScrollingY = false;
            return;
          }

          this.scroll.scrollTop += dy * this.scrollSpeed;
          if (this.updateDragWhenScrolling) {
            this.moveTo(this.dragElement, 0, dy * this.scrollSpeed);
          }

          this.tryMove(x, y);

          --ticks;
          if (ticks <= 0) {
            this.isAutoScrollingY = false;
            return;
          }

          requestAnimationFrame(autoScroll);
        }).bind(this);

        if (ticks > 0) {
          this.isAutoScrollingY = true;
          autoScroll();
        }

        return function () {
          ticks = 0;
        };
      }
    }, {
      key: "autoScroll",
      value: function autoScroll(x, y) {
        var canAutoScrollX = false;
        var canAutoScrollY = false;

        switch (this.axis) {
          case "x":
            canAutoScrollX = this.canAutoScrollX(x);
            break;
          case "y":
            canAutoScrollY = this.canAutoScrollY(y);
            break;
          default:
            canAutoScrollX = this.canAutoScrollX(x);
            canAutoScrollY = this.canAutoScrollY(y);
            break;
        }

        if (!this.isAutoScrollingX && canAutoScrollX) {
          this.stopAutoScrollX = this.autoScrollX(x, y);
        } else if (this.isAutoScrollingX && !canAutoScrollX) {
          if (this.stopAutoScrollX) {
            this.stopAutoScrollX();
          }
        }

        if (!this.isAutoScrollingY && canAutoScrollY) {
          this.stopAutoScrollY = this.autoScrollY(x, y);
        } else if (this.isAutoScrollingY && !canAutoScrollY) {
          if (this.stopAutoScrollY) {
            this.stopAutoScrollY();
          }
        }
      }
    }, {
      key: "moveTo",
      value: function moveTo(element, dx, dy) {
        this.dragX += dx;
        this.dragY += dy;
        element.style.left = this.dragX + "px";
        element.style.top = this.dragY + "px";
      }
    }, {
      key: "hide",
      value: function hide(element) {
        var display = element.style.display;
        element.style.display = "none";
        return display;
      }
    }, {
      key: "show",
      value: function show(element, display) {
        element.style.display = display;
      }
    }, {
      key: "addPlaceholder",
      value: function addPlaceholder(toIx) {
        this.items.splice(toIx, 0, this.placeholder);
      }
    }, {
      key: "removePlaceholder",
      value: function removePlaceholder() {
        var ix = this.items.indexOf(this.placeholder);
        if (ix !== -1) {
          this.items.splice(ix, 1);
        }
      }
    }, {
      key: "movePlaceholder",
      value: function movePlaceholder(toIx) {
        var fromIx = this.items.indexOf(this.placeholder);
        this.move(fromIx, toIx);
      }
    }, {
      key: "move",
      value: function move(fromIx, toIx) {
        if (fromIx !== -1 && toIx !== -1 && fromIx !== toIx) {
          this.items.splice(toIx, 0, this.items.splice(fromIx, 1)[0]);
        }
      }
    }, {
      key: "closest",
      value: function closest(element, selector) {
        var rootElement = arguments.length <= 2 || arguments[2] === undefined ? this.element : arguments[2];

        var valid = false;
        while (!valid && element !== null && element !== rootElement && element !== document) {
          valid = (0, _oribellaDefaultGestures.matchesSelector)(element, selector);
          if (valid) {
            break;
          }
          element = element.parentNode;
        }
        return valid ? element : null;
      }
    }, {
      key: "getItemModel",
      value: function getItemModel(element) {
        return element.au["sortable-item"].model;
      }
    }, {
      key: "tryMove",
      value: function tryMove(x, y) {
        var element = document.elementFromPoint(x, y);
        if (!element) {
          return;
        }
        element = this.closest(element, this.selector);
        if (element) {
          var model = this.getItemModel(element);
          if (!this.allowMove({ item: model.item })) {
            return;
          }
          var ix = model.ctx.$index;
          this.movePlaceholder(ix);
        }
      }
    }, {
      key: "down",
      value: function down(e, data, element) {
        if (this.allowDrag({ event: e, item: this.getItemModel(element).item })) {
          e.preventDefault();
          return undefined;
        }
        return false;
      }
    }, {
      key: "start",
      value: function start(e, data, element) {
        this.dragStart(element);
        this.x = data.pagePoints[0].x;
        this.y = data.pagePoints[0].y;
        var model = this.getItemModel(element);
        this.fromIx = model.ctx.$index;
        this.toIx = -1;
        this.addPlaceholder(this.fromIx);
      }
    }, {
      key: "update",
      value: function update(e, data, element) {
        var p = data.pagePoints[0];
        var x = p.x;
        var y = p.y;
        var delta = data.swipe.getDelta();
        var dx = delta[0];
        var dy = delta[1];

        this.x = p.x;
        this.y = p.y;

        switch (this.axis) {
          case "x":
            y = this.dragRect.top + this.dragRect.height / 2;
            dy = 0;
            break;
          case "y":
            x = this.dragRect.left + this.dragRect.width / 2;
            dx = 0;
            break;
          default:
            break;
        }

        this.moveTo(element, dx, dy);
        var display = this.hide(element);
        this.tryMove(x, y);
        this.show(element, display);

        this.autoScroll(x, y);
      }
    }, {
      key: "end",
      value: function end(e, data, element) {
        this.stop(e, data, element);
      }
    }, {
      key: "cancel",
      value: function cancel() /*e, data, element*/{
        this.dragEnd();
        this.removePlaceholder();
      }
    }, {
      key: "stopAutoScroll",
      value: function stopAutoScroll() {
        if (this.stopAutoScrollX) {
          this.stopAutoScrollX();
        }
        if (this.stopAutoScrollY) {
          this.stopAutoScrollY();
        }
      }
    }, {
      key: "stop",
      value: function stop() /*e, data, element*/{
        this.toIx = this.items.indexOf(this.placeholder);
        if (this.toIx < 0) {
          return; //cancelled
        }
        this.move(this.toIx < this.fromIx ? this.fromIx + 1 : this.fromIx, this.toIx);
        this.dragEnd();
        this.removePlaceholder();

        if (this.fromIx < this.toIx) {
          --this.toIx;
        }
        if (this.fromIx !== this.toIx) {
          this.moved({ fromIx: this.fromIx, toIx: this.toIx });
        }
      }
    }], null, _instanceInitializers);

    var _Sortable = Sortable;
    Sortable = (0, _aureliaDependencyInjection.transient)()(Sortable) || Sortable;
    Sortable = (0, _aureliaDependencyInjection.inject)(Element)(Sortable) || Sortable;
    Sortable = (0, _aureliaTemplating.customAttribute)("sortable")(Sortable) || Sortable;
    return Sortable;
  })();

  exports.Sortable = Sortable;

  var SortableItem = (function () {
    var _instanceInitializers2 = {};

    function SortableItem() {
      _classCallCheck(this, _SortableItem);

      _defineDecoratedPropertyDescriptor(this, "item", _instanceInitializers2);
    }

    _createDecoratedClass(SortableItem, [{
      key: "bind",
      value: function bind(ctx) {
        this.ctx = ctx; //Need a reference to the item's $index
      }
    }, {
      key: "item",
      decorators: [_aureliaTemplating.bindable],
      initializer: function initializer() {
        return null;
      },
      enumerable: true
    }], null, _instanceInitializers2);

    var _SortableItem = SortableItem;
    SortableItem = (0, _aureliaTemplating.customAttribute)("sortable-item")(SortableItem) || SortableItem;
    return SortableItem;
  })();

  exports.SortableItem = SortableItem;
});
/*, STRATEGY_FLAG*/