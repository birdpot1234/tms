import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation'
import { Icon } from 'native-base';
import font from '../resource/font';
import { normalize } from '../functions/normalize';

export const HeaderTitle = ({ title, titleStyle }) => {
    return <View style={[styles.headerWrapper,]}>
        <Text adjustsFontSizeToFit style={[styles.headerText, titleStyle]} numberOfLines={2} >{title}</Text>
    </View>
}


export const HeaderBack = withNavigation(({ navigation, reverse }) => {
    return <TouchableOpacity style={{ paddingLeft: normalize(16) }} onPress={() => navigation.goBack(null)}>
        <Icon name='arrow-back' style={{ fontSize: normalize(32), color: 'white' }} color={'white'} />
    </TouchableOpacity>
})


const styles = StyleSheet.create({
    headerWrapper: {
        flex: 1,
    },
    headerText: {
        textAlign: 'center', // ok
        alignSelf: 'center', // ok
        fontSize: normalize(24),
        color: '#fff',
        fontFamily: font.semi,
        width: '100%',

    }
})