import AuthService from './auth.service';
import NavigatorService from './navigation.service';
import _ from 'lodash';

Service = {
    request: request
}

function request(requestInfo, requestInit){
    let params = getQueryParameters(requestInfo);
    if(!params.user_id){
        let jwt = parseJwt(requestInit.headers.Authoriation);
        if(params.length > 0){
            requestInfo += '?user_id=' + jwt.user_id; 
        }else{
            requestInfo += '&user_id=' + jwt.user_id; 
        }
    }
    return fetch(requestInfo, requestInit)
    .then((response) => {
        if (response.status === 401) {
            // the request was reject for auth reason
            // trying to get a new token
            return AuthService.refreshToken()
                .then(() => {
                    // we got a new token, retrying the original request:
                    return fetch(requestInfo, requestInit);
                })
                .catch(() => {
                    // failed to get a new token
                    // navigating back to login screen:
                    return NavigatorService.navigate('Login');
                });
        }
        return response;
    });
}

function getQueryParameters(url){
    var regex = /[?&]([^=#]+)=([^&#]*)/g,
        params = {}
        match;
    while(match = regex.exec(url)) {
        params[match[1]] = match[2];
    }
    return params;
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

export default Service;