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

function getPlus(isVisible, navigate) {
    if (isVisible) {
        return (
            <Icon name="plus" size={20} color="#FFF" visible={false} onPress = {navigate}/>
        );
    }
}

function Header(props) {
    return (
        <View style={{flex: 0.05, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 10}}>
            <View style={{flex:0.33, flexDirection: 'column', alignItems: 'flex-start'}}>
                <Icon name="question-circle-o" size={20} color="#FFF"/>
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
