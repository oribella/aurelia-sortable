import { expect } from 'chai';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import * as path from 'path';
import { JSDOM } from 'jsdom';

describe('Sortable', () => {
  let component: any;
  const allowedDragSelectors: string[] = ['.drag-handle'];
  const groups = [{}];
  const bindings = {
    groups,
    allowedDragSelectors
  };
  const template = `
<ul oa-sortable="items.bind: groups;
  allowed-drag-selectors.bind: allowedDragSelectors">
  <li
    repeat.for="group of groups"
    oa-sortable-item="item.bind: group;"
    draggable="false">
    <div>` +
    '${group.name}' + `
      <ul oa-sortable="items.bind: group.items;">
        <li
          repeat.for="item of group.items"
          oa-sortable-item="item.bind: item;"
          draggable="false">
          <div>` + '${item.name}' + `</div>
      </ul>
    </div>
  </li>
</ul>
`;
  const html = `
    <html>
      <body>
        <div>
          <div></div>
          <div>
            <div class="target drag-handle"></div>
          </div>
        </div>
      </body>
    </html>
  `;
  let document: Document;
  let target: Element;

  beforeEach(async () => {
    document = (new JSDOM(html)).window.document;
    target = document.querySelector('.target') as Element;
    if (!target) {
      throw new Error(`target not found ${html}`);
    }
    component = StageComponent
      .withResources(path.resolve(__dirname, '../../src/sortable'))
      .inView(template)
      .boundTo(bindings);
    await component.create(bootstrap);
  });

  it('should have bindable items', () => {
    expect(component.viewModel.items).to.equal(bindings.groups);
  });

  it('should handle allow selector', () => {
    expect(component.viewModel.allowDrag({ evt: { target } })).to.be.true;
  });

  afterEach(() => {
    component.dispose();
  });
});
