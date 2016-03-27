export class App {
  configureRouter(config, router) {
    config.title = "Sortable";
    //config.options.pushState = true;
    config.map([
      { route: ["", "hub"], name: "hub", moduleId: "hub", nav: false, title: "Hub" }
    ]);
    this.router = router;
  }
}
