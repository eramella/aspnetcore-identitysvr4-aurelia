import { Aurelia } from 'aurelia-framework'
import environment from './environment';
import { Auth } from './auth';

//Configure Bluebird Promises.
//Note: You may want to use environment-specific configuration.
(<any>Promise).config({
  warnings: {
    wForgottenReturn: false
  }
});

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }
  console.log('IM HERE');
  aurelia.start().then(() => {
    let auth: Auth = aurelia.container.get(Auth);
    auth.loadLocalUser().then(user => {
      if (user) {
        console.log(user);
        auth.user = user;
        aurelia.setRoot();
      } else {
        if (aurelia.host.baseURI.indexOf('#id_token') > -1) {
          console.info('Oidc: is callback');
          auth.callback();
        } else {
          auth.login();
        }
      }
    })
  });
}
