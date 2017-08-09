import React from 'react';
import {
    Text,
    Modal,
    View
} from 'react-native';

import STYLES from '../common-styles';
import TouchButton from '../Button/index';

function ModalBox(props) {
    return (
        <Modal
            onRequestClose={props.onRequestClose}
            animationType={'fade'}
            transparent={true}
            visible={props.isVisible}
            style={{justifyContent:'center', alignItems:'center'}}>
                <View style={{flex:0.3, backgroundColor:'#000A'}}/>
                <View style={{backgroundColor:'#000A', flex:0.3}}>
                    <View style={{paddingBottom:20, margin:20, justifyContent:'center', alignItems:'center', backgroundColor:'white', borderRadius:5}}>
                        <View>
                            <Text style={STYLES.modalText}>{props.modalText}</Text>
                            <TouchButton
                                title = {props.title}
                                activeOpacity={0.8}
                                onPress={props.onPress}>
                                    {props.buttonText}
                            </TouchButton>
                        </View>
                    </View>
                </View>
            <View style={{flex:0.4, backgroundColor:'#000A'}}/>
        </Modal>
    );
}

export default ModalBox;
