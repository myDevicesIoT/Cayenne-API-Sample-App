import settings from '../config/settings';
import StorageService from './storage.service';

// Methods
var Service = {
    getToken: getToken,
    refreshToken: refreshToken,
    forgotPassword: forgotPassword,
    getOauth: getOauth,
    createUser: createUser
}

/**
 * Get the authorization host
 * 
 * @returns {String}
 */
function getHost() {
    return settings.authHost;
}

/**
 * Get the headers used for API calls
 * 
 * @returns {*}
 */
function getHeaders() {
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
}

function handleAuthResponse(data){
    StorageService.set('access_token', data.access_token);
    StorageService.set('refresh_token', data.refresh_token);
    return data;
}

/**
 * Requests an oauth token using email/password
 * 
 * @param {String} email 
 * @param {String} password 
 */
function getToken(email, password) {
    return fetch(getHost() + 'oauth/token', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            email: email,
            password: password,
            client_id: settings.appKey,
            client_secret: settings.appSecret,
            grant_type: 'password',
        })
    })
    .then((response) => {
        return response.json().then(handleAuthResponse);
    });
}

function refreshToken(){
    var refresh_token = StorageService.get('refresh_token');
    if(!refresh_token) {
        return Promise.reject('no refresh token');
    }

    return fetch(getHost() + 'oauth/token', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        })
    })
    .then((response) => {
        if(response.status !== 200) throw new Error("refresh failed");
        return response.json().then(handleAuthResponse);
    });
}

/**
 * Gets oauth token using auth code, app id, app secret
 * 
 * @param {String} authCode
 */
function getOauth(authCode) {
    return fetch(getHost() + 'oauth/token', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            client_id: settings.appKey,
            client_secret: settings.appSecret,
            code: authCode,
            grant_type: "authorization_code",
            redirect_uri: settings.explicitUrl
        })
    })
    .then((response) => {
        return response.json().then(handleAuthResponse);
    });
}

/**
 * Sends a forgot password request to authorization host
 * 
 * @param {String} email
 */
function forgotPassword(email) {
    return fetch(getHost() + 'password/forgot', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            email: email
        })
    })
    .then((response) => {
        return response.json();
    });
}

/**
 * Create a user
 * 
 * @param {string} email 
 * @param {string} password 
 * @param {string} firstName 
 * @param {string} lastName 
 */
function createUser(email, password, firstName, lastName) {
    return fetch(getHost() + 'users', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            email,
            first_name: firstName,
            last_name: lastName,
            password,
            application_id: settings.appKey
        })
    })
    .then((response) => {
        return response.json();
    });
}

export default Service;
