import { UserManager } from 'oidc-client';
import {Router, Redirect} from 'aurelia-router';
import {inject, singleton} from 'aurelia-framework';

//@singleton
@inject(Router)
export class Auth {
    oidcUserManager: UserManager;
    router : Router;
    user: Oidc.User;
    settings: Oidc.UserManagerCtor = {
        authority: "http://localhost:1861",
        client_id: "ems",
        redirect_uri: "http://localhost:1861/index.html",
        response_type: "id_token token",
        scope: "openid profile api.todo"
    };

    constructor(router) {
        this.router = router;
        this.oidcUserManager = new UserManager(this.settings);
        console.log("Auth contructor");
        let that = this;
        this.oidcUserManager.getUser().then(function (u) {
            if (u) {
                console.log("User loaded", u);
                that.user = u;
            }
            else {
                console.log("no user loaded");
            }
        });
    }

    login() {
        console.log("auth login");
        this.oidcUserManager.signinRedirect().then(function () {
            console.log("redirecting for login...");
        })
            .catch(function (er) {
                console.log("Sign-in error", er);
            });
    }

    callback(){
        console.log("auth callback");
        let that = this;
        this.oidcUserManager.signinRedirectCallback().then(function (callBackUser) {
            if (callBackUser == null) {
                console.error("No sign-in request pending.");
                new Redirect('http://localhost:1861/account/login');
            }
            else {
                console.log('callback user found and confirmed');
                //that.router.navigate('home');
                window.location.href = '/index.html#home';
            }
        })
        .catch(function (er) {
            console.error(er.message);
        });
    }

    isAuthenticated() : boolean {
        if(this.user) return true;
        return false;
    }
}