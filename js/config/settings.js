// Manually edit this file when making changes to .env
import {
    APP_KEY,
    APP_SECRET,
    AUTH_HOST,
    API_HOST,
    STREAMING_HOST,
    HISTORY_HOST,
    RULES_HOST
} from 'react-native-dotenv';

const settings = {
    appKey: APP_KEY,
    appSecret: APP_SECRET,
    authHost: AUTH_HOST,
    guid: guid,
    apiHost: API_HOST,
    streamingHost: STREAMING_HOST,
    historyHost: HISTORY_HOST,
    rulesHost: RULES_HOST
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
