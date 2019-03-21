import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, ScrollView, TouchableOpacity, CheckBox, RefreshControl, PermissionsAndroid } from 'react-native'
import { gql, withApollo, compose } from 'react-apollo'
import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, Input, Item, Grid, Col } from 'native-base';
import SignatureCapture from 'react-native-signature-capture';
import Moment from 'moment';
import { normalize } from '../../../functions/normalize';
import font from '../../../resource/font';

class SubmitALLJob extends Component {
    constructor(props) {
        super(props);
        this.state = {
            latitude: 1,
            longitude: 1,
            error: null,
            sig_status: false,
            status_CHECKBOX: false,
            status_typetran: false,
            date: Moment(new Date).format('DD-MM-YYYY'),
            time: Moment(new Date).format('h-mm-ss'),
            statuspic: false,
            inv: null,
            load: false,
            submitjob: false,
            refreshing: false
        }

        this.props.client.resetStore();
    }

    componentDidMount = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let { latitude, longitude } = position.coords
                this.setState({ lat: latitude, long: longitude })
            },
            (error) => console.log(error)
        );
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

    submitedit = (INVOICE, PAYMMODE, i) => {
        var name = global.NameOfMess + "_" + this.state.date + "_" + this.state.time
        var filename = name + '.png'
        this.props.client.query({
            query: submitedit,
            variables: {
                "invoiceNumber": INVOICE
            }
        }).then((result) => {
            let { lat, long } = this.state
            this.setState({ refreshing: true }, () => {
                let status = result.data.submitedit.status ? "A2" : "A1";
                this.tracking(status, INVOICE, i, lat, long)
                this.submitwork(status, INVOICE, i, PAYMMODE, filename)
            })
        }).catch((err) => {
            console.log(err)
        });
    }

    submitwork = (s, INVOICE, i, PAYMMODE, filename) => {
        let payType = PAYMMODE
        let www = "http://www.dplus-system.com:3401/upload/"
        let url = www + filename
        let CheckBoxTranfer = (this.state.status_CHECKBOX) ? "true" : "false"
        let tranType = (this.state.status_typetran) ? "Transport" : "Truck"
        this.props.client.mutate({
            mutation: submitwork_DLV2,
            variables: {
                "status": s,
                "invoiceNumber": INVOICE,
                "paymentType": payType,
                "tranType": tranType,
                "CheckBoxTranfer": CheckBoxTranfer,
                "filename": url
            }
        }).then(() => {
            if (i == 1) {
                const { navigate } = this.props.navigation
                navigate('Search', { refresionTO: this.props.navigation.state.params.refresionTO() })
            }
        }).catch((err) => {
            console.log("err of submitwork", err)
        });
    }

    tracking = (s, INVOICE, i, lat, long) => {
        this.props.client.mutate({
            mutation: tracking,
            variables: {
                "invoice": INVOICE,
                "status": s,
                "messengerID": global.NameOfMess,
                "lat": lat,
                "long": long,
            }
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

        try {
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
        } catch (error) {
            console.log(error)
        }
    }

    onConfirm = () => {
        Alert.alert(
            "ยืนยันการส่งงาน",
            "คุณต้องการยืนยันการส่งงานหรือไม่?",
            [
                { text: "ยกเลิก", onPress: () => console.log("Cancle") },
                {
                    text: "ยืนยัน", onPress: () => {
                        if (!this.state.sig_status) {
                            Alert.alert('คุณยังไม่ได้เซ็น ', 'กรุณาเซ็น')
                        } else {
                            let { in_V, PAYMMODE } = this.props.navigation.state.params;
                            this.checkPermissionStorage();
                            let filter = in_V.filter(el => el);
                            let filterPaymode = PAYMMODE.filter(el => el);
                            filter.forEach(async (val, i) => {
                                let stop = ((i + 1) !== filter.length) ? 0 : 1 // เช็คว่าตัวสุดท้ายหรือเปล่า
                                await this.submitedit(val, filterPaymode[i], stop)
                            })
                        }
                    }
                }
            ]
        )
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


                                <TouchableOpacity onPress={() => { this.resetSign() }} >
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
                                <TouchableOpacity onPress={() => this.onConfirm()} >
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

        )

    }
    saveSign() {
        this.pic()
    }

    resetSign = () => {
        this.refs["sign"].resetImage();
        this.setState({ sig_status: false })
    }

    _onSaveEvent = (result) => {
        this.pic()
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
});



const GraphQL = compose(SubmitALLJob)
export default withApollo(GraphQL)

const submitwork = gql`
    mutation submitwork($status:String!, $invoiceNumber:String!,$paymentType:String!){
        submitwork(status: $status, invoiceNumber: $invoiceNumber, paymentType: $paymentType){
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
const submitwork_DLV2 = gql`
    mutation submitwork_DLV2($status:String!, $invoiceNumber:String!,$paymentType:String!,$tranType:String!,$CheckBoxTranfer:String!,$filename:String!){
        submitwork_DLV2(status: $status, invoiceNumber: $invoiceNumber,paymentType: $paymentType,tranType: $tranType,CheckBoxTranfer:$CheckBoxTranfer,filename:$filename){
            status
        }
    }
`
const submitwork_DLV3 = gql`
    mutation submitwork_DLV3($status:String!, $invoiceNumber:String!,$paymentType:String!,$tranType:String!,$CheckBoxTranfer:String!,$filename:String!){
        submitwork_DLV3(status: $status, invoiceNumber: $invoiceNumber,paymentType: $paymentType,tranType: $tranType,CheckBoxTranfer:$CheckBoxTranfer,filename:$filename){
            status
        }
    }
`
const submitwork2 = gql`
    mutation submitwork2($status:String!, $invoiceNumber:String!,$paymentType:String!){
        submitwork2(status: $status, invoiceNumber: $invoiceNumber, paymentType: $paymentType){
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