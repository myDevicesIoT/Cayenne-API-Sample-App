import React, { Component  } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
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

class CreateName extends Component {
    static navigationOptions = {header: null};

    constructor(){
        super();
        this.state = {
            firstName: '',
            lastName: '',
        };
    }

    render(){
        const {navigate} = this.props.navigation;
        return(
            <View style={ CommonStyles.backgroundImageContainer }>
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
                        onChangeText={(text) => this.setState({firstName: text})}
                        placeholder = 'First Name'/>
                    <TextBox
                        style={{ height: 45, alignSelf: 'stretch' }}
                        onChangeText={(text) => this.setState({lastName: text})}
                        placeholder = 'Last Name'/>

                    <TouchButton
                        buttonStyle = {{ alignSelf: 'stretch' }}
                        title = 'next'
                        onPress = {() => navigate('CreateEmail', screenProps = { firstName: this.state.firstName, lastName: this.state.lastName })}
                        activeOpacity={0.8}>
                            NEXT
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
            </View>
        );
    }
}

module.exports = CreateName;
