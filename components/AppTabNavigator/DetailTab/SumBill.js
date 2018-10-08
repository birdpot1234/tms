import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native'

import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, Input, Item, Grid, Col, Badge } from 'native-base';
import { gql, withApollo, compose } from 'react-apollo'
//  import {CurrencyFormat} from 'react-currency-format';

class SumBill extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showsummoney: [],
            showStatusreport: [],
            showinvoicedetail_ID: [],
            showmoneyfile: [],
            showbillbySale:[],
            showbillbyTransfer:[],
        }
        this.props.client.resetStore();
        this.summoney();
        this.summoneyfail();
        this.billbySale();
        this.billbytransfer();
        this.insertFinishDetail();
        this.DelFinish();
    }
    billbySale = () => {
        console.log("summoney")

        this.props.client.query({
            query: SumBills,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            console.log(result.data.SumBill)
            this.setState({
                showbillbySale: result.data.SumBill
            })
        }).catch((err) => {
            console.log(err)
        });
    }
    insertFinishDetail = () => {
        console.log("summoney")

        this.props.client.mutate({
            mutation: submiitdetail_new,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            console.log('success')
        }).catch((err) => {
            console.log(err)
        });
    }
    DelFinish = () => {
        console.log("summoney")

        this.props.client.mutate({
            mutation: DelFinish,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            console.log('success')
        }).catch((err) => {
            console.log(err)
        });
    }
    billbytransfer = () => {
        console.log("billbytransfer")

        this.props.client.query({
            query: SumBillbyTranfer,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            console.log(result.data.SumBillbyTranfer)
            this.setState({
                showbillbyTransfer: result.data.SumBillbyTranfer
            })
        }).catch((err) => {
            console.log(err)
        });
    }


    summoney = () => {
        console.log("summoney")

        this.props.client.query({
            query: summoney,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            console.log(result.data.summoney)
            this.setState({
                showsummoney: result.data.summoney
            })
        }).catch((err) => {
            console.log(err)
        });
    }
    summoneyfail = () => {
        console.log("summoneyfail")

        this.props.client.query({
            query: summoneyfail,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            console.log(result.data.summoneyfail)
            this.setState({
                showmoneyfile: result.data.summoneyfail
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
            console.log("checkinvoicereport", result.data.checkinvoicereport)
            this.setState({ showinvoicedetail_ID: result.data.checkinvoicereport })
            console.log("NUM", this.state.showinvoicedetail_ID.length)
            if (this.state.showinvoicedetail_ID.length > 0) {
                this.reportsubmitwork();
            } else {
                Alert.alert(
                    "เคลียร์งานไม่สำเร็จ",
                    "คุณได้เคลียร์งานไปแล้ว",
                    [
                        { text: "OK", onPress: () => navigate('SumBill') }
                    ],
                    { cancelable: false }
                )
            }

        }).catch((err) => {
            console.log("err of checkinvoicereport", err)
        });
    }


    reportsubmitwork = () => {
        const { navigate } = this.props.navigation
        console.log("reportsubmitwork")
        this.props.client.mutate({
            mutation: reportsubmitwork,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            console.log(global.NameOfMess)
            console.log("result", result.data.reportsubmitwork)
            this.state.showinvoicedetail_ID.map(l => (
                this.reportdetail(l.invoiceNumber)
            ));
            Alert.alert(
                "เคลียร์งานสำเร็จแล้ว",
                "คุณได้เคลียร์งานสำเร็จแล้ว",
                [
                    { text: "OK", onPress: () => navigate('MainMenu') }
                ],
                { cancelable: false }
            )
        }).catch((err) => {
            console.log("error of reportsubmitwork", err)
        });
    }

    reportdetail = (id) => {
        const { navigate } = this.props.navigation
        console.log("reportdetail")

        this.props.client.mutate({
            mutation: reportdetail,
            variables: {
                "invoiceNumber": id
            }
        }).then((result) => {
          
        }).catch((err) => {
            console.log("error", err)
        });
    }
    _PRESS_SearchTab = () => {
        // const { navigate } = this.props.navigation
        this.checkinvoicereport();
        // this.billTOapp();

        // this.state.showINVOICE_ID.map(l => (
        //     this.detailtoapp(l.INVOICEID)
        // ));
        // navigate('HomeTab')
    }

    static navigationOptions = {
        header: null
    }
    render() {

        const { navigate } = this.props.navigation

        return (

            <Container>
                <Header style={{ backgroundColor: '#66c2ff' }}>
                    <Left>
                        <Button transparent
                            onPress={() => navigate('Search')}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>สรุปยอดเงิน</Title>
                    </Body>
                    <Right />
                </Header>

                <Content>
                    <View>
                        
                        {
                            this.state.showsummoney.map((l, i) => (
                                <View>
                                    <View style={{ marginHorizontal: 10, marginTop: 20, justifyContent: 'center' }}>
                                        <Text style={{ fontWeight: 'bold' }}>สรุปยอดเงินที่ต้องโอน  </Text>
                                    </View>

                                    <View style={{ margin: 30, marginTop: 5, justifyContent: 'center' }}>

                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ width: Dimensions.get('window').width / 3 }} >ยอดงเงินตามบิลจริง : </Text>
                                            <View style={{ width: Dimensions.get('window').width / 4, alignItems: 'center', justifyContent: 'center' }}>
                                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                    <Badge success style={{ height: 19,alignItems: 'center', justifyContent: 'center' }} >
                                                        <Text style={{ fontSize: 12, color: 'white', fontWeight: 'bold' }}>{l.CountBill}</Text>
                                                    </Badge>
                                                </View>
                                            </View>
                                            <Text style={{ width: Dimensions.get('window').width / 3, fontSize: 15, color: 'orange' }} >{l.amountBill} ฿ </Text>
                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ width: Dimensions.get('window').width / 3 }} >ยอดเงินที่เก็บได้ : </Text>
                                            <View style={{ width: Dimensions.get('window').width / 4, alignItems: 'center', justifyContent: 'center' }}>
                                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                    <Badge warning style={{ height: 19,alignItems: 'center', justifyContent: 'center' }} >
                                                        <Text style={{ fontSize: 12, color: 'white', fontWeight: 'bold' }}>{l.CountBill}</Text>
                                                    </Badge>
                                                </View>
                                            </View>
                                            <Text style={{ width: Dimensions.get('window').width / 3, fontSize: 15, color: 'orange' }} >{l.amountActual} ฿ </Text>
                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ width: Dimensions.get('window').width / 3 }} >ยอดที่เก็บไม่ได้ : </Text>
                                            <View >
                                                {
                                                    this.state.showmoneyfile.map((V, i) => (
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <View style={{ width: Dimensions.get('window').width / 4, alignItems: 'center', justifyContent: 'center' }}>
                                                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                                    <Badge style={{ height: 19,alignItems: 'center', justifyContent: 'center' }} >
                                                                        <Text style={{ fontSize: 12, color: 'white', fontWeight: 'bold' }}>{V.CountBill}</Text>
                                                                    </Badge>
                                                                </View>
                                                            </View>
                                                            <Text style={{ fontSize: 15, color: 'orange', width: Dimensions.get('window').width / 3 }}>{V.amountActual} ฿ </Text>
                                                        </View>
                                                    ))
                                                }
                                            </View>
                                        </View>

                                    </View>

                                    <View style={{ margin: 10, marginTop: 5, justifyContent: 'center' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ width: Dimensions.get('window').width / 1.5, fontWeight: 'bold' }} >ยอดเงินที่ต้องโอนเข้าบัญชีของบริษัท : </Text>
                                            <Text style={{ width: Dimensions.get('window').width / 1.5, fontSize: 16.5, color: 'orange', fontWeight: 'bold' }} >{l.amountActual} ฿ </Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', width: Dimensions.get('window').width, borderBottomColor: 'gray', borderBottomWidth: 0.5 }}>

                                        <View style={{ width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text>วันที่</Text>
                                        </View>

                                        {/* <View style={{ width: Dimensions.get('window').width / 3, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text>Sale</Text>
                                        </View> */}
                                        <View style={{ width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text>ยอด</Text>

                                        </View>

                                    </View>
                                    <View>
                                    {
                                            this.state.showbillbySale.map((l, i) => (

                                                <View>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <View style={{ width: Dimensions.get('window').width / 2, justifyContent: 'center' ,alignItems: 'center' }}>
                                                            <Text style={{ paddingLeft: 5 }}> {l.inv_Date}</Text>
                                                        </View>
                                                        {/* <View style={{ width: Dimensions.get('window').width / 3, justifyContent: 'center', alignItems: 'center' }}>
                                                            <Text style={{ fontWeight: 'bold' }}>{l.SaleID}</Text>
                                                        </View> */}
                                                        <View style={{ width: Dimensions.get('window').width / 2, justifyContent: 'center',  alignItems: 'center'  }}>

                                                            <Text style={{ paddingLeft: 5 ,fontWeight: 'bold', color: 'orange'}}>{l.amountActual} ฿</Text>
                                                            {/* <CurrencyFormat value={l.amountActual} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={value => <div>{value}</div>} /> */}

                                                        </View>

                                                    </View>

                                                </View>

                                            ))
                                        }
                                    </View>
                                    {
                (() => {
                  if (this.state.showbillbyTransfer.length > 0) {
                    return (
                       
                <View>
                 <View style={{ margin: 10, marginTop: 10, justifyContent: 'center' }}>
                      <View style={{ flexDirection: 'row' }}>
                          <Text style={{ width: Dimensions.get('window').width / 1.5, fontWeight: 'bold' ,color:'red'}} >ยอดรอการโอน </Text>
                         
                      </View>
                  </View>
                            <View style={{ flexDirection: 'row', width: Dimensions.get('window').width, borderBottomColor: 'gray', borderBottomWidth: 0.5 }}>


                                <View style={{ width: Dimensions.get('window').width / 3, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>Invoice</Text>
                                </View>
                                <View style={{ width: Dimensions.get('window').width / 3, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>ลูกค้า</Text>
                                </View>

                                <View style={{ width: Dimensions.get('window').width / 3, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>ยอด</Text>

                                </View>


                            </View>
                            <View>
                                {
                                    this.state.showbillbyTransfer.map((l, i) => (

                                        <View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ width: Dimensions.get('window').width / 3, justifyContent: 'center' }}>
                                                    <Text style={{ paddingLeft: 5 }}> {l.invoiceNumber}</Text>
                                                </View>
                                                <View style={{ width: Dimensions.get('window').width / 3, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={{ fontWeight: 'bold' }}>{l.CustomerName}</Text>
                                                </View>
                                                <View style={{ width: Dimensions.get('window').width / 3, justifyContent: 'center', right: 5 }}>

                                                    <Text style={{ fontWeight: 'bold', color: 'orange', right: 5, alignSelf: 'flex-end' }}>{l.amountActual} ฿</Text>
                                                    {/* <CurrencyFormat value={l.amountActual} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={value => <div>{value}</div>} /> */}

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
                      <View style={{ alignItems: 'center', marginTop: 20, borderColor: 'gray', borderWidth: 0.5 }}>
                        <Text>ไม่มียอดโอนที่ต้องติดตาม</Text>
                    
                      </View>
                    )
                  }
                })()
              }
                                    <View style={{  alignItems: 'center',margin: 30, marginTop: 20, borderColor: 'gray', borderWidth: 0.5   }}>
                                        <Text>หมายเลขบัญชี : 748-2-73551-1 ธนาคารกสิกรไทย </Text>
                                        <Text>บจก ดีพลัส อินเตอร์เทรด</Text>
                                      
                                    </View>
                                </View>
                            ))
                        }
                    </View>


                </Content>
                <Footer  >
                    <TouchableOpacity onPress={
                        this._PRESS_SearchTab.bind(this)
                    }//navigate('HomeTab')
                    >
                        <View style={{
                            width: Dimensions.get('window').width / 2,
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingLeft: 5,
                            backgroundColor: '#33CC33',
                        }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>เคลียร์งาน</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigate('DetailBill')}>
                        <View style={{
                            width: Dimensions.get('window').width / 2,
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingLeft: 5,
                            backgroundColor: '#ff6c00',
                        }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>รายละเอียดยอดเงิน</Text>
                        </View>
                    </TouchableOpacity>

                </Footer>
            </Container>

        )

    }
}


const GraphQL = compose(SumBill)
export default withApollo(GraphQL)

const summoney = gql`
query summoney($MessengerID:String!){
    summoney(MessengerID: $MessengerID){
    amountBill
    amountActual
    CountBill
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
const reportsubmitwork = gql`
    mutation reportsubmitwork($MessengerID:String!){
                    reportsubmitwork(MessengerID: $MessengerID){
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

const SumBillbySale = gql`
query SumBillbySale($MessengerID:String!){
                     SumBillbySale(MessengerID: $MessengerID){
                        amountBill
                        amountActual
                        inv_Date
                        SaleID
                        Sale_Name
                        MessengerID
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
const SumBillbyTranfer = gql`
query SumBillbyTranfer($MessengerID:String!){
    SumBillbyTranfer(MessengerID: $MessengerID){
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

const styles = StyleSheet.create({

    detailContent: {
        width: Dimensions.get('window').width,
        backgroundColor: 'white',
        borderColor: 'white',
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        height: 50,
        justifyContent: 'center'
    }
})
