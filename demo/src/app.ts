import { Router, RouterConfiguration } from 'aurelia-router';
import '../styles.css';

export class App {
  public router: Router;

  public configureRouter(config: RouterConfiguration, router: Router) {
    config.map([
      { route: ['', 'advanced'], name: 'advanced', moduleId: PLATFORM.moduleName('advanced', 'advanced'), nav: true, title: 'Advanced' },
      { route: 'simple-y', name: 'simple-y', moduleId: PLATFORM.moduleName('simple-y'), nav: true, title: 'Simple - Y' },
      { route: 'simple-xy', name: 'simple-xy', moduleId: PLATFORM.moduleName('simple-xy'), nav: true, title: 'Simple - XY' }
    ]);
    this.router = router;
  }
}
