import { Auth } from './auth';
import { inject } from 'aurelia-framework'

@inject(Auth)
export class Login {
    auth : Auth;

    constructor(auth) {
        console.log("login constructor");
        this.auth = auth;
        this.auth.login();
    }
}