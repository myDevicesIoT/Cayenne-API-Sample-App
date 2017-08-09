import {
    Text,
    View,
    Image,
} from 'react-native';
import {
    Images
} from './../../config/index';
import Hr from 'react-native-hr';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

function Instructions(props) {
    if (!props.show) {
        return (
            <View>
                <View style={{
                    flex: 0.05,
                    marginBottom: 25
                }}>
                    <Text style={{
                        color: 'white',
                        position: 'absolute',
                        left: 0,
                        paddingLeft: 10
                    }}>{props.title}</Text>

                    <Text style={{color: 'steelblue', position: 'absolute', right: 0, paddingRight: 10}}
                        onPress = {props.onPress}>
                            View Instructions <Icon name="angle-down" color="steelblue"/>
                    </Text>
                </View>
                <Hr lineColor='#b3b3b3' textColor='steelblue' />
            </View>
        );
    }
    return (
        <View>
            <View style={{
                flex: 0.05,
                marginBottom: 25
            }}>
                <Text style={{
                    color: 'white',
                    position: 'absolute',
                    left: 0,
                    paddingLeft: 10
                }}>{props.title}</Text>

                <Text style={{color: 'steelblue', position: 'absolute', right: 0, paddingRight: 10}}
                    onPress = {props.onPress}>
                        Hide Instructions <Icon name="angle-up" color="steelblue"/>
                </Text>                
            </View>

            <View style={{
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Image
                    resizeMode={'stretch'}
                    style={{width: 175, height: 125, margin: 0}}
                    source={props.instructionsImages[0]}></Image>
                <Text style={{color: 'white', width: 250, textAlign: 'center', alignItems: 'center', marginBottom: 10}}>{props.instructions[0]}</Text>
                <Hr lineColor='#b3b3b3' textColor='steelblue' />
                <Image
                    resizeMode={'stretch'}
                    style={{width: 175, height: 125, margin: 0}}
                    source={props.instructionsImages[1]}></Image>
                <Text style={{color: 'white', width: 250, textAlign: 'center', alignItems: 'center', marginBottom: 10}}>{props.instructions[1]}</Text>
                <Hr lineColor='#b3b3b3' textColor='steelblue' />
            </View>

        </View>
    );
}

export default Instructions;
