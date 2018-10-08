import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, TextInput, TouchableOpacity, Alert} from 'react-native'

import { Icon, Container, Header, Left, Body, Right, Content, Button, Form, Item, Label, Input } from 'native-base'

console.disableYellowBox = true;

class ForgetPassword extends Component {

    static navigationOptions = {
        headerTitle: () => (
            <View>
                <Text style={{ fontSize: 16, color: "black", color: 'white' }}>Forget Password</Text>
            </View>
        ),
        // headerTintColor: "blue", //สีลูกศร
        headerStyle: {
            backgroundColor:"#66c2ff"
        }
    }

    eiei = () =>{
        Alert.alert("Test Change Password","Ok")
        // console.log("test")
    }


    render() {
        return (

            <Container style={{ backgroundColor: 'white' }}>
                
                <Form style={{ paddingHorizontal: 10 }}>
                    <View style={{ flexDirection: 'row', }}>
                        <Image source={require('../assets/icon/phone-call.png')} 
                        style={{ width: 20, height: 20, marginTop: 40 }}/>
                        <Item floatingLabel style={{ flex:1 }}>
                            <Label>Phone Number</Label>
                            <Input keyboardType= 'numeric' />
                        </Item>
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                        <Image source={require('../assets/icon/id.png')} 
                        style={{ width: 20, height: 20, marginTop: 40 }}/>
                        <Item floatingLabel style={{ flex:1 }}>
                            <Label>Emplyee ID</Label>
                            <Input />
                        </Item>
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                        <Image source={require('../assets/icon/key.png')} 
                        style={{ width: 20, height: 20, marginTop: 40 }}/>
                        <Item floatingLabel style={{ flex:1 }}>
                            <Label>New Password</Label>
                            <Input secureTextEntry={true} />
                        </Item>
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                        <Image source={require('../assets/icon/key.png')} 
                        style={{ width: 20, height: 20, marginTop: 40 }}/>
                        <Item floatingLabel style={{ flex:1 }}>
                            <Label>Retype New Password</Label>
                            <Input secureTextEntry={true} />
                        </Item>
                    </View>
                </Form>

                <View style={{ margin: 20}} />

                <View style={{ margin: 10 }}>
                    <Button full
                    style={{ backgroundColor: '#66c2ff' }} 
                    onPress={this.eiei.bind(this)}>
                        <Text style={{ color: 'white', fontWeight: 'bold'}}>Change Password</Text>
                    </Button>
                </View>
                
            </Container>

        )
    } 
}

export default ForgetPassword

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#66c2ff',
        flexDirection: 'column'
      }
})
