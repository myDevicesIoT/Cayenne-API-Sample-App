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
    Instructions
} from './../components/index';
import {
    PlatformService
} from './../lib/index';
import {
    Images
} from './../config/index';
import Hr from 'react-native-hr';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';

class GatewaySetup extends Component {
    static navigationOptions = {header: null};

    constructor() {
        super();
        this.state = {
            gatewayName: '',
            gatewayId: '',
            location: '',
            showInitHeader: true,
            showErrorHeader: false,
            showInstructions: false
        };
        this.instructions = ['After connecting the Micro-USB and Ethernet cable, check that the POWER light is red and CONN light is orange.',
                            'Place within 200ft of walk-in, cooler, freezer or food prep area.'];
        this.instructionsImages = [Images.gatewaySetup, Images.gatewayPlacement];
        this.addGateway = _.debounce(this.addGateway.bind(this), 1000, {leading: true});
    }

    addGateway = () => {
        var vm = this;
        const { navigate } = this.props.navigation;
        let { showInitHeader, showErrorHeader, gatewayName, gatewayId, location} = this.state;

        vm.setState({showInitHeader: false});
        PlatformService.pairGateway(gatewayName, gatewayId).then(function(response) {
            if (response.statusCode >= 400) {
                vm.setState({showErrorHeader: true, showInitHeader: false});
                setTimeout(() => {
                    vm.setState({showErrorHeader: false, showInitHeader: true});
                }, 2000);
                return;
            }
            return navigate('SensorSetup', screenProps = {gateway: response});
        })
    }

    getHeader = () => {
        const { showInitHeader, showErrorHeader} = this.state;
        if (showInitHeader)
            return (
                <View style={{
                    flex: .05,
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center',
                    margin: 10
                }}>
                    <Text style={[CommonStyles.white, CommonStyles.textHeader ]}>SET UP GATEWAY</Text>

                    <Icon name="question-circle-o" size={20} color="#FFF" style={{position: 'absolute', left: 0}}/>
                </View>
            );
        if (!showInitHeader && !showErrorHeader)
            return (
                <View style={{
                    flex: .05,
                    marginBottom: 15
                }}>
                    <TouchableOpacity style={{
                        backgroundColor: '#5CB85C'
                    }}>
                        <Text style={{
                            color: 'white',
                            margin: 10
                        }}>Adding gateway...
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        if (showErrorHeader)
            return (
                <View style={{
                    flex: .05,
                    marginBottom: 30
                }}>
                    <TouchableOpacity style={{
                        backgroundColor: '#d9534f'
                    }}>
                        <Text style={{
                            color: 'white',
                            margin: 10
                        }}>Gateway not added. Please check Gateway ID and try again
                        </Text>
                    </TouchableOpacity>
                </View>
            );
    }

    handleInstruction = () => {
        const { showInstructions } = this.state;
        this.setState({showInstructions: !showInstructions});
    }

    render() {
        return (
            <ScrollView style={[CommonStyles.background, {flex: 1}]}>

                {this.getHeader()}

                <Instructions
                    show={this.state.showInstructions}
                    title='Gateway Setup'
                    onPress = {() => {this.handleInstruction()}}
                    instructions={this.instructions}
                    instructionsImages={this.instructionsImages}
                />

                <View style={{
                    flex: 0.75
                }}>
                    <TextBox
                        style={{height: 50}}
                        onChangeText = {(text) => this.setState({gatewayName: text})}
                        placeholder = 'Gateway Name'/>
                    <TextBox
                        style={{height: 50}}
                        onChangeText = {(text) => this.setState({gatewayId: text})} 
                        placeholder='Gateway ID' />
                </View>

                <View style={{flex:0.15}}>
                    <TouchButton
                        title = 'Add Gateway'
                        onPress = {() => {this.addGateway()}}
                        activeOpacity={0.8}
                        style={{backgroundColor: '#5CB85C'}}>
                            ADD GATEWAY
                    </TouchButton>
                </View>
            </ScrollView>
        );
    }
}

module.exports = GatewaySetup;
