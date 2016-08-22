/// <reference path="../node_modules/oidc-client/oidc-client.d.ts" />

import {UserManager, OidcClient,Log} from 'oidc-client';
import {inject, LogManager} from 'aurelia-framework'


@inject(UserManager, OidcClient,LogManager)
export class App {
  message = 'Hello World!';
  oidcUserManager : UserManager;
  user : any;
  oidc : OidcClient;
  log : any = LogManager.getLogger('app');

  settings = {
            authority: "http://localhost:1861",
            client_id: "ems",
            redirect_uri: "http://localhost:1861/spa/callback.html",
            response_type: "id_token token",
            scope:"openid profile api.todo"
        };

  constructor(userManager, oidc){
      this.oidcUserManager = new UserManager(this.settings);      
    }

  activate(){
    //this.log.logger(console);
    this.oidcUserManager.getUser().then(function (u) {
            if (u) {
                console.log("User loaded", u);
                this.user = u;
            }
            else {
                console.log("no user loaded");
            }
        });
  }

  login(){
    console.log("clicked login");
    this.oidcUserManager.signinRedirect().then(function () {
                console.log("redirecting for login...");
            })
            .catch(function (er) {
                console.log("Sign-in error", er);
            });
  }
  

}
