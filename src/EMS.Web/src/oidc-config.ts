import { OpenIdConfiguration, UserManagerSettings } from "./open-id/open-id";

let isDevelopment = window.location.host.startsWith("localhost");

let authority: string = isDevelopment
    ? "http://localhost:1861"
    : "https://my.mysite.net";

let host: string = isDevelopment
    ? "http://localhost:1861"
    : "https://my.mysite.net";

const oidcConfig: OpenIdConfiguration = {
    LoginRedirectModuleId: "login",
    LogoutRedirectModuleId: "login",
    UserManagerSettings: <UserManagerSettings>{
        authority: authority,
        client_id: "ems",
        post_logout_redirect_uri: `${host}/signout-oidc`,
        redirect_uri: `${host}/index.html`,
        response_type: "id_token token",
        scope: "openid profile api.todo",
        filterProtocolClaims: true, // TODO What is this?
        loadUserInfo: true,
    }
};

export default oidcConfig;
