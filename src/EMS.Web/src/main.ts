import {Aurelia} from 'aurelia-framework'
import environment from './environment';
import {Auth} from './auth';

//Configure Bluebird Promises.
//Note: You may want to use environment-specific configuration.
(<any>Promise).config({
  warnings: {
    wForgottenReturn: false
  }
});

export function configure(aurelia: Aurelia) {
  //aurelia.use.singleton(Auth);
  aurelia.use
    .standardConfiguration()
    .feature('resources');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => {
    let auth : Auth = aurelia.container.get(Auth);
    if (aurelia.host.baseURI.indexOf('#id_token') > -1){
      auth.callback();
    }else{
      let root = auth.isAuthenticated() ? 'home' : 'login'
      aurelia.setRoot(root);
    }
    
  });
}
