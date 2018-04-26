import { AsyncStorage } from 'react-native';

// Methods
var Service = {
    get: getData,
    set: setData,
    remove: removeData
}

async function getData(key){
    return await AsyncStorage.getItem(key);
}

async function setData(key, value){
    return await AsyncStorage.setItem(key, value);
}

async function removeData(key){
    return await AsyncStorage.removeItem(key);
}

export default Service;