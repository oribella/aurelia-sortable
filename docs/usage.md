## Installation

JSPM

```javascript
jspm install npm:oribella-aurelia-sortable
```
NPM
```javascript
npm install oribella-aurelia-sortable
```

## Load the plugin

```javascript
export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin("oribella-aurelia-sortable");

  aurelia.start().then(a => a.setRoot());
}
```

## Use the plugin

*sortable*, *sortable-item* will be available as global *custom attributes*.

To get started you need to bind the *sortable*, *sortable-item* attributes in conjunction with the *repeat* attribute.
```markup
<ul oa-sortable="items.bind: items">
  <li repeat.for="item of items" oa-sortable-item="item.bind: item"></li>
</ul>
```
This will enable the plugin to keep track of and move around the items.

## scroll
If the `sortable` *custom attribute* is in an area that is scrollable you have to bind either a `selector` or an `Element` or `document`:
```markup
<!-- Other bindings omitted -->
<div oa-sortable="scroll.bind: '.page-host'">
</div>
```
Default `scroll='document'`

## scrollSpeed scrollSensitivity
so it can auto scroll when needed. If you want you may even do a manual scroll when it's auto scrolling or combine them by first auto scrolling then manual scrolling and it should still behave as intended. If you are not happy with the sensitivity or scroll speed for the auto scroll you can set it with below bindings:
```
<!-- Other bindings omitted -->
<div oa-sortable="scroll-sensitivity.bind: 20; scroll-speed.bind: 20">
</div>
```
Default `scrollSpeed=10` - how many pixels it will scroll for each frame

Default `scrollSensitivity=10` - how many pixels from the `scroll` bounding threshold until it starts auto scrolling.

## axis
If you have a vertical or horizontal list you can lock the sortable axis movement with:
```
<!-- Other bindings omitted -->
<!-- Lock to horizontal movement -->
<div oa-sortable="axis: 1">
</div>
<!-- Lock to vertical movement -->
<div oa-sortable="axis: 2">
</div>
```
Default `axis=3` - sets the allowed axis movement. Which is both horizontal and vertical movement.

## dragZIndex
To make sure that the dragging of a *sortable item* always is on top of other elements make sure to bind:
```markup
<!-- Other bindings omitted -->
<div oa-sortable="drag-z-index.bind: 120">
</div>
```
Default `dragZIndex=1` - z-index of the dragging *sortable item*.

## disallowedDragTagNames
To be able to have a *sortable* where you might be editing the *sortable items* you can control this by:
```
<!-- Other bindings omitted -->
<div oa-sortable="disallowed-drag-tag-names.bind: 'DIV'">
</div>
```
Default `disallowedDragTagNames=['INPUT', 'SELECT', 'TEXTAREA']` - element tags that disallows start dragging.

## allowedDragSelector allowedDragSelectors
```
<!-- Other bindings omitted -->
<div oa-sortable="allow-drag-selector.bind: '.handle'">
</div>
```
or
```
<!-- Other bindings omitted -->
<div oa-sortable="allow-drag-selectors.bind: ['.handle1', '.handle2]">
</div>
```

## allowDrag
If that is insufficient:
```markup
<!-- Other bindings omitted -->
<div oa-sortable="allow-drag.call: allowDrag($event);">
</div>
```
Default `allowDrag`
```javascript
@bindable public allowDrag = ({ event }: { event: Event, item: SortableItem }) => {
  const target = (event.target as HTMLElement);
  if (this.allowedDragSelector &&
    !matchesSelector(target, this.allowedDragSelector)) {
    return false;
  }
  if (this.allowedDragSelectors.length &&
    this.allowedDragSelectors.filter((selector) => matchesSelector(target, selector)).length === 0) {
    return false;
  }
  if (this.disallowedDragSelectors.filter((selector) => matchesSelector(target, selector)).length !== 0) {
    return false;
  }
  if (target.isContentEditable) {
    return false;
  }
  return true;
}
```
where `$event` has `event` and `item` properties.

`event` - the native DOM event

`item` - the `sortable-item` view-model

## typeFlag
```markup
<!-- Other bindings omitted -->
<div oa-sortable-item="type-flag.bind: 1">
</div>
```
You can use an abstract type flag to enable/disable moving between lists.
This is useful for more advanced scenarios i.e multi nested sortables.
Checkout the advanced demo for more insight.
