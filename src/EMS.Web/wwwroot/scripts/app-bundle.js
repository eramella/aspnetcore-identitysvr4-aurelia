var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('auth',["require", "exports", 'aurelia-router', 'aurelia-framework'], function (require, exports, aurelia_router_1, aurelia_framework_1) {
    "use strict";
    var Auth = (function () {
        function Auth(router) {
            this.settings = {
                authority: "http://localhost:1861",
                client_id: "ems",
                redirect_uri: "http://localhost:1861/index.html",
                response_type: "id_token token",
                scope: "openid profile api.todo"
            };
            this.router = router;
            this.oidcUserManager = new UserManager(this.settings);
            console.log("Auth contructor");
            var that = this;
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
        Auth.prototype.login = function () {
            console.log("auth login");
            this.oidcUserManager.signinRedirect().then(function () {
                console.log("redirecting for login...");
            })
                .catch(function (er) {
                console.log("Sign-in error", er);
            });
        };
        Auth.prototype.callback = function () {
            console.log("auth callback");
            var that = this;
            this.oidcUserManager.signinRedirectCallback().then(function (callBackUser) {
                if (callBackUser == null) {
                    console.error("No sign-in request pending.");
                    new aurelia_router_1.Redirect('http://localhost:1861/account/login');
                }
                else {
                    console.log('callback user found and confirmed');
                    window.location.href = '/index.html#home';
                }
            })
                .catch(function (er) {
                console.error(er.message);
            });
        };
        Auth.prototype.isAuthenticated = function () {
            if (this.user)
                return true;
            return false;
        };
        Auth = __decorate([
            aurelia_framework_1.inject(aurelia_router_1.Router), 
            __metadata('design:paramtypes', [Object])
        ], Auth);
        return Auth;
    }());
    exports.Auth = Auth;
});

define('app',["require", "exports"], function (require, exports) {
    "use strict";
    var App = (function () {
        function App() {
        }
        App.prototype.configureRouter = function (config, router) {
            config.title = 'Asp.net Core - IdentitySvr4 - Aurelia';
            config.map([
                { route: ['', 'home'], name: 'home', moduleId: 'home' },
                { route: 'login', name: 'login', moduleId: 'login' }
            ]);
        };
        return App;
    }());
    exports.App = App;
});

define('callback',["require", "exports"], function (require, exports) {
    "use strict";
    var Callback = (function () {
        function Callback() {
        }
        return Callback;
    }());
    exports.Callback = Callback;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('home',["require", "exports"], function (require, exports) {
    "use strict";
    var Home = (function () {
        function Home() {
        }
        return Home;
    }());
    exports.Home = Home;
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
define('login',["require", "exports", './auth', 'aurelia-framework'], function (require, exports, auth_1, aurelia_framework_1) {
    "use strict";
    var Login = (function () {
        function Login(auth) {
            console.log("login constructor");
            this.auth = auth;
            this.auth.login();
        }
        Login = __decorate([
            aurelia_framework_1.inject(auth_1.Auth), 
            __metadata('design:paramtypes', [Object])
        ], Login);
        return Login;
    }());
    exports.Login = Login;
});

define('main',["require", "exports", './environment', './auth'], function (require, exports, environment_1, auth_1) {
    "use strict";
    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () {
            var auth = aurelia.container.get(auth_1.Auth);
            if (aurelia.host.baseURI.indexOf('#id_token') > -1) {
                auth.callback();
            }
            else {
                var root = auth.isAuthenticated() ? 'home' : 'login';
                aurelia.setRoot(root);
            }
        });
    }
    exports.configure = configure;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\r\n  <router-view></router-view>\r\n</template>\r\n"; });
define('text!callback.html', ['module'], function(module) { module.exports = "<template>\r\n    <h1>Callback</h1>    \r\n</template>"; });
define('text!home.html', ['module'], function(module) { module.exports = "<template> \r\n    <h1>Home</h1>\r\n</template>"; });
define('text!login.html', ['module'], function(module) { module.exports = "<template>\r\n    <h1>Login</h1>\r\n    <button type=\"button\" click.trigger=\"login()\">Log in</button>\r\n</template>"; });
//# sourceMappingURL=app-bundle.js.map