import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, ScrollView, TouchableOpacity, RefreshControl, TouchableHighlight, CheckBox, PermissionsAndroid } from 'react-native'
import { gql, withApollo, compose } from 'react-apollo'
import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, Input, Item, Grid, Col } from 'native-base';
import SignatureCapture from 'react-native-signature-capture';
import Moment from 'moment';
import mainservice from '../../services/mainService'
import { normalize } from '../../../functions/normalize';
import font from '../../../resource/font';
class Submit_TSC extends Component {
    constructor(props) {
        super(props);
        this.state = {
            latitude: 1,
            longitude: 1,
            error: null,
            image: null,
            sig_status: false,
            partname: null,
            status_CHECKBOX: false,
            date: Moment(new Date).format('d-MM-YYYY'),
            time: Moment(new Date).format('h-mm-ss'),
            refreshing: false
        }

        this.props.client.resetStore();
    }

    async  checkPermissionStorage() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'ขออนุญาตเข้าพื้นที่จัดเก็บข้อมูล',
                    message: 'กด "ยอมรับ"',
                    buttonPositive: 'ยอมรับ'
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                this.refs["sign"].saveImage();
            } else {
                this.checkPermissionStorage()
            }
        } catch (err) {
            console.warn(err);
        }
    }

    submit_inv = () => {
        var www = "http://www.dplus-system.com:3401/upload/"
        var name = global.NameOfMess + "_" + this.state.date + "_" + this.state.time
        var filename = name + '.png'
        var url = www + filename
        this.props.client.mutate({
            mutation: submit_inv,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id,
                "filename": url
            }
        }).then((result) => {
            console.log("success", this.props.navigation.state.params.id)
        }).catch((err) => {
            console.log("err of submitwork", err)
        });
    }

    submitwork = (s) => {
        this.setState({ refreshing: true }, () => {
            this.props.client.mutate({
                mutation: submit_TSC,
                variables: {
                    "TSC": this.props.navigation.state.params.id,
                    "status_work": s
                }
            }).then((result) => {
                if (!result.data.submit_TSC.status) {
                    Alert.alert("ส่งไม่สำเร็จ", "กรุณากดส่งใหม่อีกครั้ง")
                } else {
                    navigator.geolocation.getCurrentPosition(
                        async position => {
                            let { latitude, longitude } = position.coords;
                            this.tracking(s, latitude, longitude)
                        },
                        (error) => {
                            console.log(error)
                            this.tracking(s, -1, -1)
                        },
                    )
                }
            }).catch((err) => {
                console.log("err of submitwork", err)
            });
        })
    }

    tracking = (s, latitude, longitude) => {
        this.props.client.mutate({
            mutation: tracking_CN,
            variables: {
                "invoice": this.props.navigation.state.params.id,
                "status": s,
                "messengerID": global.NameOfMess,
                "lat": latitude,
                "long": longitude,
            }
        }).then((result) => {
            if (!result.data.tracking_CN.status) {
                Alert.alert(
                    "ส่งไม่สำเร็จ",
                    "กรุณากดส่งใหม่อีกครั้ง",
                )
            } else {
                this.props.navigation.state.params.refresion()
                this.props.navigation.goBack()
            }
        }).catch((err) => {
            console.log("ERR OF TRACKING", err)
        });
    }


    pic = () => {
        const part = 'file:///storage/emulated/0/saved_signature/signature.png'
        const name = global.NameOfMess + "_" + this.state.date + "_" + this.state.time
        const fileName = name + '.png'
        let photo = {
            uri: part,
            type: 'image/png',
            name: fileName,
            size: 500,
        };
        var form = new FormData();
        form.append("productImage", photo);
        form.append("inv", this.props.navigation.state.params.id);

        fetch('http://www.dplus-system.com:3401/upload', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: form,
        })
            .then((response) => response.json())
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        let { refreshing } = this.state
        const { navigate } = this.props.navigation
        return (
            <Container>
                <Content contentContainerStyle={{ flex: 1 }} refreshControl={<RefreshControl enabled={false} refreshing={refreshing} />}>
                    <View style={{ flex: 1, flexDirection: "column" }}>
                        <SignatureCapture
                            style={[{ flex: 1 }, styles.signature]}
                            ref="sign"
                            onSaveEvent={this._onSaveEvent}
                            onDragEvent={this._onDragEvent}
                            saveImageFileInExtStorage={true}
                            showNativeButtons={false}
                            showTitleLabel={false}
                            viewMode={"portrait"} />
                    </View>

                    <Footer style={{ height: normalize(140) }} backgroundColor={'white'}>
                        <View>
                            <View style={{ flex: 1, flexDirection: 'row', }}>
                                <TouchableOpacity onPress={() => navigate('')} >
                                    <View style={{
                                        width: Dimensions.get('window').width / 2, height: normalize(70), backgroundColor: '#FFFD66'
                                        , justifyContent: 'center', alignItems: 'center'
                                    }}>
                                        <Image source={require('../../../assets/icon/photo-camera.png')}
                                            style={{ width: normalize(35), height: normalize(35) }} />
                                        <Text style={{ fontFamily: font.semi, fontSize: normalize(16), marginTop: normalize(2) }}>ถ่ายภาพ</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => { this.resetSign() }}  >
                                    <View style={{
                                        width: Dimensions.get('window').width / 2, height: normalize(70), backgroundColor: '#FFA566'
                                        , justifyContent: 'center', alignItems: 'center'
                                    }}>
                                        <Image source={require('../../../assets/icon/check.png')}
                                            style={{ width: normalize(35), height: normalize(35) }} />
                                        <Text style={{ fontFamily: font.semi, fontSize: normalize(16), marginTop: normalize(2) }}>แก้ไขลายเซ็น</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={{ flex: 1, flexDirection: 'row', }}>
                                <TouchableOpacity onPress={() =>
                                    Alert.alert(
                                        "ยืนยันการส่งงาน",
                                        "คุณต้องการยืนยันการส่งงานหรือไม่?",
                                        [
                                            { text: "ยกเลิก", onPress: () => console.log("Cancle") },
                                            { text: "ยืนยัน", onPress: () => this.saveSign() }
                                        ]
                                    )
                                } >
                                    <View style={{
                                        width: Dimensions.get('window').width, height: normalize(70), backgroundColor: '#66FFB3'
                                        , justifyContent: 'center', alignItems: 'center'
                                    }}>
                                        <Image source={require('../../../assets/icon/file.png')}
                                            style={{ width: normalize(35), height: normalize(35) }} />
                                        <Text style={{ fontFamily: font.semi, fontSize: normalize(16), marginTop: normalize(2) }}>ยืนยันส่งงาน</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Footer>
                </Content>
            </Container>
        );
    }

    saveSign() {
        if (this.state.sig_status) {
            this.checkPermissionStorage();
            this.submitwork('A1')
        } else {
            Alert.alert(
                'คุณยังไม่ได้เซ็น ',
                'กรุณาเซ็น'
            )
        }
    }

    resetSign = () => {
        this.refs["sign"].resetImage();
        this.setState({ sig_status: false })
    }

    _onSaveEvent = (result) => {
        this.pic();
        this.submit_inv();
    }

    _onDragEvent = () => {
        this.setState({ sig_status: true })
    }
}

