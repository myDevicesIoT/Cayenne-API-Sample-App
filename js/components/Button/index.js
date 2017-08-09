import React from 'react';
import {
    Text,
    TouchableOpacity
} from 'react-native';

import styles from './styles';

function Button(props) {
    return (
        <TouchableOpacity
            onPress = {props.onPress}
            title = {props.title}
            activeOpacity = {props.activeOpacity}
            style = {props.buttonStyle}>
            <Text style={[styles.buttonText, props.style]}>
                {props.children}</Text>
        </TouchableOpacity>
    );
}

export default Button;
