import React, { 
  Component
} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import {
  StackNavigator
} from 'react-navigation';
import {
  TouchButton,
  TextBox,
  CommonStyles,
  Instructions,
  Header
} from './../components/index';
import {
  PlatformService
} from './../lib/index';
import { 
  Images
} from './../config/index.js'
import _ from 'lodash';
import Hr from 'react-native-hr';
import Icon from 'react-native-vector-icons/FontAwesome';

class SensorSetup extends Component {
  static navigationOptions = {header: null};

  constructor(props) {
    super(props);
    this.state = {
      sensorName: '',
      hardwareId: '',
      gateway: props.navigation.state.params.gateway,
      showInstructions: false
    };
    this.instructions = ['Take sensor to walk-in cooler, freezer and food prep areas.',
                        'Peel off sticker and place in walk-in, cooler, freezer and food prep areas to monitor.'];
    this.instructionsImages = [Images.elsysSensor, Images.gatewayPlacement];
    this.addSensor = this.addSensor.bind(this);
  }

  addSensor = () => {
    const { navigate } = this.props.navigation;
    let {
      sensorName,
      gateway,
      hardwareId
    } = this.state

    if (_.isNil(gateway)) return navigate('Status');

    let thing = {};
    thing.name = sensorName;
    // Some device type id
    thing.device_type_id = 'f39b7b70-5131-11e7-b4cf-01fdf2fa57ad';
    thing.parent_id = gateway.id;
    thing.hardware_id = hardwareId;
    thing.properties = {
      sampleAppProp1: 'sample property',
      deveui: hardwareId,
      network: 'some network'
    }
    thing.active = 1;
    thing.status = 'ACTIVATED';

    PlatformService.addThing(thing).then(function(response) {
      if (response.statusCode >= 400) return;
      return navigate('Status');
    });
  }

  handleInstruction = () => {
      const { showInstructions } = this.state;
      this.setState({showInstructions: !showInstructions});
  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <ScrollView style={[CommonStyles.background, {flex: 1}]}>
            <Header title='SET UP SENSOR' navigation={this.props.navigation} visible={false}/>
            <Instructions
                show={this.state.showInstructions}
                title='Sensor Setup'
                onPress = {() => {this.handleInstruction()}}
                instructions={this.instructions}
                instructionsImages={this.instructionsImages}
            />
 
            <View style={{
                flex: 0.75
            }}>
                <TextBox
                  style={{height: 50}}
                  onChangeText = {(text) => this.setState({sensorName: text})}
                  placeholder='Sensor Name' />
                <TextBox
                  style={{height: 50}}
                  onChangeText = {(text) => this.setState({hardwareId: text})} 
                  placeholder='Hardware ID' />
            </View>

            <View style={{flex:0.15}}>
                <TouchButton
                    title = 'Add Sensor'
                    onPress = {() => {this.addSensor()}}
                    activeOpacity={0.8}
                    style={{backgroundColor: '#5CB85C'}}>
                        ADD
                </TouchButton>
            </View>
      </ScrollView>
    )
  }
}

module.exports = SensorSetup;
