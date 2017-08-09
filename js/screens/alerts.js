import React, { 
    Component
} from 'react';
import {
    View,
    Text,
    ScrollView
} from 'react-native';
import {
  StackNavigator
} from 'react-navigation';
import {
    Footer,
    CommonStyles,
    Header
} from './../components/index';

class Alerts extends Component {
    static navigationOptions = {header: null};
    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={[CommonStyles.background, {flex: 1}]}>
                <Header title='ALERTS' navigation={this.props.navigation} visible={true} onPress = {() => navigate('SensorSetup', screenProps = {gateway: 'alerts'})}/>

                <ScrollView style={{flex: 0.85}}>
                    <View style={{ flex: 1}}>

                    </View>
                </ScrollView>
                <Footer navigation={this.props.navigation}/>
            </View>
        );
    }
}

module.exports = Alerts;
