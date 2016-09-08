define('text!app.html', ['module'], function(module) { module.exports = "<template>\r\n  <router-view></router-view>\r\n</template>"; });
define('text!dashboard.html', ['module'], function(module) { module.exports = "<template>  \r\n    <h1>This is Dashboard</h1>\r\n</template>"; });
define('text!login.html', ['module'], function(module) { module.exports = "<template>\r\n  <style type=\"text/css\">\r\n    pre {\r\n      background: #eee;\r\n      padding: 1em;\r\n      overflow: auto;\r\n    }\r\n  </style>\r\n\r\n  <p>\r\n    <button show.bind='!isLoggedIn' click.trigger=\"login()\">Log in</button>\r\n  </p>\r\n  <p>\r\n    <button click.trigger=\"queryResourceServer(01, true)\">Get User Info</button>\r\n   <pre>${resourceServerMessage}</pre>\r\n  </p>\r\n  <div show.bind=\"isLoggedIn\">\r\n    <p>\r\n      <button click.trigger=\"logout()\">Log out</button>\r\n      <pre>${authorizationServerMessage}</pre>\r\n    </p>\r\n  </div>\r\n</template>"; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app',["require", "exports", "aurelia-framework", "./open-id/open-id"], function (require, exports, aurelia_framework_1, open_id_1) {
    "use strict";
    var App = (function () {
        function App(openId) {
            this.openId = openId;
        }
        App.prototype.configureRouter = function (routerConfiguration, router) {
            routerConfiguration.options.pushState = true;
            routerConfiguration.options.root = '/';
            routerConfiguration.map([
                { route: ["", "login"], name: "Login", moduleId: "login" },
                { route: "dashboard", name: "Dashboard", moduleId: "dashboard" },
            ]);
            this.openId.Configure(routerConfiguration);
        };
        App = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [open_id_1.OpenId])
        ], App);
        return App;
    }());
    exports.App = App;
});

define('dashboard',["require", "exports"], function (require, exports) {
    "use strict";
    var Dashboard = (function () {
        function Dashboard() {
        }
        return Dashboard;
    }());
    exports.Dashboard = Dashboard;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('login',["require", "exports", "aurelia-framework", "./open-id/open-id", "aurelia-fetch-client", "aurelia-router"], function (require, exports, aurelia_framework_1, open_id_1, aurelia_fetch_client_1, aurelia_router_1) {
    "use strict";
    var Login = (function () {
        function Login(openId, httpClient, router) {
            var _this = this;
            this.openId = openId;
            this.httpClient = httpClient;
            this.isLoggedIn = false;
            this.router = router;
            this.openId.UserManager.getUser().then(function (user) {
                console.log(user);
                if (user === null || user === undefined) {
                    return;
                }
                console.log("logged in");
                _this.isLoggedIn = true;
                _this.authorizationServerMessage = JSON.stringify(user, null, 4);
                console.log("login constructor done");
                _this.router.navigate('dashboard');
            });
        }
        Login.prototype.login = function () {
            this.openId.Login();
        };
        Login.prototype.logout = function () {
            this.openId.Logout();
        };
        Login.prototype.queryResourceServer = function (serverNum, isPrivate) {
            var _this = this;
            this.openId.UserManager.getUser().then(function (user) {
                var url = _this.getUrl(serverNum, isPrivate);
                _this.resourceServerMessage = "Fetching " + url;
                var fetchInit = {
                    headers: new Headers(),
                };
                if (user !== null && user !== undefined) {
                    fetchInit.headers.append("Authorization", "Bearer " + user.access_token);
                }
                _this.httpClient.fetch(url, fetchInit)
                    .then(function (response) {
                    if (response.ok) {
                        return response.text();
                    }
                    else {
                        return response.statusText;
                    }
                })
                    .then(function (data) {
                    _this.resourceServerMessage = JSON.stringify(data, null, 2);
                })
                    .catch(function (err) {
                    _this.resourceServerMessage = "" + err.message;
                });
            });
        };
        Login.prototype.getUrl = function (serverNum, isPrivate) {
            var leftPart;
            var path;
            if (window.location.hostname.startsWith("localhost")) {
                leftPart = "http://localhost:1861";
            }
            else {
                leftPart = "https://myweb.mayweb.net";
            }
            return leftPart + "/api/Test";
        };
        Login = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [open_id_1.OpenId, aurelia_fetch_client_1.HttpClient, aurelia_router_1.Router])
        ], Login);
        return Login;
    }());
    exports.Login = Login;
});

define('oidc-config',["require", "exports"], function (require, exports) {
    "use strict";
    var isDevelopment = window.location.host.startsWith("localhost");
    var authority = isDevelopment
        ? "http://localhost:1861"
        : "https://my.mysite.net";
    var host = isDevelopment
        ? "http://localhost:1861"
        : "https://my.mysite.net";
    var oidcConfig = {
        LoginRedirectModuleId: "login",
        LogoutRedirectModuleId: "login",
        UserManagerSettings: {
            authority: authority,
            client_id: "ems",
            post_logout_redirect_uri: host + "/signout-oidc",
            redirect_uri: host + "/signin-oidc",
            response_type: "id_token token",
            scope: "openid profile api.todo",
            filterProtocolClaims: true,
            loadUserInfo: true,
        }
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = oidcConfig;
});

define('main',["require", "exports", "./oidc-config"], function (require, exports, oidc_config_1) {
    "use strict";
    Promise.config({
        warnings: {
            wForgottenReturn: false,
        },
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .plugin("./open-id/open-id", function (callback) { return callback(oidc_config_1.default); });
        aurelia.use.developmentLogging();
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

//# sourceMappingURL=app-bundle.js.map