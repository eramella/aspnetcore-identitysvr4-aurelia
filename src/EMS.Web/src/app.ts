import {RouterConfiguration,Router} from 'aurelia-router'

export class App {
  router : Router;  
  
  configureRouter(config: RouterConfiguration, router: Router) : void {
      this.router = router;
      config.title = 'Asp.net Core - IdentitySvr4 - Aurelia';
      config.map([
          {route: '', name: 'login', moduleId: 'login'},
          {route: 'callback', name: 'callback', moduleId: 'callback'}
      ]);
  }
}
