import { autoinject } from "aurelia-framework";
import { OpenId, User } from "./open-id/open-id";
import { HttpClient } from "aurelia-fetch-client";
import { Router } from "aurelia-router";

@autoinject
export class Login {

    private authorizationServerMessage: string;
    private resourceServerMessage: string;
    private isLoggedIn: boolean = false;
    private router: Router;

    constructor(private openId: OpenId, private httpClient: HttpClient, router: Router) {
        this.router = router;
        this.openId.UserManager.getUser().then((user: User) => {

            console.log(user);
            if (user === null || user === undefined) {
                return;
            }

            console.log("logged in");
            this.isLoggedIn = true;
            this.authorizationServerMessage = JSON.stringify(user, null, 4);

            console.log("login constructor done");
            this.router.navigate('dashboard');
        });
    }

    private login() {
        this.openId.Login();
    }

    private logout() {
        this.openId.Logout();
    }

    private queryResourceServer(serverNum: number, isPrivate: boolean) {

        this.openId.UserManager.getUser().then((user: User) => {

            let url = this.getUrl(serverNum, isPrivate);

            this.resourceServerMessage = `Fetching ${url}`;

            let fetchInit = {
                headers: new Headers(),
            };

            if (user !== null && user !== undefined) {
                fetchInit.headers.append("Authorization", `Bearer ${user.access_token}`);
            }

            this.httpClient.fetch(url, fetchInit)
                .then((response) => {
                    if (response.ok) {
                        return response.text();
                    } else {
                        return response.statusText;
                    }
                })
                .then((data) => {
                    this.resourceServerMessage = JSON.stringify(data,null,2);
                })
                .catch((err) => {
                    this.resourceServerMessage = `${err.message}`;
                });
        });
    }

    // HACK: Handle different environments and servers
    private getUrl(serverNum: number, isPrivate: boolean) {
        let leftPart: string;
        let path: string;

        if (window.location.hostname.startsWith("localhost")) {
            leftPart = "http://localhost:1861";
        } else {
            leftPart = "https://myweb.mayweb.net";
        }

        //path = isPrivate ? "private" : "public";

        return `${leftPart}/api/Test`;
    }
}
