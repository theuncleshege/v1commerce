let host: string = '';
let imgHost: string = '';

if ((process.env.NODE_ENV != "production" && typeof process.env.REACT_APP_CONTAINER == "undefined")) {
    host = 'http://localhost:4000';
    imgHost = `${host}`;
}
else {
    host = '/api';
    imgHost = '';
}

export const ASSETS_URL: string = `${imgHost}/images`;
export const API_URI: string = `${host}`;
export const AUTH_TOKEN: string = "auth_token";
export const IS_ADMIN: string = "is_admin";
