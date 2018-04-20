import React, { 
    Component
} from 'react';

import {
    View,
    Text
} from 'react-native';

import StreamingService from './../../lib/streaming.service';

class Sensor extends Component{
    
    constructor(props){
        super(props);
        this.state ={value: null};
        this.subscriberId = null;
    }

    componentWillMount() {
        // Listen for event
        this.subscriberId = StreamingService.getInstance().subscribe(
            'data-changed',this.props.deviceId, this.props.sensor.properties.channel, 
            this.update.bind(this)
        );
    }

    componentWillUnmount(){
        // unsubscribe for event
        StreamingService.getInstance().unsubscribe(
            'data-changed', this.props.deviceId, this.props.sensor.properties.channel, 
            this.subscriberId
        );
    }

    update(value){
        this.setState({value: value});
    }

    render(){
        return (
            <View style={{width: '30%', flexDirection: 'column', borderColor: 'black', borderRadius: 5, borderWidth: 1, marginBottom: 10, padding: 5}}>
                <View style={{flex: 0.30}}>
                    <Text style={{color: 'grey', fontSize: 11, textAlign: 'left'}}>{this.props.sensor.name}</Text>
                </View>
                <View style={{flex: 0.40}}>
                    <Text style={{color: 'black', fontSize: 15, textAlign: 'center'}}>
                        {this.state.value === null ? 
                            '' : this.state.value.value
                        }
                    </Text>
                </View>
                <View style={{flex: 0.30}}>
                    <Text style={{color: 'grey', fontSize: 11, textAlign: 'center'}}>
                        {this.state.value === null ? 
                            '' : this.state.value.label
                        }
                    </Text>
                </View>
            </View>
        );
    }
}

export default Sensor;