import React, { 
    Component
} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Navigator,
  Image,
  Modal
} from 'react-native';
import {
  StackNavigator
} from 'react-navigation';
import _ from 'lodash';
import {
    TouchButton,
    TextBox,
    ModalBox,
    CommonStyles
} from './../../components/index';
import {
    AuthService
} from './../../lib/index';
import {
    Images
} from './../../config/index';

class ForgotPassword extends Component {
    static navigationOptions = {header: null};

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            modalVisible: false
        };
        this.forgotPassword = this.forgotPassword.bind(this);
    }

    forgotPassword = () => {
        const {navigate } = this.props.navigation;
        const { email, modalVisible } = this.state;

        if (email.search('@') === -1) return; 

        this.setState({ modalVisible: true });
        AuthService.forgotPassword(email.trim()).then(function(response) {
            console.log(response);
        }).catch(function(error) {
            alert(error.message);
        })
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
                <Image style={CommonStyles.backgroundImageContainer} source={Images.loginSplash}>
                    <ModalBox
                        onRequestClose={() => navigate('Login')}
                        isVisible={this.state.modalVisible}
                        modalText='You`ll receive an email shortly if you entered a valid email.'
                        title='OK'
                        onPress={() => {this.setState({modalVisible: false})}}
                        buttonText='OK'>
                    </ModalBox>

                    <View style={{
                        flex: 0.5,
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        <Image style={{margin:40, backgroundColor:'transparent'}} source={Images.logo}/>
                        <Text style={CommonStyles.screenText}>Forgot your password?</Text>
                        <Text style={CommonStyles.screenText}>Enter your email address below and we'll send you instructions for how to reset your password</Text>
                    </View>

                    <View style={{flex:0.5}}>
                        <TextBox
                            style={{height: 45}}
                            onChangeText = {(text) => this.setState({email: text})} 
                            placeholder='Email' />

                        <TouchButton
                            title = 'Send Link'
                            onPress = {() => {this.forgotPassword()}}
                            activeOpacity={0.8}>
                                Send Link
                        </TouchButton>

                        <TouchableOpacity 
                            onPress = {() => navigate('Login')}
                            title = "Cancel"><Text style={CommonStyles.linkText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Image>
        );
    }
}

module.exports = ForgotPassword;
