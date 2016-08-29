import { UserManager, OidcClient, Log } from 'oidc-client';
import { autoinject } from 'aurelia-framework';

@autoinject
export class Auth {
    oidcUserManager: UserManager;
    public user: Oidc.User;
    settings: Oidc.UserManagerCtor = {
        authority: "http://localhost:1861",
        client_id: "ems",
        redirect_uri: "http://localhost:1861/index.html",
        response_type: "id_token token",
        scope: "openid profile api.todo"
    };

    constructor() {
        this.oidcUserManager = new UserManager(this.settings);
    }

    loadLocalUser() {
        return this.oidcUserManager.getUser().then(function (u) {
            if (u) {
                console.info("Oidc: User loaded", u);
                return u;
            }
            else {
                console.info("Oidc: no user loaded");
            }
        });
    }

    login() {
        this.oidcUserManager.signinRedirect().then(function () {
            console.info("Oidc: redirecting for login...");
        })
            .catch(function (er) {
                console.info("Oidc: Sign-in error", er);
            });
    }

    callback() {
        console.info("Oidc: auth callback");
        let that = this;
        return this.oidcUserManager.signinRedirectCallback().then(function (callBackUser) {
            if (callBackUser == null) {
                console.error("Oidc: No sign-in request pending.");
                window.location.href = 'http://localhost:1861/account/login';
            }
            else {
                console.info('Oidc: callback user found and confirmed');
                window.location.href = 'http://localhost:1861/index.html';
            }
        })
            .catch(function (er) {
                console.error(er.message);
            });
    }

    isAuthenticated(): boolean {
        if (this.user) return true;
        return false;
    }
}