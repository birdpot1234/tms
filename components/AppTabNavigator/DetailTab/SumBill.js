import React, { Component } from 'react'
import { Text, StyleSheet, Alert, View, Dimensions, TouchableOpacity } from 'react-native'

import { Container, Content, Footer, Badge } from 'native-base';
import { gql, withApollo, compose } from 'react-apollo'
import { normalize } from '../../../functions/normalize'
import font from '../../../resource/font'
import { post } from '../../services';
//  import {CurrencyFormat} from 'react-currency-format';

class SumBill extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showsummoney: [],
            showStatusreport: [],
            showinvoicedetail_ID: [],
            showmoneyfile: [],
            showbillbySale: [],
            showbillbyTransfer: [],
            countSpecail_success: '',
            countSpecail_fail: '',
            status_clear: false
        }
    }

    componentDidMount = () => {
        this.props.client.resetStore();
        this.summoney();
        this.summoneyfail();
        this.billbySale();
        this.billbytransfer();
        this.insertFinishDetail();
        this.DelFinish();
        this.countspecailjob();
    }

    billbySale = () => {
        this.props.client.query({
            query: SumBills,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            this.setState({ showbillbySale: result.data.SumBill })
        }).catch((err) => {
            console.log(err)
        });
    }

    insertFinishDetail = () => {
        this.props.client.mutate({
            mutation: submiitdetail_new,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).catch((err) => {
            console.log(err)
        });
    }

    DelFinish = () => {
        this.props.client.mutate({
            mutation: DelFinish,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).catch((err) => {
            console.log(err)
        });
    }

    billbytransfer = () => {
        this.props.client.query({
            query: WaitTranfer_DL,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            this.setState({ showbillbyTransfer: result.data.WaitTranfer_DL })
        }).catch((err) => {
            console.log(err)
        });
    }

    summoney = () => {
        this.props.client.query({
            query: summoney_cash,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            console.log(result)
            this.setState({ showsummoney: result.data.summoney_cash })
        }).catch((err) => {
            console.log(err)
        });
    }

    summoneyfail = () => {
        this.props.client.query({
            query: summoneyfail,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            this.setState({ showmoneyfile: result.data.summoneyfail })
        }).catch((err) => {
            console.log(err)
        });
    }

    countspecailjob = () => {
        this.props.client.query({
            query: countspecailjob,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            this.setState({
                countSpecail_success: result.data.countspecailjob[0].CountSuccess,
                countSpecail_fail: result.data.countspecailjob[0].CountFail,
            })
        }).catch((err) => {
            console.log(err)
        });
    }

    checkinvoicereport = () => {
        const { navigate } = this.props.navigation
        this.props.client.query({
            query: checkinvoicereport,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            // this.setState({ showinvoicedetail_ID: result.data.checkinvoicereport })
            if (result.data.checkinvoicereport.length > 0) {
                Alert.alert(
                    "ยืนยันการเคลียร์งาน",
                    "ควรเคลียร์เงินกับทางบัญชีก่อนการกดเคลียร์",
                    [
                        { text: "ยกเลิก", onPress: () => this.setState({ status_clear: false }) },
                        { text: "ยืนยัน", onPress: () => this.Clear(result.data.checkinvoicereport) }
                    ],
                    { cancelable: false }
                )
            } else {
                Alert.alert(
                    "เคลียร์งานไม่สำเร็จ",
                    "คุณได้เคลียร์งานไปแล้ว",
                    [
                        { text: "OK", onPress: () => this.setState({ status_clear: false }, () => navigate('SumBill')) }
                    ],
                    { cancelable: false }
                )
            }

        }).catch((err) => {
            this.setState({ status_clear: false })
            console.log("err of checkinvoicereport", err)
        });
    }

    Clear = (checkinvoicereport) => {
        this.reportsubmitwork(checkinvoicereport)
        this.TMS_report()
    }

    TMS_report = () => {
        this.props.client.mutate({
            mutation: TMS_report,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).catch((err) => {
            console.log("error of reportsubmitwork", err)
        });
    }

    reportsubmitwork = async (checkinvoicereport) => {
        const { navigate } = this.props.navigation
        let invoiceNumber = checkinvoicereport.map(el => el.invoiceNumber);
        try {
            let result = await post(":3499/tms/api/reportdetail", JSON.stringify({ invoiceNumber }));
            console.log('report', result)
            if (result.success) {
                Alert.alert(
                    "เคลียร์งานสำเร็จแล้ว",
                    "คุณได้เคลียร์งานสำเร็จแล้ว",
                    [
                        { text: "OK", onPress: () => this.setState({ status_clear: false }, () => navigate('MainMenu')) }
                    ],
                    { cancelable: false }
                )
            }
        } catch (error) {
            this.setState({ status_clear: false })
            console.log(error)
        }
        // this.props.client.mutate({
        //     mutation: reportsubmitwork,
        //     variables: {
        //         "MessengerID": global.NameOfMess
        //     }
        // }).then(() => {
        //     this.state.showinvoicedetail_ID.map(l => (
        //         this.reportdetail(l.invoiceNumber)
        //     ));
        //     Alert.alert(
        //         "เคลียร์งานสำเร็จแล้ว",
        //         "คุณได้เคลียร์งานสำเร็จแล้ว",
        //         [
        //             { text: "OK", onPress: () => navigate('MainMenu') }
        //         ],
        //         { cancelable: false }
        //     )
        // }).catch((err) => {
        //     console.log("error of reportsubmitwork", err)
        // });
    }

    reportdetail = (id) => {
        this.props.client.mutate({
            mutation: reportdetail,
            variables: {
                "invoiceNumber": id
            }
        }).catch((err) => {
            console.log("error", err)
        });
    }

    _PRESS_SearchTab = () => {
        this.setState({ status_clear: true }, () => this.checkinvoicereport())
    }

    render() {
        let { status_clear } = this.state
        const { navigate } = this.props.navigation
        return (
            <Container>
                <Content>
                    <View>
                        {
                            this.state.showsummoney.map((l, k) => (
                                <View key={`summoney${k}`}>
                                    <View style={{ marginHorizontal: normalize(10), marginTop: normalize(10), justifyContent: 'center' }}>
                                        <Text style={{ fontFamily: font.semi, fontSize: normalize(18) }}>สรุปยอดเงินที่ต้องโอน  </Text>
                                    </View>

                                    <View style={{ paddingHorizontal: normalize(20), marginTop: normalize(5), justifyContent: 'center' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                            <Text style={{ flex: 2, fontSize: normalize(17) }} >ยอดเงินตามบิลจริง</Text>
                                            <Badge success style={{ height: normalize(19), width: normalize(19), borderRadius: normalize(9.5), alignItems: 'center', justifyContent: 'center' }} >
                                                <Text style={{ fontSize: normalize(12), color: 'white', fontFamily: font.semi }}>{l.CountBill_CASH}</Text>
                                            </Badge>
                                            <Text style={styles.textCon} >{l.amountBill || '0'} ฿ </Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                            <Text style={{ flex: 2, fontSize: normalize(17) }} >ยอดเครดิต</Text>
                                            <Badge warning style={{ height: normalize(19), width: normalize(19), borderRadius: normalize(9.5), alignItems: 'center', justifyContent: 'center', backgroundColor: 'violet' }} >
                                                <Text style={{ fontSize: normalize(12), color: 'white', fontFamily: font.semi }}>{l.CountBill_CREDIT}</Text>
                                            </Badge>
                                            <Text style={styles.textCon} >{l.amountActual_CREDIT || '0'} ฿ </Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                            <Text style={{ flex: 2, fontSize: normalize(17) }} >ยอดโอนเข้าบริษัท</Text>
                                            <Badge warning style={{ height: normalize(19), width: normalize(19), borderRadius: normalize(9.5), alignItems: 'center', justifyContent: 'center', backgroundColor: 'gray' }} >
                                                <Text style={{ fontSize: normalize(12), color: 'white', fontFamily: font.semi }}>{l.CountBill_TRANSFER}</Text>
                                            </Badge>
                                            <Text style={styles.textCon} >{l.amountActual_TRANSFER || '0'} ฿ </Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                            <Text style={{ flex: 2, fontSize: normalize(17) }} >ยอดเงินสดฝากขนส่ง</Text>
                                            <Badge warning style={{ height: normalize(19), width: normalize(19), borderRadius: normalize(9.5), alignItems: 'center', justifyContent: 'center', backgroundColor: 'gray' }} >
                                                <Text style={{ fontSize: normalize(12), color: 'white', fontFamily: font.semi }}>{l.CountBill_TRAN}</Text>
                                            </Badge>
                                            <Text style={styles.textCon} >{l.amountActual_TRAN || '0'} ฿ </Text>
                                        </View>

                                        {this.state.showmoneyfile.length > 0 &&
                                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                                <Text style={{ flex: 2, fontSize: normalize(17) }} >ยอดที่เก็บไม่ได้</Text>
                                                <Badge style={{ height: normalize(19), width: normalize(19), borderRadius: normalize(9.5), alignItems: 'center', justifyContent: 'center' }} >
                                                    <Text style={{ fontSize: normalize(12), color: 'white', fontFamily: font.semi }}>{this.state.showmoneyfile[0].CountBill}</Text>
                                                </Badge>
                                                <Text style={styles.textCon} >{this.state.showmoneyfile[0].amountActual || '0'} ฿ </Text>
                                            </View>
                                        }


                                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                            <Text style={{ flex: 2, fontSize: normalize(17) }} >ยอดเงินที่เก็บได้</Text>
                                            <Badge warning style={{ height: normalize(19), width: normalize(19), borderRadius: normalize(9.5), alignItems: 'center', justifyContent: 'center' }} >
                                                <Text style={{ fontSize: normalize(12), color: 'white', fontFamily: font.semi }}>{l.CountBill_CASH}</Text>
                                            </Badge>
                                            <Text style={styles.textCon} >{l.amountActual || '0'} ฿ </Text>
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: normalize(20), marginTop: normalize(10) }}>
                                        <Text style={{ flex: 3, fontSize: normalize(17), fontFamily: font.semi }} >ยอดบิลรวม</Text>
                                        <Text style={{ flex: 2, fontSize: normalize(17), marginLeft: normalize(10), textAlign: 'right', color: 'black' }} >{l.amountActual} ฿ </Text>
                                    </View>

                                    <View style={{ marginVertical: normalize(10) }}>
                                        <View style={{ marginHorizontal: normalize(10), justifyContent: 'center' }}>
                                            <Text style={{ fontFamily: font.semi, fontSize: normalize(18) }}>สรุปงานพิเศษ </Text>
                                        </View>

                                        <View style={{ paddingHorizontal: normalize(20), justifyContent: 'center' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                                <Text style={{ flex: 2, fontSize: normalize(17) }} >งานพิเศษส่งสำเร็จ</Text>
                                                <Badge success style={{ height: normalize(19), width: normalize(19), borderRadius: normalize(9.5), alignItems: 'center', justifyContent: 'center' }} >
                                                    <Text style={{ fontSize: normalize(12), color: 'white', fontFamily: font.semi }}>{this.state.countSpecail_success}</Text>
                                                </Badge>
                                            </View>

                                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                                <Text style={{ flex: 2, fontSize: normalize(17) }} >งานพิเศษส่งไม่สำเร็จ</Text>
                                                <Badge success style={{ height: normalize(19), width: normalize(19), borderRadius: normalize(9.5), alignItems: 'center', justifyContent: 'center', backgroundColor: 'red' }} >
                                                    <Text style={{ fontSize: normalize(12), color: 'white', fontFamily: font.semi }}>{this.state.countSpecail_fail}</Text>
                                                </Badge>
                                            </View>
                                        </View>
                                    </View>

                                    {
                                        (() => {
                                            if (this.state.showbillbyTransfer.length > 0) {
                                                return (

                                                    <View>
                                                        <View style={{ margin: normalize(10), marginTop: normalize(10), justifyContent: 'center' }}>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <Text style={{ width: Dimensions.get('window').width / 1.5, fontSize: normalize(17), fontFamily: font.semi, color: 'red' }} >ยอดเงินสดรอการโอน </Text>
                                                            </View>
                                                        </View>

                                                        <View style={{ flexDirection: 'row', width: Dimensions.get('window').width, borderBottomColor: 'gray', borderBottomWidth: 0.5 }}>
                                                            <View style={{ width: Dimensions.get('window').width / 3, justifyContent: 'center', alignItems: 'center' }}>
                                                                <Text style={{ fontSize: normalize(17), fontFamily: font.semi }}>Invoice</Text>
                                                            </View>
                                                            <View style={{ width: Dimensions.get('window').width / 3, justifyContent: 'center', alignItems: 'center' }}>
                                                                <Text style={{ fontSize: normalize(17), fontFamily: font.semi }}>ลูกค้า</Text>
                                                            </View>
                                                            <View style={{ width: Dimensions.get('window').width / 3, justifyContent: 'center', alignItems: 'center' }}>
                                                                <Text style={{ fontSize: normalize(17), fontFamily: font.semi }}>ยอด</Text>
                                                            </View>
                                                        </View>

                                                        <View>
                                                            {
                                                                this.state.showbillbyTransfer.map((l, index) => (
                                                                    <View key={`showBill${index}`}>
                                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                            <View style={{ width: Dimensions.get('window').width / 3, justifyContent: 'center' }}>
                                                                                <Text style={{ fontSize: normalize(17), fontFamily: font.semi, paddingLeft: normalize(5) }}> {l.invoiceNumber}</Text>
                                                                            </View>
                                                                            <View style={{ width: Dimensions.get('window').width / 3, justifyContent: 'center', alignItems: 'center' }}>
                                                                                <Text style={{ fontSize: normalize(17), fontFamily: font.semi, paddingLeft: normalize(5) }}>{l.CustomerName}</Text>
                                                                            </View>
                                                                            <View style={{ width: Dimensions.get('window').width / 3, justifyContent: 'center', right: normalize(5) }}>
                                                                                <Text style={{ fontSize: normalize(17), fontFamily: font.semi, paddingLeft: normalize(5), alignSelf: 'flex-end', color: 'orange', right: normalize(5), }}>{l.amountActual} ฿</Text>
                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                ))
                                                            }
                                                        </View>
                                                    </View>
                                                )
                                            } else {
                                                return (
                                                    <View style={{ alignItems: 'center', paddingVertical: normalize(20), borderColor: 'gray', borderWidth: 0.5 }}>
                                                        <Text style={{ fontSize: normalize(17), fontFamily: font.semi }}>ไม่มียอดโอนที่ต้องติดตาม</Text>
                                                    </View>
                                                )
                                            }
                                        })()
                                    }

                                    <View style={{ alignItems: 'center', paddingVertical: normalize(20), borderColor: 'gray', borderWidth: 0.5 }}>
                                        <Text style={{ fontSize: normalize(17), fontFamily: font.medium }}>หมายเลขบัญชี : 748-2-73551-1 ธนาคารกสิกรไทย </Text>
                                        <Text style={{ fontSize: normalize(17), fontFamily: font.medium }}>บจก ดีพลัส อินเตอร์เทรด</Text>
                                    </View>
                                </View>
                            ))
                        }
                    </View>

                    <View style={{ height: normalize(20) }} />
                </Content>

                <Footer style={{ backgroundColor: 'white' }}>
                    <TouchableOpacity disabled={status_clear}
                        onPress={this._PRESS_SearchTab.bind(this)}>
                        <View style={{
                            width: Dimensions.get('window').width / 2,
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingLeft: normalize(5),
                            backgroundColor: '#33CC33',
                        }}>
                            <Text style={{ color: 'white', fontFamily: font.semi, fontSize: normalize(20) }}>เคลียร์งาน</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigate('DetailBill')}>
                        <View style={{
                            width: Dimensions.get('window').width / 2,
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingLeft: normalize(5),
                            backgroundColor: '#ff6c00',
                        }}>
                            <Text style={{ color: 'white', fontFamily: font.semi, fontSize: normalize(20) }}>รายละเอียดยอดเงิน</Text>
                        </View>
                    </TouchableOpacity>
                </Footer>
            </Container>
        )
    }
}


const GraphQL = compose(SumBill)
export default withApollo(GraphQL)

const summoney_cash = gql`
query summoney_cash($MessengerID:String!){
    summoney_cash(MessengerID: $MessengerID){
        amountBill
        amountActual
        CountBill
        CountBill_CASH
        CountBill_CREDIT
        CountBill_TRAN
        CountBill_TRANSFER
        amountActual_TRANSFER
        amountActual_CREDIT
        amountActual_TRAN
       
}
}
`
const summoneyfail = gql`
query summoneyfail($MessengerID:String!){
                    summoneyfail(MessengerID: $MessengerID){
                    amountBill
    amountActual
    CountBill
                }
              }
              `
const submiitdetail_new = gql`
              mutation submiitdetail_new($MessengerID:String!){
                submiitdetail_new(MessengerID: $MessengerID){
                      status
                  }
              }
          `
const DelFinish = gql`
              mutation DelFinish($MessengerID:String!){
                DelFinish(MessengerID: $MessengerID){
                      status
                  }
              }
          `
const reportdetail = gql`
    mutation reportdetail($invoiceNumber:String!){
                    reportdetail(invoiceNumber: $invoiceNumber){
                    status
                }
                }
            `
const checkinvoicereport = gql`
    query checkinvoicereport($MessengerID:String!){
                    checkinvoicereport(MessengerID: $MessengerID){
                    invoiceNumber
                }
                }
            `


const SumBills = gql`
query SumBill($MessengerID:String!){
    SumBill(MessengerID: $MessengerID){
                        amountBill
                        amountActual
                        inv_Date
                        MessengerID
            }
            }
        `
const WaitTranfer_DL = gql`
query WaitTranfer_DL($MessengerID:String!){
    WaitTranfer_DL(MessengerID: $MessengerID){
                        amountBill
                        amountActual
                        inv_Date
                        SaleID
                        Sale_Name
                        MessengerID
                        CustomerID
                        CustomerName
                        invoiceNumber
            }
            }
        `
const countspecailjob = gql`
query countspecailjob($MessengerID:String!){
    countspecailjob(MessengerID: $MessengerID){
                       
                        CountSuccess
                        CountFail

            }
            }
        `
const TMS_report = gql`
    mutation TMS_report($MessengerID:String!){
        TMS_report(MessengerID: $MessengerID){
                    status
                }
                }
            `

const styles = StyleSheet.create({
    textCon: {
        flex: 1,
        fontSize: normalize(15),
        color: 'orange',
        marginLeft: normalize(10),
        textAlign: 'right'
    }
})
