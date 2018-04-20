// Manually edit this file when making changes to .env
import {
    APP_KEY,
    APP_SECRET,
    AUTH_HOST,
    IMPLICIT_REDIRECT_URI,
    EXPLICIT_REDIRECT_URI,
    API_HOST,
    STREAMING_HOST,
    HISTORY_HOST
} from 'react-native-dotenv';

const settings = {
    appKey: APP_KEY,
    appSecret: APP_SECRET,
    authHost: AUTH_HOST,
    getImplicitLogin: getImplicitLogin,
    getExplicitLogin: getExplicitLogin,
    guid: guid,
    apiHost: API_HOST,
    explicitUrl: EXPLICIT_REDIRECT_URI,
    streamingHost: STREAMING_HOST,
    historyHost: HISTORY_HOST
}


/**
 * Construct Cayenne Implicit URL
 * 
 * @returns {String}
 */
function getImplicitLogin() {
    return `${settings.authHost}oauth/authorization?redirect_uri=${encodeURI(IMPLICIT_REDIRECT_URI)}&client_id=${settings.appKey}&state=${settings.state}&response_type=token`;
}

/**
 * Construct Cayenne Explicit URL
 * 
 * @returns {String}
 */
function getExplicitLogin() {
    return `${settings.authHost}oauth/authorization?redirect_uri=${encodeURI(EXPLICIT_REDIRECT_URI)}&client_id=${settings.appKey}&state=${settings.state}&response_type=code`;
}

/**
 * Create a random GUID
 */
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

export default settings;
