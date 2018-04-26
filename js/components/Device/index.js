import React, { 
    Component
} from 'react';

import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';

import Sensor from './../Sensor/index';
import HistoryService from './../../lib/history.service';

class Device extends Component{

    constructor(props){
        super(props);
        this.state = {expanded: false };
    }

    toggleExpand(){
        this.setState({expanded: !this.state.expanded});
    };

    renderSensors(){
        HistoryService.getState(this.props.device.id);
        var deviceId = this.props.device.id;
        var sensorList = this.props.sensors.map(function(sensor, i) {
            return (
                <Sensor sensor={sensor} deviceId={deviceId} key={i} />
            );
        });
        return sensorList;
    };

    render() {
        return (
            <View>
                <TouchableOpacity onPress={this.toggleExpand.bind(this)} activeOpacity = {0.8} style={{flex: 0.20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 5, marginLeft:5, marginRight:5, padding: 15, borderRadius: 5, backgroundColor: '#405159'}}>
                    <View style={{flex: 0.40, justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column'}}>
                        <Text style={{color: 'white'}}>{this.props.device.name}</Text>
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
                {
                    this.state.expanded ? 
                    <View  style={{backgroundColor: 'white', borderRadius: 5, flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginLeft:5, marginRight:5, paddingLeft: 5, paddingRight: 15, paddingTop:5 }}>
                        {this.renderSensors()}
                    </View> 
                    : null 
                }
            </View>
        );
    }
}

export default Device;
