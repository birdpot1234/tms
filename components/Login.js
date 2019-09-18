import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, TextInput, TouchableOpacity, Alert, ImageBackground, StatusBar, NetInfo } from 'react-native'
import { gql, withApollo, compose } from 'react-apollo';
import IMEI from 'react-native-imei';
import { normalize } from '../functions/normalize';
import font from '../resource/font'

import { Container, Button } from 'native-base'
class Login extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            mess: "",
            status: false,
            selected1: null,
            addressIMEI: '',
            loading: false,
            error: false
        };
    }


    componentDidMount() {
        NetInfo.getConnectionInfo().then(connectionInfo => {
            if (connectionInfo.type.toLocaleLowerCase() !== "none") {
                console.log('didmount');
                this.user();
            } else {
                this.setState({ loading: true, error: true })
            }
        })
    }

    confirmLogin = () => {
        let { addressIMEI } = this.state
        const { navigate } = this.props.navigation
        this.props.client.query({
            query: loginQuery,
            variables: {
                "IMEI": addressIMEI,
                // "IMEI": "358465093919531",
                "Password": this.state.text
            }
        }).then((result) => {
            if (result.data.loginQuery.status) {
                navigate("mainScreen")
            } else {
                Alert.alert("เข้าสู่ระบบไม่สำเร็จ", "กรุณาเข้าสู่ระบบอีกครั้ง(Test)",
                    [
                        { text: 'ตกลง', onPress: () => console.log("ok") },
                    ]
                )
            }

        }).catch((err) => {
            console.log(err)
        });
    }

    user = () => {
        let imei = IMEI.getImei();
        console.log(imei)
        this.props.client.query({
            query: beforeloginQuery,
            variables: {
                "imei": IMEI.getImei()
                // "imei": "359993095628619",
            }
        }).then((result) => {
            console.log(result, imei);
            this.setState({ mess: result.data.beforeloginQuery[0].IDMess, addressIMEI: imei, loading: true })
        }).catch((err) => {
            this.setState({ error: false, loading: true })
        });
    }

    render() {
        let { mess, loading, error } = this.state
        const { navigate } = this.props.navigation
        return (
            <Container>
                <StatusBar backgroundColor={"transparent"} translucent barStyle="light-content" />
                <ImageBackground style={styles.container}
                    source={require('../assets/loader.png')}>
                    {mess ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ marginBottom: normalize(20) }}>
                            <Image source={require('../assets/dplus.png')}
                                style={{ width: normalize(160), height: normalize(160), borderRadius: 15, }}
                            />
                        </View>
                        {/* <Text style={{ fontSize: 24, fontWeight: 'bold', fontStyle: 'italic', color: 'white' }}>
                            {this.state.mess}
                        </Text> */}
                        <View style={[styles.containerLogin, { marginTop: normalize(30), }]}>
                            <Image source={require('../resource/man.png')} style={{ width: normalize(30), height: normalize(30), tintColor: '#0086b3' }} resizeMode={'contain'} />
                            <TextInput
                                value={mess}
                                editable={false}
                                style={{
                                    width: normalize(200),
                                    padding: normalize(10),
                                    paddingLeft: normalize(20),
                                    backgroundColor: 'rgba(0,0,0,0)',
                                    fontSize: normalize(18),
                                    fontFamily: font.regular,
                                    color: '#0086b3',
                                }}
                                keyboardType='default'
                                placeholder='กรุณากรอกรหัสผ่าน'
                                placeholderTextColor="#0086b3"
                                underlineColorAndroid='transparent'
                            />
                        </View>

                        {/*####################### PASSWORD #######################*/}
                        <View style={[styles.containerLogin, { marginTop: normalize(10) }]}>
                            <Image source={require('../assets/icon/lock.png')} style={{ width: normalize(30), height: normalize(30), tintColor: '#0086b3' }} resizeMode={'contain'} />
                            <TextInput
                                style={{
                                    width: normalize(200),
                                    padding: normalize(10),
                                    paddingLeft: normalize(20),
                                    backgroundColor: 'rgba(0,0,0,0)',
                                    fontSize: normalize(18),
                                    fontFamily: font.regular,
                                    color: '#0086b3',
                                }}
                                keyboardType='default'
                                placeholder='กรุณากรอกรหัสผ่าน'
                                placeholderTextColor="#0086b3"
                                secureTextEntry={true}
                                underlineColorAndroid='transparent'
                                onChangeText={(text) => this.setState({ text })}
                            />
                        </View>

                        <View style={{ justifyContent: 'center', marginTop: normalize(20) }}>
                            <Button transparent
                                style={{ height: normalize(20) }}
                                onPress={() => navigate('ForgetPassword')}
                            >
                                <Text style={{ color: 'white', fontSize: normalize(16) }}>ลืมรหัสผ่าน?</Text>
                            </Button>
                        </View>

                        <TouchableOpacity onPress={this.confirmLogin.bind(this)}
                            style={{
                                marginTop: normalize(20), backgroundColor: 'white', paddingVertical: normalize(5),
                                width: normalize(200), borderRadius: normalize(5),
                                justifyContent: 'center', alignItems: 'center',
                                paddingHorizontal: normalize(10),
                                borderColor: '#0086b3',
                                borderWidth: normalize(2)
                            }}>
                            <Text style={{ color: '#0086b3', fontFamily: font.semi, fontSize: normalize(20) }}>เข้าสู่ระบบ</Text>
                        </TouchableOpacity>

                        <Text style={{ marginTop: normalize(10), fontSize: normalize(16), color: 'white' }}>เวอร์ชั่น 1.0.2</Text>
                    </View> : loading ?
                            !error ?
                                <Text style={{ fontFamily: font.regular, fontSize: normalize(18), color: 'white', textAlign: 'center' }}>โทรศัพท์ของท่านยังไม่ได้ลงทะเบียน โปรดติดต่อผู้พัฒนา</Text> :
                                <Text style={{ fontFamily: font.regular, fontSize: normalize(18), color: 'white', textAlign: 'center' }}>โปรดเช็คสัญญาณมือถือของท่านใหม่ หรือรีสตาร์ทอุปกรณ์มือถือของท่าน</Text> :
                            <View />}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d9d9d9',
        flexDirection: 'column'
    },
    containerLogin: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: normalize(5),
        borderColor: 'white',
        alignItems: 'center',
        paddingVertical: normalize(3),
        paddingHorizontal: normalize(10)
    }
})
