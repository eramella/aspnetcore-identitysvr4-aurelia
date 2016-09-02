import { autoinject } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";
import { OpenId } from "./open-id/open-id";

@autoinject
export class App {

    public openId: OpenId;

    constructor(openId: OpenId) {
        this.openId = openId;
    }

    public configureRouter(routerConfiguration: RouterConfiguration, router: Router) {

        // switch from hash (#) to slash (/) navigation
        routerConfiguration.options.pushState = true;
        routerConfiguration.options.root = '/';

        // configure routes
        routerConfiguration.map([
            { route: ["", "login"], name: "Login", moduleId: "login" },
            { route: "dashboard", name: "Dashboard", moduleId: "dashboard" },
        ]);

        this.openId.Configure(routerConfiguration);
    }
}
