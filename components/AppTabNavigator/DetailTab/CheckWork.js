import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, TouchableOpacity } from 'react-native'
import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer } from 'native-base';
import { gql, withApollo, compose } from 'react-apollo'
import { normalize } from '../../../functions/normalize';
import font from '../../../resource/font';
import { post } from '../../services';

class CheckWork extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ShowData: [],
            ShowSUM: [],
            latitude: 1,
            longitude: 1,
            error: null,
        }
    }

    componentDidMount = () => {
        this.props.client.resetStore();
        this.datailwork();
        this.datailsum();
    }

    datailwork = () => {
        this.props.client.query({
            query: selectDetailWork_DL,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id
            }
        }).then((result) => {
            this.setState({ ShowData: result.data.selectDetailWork_DL })
        }).catch((err) => {
            console.log(err)
        });
    }

    datailsum = () => {
        this.props.client.query({
            query: selectsum_DL,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id
            }
        }).then((result) => {
            this.setState({ ShowSUM: result.data.selectsum_DL })
        }).catch((err) => {
            console.log(err)
        });
    }

    checkpending = () => {
        const { navigate } = this.props.navigation
        this.props.client.query({
            query: selectpendingwork,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            if (result.data.selectpendingwork.status) {
                Alert.alert(
                    'คุณยังมีงานที่ยังค้างการส่งหรือยังไม่สรุปยอด',
                    'คุณต้องการเคลียงานเก่า?',
                    [
                        { text: 'ใช่', onPress: () => navigate("Search") },
                    ]
                )
            } else {
                this.GET_LOCATE()
            }
        }).catch((err) => {
            console.log(err)
        });

    }

    GET_LOCATE = async () => {
        try {
            let { invoiceNumber, id } = this.props.navigation.state.params
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    let { latitude, longitude } = position.coords
                    await this.confirmworksome(invoiceNumber, id)
                    await this.tracking(invoiceNumber, latitude, longitude)
                },
                async (error) => {
                    console.log(error)
                    await this.confirmworksome(invoiceNumber, id)
                    await this.tracking(invoiceNumber, -1, -1)
                }
            );
        } catch (error) {
            console.log(error)
        }
    }

    confirmworksome = async (inV, id) => {
        try {
            let invoicenumber = inV
            let result = await post(":3499/tms/api/confirmsome", JSON.stringify({ invoicenumber, mess_id: global.NameOfMess, id }))
            if (!result.success) {
                Alert.alert(
                    'ตรวจงานไม่สำเร็จ',
                    'มีการตรวจงานไปแล้ว',
                    [
                        { text: 'ตกลง', onPress: () => console.log("ok") },
                    ]
                )
            }
        } catch (error) {
            console.log(error)
        }
        // this.props.client.mutate({
        //     mutation: confirmworksome_DL,
        //     variables: {
        //         "invoiceNumber": this.props.navigation.state.params.id,
        //         "numBox": this.props.navigation.state.params.NumBox,
        //         "MessengerID": global.NameOfMess
        //     }
        // }).then((result) => {
        //     if (result.data.confirmworksome_DL.status) {
        //         this.tracking(latitude, longitude)
        //     } else {
        //         Alert.alert(
        //             'ตรวจงานไม่สำเร็จ',
        //             'มีการตรวจงานนี้ไปแล้ว',
        //             [
        //                 { text: 'ตกลง', onPress: () => console.log("ok") },
        //             ]
        //         )
        //     }
        // }).catch((err) => {
        //     console.log(err)
        // });
    }

    tracking = async (latitude, longitude) => {
        try {
            await post(":3499/tms/api/tracking", JSON.stringify({ invoiceNumber, mess_id: global.NameOfMess, latitude, longitude, status: "5" }))
            this.props.navigation.goBack()
            this.props.navigation.state.params.refresion()
        } catch (error) {
            console.log(error)
        }
        // this.props.client.mutate({
        //     mutation: tracking_DL,
        //     variables: {
        //         "invoice": this.props.navigation.state.params.id,
        //         "status": "5",
        //         "messengerID": global.NameOfMess,
        //         "lat": latitude,
        //         "long": longitude,
        //         "box": this.props.navigation.state.params.NumBox
        //     }
        // }).then(() => {
        //     this.props.navigation.goBack()
        //     this.props.navigation.state.params.refresion()
        // }).catch((err) => {
        //     console.log("ERR OF TRACKING", err)
        // });
    }

    render() {
        let { receive_success } = this.props.navigation.state.params
        return (
            <Container>
                <StatusBar translucent backgroundColor={'transparent'} barStyle={'light-content'} />
                <Content>
                    <View style={{ margin: normalize(10), flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={{ fontFamily: font.semi, color: 'black', fontSize: normalize(17) }}>รหัสบิล: {this.props.navigation.state.params.id}</Text>
                        {!!receive_success && <Text style={{ fontFamily: font.semi, backgroundColor: '#A9FC93', paddingHorizontal: normalize(3), marginLeft: normalize(3) }}>ตรวจรับงานแล้ว</Text>}
                    </View>

                    <View style={{ flexDirection: 'row', width: Dimensions.get('window').width, borderBottomColor: 'gray', borderBottomWidth: 0.5 }}>
                        <View style={{ width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: normalize(17), fontFamily: font.semi }}>ชื่อ</Text>
                        </View>

                        <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: normalize(17), fontFamily: font.semi }}>จำนวน</Text>
                        </View>
                        <View style={{ width: Dimensions.get('window').width / 4, right: 0, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: normalize(17), fontFamily: font.semi }}>ราคา</Text>
                        </View>
                    </View>

                    <View>
                        {
                            this.state.ShowData.map((l, i) => (
                                <View style={{ flexDirection: 'row', paddingTop: normalize(3), paddingBottom: i === 0 ? 0 : normalize(3) }} key={i}>
                                    <View style={{ width: Dimensions.get('window').width / 2, justifyContent: 'center' }}>
                                        <Text style={{ paddingLeft: normalize(16), fontSize: normalize(16), fontFamily: font.medium }}>{i + 1}). {l.itemName}</Text>
                                    </View>
                                    <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: normalize(16), fontFamily: font.medium }}>{l.qty}</Text>
                                    </View>
                                    <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', right: normalize(16) }}>
                                        <Text style={{ fontFamily: font.medium, fontSize: normalize(16), color: 'orange', alignSelf: 'flex-end' }}>{l.amount} ฿</Text>
                                    </View>
                                </View>

                            ))
                        }

                        <View style={{ borderTopWidth: 0.5, borderTopColor: 'gray', marginBottom: normalize(25) }}>
                            {
                                this.state.ShowSUM.map((l, i) => (
                                    <View style={{ marginTop: normalize(25) }} key={i}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ width: Dimensions.get('window').width / 3, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ fontFamily: font.medium, fontSize: normalize(18) }}>ราคาทั้งหมด </Text>
                                            </View>
                                            <View style={{ width: Dimensions.get('window').width / 3, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ color: 'orange', fontFamily: font.medium, fontSize: normalize(18) }}> {l.SUM} ฿</Text>
                                            </View>
                                        </View>
                                        {/* <View style={{ margin: 26, marginTop: 5, justifyContent: 'center' }}>
                                            <Text style={{ fontWeight: 'bold' }}>หมายเหตุ :  </Text>
                                        </View> */}
                                    </View>
                                ))
                            }
                        </View>
                    </View>

                </Content>
                {!receive_success &&
                    <TouchableOpacity onPress={() => Alert.alert(
                        'ตรวจงานนี้',
                        'คุณต้องการยืนยันการตรวจงานนี้?',
                        [
                            { text: 'ไม่', onPress: () => console.log("no") },
                            { text: 'ใช่', onPress: () => this.checkpending() },
                        ]
                    )}>
                        <Footer style={{
                            backgroundColor: '#ff6c00',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }} >
                            <Text style={{ color: 'white', fontFamily: font.semi, fontSize: normalize(20) }}>ยืนยันการตรวจงาน</Text>
                        </Footer>
                    </TouchableOpacity>}
            </Container>
        )
    }
}

