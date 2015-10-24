System.register(["aurelia-pal", "aurelia-templating", "aurelia-dependency-injection", "oribella-default-gestures", "./drag", "./auto-scroll"], function (_export) {
  "use strict";

  var DOM, customAttribute, bindable, inject, transient, oribella, matchesSelector, Drag, AutoScroll, Sortable, SortableItem;

  var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === "function") { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

  return {
    setters: [function (_aureliaPal) {
      DOM = _aureliaPal.DOM;
    }, function (_aureliaTemplating) {
      customAttribute = _aureliaTemplating.customAttribute;
      bindable = _aureliaTemplating.bindable;
    }, function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
      transient = _aureliaDependencyInjection.transient;
    }, function (_oribellaDefaultGestures) {
      oribella = _oribellaDefaultGestures.oribella;
      matchesSelector = _oribellaDefaultGestures.matchesSelector;
    }, function (_drag) {
      Drag = _drag.Drag;
    }, function (_autoScroll) {
      AutoScroll = _autoScroll.AutoScroll;
    }],
    execute: function () {
      Sortable = (function () {
        var _instanceInitializers = {};
        var _instanceInitializers = {};

        _createDecoratedClass(Sortable, [{
          key: "scroll",
          decorators: [bindable],
          initializer: function initializer() {
            return null;
          },
          enumerable: true
        }, {
          key: "scrollSpeed",
          decorators: [bindable],
          initializer: function initializer() {
            return 10;
          },
          enumerable: true
        }, {
          key: "scrollSensitivity",
          decorators: [bindable],
          initializer: function initializer() {
            return 10;
          },
          enumerable: true
        }, {
          key: "items",
          decorators: [bindable],
          initializer: function initializer() {
            return [];
          },
          enumerable: true
        }, {
          key: "placeholder",
          decorators: [bindable],
          initializer: function initializer() {
            return { placeholderClass: "placeholder", style: {} };
          },
          enumerable: true
        }, {
          key: "axis",
          decorators: [bindable],
          initializer: function initializer() {
            return "";
          },
          enumerable: true
        }, {
          key: "boundingRect",
          decorators: [bindable],
          initializer: function initializer() {
            return null;
          },
          //{ left, top, right, bottom }
          enumerable: true
        }, {
          key: "moved",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }, {
          key: "dragZIndex",
          decorators: [bindable],
          initializer: function initializer() {
            return 1;
          },
          enumerable: true
        }, {
          key: "disallowedDragTagNames",
          decorators: [bindable],
          initializer: function initializer() {
            return ["INPUT", "SELECT", "TEXTAREA"];
          },
          enumerable: true
        }, {
          key: "allowDrag",
          decorators: [bindable],
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
          decorators: [bindable],
          initializer: function initializer() {
            return function () {
              return true;
            };
          },
          enumerable: true
        }], null, _instanceInitializers);

        function Sortable(element, drag, autoScroll) {
          _classCallCheck(this, _Sortable);

          _defineDecoratedPropertyDescriptor(this, "scroll", _instanceInitializers);

          _defineDecoratedPropertyDescriptor(this, "scrollSpeed", _instanceInitializers);

          _defineDecoratedPropertyDescriptor(this, "scrollSensitivity", _instanceInitializers);

          _defineDecoratedPropertyDescriptor(this, "items", _instanceInitializers);

          _defineDecoratedPropertyDescriptor(this, "placeholder", _instanceInitializers);

          _defineDecoratedPropertyDescriptor(this, "axis", _instanceInitializers);

          _defineDecoratedPropertyDescriptor(this, "boundingRect", _instanceInitializers);

          _defineDecoratedPropertyDescriptor(this, "moved", _instanceInitializers);

          _defineDecoratedPropertyDescriptor(this, "dragZIndex", _instanceInitializers);

          _defineDecoratedPropertyDescriptor(this, "disallowedDragTagNames", _instanceInitializers);

          _defineDecoratedPropertyDescriptor(this, "allowDrag", _instanceInitializers);

          _defineDecoratedPropertyDescriptor(this, "allowMove", _instanceInitializers);

          this.selector = "[sortable-item]";
          this.fromIx = -1;
          this.toIx = -1;
          this.pageX = 0;
          this.pageY = 0;
          this.scrollRect = { left: 0, top: 0, width: 0, height: 0 };

          this.element = element;
          this.drag = drag;
          this.autoScroll = autoScroll;
        }

        _createDecoratedClass(Sortable, [{
          key: "activate",
          value: function activate() {
            this.removeListener = oribella.on(this.element, "swipe", this);
            if (typeof this.scroll === "string") {
              this.scroll = this.closest(this.element, this.scroll);
            }
            if (!(this.scroll instanceof DOM.Element)) {
              this.scroll = this.element;
            }
            this.removeScroll = this.bindScroll(this.scroll, this.onScroll.bind(this));
          }
        }, {
          key: "deactivate",
          value: function deactivate() {
            if (typeof this.removeListener === "function") {
              this.removeListener();
            }
            if (typeof this.removeScroll === "function") {
              this.removeScroll();
            }
          }
        }, {
          key: "attached",
          value: function attached() {
            this.activate();
          }
        }, {
          key: "detached",
          value: function detached() {
            this.deactivate();
          }
        }, {
          key: "bindScroll",
          value: function bindScroll(scroll, fn) {
            scroll.addEventListener("scroll", fn, false);
            return function () {
              scroll.removeEventListener("scroll", fn, false);
            };
          }
        }, {
          key: "onScroll",
          value: function onScroll() {
            if (!this.drag.element) {
              return;
            }
            this.drag.update(this.pageX, this.pageY, this.scroll, this.axis);

            var _getPoint = this.getPoint(this.pageX, this.pageY);

            var x = _getPoint.x;
            var y = _getPoint.y;

            this.tryMove(x, y);
          }
        }, {
          key: "hide",
          value: function hide(element) {
            var display = element.style.display;
            element.style.display = "none";
            return function () {
              element.style.display = display;
            };
          }
        }, {
          key: "closest",
          value: function closest(element, selector) {
            var rootElement = arguments.length <= 2 || arguments[2] === undefined ? document : arguments[2];

            var valid = false;
            while (!valid && element !== null && element !== rootElement && element !== document) {
              valid = matchesSelector(element, selector);
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
          key: "tryUpdate",
          value: function tryUpdate(pageX, pageY) {
            var showFn = this.hide(this.drag.element);
            this.tryMove(pageX, pageY);
            showFn();
          }
        }, {
          key: "tryMove",
          value: function tryMove(x, y) {
            var doc = arguments.length <= 2 || arguments[2] === undefined ? document : arguments[2];

            var element = doc.elementFromPoint(x, y);
            if (!element) {
              return;
            }
            element = this.closest(element, this.selector, this.element);
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
          key: "getPoint",
          value: function getPoint(pageX, pageY) {
            switch (this.axis) {
              case "x":
                pageY = this.drag.getCenterY();
                break;
              case "y":
                pageX = this.drag.getCenterX();
                break;
              default:
                break;
            }
            return {
              x: Math.max(this.boundingRect.left, Math.min(this.boundingRect.right, pageX)),
              y: Math.max(this.boundingRect.top, Math.min(this.boundingRect.bottom, pageY))
            };
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
            this.pageX = data.pagePoints[0].x;
            this.pageY = data.pagePoints[0].y;
            this.scrollRect = this.scroll.getBoundingClientRect();
            this.boundingRect = this.boundingRect || { left: this.scrollRect.left + 5, top: this.scrollRect.top + 5, right: this.scrollRect.right - 5, bottom: this.scrollRect.bottom - 5 };
            this.drag.start(element, this.pageX, this.pageY, this.scroll, this.dragZIndex, this.placeholder, this.axis);
            this.autoScroll.start(this.axis, this.scrollSpeed, this.scrollSensitivity);
            this.fromIx = this.getItemModel(element).ctx.$index;
            this.toIx = -1;
            this.addPlaceholder(this.fromIx);
          }
        }, {
          key: "update",
          value: function update(e, data) {
            var p = data.pagePoints[0];
            var pageX = this.pageX = p.x;
            var pageY = this.pageY = p.y;

            this.drag.update(pageX, pageY, this.scroll, this.axis);

            var _getPoint2 = this.getPoint(pageX, pageY);

            var x = _getPoint2.x;
            var y = _getPoint2.y;

            this.tryUpdate(x, y);
            this.autoScroll.update(this.scroll, x, y, this.scrollRect);
          }
        }, {
          key: "end",
          value: function end() {
            this.stop();
          }
        }, {
          key: "cancel",
          value: function cancel() {
            this.drag.end();
            this.autoScroll.stop();
            this.removePlaceholder();
          }
        }, {
          key: "stop",
          value: function stop() {
            this.toIx = this.items.indexOf(this.placeholder);
            if (this.toIx < 0) {
              return; //cancelled
            }
            this.move(this.toIx < this.fromIx ? this.fromIx + 1 : this.fromIx, this.toIx);
            this.drag.end();
            this.autoScroll.stop();
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
        Sortable = transient()(Sortable) || Sortable;
        Sortable = inject(DOM.Element, Drag, AutoScroll)(Sortable) || Sortable;
        Sortable = customAttribute("sortable")(Sortable) || Sortable;
        return Sortable;
      })();

      _export("Sortable", Sortable);

      SortableItem = (function () {
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
          decorators: [bindable],
          initializer: function initializer() {
            return null;
          },
          enumerable: true
        }], null, _instanceInitializers2);

        var _SortableItem = SortableItem;
        SortableItem = customAttribute("sortable-item")(SortableItem) || SortableItem;
        return SortableItem;
      })();

      _export("SortableItem", SortableItem);
    }
  };
});