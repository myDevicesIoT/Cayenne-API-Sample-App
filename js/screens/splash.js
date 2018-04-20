import React, { Component  } from 'react';
import {
    Image
} from 'react-native';

import StorageService from '../lib/storage.service';

import {
    Images
} from '../config/index';

import {
    CommonStyles
} from './../components/index';

class Splash extends Component {

    constructor(props){
        super(props);
    }

    async componentDidMount() {
        var token = await StorageService.get('access_token');
        if(token === null){
            this.props.navigation.navigate('CreateName');
            //return <SCREENS.CreateName />;
        }else{
            this.props.navigation.navigate('Status');
        }
    }

    render(){
        return <Image style={ CommonStyles.backgroundImageContainer } source={ Images.loginSplash } />;
    }
}

module.exports = Splash;