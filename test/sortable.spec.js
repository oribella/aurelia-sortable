import {Container} from "aurelia-dependency-injection";
import {BehaviorInstance} from "aurelia-templating";
import {Sortable} from "../src/sortable";

describe("Sortable", () => {
  beforeEach(() => {
    new Container().makeGlobal();
  });

  it("should set default values", () => {
      var sortable = BehaviorInstance.createForUnitTest(Sortable);
      expect(sortable.scrollSpeed).to.equal(10);
      expect(sortable.scrollSensitivity).to.equal(10);
      expect(sortable.items).to.have.length(0);
      expect(sortable.placeholder).to.deep.equal({ placeholderClass: "placeholder", style: {} });
      expect(sortable.axis).to.have.length(0);
      expect(sortable.moved).to.be.a("function");
      expect(sortable.allowDrag).to.be.a("function");
      expect(sortable.allowMove).to.be.a("function");
    });
});
