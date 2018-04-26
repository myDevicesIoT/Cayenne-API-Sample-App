import AuthService from './auth.service';
import NavigatorService from './navigation.service'

Service = {
    request: request
}

function request(requestInfo, requestInit){
    return fetch(requestInfo, requestInit)
    .then((response) => {
        if (response.statusCode === 401) {
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
                    NavigatorService.navigate('Login');
                });
        }
        return response;
    });
}

export default Service;