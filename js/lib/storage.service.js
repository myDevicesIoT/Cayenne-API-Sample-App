import { AsyncStorage } from 'react-native';

// Methods
var Service = {
    getAsync: getData,
    setAsync: setData,
    removeAsync: removeData,
    get: getData,
    set: setData,
    remove: removeData
}

async function getData(key){
    return AsyncStorage.getItem(key);
}

async function setData(key, value){
    return AsyncStorage.setItem(key, value);
}

async function removeData(key){
    return AsyncStorage.removeItem(key);
}

async function getDataAsync(key){
    return await AsyncStorage.getItem(key);
}

async function setDataAsync(key, value){
    return await AsyncStorage.setItem(key, value);
}

async function removeDataAsync(key){
    return await AsyncStorage.removeItem(key);
}

export default Service;