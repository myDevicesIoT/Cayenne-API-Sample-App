import React, { 
    Component
} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import {
  StackNavigator
} from 'react-navigation';
import {
    TextBox,
    CommonStyles,
    Footer,
    Header,
    Device
} from './../components/index';
import {
    PlatformService
} from './../lib/index';
import Hr from 'react-native-hr';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';

class Status extends Component {
    static navigationOptions = {header: null};
    constructor() {
        super();
        this.state = {
            devices: {}
        }
        this.getThings = this.getThings.bind(this);
        this.deleteThing = this.deleteThing.bind(this);
        this.getThings();
    }

    getThings = () => {
        var vm = this;

        PlatformService.getThings().then(function(response) {
            if (response.statusCode >= 400) return;
            if (!_.isEmpty(response)) vm.setState({devices: response});
        })
    }

    /**
     * Deletes a specified thing by its thingId
     * 
     * @param {String} thingId
     */
    deleteThing = (thingId) => {
        var vm = this;
        PlatformService.deleteThing(thingId).then(function(response) {
            console.log('Deleted!');
        });
    }

    deviceList = () => {
        var vm = this;
        let { devices } = this.state;
        if (_.isEmpty(devices)) return;
        var sensorList = devices.map(function(device, i) {
            return (
                <Device device={device} key={i} sensors={device.children} />
            );
        });
        return sensorList;
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={[CommonStyles.background, {flex: 1}]}>
                <Header title='STATUS' navigation={this.props.navigation} visible={true} onPress = {() => navigate('GatewaySetup')}/>
                <ScrollView style={{flex: 0.85}}>
                    <View style={{ flex: 1}}>
                        {this.deviceList()}
                    </View>
                </ScrollView>
                <Footer navigation={this.props.navigation}/>
            </View>
        )
    }
}

module.exports = Status;
