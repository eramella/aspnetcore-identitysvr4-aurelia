/// <reference path="../node_modules/oidc-client/oidc-client.d.ts" />


import { UserManager } from 'oidc-client';
import { inject } from 'aurelia-framework'

@inject(UserManager)
export class Login {
    oidcUserManager: UserManager;
    user: Oidc.User;
    settings: Oidc.UserManagerCtor = {
        authority: "http://localhost:1861",
        client_id: "ems",
        redirect_uri: "http://localhost:1861/callback.html",
        response_type: "id_token token",
        scope: "openid profile api.todo"
    };

    constructor(userManager) {
        this.oidcUserManager = new UserManager(this.settings);
    }

    activate() {
        console.log("login activate");
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
        console.log("clicked login");
        this.oidcUserManager.signinRedirect().then(function () {
            console.log("redirecting for login...");
        })
            .catch(function (er) {
                console.log("Sign-in error", er);
            });
    }
}