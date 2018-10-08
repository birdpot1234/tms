import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, TextInput, TouchableOpacity, Alert, ImageBackground, StatusBar } from 'react-native'
import { gql, withApollo, compose } from 'react-apollo'
// import {gql} from 'apollo-boost'
// import gql from 'graphql-tag'

import { Icon, Container, Header, Left, Body, Right, Content, Button } from 'native-base'

// import MSSQL from 'react-native-mssql'; //connect to db

class Login extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            mess: "",
            status: false
        };
    }

    confirmLogin = () => {
        const IMEI = require('react-native-imei');
        const { navigate } = this.props.navigation
        console.log('imeeeeeeeeeeeeeeeeeeeeeeeee')
        console.log(IMEI.getImei())
        this.props.client.query({
            query: loginQuery,
            variables: {
                "IMEI": IMEI.getImei(),
                "Password": this.state.text
            }
        }).then((result) => {
             console.log(result.data.loginQuery.status)
             
            if (result.data.loginQuery.status) {
                navigate("mainScreen")
                // console.log("name Mess",this.state.mess)
            } else {
                Alert.alert("เข้าสู่ระบบไม่สำเร็จ", "กรุณาเข้าสู่ระบบอีกครั้ง(Test)",
                 [
                    { text: 'ตกลง', onPress: ()  => console.log("ok") },
                ]
            )
            }

        }).catch((err) => {
            console.log(err)
        });
    }

    user = () => {
        const IMEI = require('react-native-imei');

        this.props.client.query({
            query: beforeloginQuery,
            variables: {
                "imei": IMEI.getImei()
            }
        }).then((result) => {
            // console.log(result.data.beforeloginQuery[0].IDMess)
            this.setState({ mess: result.data.beforeloginQuery[0].IDMess })
        }).catch((err) => {
            console.log(err)
        });
    }

    componentWillMount() {
        this.user();
    }

    render() {

        const { navigate } = this.props.navigation

        // this.user();

        return (

            <Container>

                <StatusBar backgroundColor="#33adff"
                    barStyle="light-content" hidden={false} />

                <ImageBackground style={styles.container}
                    source={require('../assets/loader.png')}>
                    <View style={{ marginBottom: 20 }}>
                        <Image source={require('../assets/dplus.png')}
                            style={{ width: 160, height: 160 }}
                        />
                    </View>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', fontStyle: 'italic', color: 'white' }}>
                        {this.state.mess}
                    </Text>
                    <View style={{ flexDirection: 'row', marginTop: 50, justifyContent: 'center' }}>
                        <Image source={require('../assets/icon/lock.png')}
                            style={{ width: 32, height: 32 }}
                        />
                        <TextInput
                            style={{
                                height: 45,
                                width: 200,
                                padding: 10,
                                backgroundColor: 'rgba(0,0,0,0)'
                            }}
                            keyboardType='default'
                            placeholder='กรุณากรอกรหัสผ่าน'
                            placeholderTextColor="white"
                            secureTextEntry={true}
                            underlineColorAndroid='white'
                            onChangeText={(text) => this.setState({ text })}
                        />
                    </View>

                    <View style={{ justifyContent: 'center', marginTop: 20 }}>
                        <Button transparent
                            style={{ height: 20 }}
                            onPress={() => navigate('ForgetPassword')}
                        >
                            <Text style={{ color: 'white' }}>ลืมรหัสผ่าน?</Text>
                        </Button>
                    </View>
                    <TouchableOpacity onPress={this.confirmLogin.bind(this)}
                        style={{ marginTop: 20 }}>
                        <Button rounded
                            style={{ width: 200, backgroundColor: 'white', justifyContent: 'center' }}
                        >
                            <Text style={{ color: '#0086b3', fontWeight: 'bold' }}>เข้าสู่ระบบ</Text>
                        </Button>
                    </TouchableOpacity>
                </ImageBackground>



            </Container>
        )
    }
}

// export default Login

const beforeloginQuery = gql`
    query beforeloginQuery($imei:String!){
        beforeloginQuery(imei: $imei){
            IDMess
        }
    }
`

const loginQuery = gql`
    query loginQuery($IMEI:String!,$Password:String!){
        loginQuery(IMEI: $IMEI,Password: $Password){
            status
        }
    }
`

const GraphQL = compose(Login)
export default withApollo(GraphQL)

// const Login = graphql(beforeloginQuery)(LoginEIEI)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d9d9d9',
        flexDirection: 'column'
    }
})
