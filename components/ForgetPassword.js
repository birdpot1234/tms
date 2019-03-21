import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, Alert, TouchableOpacity } from 'react-native'

import { Container, Button, Form, Item, Label, Input } from 'native-base'
import { normalize } from '../functions/normalize';
import font from '../resource/font';

console.disableYellowBox = true;

class ForgetPassword extends Component {
    eiei = () => {
        Alert.alert("Test Change Password", "Ok")
        // console.log("test")
    }


    render() {
        return (

            <Container style={{ backgroundColor: 'white' }}>

                <Form style={{ paddingHorizontal: normalize(10) }}>
                    <View style={{ flexDirection: 'row', }}>
                        <Image source={require('../assets/icon/phone-call.png')} style={{ width: normalize(20), height: normalize(20), marginTop: normalize(40) }} />
                        <Item floatingLabel style={{ flex: 1 }}>
                            <Label style={{ fontSize: normalize(18) }}>Phone Number</Label>
                            <Input keyboardType='numeric' style={{ fontSize: normalize(18) }} />
                        </Item>
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                        <Image source={require('../assets/icon/id.png')} style={{ width: normalize(20), height: normalize(20), marginTop: normalize(40) }} />
                        <Item floatingLabel style={{ flex: 1 }}>
                            <Label style={{ fontSize: normalize(18) }}>Emplyee ID</Label>
                            <Input style={{ fontSize: normalize(18) }} />
                        </Item>
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                        <Image source={require('../assets/icon/key.png')} style={{ width: normalize(20), height: normalize(20), marginTop: normalize(40) }} />
                        <Item floatingLabel style={{ flex: 1 }}>
                            <Label style={{ fontSize: normalize(18) }}>New Password</Label>
                            <Input secureTextEntry={true} style={{ fontSize: normalize(18) }} />
                        </Item>
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                        <Image source={require('../assets/icon/key.png')} style={{ width: normalize(20), height: normalize(20), marginTop: normalize(40) }} />
                        <Item floatingLabel style={{ flex: 1 }}>
                            <Label style={{ fontSize: normalize(18) }}>Retype New Password</Label>
                            <Input secureTextEntry={true} style={{ fontSize: normalize(18) }} />
                        </Item>
                    </View>
                </Form>

                <TouchableOpacity
                    style={{
                        marginTop: normalize(20), backgroundColor: '#0086b3', paddingVertical: normalize(5),
                        width: normalize(200), borderRadius: normalize(5),
                        justifyContent: 'center', alignItems: 'center',
                        paddingHorizontal: normalize(10),
                        borderColor: '#0086b3',
                        borderWidth: normalize(2),
                        alignSelf: 'center'
                    }}

                    onPress={this.eiei.bind(this)}>
                    <Text style={{ color: 'white', fontFamily: font.semi, fontSize: normalize(18) }}>บันทึกรหัสผ่าน</Text>
                </TouchableOpacity>
            </Container>

        )
    }
}

export default ForgetPassword


