import { Router, RouterConfiguration } from 'aurelia-router';

export class App {
  public router: Router;

  public configureRouter(config: RouterConfiguration, router: Router) {
    config.map([
      { route: ['', 'advanced'], name: 'advanced', moduleId: 'demo/advanced', nav: true, title: 'Advanced' },
      { route: 'simple-y', name: 'simple-y', moduleId: 'demo/simple-y', nav: true, title: 'Simple - Y' },
      { route: 'simple-xy', name: 'simple-xy', moduleId: 'demo/simple-xy', nav: true, title: 'Simple - XY' }
    ]);
    this.router = router;
  }
}
