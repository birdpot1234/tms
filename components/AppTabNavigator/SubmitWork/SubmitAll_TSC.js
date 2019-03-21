import React, { Component } from 'react'
import { Text, StyleSheet, Alert, View, Image, Dimensions, TouchableOpacity, PermissionsAndroid, RefreshControl } from 'react-native'
import { gql, withApollo, compose } from 'react-apollo'
import { Container, Content, Footer } from 'native-base';
import SignatureCapture from 'react-native-signature-capture';
import Moment from 'moment';
import { normalize } from '../../../functions/normalize';
import font from '../../../resource/font';
class SubmitAll_TSC extends Component {
    constructor(props) {
        super(props);
        this.state = {
            latitude: -1,
            longitude: -1,
            error: null,
            sig_status: false,
            date: Moment(new Date).format('d-MM-YYYY'),
            time: Moment(new Date).format('h-mm-ss'),
            inv: null,
            refreshing: false,
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

    submitedit = (INVOICE, i) => {
        var name = global.NameOfMess + "_" + this.state.date + "_" + this.state.time
        var filename = name + '.png';

        this.submitwork("A1", INVOICE, i)
        this.submit_inv(INVOICE, filename)
    }

    submit_inv = (INVOICE, filename) => {
        var www = "http://www.dplus-system.com:3401/upload/"
        var url = www + filename
        this.props.client.mutate({
            mutation: submit_inv,
            variables: {
                "invoiceNumber": INVOICE,
                "filename": url
            }
        }).catch((err) => {
            console.log("err of submitwork", err)
        });
    }

    submitwork = (s, INVOICE, i) => {
        this.props.client.mutate({
            mutation: submit_TSC,
            variables: {
                "TSC": INVOICE,
                "status_work": s
            }
        }).then(() => {
            let { lat, long } = this.state
            this.setState({ refreshing: true }, () => {
                this.tracking(s, INVOICE, i, lat, long)
            })
        }).catch((err) => {
            console.log("err of submitwork", err)
        });
    }


    tracking = (s, INVOICE, i) => {
        this.props.client.mutate({
            mutation: tracking_CN,
            variables: {
                "invoice": INVOICE,
                "status": s,
                "messengerID": global.NameOfMess,
                "lat": this.state.latitude,
                "long": this.state.longitude,
            }
        }).then((result) => {
            if (!result.data.tracking_CN.status) {
                Alert.alert(
                    "ส่งไม่สำเร็จ",
                    "กรุณากดส่งใหม่อีกครั้ง",
                )
            } else {
                if (i == 1) {
                    const { navigate } = this.props.navigation
                    navigate('AddMediaTab', { refresionTO: this.props.navigation.state.params.refresionTO() })
                }
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
                            let { in_V } = this.props.navigation.state.params
                            this.checkPermissionStorage();
                            let filter = in_V.filter(el => el);
                            filter.forEach(async (val, i) => {
                                let stop = ((i + 1) !== filter.length) ? 0 : 1 // เช็คว่าตัวสุดท้ายหรือเปล่า
                                await this.submitedit(val, stop)
                            });
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
        this.signComponent.saveImage();
        this.pic();
    }

    resetSign = () => {
        this.refs["sign"].resetImage();
        this.setState({ sig_status: false })
    }

    _onSaveEvent = () => {
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
    }
});



const GraphQL = compose(SubmitAll_TSC)
export default withApollo(GraphQL)

const submit_inv = gql`
    mutation submit_inv($invoiceNumber:String!,$filename:String!){
        submit_inv(invoiceNumber: $invoiceNumber, filename: $filename){
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