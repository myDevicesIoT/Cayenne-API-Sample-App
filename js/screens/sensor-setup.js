import React, { 
  Component
} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Picker
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
  PlatformService, AuthService, RulesService
} from './../lib/index';
import {
  Settings,
  Images
} from './../config/index.js';

import _ from 'lodash';
import Hr from 'react-native-hr';
import Icon from 'react-native-vector-icons/FontAwesome';
import IOSPicker from 'react-native-ios-picker';

class SensorSetup extends Component {
  static navigationOptions = {header: null};

  constructor(props) {
    super(props);
    this.state = {
      sensorName: '',
      hardwareId: '',
      sensorType: null,
      showInstructions: false,
      deviceTypes: []
    };
    this.instructions = ['Take sensor to walk-in cooler, freezer and food prep areas.',
                        'Peel off sticker and place in walk-in, cooler, freezer and food prep areas to monitor.'];
    this.instructionsImages = [Images.elsysSensor, Images.gatewayPlacement];
    this.getThingsTypes();
  }

  getThingsTypes = () => {
    var vm = this;
    PlatformService.getThingsTypes().then(function(response){
      vm.setState({deviceTypes: response.rows});
      if(response.rows.length === 1){
        vm.setState({sensorType: response.rows[0]});
      }
    });
  }

  addSensor = () => {
    const { navigate } = this.props.navigation;
    let {
      sensorName,
      hardwareId
    } = this.state;

    let thing = {};
    let thingType = this.state.sensorType
    thing.name = sensorName;
    thing.device_type_id = thingType.id;
    thing.hardware_id = hardwareId;
    thing.application_id = Settings.appKey;

    thing.properties = {
      codec: thingType.codec,
      deveui: hardwareId,
      network: 'ttn',
      activation: 'activated',
      "location.address":null,
      "location.type":"GPS",
      "location.lat":null,
      "location.lon":null
    }
    thing.active = 1;
    thing.status = 'ACTIVATED';

    let user = null;
    let children = [];

    AuthService.getUser().then((user) => {
        thing.user_id = user.id;
        user = user;
        return user;
    }).then(() => {
      return Promise.all([
        PlatformService.addThing(thing),
        PlatformService.getTypeChannels(this.state.sensorType.id)
      ]);
    }).then((result) => {
      thing.id = result[0].id;
      promises = _.map(result[1], function(channel){
        return PlatformService.addThing({
          name: channel.name,
          parent_id: thing.id,
          active: 1,
          status: 'ACTIVATED',
          device_type_id: '8f93f0f0-db59-44c1-aaa4-bd48707de97b',
          properties: {
            channel: channel.channel
          }
        }).then((child) => {
          children.push(child);
        });
      });
      return Promise.all(promises)
    }).then(() => {
      return RulesService.getDeviceTypeRules(thing.device_type_id);
    }).then((deviceRules) => {
      var promises = _.map(deviceRules, function(ruleTemplate){
        if(ruleTemplate.triggers.length > 0 && ruleTemplate.triggers[0].conditions.length > 0){
          let notification = {
            "data" : {
              "owner" : user.first_name + ' ' + owner.last_name,
              "device_name" : thing.name,
              "connection_message ": "This is connected to " + thing.name,
              "device_type" : thingType.name,
              "value_message": ruleTemplate.triggers[0].conditions[0].value
            },
            "value" : user.email,
            "method" : "email",
            "type" : "msm-cayenne-notification",
            "body" : null
          };

          if(ruleTemplate.triggers[0].query_type === 'state'){
            ruleTemplate.triggers[0].id = thing.id;
            ruleTemplate.title = 'Rule for ' + thing.name;
            ruleTemplate.type = 'msm-cayenne-offline';
            notification.data.value_message = 'state changed';
          }else{
            let sensor = _.find(children, {properties: {channel: ruleTemplate.triggers[0].channel }});
            ruleTemplate.triggers[0].id = sensor.id;
            notification.data.sensor_name = sensor.name;
            notification.data.connection_message = "This is connected to " + sensor.name;
            ruleTemplate.title = 'Rule for ' + sensor.name;
          }

          if(!ruleTemplate.notifications) ruleTemplate.notifications = [];
          ruleTemplate.notifications.push(notification);
          return RulesService.setRule(ruleTemplate);
        }
      });
      return Promise.all(promises);
    }).then(() => {
      return navigate('Status');
    });
  }

  handleInstruction = () => {
      const { showInstructions } = this.state;
      this.setState({showInstructions: !showInstructions});
  }

  renderTextBoxes = () => {
    if(this.state.sensorType === null) return;
    return (
      <View>
        <TextBox
          style={{height: 50}}
          onChangeText = {(text) => this.setState({sensorName: text})}
          placeholder='Sensor Name' />
        <TextBox
          style={{height: 50}}
          onChangeText = {(text) => this.setState({hardwareId: text})} 
          placeholder='Hardware ID' />
      </View>
    );
  } 

  render() {
    const {navigate} = this.props.navigation;
    var listTypes = this.state.deviceTypes.map(function(type) {
      return (
        <Picker.Item label={type.name} value={type.id} key={type.id}/>
      );
    });

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
                <IOSPicker
                  selectedValue={this.state.sensorType ? this.state.sensorType.name : null }
                  style={{
                    marginLeft:10,
                    marginRight:10,
                    marginTop:5,
                    marginBottom:5,
                    padding:15,
                    borderRadius: 5,
                    backgroundColor:'white'
                }}
                  onValueChange={(itemValue, itemIndex) => this.setState({sensorType: this.state.deviceTypes[itemIndex]})}>
                  {listTypes}
                </IOSPicker>
                {this.renderTextBoxes()}
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
