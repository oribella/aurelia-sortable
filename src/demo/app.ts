import { Router, RouterConfiguration } from 'aurelia-router';
// import '../../styles.css';

export class App {
  public router: Router;

  public configureRouter(config: RouterConfiguration, router: Router) {
    config.map([
      { route: ['', 'dummy'], name: 'dummy', moduleId: 'demo/dummy', nav: true, title: 'Dummy' }/*,
      { route: ['', 'advanced'], name: 'advanced', moduleId: '/advanced', nav: true, title: 'Advanced' },
      { route: 'simple-y', name: 'simple-y', moduleId: '/simple-y', nav: true, title: 'Simple - Y' },
      { route: 'simple-xy', name: 'simple-xy', moduleId: '/simple-xy', nav: true, title: 'Simple - XY' }*/
    ]);
    this.router = router;
  }
}
