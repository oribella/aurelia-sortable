export class MdlDemo {
  configureRouter(config, router) {
    config.map([
      { route: ["", "demo"], name: "Demo", moduleId: "features/mdl/mdl-sortable", nav: true, title: "Demo" }
    ]);
    this.router = router;
  }
}
