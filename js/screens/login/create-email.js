import React, { Component  } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    Linking,
    Navigator,
    Platform
} from 'react-native';
import _ from 'lodash';
import {
    TouchButton,
    TextBox,
    CommonStyles
} from './../../components/index';
import {
    Images
} from './../../config/index';
import {
  AuthService,
  PlatformService,
  StorageService
} from './../../lib/index';
import {
  Session
} from './../../config/index'

class CreateEmail extends Component {
  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    this.state = {
      firstName: props.navigation.state.params.firstName,
      lastName: props.navigation.state.params.lastName,
      email: '',
      password: ''
    };
    this.cayenneSignup = _.debounce(this.cayenneSignup.bind(this));
  }

  /**
   * Create user
   */
  cayenneSignup = () => {
    let vm = this;
    const { navigate } = this.props.navigation;

    let { email, password, firstName, lastName } = this.state;
    email = email.trim();

    if (email.search('@') === -1 || password === '') return;

    AuthService.createUser(email, password, firstName, lastName).then(function(response) {
      if (response.statusCode >= 400) {
        return alert(response.message);
      }

      Session.access_token = response.access_token;
      Session.refresh_token = response.refresh_token;

      PlatformService.createClient().then(function(response) {
        if (response.statusCode >= 400) return alert('Unable to create client');
        StorageService.set('mqqt_id', response.id);
        StorageService.set('mqqt_secret', response.clear_secret);

        return navigate('GatewaySetup')
      });
    }).catch(function(error) {
      alert(error.message);
    });
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <Image style={ CommonStyles.backgroundImageContainer } source={ Images.loginSplash }>
        <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Image style={{ backgroundColor:'transparent' }} source={ Images.logo }/>
          <Text style={ CommonStyles.screenText }>Create an account to get started</Text>

          <TextBox
            style={{ height: 45, alignSelf: 'stretch' }}
            onChangeText={(text) => this.setState({ email: text })}
            placeholder = 'Email'/>

          <TextBox
            style={{ height: 45, alignSelf: 'stretch' }}
            onChangeText={(text) => this.setState({ password: text })}
            placeholder = 'Password'
            secureTextEntry={ true }/>

          <TouchButton
            buttonStyle = {{ alignSelf: 'stretch' }}
            title = 'Create Account'
            onPress = {() => { this.cayenneSignup() }}
            activeOpacity={0.8}>
                Create Account
          </TouchButton>

          <TouchableOpacity 
            onPress = {() => navigate('Login')}
            title = "Login">
              <View style = {{
                flexDirection: 'row',
              }}>
                <Text style={ CommonStyles.screenText }>Already have an account?</Text>
                <Text style={ CommonStyles.linkText }>Login</Text>
              </View>
          </TouchableOpacity>
        </View>
      </Image>
    )
  }
}

module.exports = CreateEmail;