const styles = StyleSheet.create({
    signature: {
        flex: 1,
        borderColor: '#000033',
        borderWidth: 0.5,
    },
    buttonStyle: {
        flex: 1, justifyContent: "center", alignItems: "center", height: normalize(50),
        backgroundColor: "#eeeeee",
        margin: normalize(50)
    },
    con: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',

    }
});

//AppRegistry.registerComponent('SubmitJob', () => SubmitJob);
const GraphQL = compose(Submit_TSC)
export default withApollo(GraphQL)

const submitwork = gql`
    mutation submitwork($status:String!, $invoiceNumber:String!,$paymentType:String!){
        submitwork(status: $status, invoiceNumber: $invoiceNumber, paymentType: $paymentType){
            status
        }
    }
`
const submit_inv = gql`
    mutation submit_inv($invoiceNumber:String!,$filename:String!){
        submit_inv(invoiceNumber: $invoiceNumber, filename: $filename){
            status
        }
    }
`
const submiitdetail = gql`
    mutation submiitdetail($invoiceNumber:String!){
        submiitdetail(invoiceNumber: $invoiceNumber){
            status
        }
    }
`

const submitedit = gql`
    query submitedit($invoiceNumber:String!){
        submitedit(invoiceNumber: $invoiceNumber){
            status
        }
    }
`
const submit_TSC = gql`
    mutation submit_TSC($TSC:String!,$status_work:String!){
        submit_TSC(TSC: $TSC,status_work: $status_work){
            status
        }
    }
`

const tracking = gql`
    mutation tracking(
        $invoice:String!,
        $status:String!,
        $messengerID:String!,
        $lat:Float!,
        $long:Float!
    ){
        tracking(
            invoice: $invoice,
            status: $status,
            messengerID: $messengerID,
            lat: $lat,
            long: $long
        ){
            status
        }
    }
`
const tracking_CN = gql`
    mutation tracking_CN(
        $invoice:String!,
        $status:String!,
        $messengerID:String!,
        $lat:Float!,
        $long:Float!
    ){
        tracking_CN(
            invoice: $invoice,
            status: $status,
            messengerID: $messengerID,
            lat: $lat,
            long: $long
        ){
            status
        }
    }
 `