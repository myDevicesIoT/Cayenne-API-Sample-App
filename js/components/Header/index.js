import React from 'react';
import {
    Text,
    View,
    TouchableHighlight
} from 'react-native';
import {
  CommonStyles
} from './../index';
import Icon from 'react-native-vector-icons/FontAwesome';

import StorageService from '../../lib/storage.service';
import NavigationService from '../../lib/navigation.service';

function getPlus(isVisible, navigate) {
    if (isVisible) {
        return (
            <Icon name="plus" size={20} color="#FFF" visible={false} onPress = {navigate}/>
        );
    }
}

function logOut(){
    StorageService.remove('access_token');
    NavigationService.navigate('CreateName');
}

function Header(props) {
    return (
        <View style={{flex: 0.05, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 10}}>
            <View style={{flex:0.33, flexDirection: 'column', alignItems: 'flex-start'}}>
                {/* <Icon name="question-circle-o" size={20} color="#FFF"/> */}
                <Text style={[CommonStyles.textHeader, {color:'white'}]} onPress={logOut}>Log out</Text>
            </View>
            <View style={{flex:0.33, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                <Text style={[CommonStyles.textHeader, {color:'white'}]}>{props.title}</Text>
            </View>
            <View style={{flex:0.33, flexDirection: 'column', alignItems: 'flex-end'}}>
                {getPlus(props.visible, props.onPress)}
            </View>
        </View>
    );
}

export default Header;
