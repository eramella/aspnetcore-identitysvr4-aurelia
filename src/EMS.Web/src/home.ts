import {Auth} from './auth';
import {autoinject} from 'aurelia-framework';

@autoinject
export class Home {
    auth: Auth;
    user: string;

    constructor(auth: Auth){
        this.auth = auth;
    }

    activate(){
        this.user = JSON.stringify(this.auth.user);
    }
}