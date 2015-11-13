# oribella/aurelia-sortable

[Demo](http://oribella.github.io/aurelia-sortable)

Sortable plugin for *Aurelia* powered by *Oribella*

## Installation

Install via JSPM

```javascript
jspm install github:oribella/aurelia-sortable
```

Load the plugin

```javascript
export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin("oribella/aurelia-sortable");

  aurelia.start().then(a => a.setRoot());
}
```

## Use the plugin

*sortable*, *sortable-item* will be available as global *custom attributes*.

To get started you need to bind the *sortable*, *sortable-item* attributes in conjunction with the *repeat* attribute.
```markup
<div sortable="items.bind: images">
  <div repeat.for="image of images" sortable-item="item.bind image"></div>
</div>
```
This will enable the plugin to keep track of and move around the items.

However you might want to control the `placeholder` that is moved around. Add a binding:
```markup
<!-- Other bindings omitted -->
<div sortable="placeholder.bind: {
    media: {
      m: '//:0', placeholderClass: 'placeholder'
    }
  }">
</div>
```
to simulate an `item` in the repeat.

If the `sortable` *custom attribute* is in an area that is scrollable you have to bind either a `selector` or an `Element`:
```markup
<!-- Other bindings omitted -->
<div sortable="scroll.bind: '.page-host'">
</div>
```
so it can auto scroll when needed. If you want you may even do a manual scroll when it's auto scrolling or combine them by first auto scrolling then manual scrolling and it should still behave as intended. If you are not happy with the sensitivity or scroll speed for the auto scroll you can set it with below bindings:
```
<!-- Other bindings omitted -->
<div sortable="scroll-sensitivity.bind: 20; scroll-speed.bind: 20">
</div>
```
###### Default `scrollSpeed=10` - how many pixels it will scroll for each frame
###### Default `scrollSensitivity=10` - how many pixels from the `scroll` bounding threshold until it starts auto scrolling.

If you have a vertical or horizontal list you can lock the sortable axis movement with:
```
<!-- Other bindings omitted -->
<!-- Lock to horizontal movement -->
<div sortable="axis: 'x'">
</div>
<!-- Lock to vertical movement -->
<div sortable="axis: 'y'">
</div>
```
###### Default `axis=''` - sets the allowed axis movement.

To be able to constrain the *sortable* bounding rect add:
```markup
<!-- Other bindings omitted -->
<div sortable="bounding-rect.bind: {
  left: 20,
  top: 20,
  right: 20,
  bottom: 20 }">
</div>
```
This is useful if the list has a padding and you still want to lock the `axis` movement.
###### Default `boundingRect={ left: 0, top: 0, right: 0, bottom : 0 }`.

To make sure that the dragging of a *sortable item* always is on top of other elements make sure to bind:
```markup
<!-- Other bindings omitted -->
<div sortable="drag-z-index.bind: 120">
</div>
```
###### Default `dragZIndex=1` - z-index of the dragging *sortable item*.

To be able to have a *sortable* where you might be editing the *sortable items* you can control this by:
```
<!-- Other bindings omitted -->
<div sortable="disallowed-drag-tag-names.bind: 'DIV'">
</div>
```
###### Default `disallowedDragTagNames=['INPUT', 'SELECT', 'TEXTAREA']` - element tags that disallows start dragging.

If that insufficient:
```markup
<!-- Other bindings omitted -->
<div sortable="allow-drag.bind: allowDrag();">
</div>
```
###### Default `allowDrag`
```javascript
@bindable allowDrag = args => {
  if(this.disallowedDragTagNames.indexOf(args.event.target.tagName) !== -1) {
    return false;
  }
  if(args.event.target.isContentEditable) {
    return false;
  }
  return true;
};
```

Control whether a *sortable item* is allowed to move:
```markup
<!-- Other bindings omitted -->
<div sortable="allow-move.bind: allowMove();">
</div>
```
###### Default `allowMove`
```javascript
@bindable allowMove = () => { return true; };
```
