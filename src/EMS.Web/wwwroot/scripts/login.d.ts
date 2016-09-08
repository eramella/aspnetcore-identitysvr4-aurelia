import { OpenId } from "./open-id/open-id";
import { HttpClient } from "aurelia-fetch-client";
import { Router } from "aurelia-router";
export declare class Login {
    private openId;
    private httpClient;
    private authorizationServerMessage;
    private resourceServerMessage;
    private isLoggedIn;
    private router;
    constructor(openId: OpenId, httpClient: HttpClient, router: Router);
    private login();
    private logout();
    private queryResourceServer(serverNum, isPrivate);
    private getUrl(serverNum, isPrivate);
}
