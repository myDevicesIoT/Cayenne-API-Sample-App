import React from 'react';
import {
    Text,
    View,
    TouchableHighlight
} from 'react-native';
import {
  StackNavigator
} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

function Footer(props) {
    const {navigate} = props.navigation;
    return (
        <View style={{flex: 0.10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 10}}>
            <TouchableHighlight onPress = {() => navigate('Status')} style={{flex:0.33}}>
                <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                    <Icon name="signal" size={20} color="#FFF" />
                    <Text style={{color: 'white'}}>STATUS</Text>
                </View>
            </TouchableHighlight>

            <TouchableHighlight onPress = {() => navigate('SensorMap')} style={{flex:0.33}}>
                <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                    <Icon name="map" size={20} color="#FFF" />
                    <Text style={{color: 'white'}}>MAP</Text>
                </View>
            </TouchableHighlight>

            <TouchableHighlight onPress = {() => navigate('Alerts')} style={{flex:0.33}}>
                <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                    <Icon name="play-circle" size={20} color="#FFF" />
                    <Text style={{color: 'white'}}>ALERTS</Text>
                </View>
            </TouchableHighlight>
        </View>
    );
}

export default Footer;
