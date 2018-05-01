import React from 'react';
import {
    TextInput,
} from 'react-native';

import styles from './styles';

function TextBox(props) {
    return (
        <TextInput 
            style={[styles.inputField, props.style]}
            underlineColorAndroid='rgba(0,0,0,0)'
            autoCorrect={false}
            returnKeyType={props.returnKeyType}
            autoCapitalize={props.autoCapitalize}
            secureTextEntry={props.secureTextEntry}
            onChangeText = {props.onChangeText}
            placeholder={props.placeholder} />
    );
}

export default TextBox;
