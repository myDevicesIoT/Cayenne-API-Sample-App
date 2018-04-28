import settings from '../config/settings';
import StorageService from './storage.service';
import HttpService from './auth.interceptor';

/**
 * Public methods
 */
var Service = {
    getThings: getThings,
    pairGateway: pairGateway,
    addThing: addThing,
    createClient: createClient,
    deleteThing: deleteThing,
    getDataTypes: dataTypes,
    getThingsTypes: getThingsTypes,
    getTypeChannels: getTypeChannels
}

/**
 * Get Things API host
 * 
 * @returns {String}
 */
function getHost() {
    return settings.apiHost;
}

/**
 * Get headers used for API calls
 * 
 * @returns {*}
 */
async function getHeaders() {
    
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await StorageService.get('access_token')}`
    }
}

/**
 * Get things attached to current account
 * 
 * @returns {*}
 */
async function getThings() {
    return HttpService.request(getHost() + 'things', {
        method: 'GET',
        headers: await getHeaders()
    })
    .then((response) => {
        return response.json();
    });
}

/**
 * Get things types 
 * 
 * @returns {*}
 */
async function getThingsTypes() {
    return HttpService.request(getHost() + 'things/types', {
        method: 'GET',
        headers: await getHeaders()
    })
    .then((response) => {
        return response.json();
    });
}

/**
 * Get things types 
 * 
 * @returns {*}
 */
async function getTypeChannels(typeId) {
    return HttpService.request(getHost() + `things/types/${typeId}/channels`, {
        method: 'GET',
        headers: await getHeaders()
    })
    .then((response) => {
        return response.json();
    });
}


/**
 * Pair a gateway
 * 
 * @param {String} gatewayName
 * @param {String} gatewayId
 * @returns {*}
 */
async function pairGateway(gatewayName, gatewayId) {
    return HttpService.request(getHost() + 'things/pair', {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify({
            hardware_id: gatewayId,
            name: gatewayName
        })
    })
    .then((response) => {
        return response.json();
    });
}

/**
 * Add a thing
 * 
 * @param {String} thing
 * @returns {*}
 */
async function addThing(thing) {
    return HttpService.request(getHost() + 'things', {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify(thing)
    })
    .then((response) => {
        return response.json();
    });
}

/**
 * Create a MQTT client credentials
 * 
 * @returns {*}
 */
async function createClient() {
    return HttpService.request(getHost() + 'clients', {
        method: 'POST',
        headers: await getHeaders()
    })
    .then((response) => {
        return response.json();
    });
}

/**
 * Delete a thing
 * 
 * @param {String} thingId
 */
async function deleteThing(thingId) {
    return HttpService.request(getHost() + `things/${thingId}`, {
        method: 'DELETE',
        headers: await getHeaders()
    })
    .then((response) => {
        return response.json();
    });
}

async function dataTypes(){
    return HttpService.request(getHost() + `ui/datatypes`, {
        method: 'GET',
        headers: await getHeaders()
    })
    .then((response) => {
        return response.json();
    });
}

export default Service;
