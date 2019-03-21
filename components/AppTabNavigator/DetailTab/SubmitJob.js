import React, { Component } from 'react'
import { Text, StyleSheet, Alert, View, Image, Dimensions, TouchableOpacity, CheckBox, RefreshControl, PermissionsAndroid } from 'react-native'
import { gql, withApollo, compose } from 'react-apollo'
import { Container, Content, Footer } from 'native-base';
import SignatureCapture from 'react-native-signature-capture';
import Moment from 'moment';
import { normalize } from '../../../functions/normalize';
import font from '../../../resource/font';

class SubmitJob extends Component {

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
            status_typetran: false,
            submitjob: false,
            date: Moment(new Date).format('DD-MM-YYYY'),
            time: Moment(new Date).format('h-mm-ss'),
            refreshing: false
        }
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

    submitedit = () => {
        this.props.client.query({
            query: submitedit,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id
            }
        }).then((result) => {
            let status = result.data.submitedit.status ? "A2" : "A1";
            this.setState({ refreshing: true }, () => {
                navigator.geolocation.getCurrentPosition(
                    async position => {
                        let { latitude, longitude } = position.coords;
                        this.submitwork(status, latitude, longitude)
                    },
                    (error) => {
                        console.log(error)
                        this.submitwork(status, -1, -1)
                    },
                )
            })
        }).catch((err) => {
            console.log(err)
        });
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
        }).catch((err) => {
            console.log("err of submitwork", err)
        });
    }

    /**
     * submitwork => submitjob
     */
    submitwork = (s, latitude, longitude) => {
        let payType = this.props.navigation.state.params.PAYMMODE || null
        let CheckBoxTranfer = (this.state.status_CHECKBOX) ? "true" : "false"
        let tranType = (this.state.status_typetran) ? "Transport" : "Truck"
        this.props.client.mutate({
            mutation: submitwork_DL,
            variables: {
                "status": s,
                "invoiceNumber": this.props.navigation.state.params.id,
                "paymentType": payType,
                "tranType": tranType,
                "CheckBoxTranfer": CheckBoxTranfer
            }
        }).then(() => {
            this.submiitdetail(s, latitude, longitude)
        }).catch((err) => {
            console.log("err of submitwork", err)
        });
    }

    submiitdetail = (s, latitude, longitude) => {
        this.props.client.mutate({
            mutation: submiitdetail,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id
            }
        }).then(() => {
            this.tracking(s, latitude, longitude)
        }).catch((err) => {
            console.log("err of submiitdetail", err)
        });
    }

    tracking = (s, latitude, longitude) => {
        console.log(s, latitude, longitude)
        this.props.client.mutate({
            mutation: tracking,
            variables: {
                "invoice": this.props.navigation.state.params.id,
                "status": s,
                "messengerID": global.NameOfMess,
                "lat": latitude,
                "long": longitude,
            }
        }).then(() => {
            this.props.navigation.state.params.refresion()
            this.props.navigation.goBack()
        }).catch((err) => {
            console.log("ERR OF TRACKING", err)
        });
    }

    pic = () => {
        const part = 'file:///storage/emulated/0/saved_signature/signature.png'
        const name = global.NameOfMess + "_" + this.state.date + "_" + this.state.time
        const fileName = name + '.png'
        var photo = {
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
        return (
            <Container>
                <Content contentContainerStyle={{ flex: 1 }} refreshControl={<RefreshControl enabled={false} refreshing={refreshing} />}>
                    <View style={{ flex: 1, flexDirection: "column" }}>
                        {/* <Text style={{alignItems:"center",justifyContent:"center"}}>Signature Capture Extended555 </Text> */}
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

                    <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width, borderBottomColor: 'gray', borderBottomWidth: 0.5, marginBottom: normalize(5) }}>
                        <View style={{ marginLeft: normalize(20) }}>
                            <CheckBox value={this.state.status_CHECKBOX} onValueChange={() => { this.setState({ status_CHECKBOX: !this.state.status_CHECKBOX }) }} />
                        </View>
                        <Text style={{ fontSize: normalize(18) }}>ชำระแบบโอน</Text>

                        <View style={{ marginLeft: normalize(20) }}>
                            <CheckBox value={this.state.status_typetran} onValueChange={() => { this.setState({ status_typetran: !this.state.status_typetran }) }} />
                        </View>
                        <Text style={{ fontSize: normalize(18) }}>ส่งขนส่ง</Text>
                    </View>

                    <Footer style={{ height: normalize(140) }} backgroundColor={'white'}>
                        <View>
                            <View style={{ flex: 1, flexDirection: 'row', }}>
                                <TouchableOpacity onPress={() => console.log('coming soon')} >
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
                                }>
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
            this.submitedit()
        }
        else {
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

    _onSaveEvent = () => {
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

    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: normalize(10)
    }
});

const GraphQL = compose(SubmitJob)
export default withApollo(GraphQL)

const submit_inv = gql`
    mutation submit_inv($invoiceNumber:String!,$filename:String!){
        submit_inv(invoiceNumber: $invoiceNumber, filename: $filename){
            status
        }
    }
`
const submitwork_DL = gql`
    mutation submitwork_DL($status:String!, $invoiceNumber:String!,$paymentType:String!,$tranType:String!,$CheckBoxTranfer:String!){
        submitwork_DL(status: $status, invoiceNumber: $invoiceNumber,paymentType: $paymentType,tranType: $tranType,CheckBoxTranfer:$CheckBoxTranfer){
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