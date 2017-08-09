import React, { 
    Component
} from 'react';
import {
    View,
    Text
} from 'react-native';
import {
  StackNavigator
} from 'react-navigation';
import {
    Footer,
    CommonStyles,
    Header
} from './../components/index';

class SensorMap extends Component {
    static navigationOptions = {header: null};
    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={[CommonStyles.background, {flex: 1}]}>
                <Header title='MAP' navigation={this.props.navigation} visible={true} onPress = {() => navigate('SensorSetup', screenProps = {gateway: 'map'})}/>
                <View style={{ flex: 0.85}}>

                </View>
                <Footer navigation={this.props.navigation}/>
            </View>
        );
    }
}

module.exports = SensorMap;
