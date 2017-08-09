import {
    StyleSheet
} from 'react-native';

export default StyleSheet.create({
    inputField: {
        marginLeft:10,
        marginRight:10,
        marginTop:5,
        marginBottom:5,
        padding:15,
        borderRadius: 5,
        backgroundColor:'white'
    },
    linkText: {
        marginTop:1,
        padding:1,
        textAlign:'center',
        backgroundColor: 'transparent',
        fontSize:16,
        color:'white',
        textDecorationLine:'underline',
        textDecorationStyle:'solid'
    },
    backgroundImageContainer:{
        flex: 1,
        resizeMode:'stretch',
        width: undefined,
        height: undefined,
        backgroundColor: 'transparent',
        justifyContent: 'center'
    },
    modalText:{
        marginLeft:10,
        marginRight:10,
        marginTop:5,
        marginBottom:2,
        padding:15,
        textAlign:'center',
        fontSize:18,
        color:'black'
    },
    screenText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 5,
        marginTop: 5,
        width: 250
    },
    background: {
        flex: 1,
        width: undefined,
        height: undefined,
        backgroundColor: '#3A4950',
    },
    textHeader: {
        width: 100,
        textAlign: 'center'
    },
    white: {
        color: '#FFFFFF'
    },



    sensorBackground: {
        flex: 1,
        width: undefined,
        height: undefined,
        backgroundColor: '#000050',
    },
})