// export default CheckWork;

const GraphQL = compose(CheckWork)
export default withApollo(GraphQL)

const tracking_DL = gql`
    mutation tracking_DL(
        $invoice:String!,
        $status:String!,
        $messengerID:String!,
        $lat:Float!,
        $long:Float!,
        $box:String!
    ){
        tracking_DL(
            invoice: $invoice,
            status: $status,
            messengerID: $messengerID,
            lat: $lat,
            long: $long,
            box:$box
        ){
            status
        }
    }
`

const selectDetailWork_DL = gql`
    query selectDetailWork_DL($invoiceNumber:String!){
        selectDetailWork_DL(invoiceNumber: $invoiceNumber){
            invoiceNumber
            itemCode
            itemName
            qty
            amount
            priceOfUnit
            
        }
    }
`

const selectsum_DL = gql`
    query selectsum_DL($invoiceNumber:String!){
        selectsum_DL(invoiceNumber: $invoiceNumber){
            SUM
        }
    }
`

const confirmworksome_DL = gql`
    mutation confirmworksome_DL($invoiceNumber:String!,$numBox:String!,$MessengerID:String!){
        confirmworksome_DL(invoiceNumber: $invoiceNumber,numBox:$numBox,MessengerID:$MessengerID){
            status
        }
    }
`

const selectpendingwork = gql`
        query selectpendingwork($MessengerID:String!){
            selectpendingwork(MessengerID: $MessengerID){
                    status
               }
                }
            `
