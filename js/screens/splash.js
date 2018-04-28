import React, { Component  } from 'react';
import {
    Image
} from 'react-native';

import StorageService from '../lib/storage.service';
import PlatformService from '../lib/platform.service';

import {
    Images
} from '../config/index';

import {
    CommonStyles
} from './../components/index';
import _ from 'lodash';

class Splash extends Component {

    constructor(props){
        super(props);
    }

    async componentDidMount() {
        var token = await StorageService.get('access_token');
        const { navigate } = this.props.navigation;
        if(token === null){
            this.props.navigation.navigate('CreateName');
            //return <SCREENS.CreateName />;
        }else{
            PlatformService.getThings().then(function(response) {
                if (response.statusCode >= 400) return;
                
                if (_.isEmpty(response)) return navigate('SensorSetup');
                return navigate('Status');
            });
        }
    }

    render(){
        return <Image style={ CommonStyles.backgroundImageContainer } source={ Images.loginSplash } />;
    }
}

module.exports = Splash;