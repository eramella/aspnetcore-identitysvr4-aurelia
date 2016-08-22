var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app',["require", "exports", 'aurelia-framework'], function (require, exports, aurelia_framework_1) {
    "use strict";
    var App = (function () {
        function App(userManager, oidc) {
            this.message = 'Hello World!';
            this.log = aurelia_framework_1.LogManager.getLogger('app');
            this.settings = {
                authority: "http://localhost:1861",
                client_id: "ems",
                redirect_uri: "http://localhost:1861/spa/callback.html",
                response_type: "id_token token",
                scope: "openid profile api.todo"
            };
            this.oidcUserManager = new UserManager(this.settings);
        }
        App.prototype.activate = function () {
            this.oidcUserManager.getUser().then(function (u) {
                if (u) {
                    console.log("User loaded", u);
                    this.user = u;
                }
                else {
                    console.log("no user loaded");
                }
            });
        };
        App.prototype.login = function () {
            console.log("clicked login");
            this.oidcUserManager.signinRedirect().then(function () {
                console.log("redirecting for login...");
            })
                .catch(function (er) {
                console.log("Sign-in error", er);
            });
        };
        App = __decorate([
            aurelia_framework_1.inject(UserManager, OidcClient, aurelia_framework_1.LogManager), 
            __metadata('design:paramtypes', [Object, Object])
        ], App);
        return App;
    }());
    exports.App = App;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('main',["require", "exports", './environment'], function (require, exports, environment_1) {
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
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <h1>${message}</h1>\n  <button type=\"button\" click.trigger=\"login()\">Log in</button>\n\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map