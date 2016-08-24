import { Redirect, NavigationInstruction, RouterConfiguration, Router } from 'aurelia-router'
import { Auth } from './auth';
import { inject } from 'aurelia-framework';

export class App {
    configureRouter(config: RouterConfiguration, router: Router): void {
        config.title = 'Asp.net Core - IdentitySvr4 - Aurelia';
        config.addPipelineStep('authorize', AuthorizeStep);
        config.map([
            { route: 'login', name: 'login', moduleId: 'login', nav: false },
            { route: ['', 'home'], name: 'home', moduleId: 'home' }
        ]);
    }
}

@inject(Auth)
class AuthorizeStep {
    auth: Auth;

    constructor(auth) {
        console.log('AuthorizeStep contructor');
        this.auth = auth;
    }

    run(navigationInstruction: NavigationInstruction, next: any): Promise<any> {
        console.log("AuthorizeStep run");
        if (!this.auth.isAuthenticated()) {
            //if (navigationInstruction.getAllInstructions().some(i => i..config.href.indexOf('callback.html#id_token') > -1)) {
            if (window.location.href.indexOf('callback.html#id_token') > -1) {
                console.log("found callback");
                return this.auth.callback();
                // if (!isLoggedIn) {
                     //return next.cancel(new Redirect('login'));
                // }
            }
            else{
                console.log("go to login");
                return next.cancel(new Redirect('login')); //this.auth.login();
                //return next.cancel()
            }
        }
        return next();
    }

}