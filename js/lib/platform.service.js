import settings from '../config/settings';
import session from '../config/session';

/**
 * Public methods
 */
var Service = {
    getThings: getThings,
    pairGateway: pairGateway,
    addThing: addThing,
    createClient: createClient,
    deleteThing: deleteThing
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
function getHeaders() {
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
    }
}

/**
 * Get things attached to current account
 * 
 * @returns {*}
 */
function getThings() {
    return fetch(getHost() + 'things', {
        method: 'GET',
        headers: getHeaders()
    })
    .then((response) => {
        return response.json();
    })
    .catch((error) => {
        throw error;
    })
}

/**
 * Pair a gateway
 * 
 * @param {String} gatewayName
 * @param {String} gatewayId
 * @returns {*}
 */
function pairGateway(gatewayName, gatewayId) {
    return fetch(getHost() + 'things/pair', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            hardware_id: gatewayId,
            name: gatewayName
        })
    })
    .then((response) => {
        return response.json();
    })
    .catch((error) => {
        throw error;
    })
}

/**
 * Add a thing
 * 
 * @param {String} thing
 * @returns {*}
 */
function addThing(thing) {
    return fetch(getHost() + 'things', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(thing)
    })
    .then((response) => {
        return response.json();
    })
    .catch((error) => {
        throw error;
    })
}

/**
 * Create a MQTT client credentials
 * 
 * @returns {*}
 */
function createClient() {
    return fetch(getHost() + 'clients', {
        method: 'POST',
        headers: getHeaders()
    })
    .then((response) => {
        return response.json();
    })
    .catch((error) => {
        throw error;
    })
}

/**
 * Delete a thing
 * 
 * @param {String} thingId
 */
function deleteThing(thingId) {
    return fetch(getHost() + `things/${thingId}`, {
        method: 'DELETE',
        headers: getHeaders()
    })
    .then((response) => {
        return response.json();
    })
    .catch((error) => {
        throw error;
    })
}

export default Service;
