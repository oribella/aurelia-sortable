import {resolver, Container} from 'aurelia-dependency-injection';

@resolver()
export class OptionalParent {
  // tslint:disable-next-line:ban-types
  constructor(private key: Function | string) {}

  public get(container: Container) {
    if (container.parent && container.parent.hasResolver(this.key, true)) {
      return container.parent.get(this.key);
    }
    return null;
  }

  // tslint:disable-next-line:ban-types
  public static of(key: Function | string) {
    return new OptionalParent(key);
  }
}
