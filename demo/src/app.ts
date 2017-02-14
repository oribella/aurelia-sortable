import { Router, RouterConfiguration } from 'aurelia-router';
import '../styles.css';

export class App {
  public router: Router;

  public configureRouter(config: RouterConfiguration, router: Router) {
    config.map([
      { route: ['', 'nested'], name: 'nested', moduleId: PLATFORM.moduleName('page-nested', 'nested'), nav: true, title: 'Advanced' },
      { route: 'page-scroll', name: 'page-scroll', moduleId: PLATFORM.moduleName('page-scroll'), nav: true, title: 'Simple' },
      { route: 'container-scroll', name: 'container-scroll', moduleId: PLATFORM.moduleName('container-scroll'), nav: false, title: 'Simple - element scroll' }
    ]);
    this.router = router;
  }
}
