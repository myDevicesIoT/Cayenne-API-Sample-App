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
    Header
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
            sensors: {}
        }
        this.getThings = this.getThings.bind(this);
        this.deleteThing = this.deleteThing.bind(this);
        this.getThings();
    }

    getThings = () => {
        var vm = this;

        PlatformService.getThings().then(function(response) {
            if (response.statusCode >= 400) return;
            if (!_.isEmpty(response)) vm.setState({sensors: response});
        })
    }

    deleteThing = (thingId) => {
        var vm = this;
        PlatformService.deleteThing(thingId).then(function(response) {
            console.log('Deleted!');
        })
    }

    thingList = () => {
        var vm = this;
        let { sensors } = this.state;
        if (_.isEmpty(sensors)) return;
        var sensorList = sensors.map(function(sensor) {
            return (
                <TouchableOpacity activeOpacity = {0.8} style={{flex: 0.20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 5, padding: 15, borderRadius: 5, backgroundColor: '#405159'}} onPress = {() => {vm.deleteThing(sensor.id)}}>
                        <View style={{flex: 0.40, justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column'}}>
                            <Text style={{color: 'white'}}>{sensor.name}</Text>
                        </View>
                        <View style={{flex: 0.20, justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column'}}>
                            <Text style={{color: 'white', fontSize: 11}}>LEVEL:</Text>
                            {/*<Text style={{color: 'white', fontSize: 15}}>35%</Text>*/}
                        </View>
                        <View style={{flex: 0.20, justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column'}}>
                            <Text style={{color: 'white', fontSize: 11}}>SIGNAL:</Text>
                            {/*<Icon name="signal" size={15} color="#FFF"> 90%</Icon>*/}
                        </View>
                        <View style={{flex: 0.20, justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column'}}>
                            <Text style={{color: 'white', fontSize: 11}}>BATTERY:</Text>
                            {/*<Icon name="battery-4" size={15} color="#FFF"> 87%</Icon>*/}
                        </View>
                </TouchableOpacity>
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
                        {this.thingList()}
                    </View>
                </ScrollView>
                <Footer navigation={this.props.navigation}/>
            </View>
        )
    }
}

module.exports = Status;
