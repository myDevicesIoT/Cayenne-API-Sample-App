import settings from '../config/settings';
import HttpService from './auth.interceptor';

// Methods
var Service = {
    getDeviceTypeRules: getDeviceTypeRules,
    setRule: setRule
}

/**
 * Get the authorization host
 * 
 * @returns {String}
 */
function getHost() {
    return settings.rulesHost;
}


/**
 * Get headers used for API calls
 * 
 * @returns {*}
 */
async function getHeaders() {
    return {
        'Authorization': `Bearer ${await StorageService.get('access_token')}`
    }
}


function getDeviceTypeRules(deviceTypeId){
    var appId = settings.appKey;
    var url = getHost + '/v1.0/applicationRule/' + deviceTypeId + '/' + appId;

    return getHeaders().then((headers) => {
        return HttpService.request(url, {method: 'GET', headers: headers});
    }).then((response) => {
        return response.json();
    });
}

function setRule(rule){
    var url = getHost + '/v1.0/rules';

    return getHeaders().then((headers) => {
        return HttpService.request(
            url, 
            {
                method: 'POST', 
                headers: headers,
                body: JSON.stringify(rule)
            }
        );
    }).then((response) => {
        return response.json();
    });
}
  