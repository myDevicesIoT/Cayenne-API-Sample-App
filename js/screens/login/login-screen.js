import React, { 
    Component 
} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    Modal,
    Linking,
    Navigator,
    Platform
} from 'react-native';
import {
    StackNavigator
} from 'react-navigation';
import DeepLinking from 'react-native-deep-linking';
import _ from 'lodash';
import {
    TouchButton,
    TextBox,
    ModalBox,
    CommonStyles
} from './../../components/index';
import {
    AuthService,
    PlatformService
} from './../../lib/index';
import {
    Session,
    Settings,
    Images
} from './../../config/index';

import {createIconSetFromFontello} from 'react-native-vector-icons';
import config from './../../config/config.json';
let Icon = createIconSetFromFontello(config);

class LoginScreen extends Component{
    static navigationOptions = {header: null};

    constructor(){
        super();
        this.state = {
            username: '',
            password: '',
            modalVisible: false
        };
        this.cayenneLogin = _.debounce(this.cayenneLogin.bind(this));
        this.cayenneApi = _.debounce(this.cayenneApi.bind(this), 1000, {leading: true});
        this.getThings = this.getThings.bind(this);
        Session.access_token = '';
        Session.refresh_token = '';
    }

    componentDidMount() {
        if (Platform.OS === 'android') {
            Linking.getInitialURL().then(url => {
                this.navigate(url);
            });
        } else Linking.addEventListener('url', this.handleOpenURL);
    }

    componentWillUnmount() { Linking.removeEventListener('url', this.handleOpenURL); }

    handleOpenURL = (event) => { this.navigate(event.url); }

    /**
     * Cayenne API Login using app id
     * This will redirect to the authorization page and will use the redirect link provdided
     */
    cayenneApi = (loginType) => {
        Settings.state = Settings.guid();
        var loginUrl = (loginType === 'implicit') ? Settings.getImplicitLogin() : Settings.getExplicitLogin();
        Linking.openURL(loginUrl)
            .then(supported => {})
            .catch(err => console.error('Error: ', err));
    }

    /**
     * Standard Cayenne login using email & password
     */
    cayenneLogin = () => {
        var vm = this;
        const { username, password, modalVisible } = this.state;
        var email = username.trim();    // Some auto completes on phones appends spaces

        if (email.search('@') === -1 || email === '' || password === '') return;

        AuthService.getToken(email, password).then(function(response) {
            if (response.statusCode >= 400) {
                vm.setState({ modalVisible: true });
                return;
            }
            vm.getThings();
        }).catch(function (error) {
            alert(error.message);
        });
    }

    getThings = () => {
        var vm = this;
        const { navigate } = this.props.navigation;

        PlatformService.createClient().then(function(response) {
            if (_.isEmpty(response)) return;
            Session.mqqt_id = response.id;
            Session.mqqt_secret = response.clear_secret;

            PlatformService.getThings().then(function(response) {
                if (response.statusCode >= 400) return;
                if (_.isEmpty(response)) return navigate('SensorSetup');
                return navigate('Status');
            });
        });
    }

    render(){
        const {navigate} = this.props.navigation;
        return(
                <View style={CommonStyles.backgroundImageContainer}>
                    <ModalBox
                        onRequestClose={() => navigate('Login')}
                        isVisible={this.state.modalVisible}
                        modalText='Wrong email or password!'
                        title='OK'
                        onPress={() => {this.setState({modalVisible: false})}}
                        buttonText='OK'>
                    </ModalBox>

                    <View style={{flex:0.05}}/>
                    <View style={{flex:1, justifyContent:'flex-start'}}>
                        <Image style={{margin:50, backgroundColor:'transparent'}} source={Images.logo}/>

                        <TextBox
                            style={{height: 45}}
                            autoCapitalize='none'
                            returnKeyType={'next'}
                            onChangeText={(text) => this.setState({username: text})}
                            placeholder = 'Username'/>
                        <TextBox
                            style={{height: 45}}
                            onChangeText={(text) => this.setState({password: text})}
                            placeholder = 'Password'
                            returnKeyType={'done'}
                            secureTextEntry={true}/>

                        <TouchButton
                            title = 'Sign In'
                            onPress = {() => {this.cayenneLogin()}}
                            activeOpacity={0.8}>
                                Sign In
                        </TouchButton>

                        {/* <TouchableOpacity 
                            onPress = {() => navigate('ForgotPassword')}
                            title = "Forgot Passord?"><Text style={CommonStyles.linkText}>Forgot password?</Text>
                        </TouchableOpacity> */}
                    </View>
                    <View style={{flex:0.05}}/>
                </View>
        );
    }
}

module.exports = LoginScreen;
