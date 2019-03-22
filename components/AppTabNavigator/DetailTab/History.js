import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import { gql, withApollo, compose } from 'react-apollo'
import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, Input, Item, Grid, Col, ActionSheet, Badge } from 'native-base';
import Communications from 'react-native-communications';
import Moment from 'moment';
import { normalize } from '../../../functions/normalize';
import font from '../../../resource/font';

class History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDetailWork: [],
            latitude: null,
            longitude: null,
            error: null,
            ShowMomey: [],
            showTel: "",
            statusEdit: 0,
        }
    }

    componentDidMount = () => {
        // this.props.client.resetStore();
        this.subDetail();
        this.summoneydetail();
        this.submitedit();
    }

    subDetail = () => {
        this.props.client.query({
            query: subDetail,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id
            }
        }).then((result) => {
            this.setState({
                showDetailWork: result.data.subDetail
            })
        }).catch((err) => {
            console.log(err)
        });
    }

    summoneydetail = () => {
        this.props.client.query({
            query: summoneydetail,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id
            }
        }).then((result) => {
            this.setState({
                ShowMomey: result.data.summoneydetail
            })
        }).catch((err) => {
            console.log(err)
        });
    }

    submitedit = () => {
        this.props.client.query({
            query: submitedit,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id,
            }
        }).then((result) => {
            this.setState({ statusEdit: result.data.submitedit.status ? 1 : 0 })
        }).catch((err) => {
            console.log("err of submitedit", err)
        });
    }

    render() {
        return (
            <Container>
                <Content>
                    <View style={{ margin: normalize(10) }}>
                        <Text style={{ fontSize: normalize(17), fontFamily: font.medium, color: 'black', }}>รหัสบิล : <Text style={{ fontFamily: font.light }}>{this.props.navigation.state.params.id}</Text></Text>
                        <Text style={{ fontSize: normalize(17), fontFamily: font.medium }}>ห้าง : <Text style={{ fontFamily: font.light }}>{this.props.navigation.state.params.Zone}</Text></Text>
                        <Text style={{ fontFamily: font.semi, fontSize: normalize(17), color: '#4682b4' }}>ชื่อลูกค้า : {this.props.navigation.state.params.Cusname} </Text>
                        <Text style={{ fontSize: normalize(17), fontFamily: font.medium }}>ที่อยู่ : <Text style={{ fontFamily: font.light }}>{this.props.navigation.state.params.address}</Text></Text>
                        <Text style={{ fontSize: normalize(17), fontFamily: font.medium }}>วันที่ : <Text style={{ fontFamily: font.light }}>{Moment(this.props.navigation.state.params.datetime).format('l')} {Moment(this.props.navigation.state.params.datetime).format('LTS')} </Text></Text>
                        {/* <Text>รหัสบิล : {this.props.navigation.state.params.id}</Text>
                        <Text >ห้าง : {this.props.navigation.state.params.Zone} </Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#4682b4' }}>ชื่อลูกค้า : {this.props.navigation.state.params.Cusname} </Text>
                        <Text>ที่อยู่ : {this.props.navigation.state.params.address} </Text>
                        <Text>วันที่ : {Moment(this.props.navigation.state.params.datetime).format('l')} {Moment(this.props.navigation.state.params.datetime).format('LTS')} </Text> */}
                    </View>

                    <View style={{ flexDirection: 'row', width: Dimensions.get('window').width, borderBottomColor: 'gray', borderBottomWidth: 0.5 }}>
                        <View style={{ width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: normalize(17), fontFamily: font.medium }}>ชื่อ</Text>
                        </View>

                        <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: normalize(17), fontFamily: font.medium }}>จำนวน</Text>
                        </View>
                        <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: normalize(17), fontFamily: font.medium }}>ราคา</Text>

                        </View>
                    </View>

                    <View>
                        {
                            this.state.showDetailWork.map((l, i) => (
                                <View style={{ flexDirection: 'row', paddingTop: normalize(3), paddingBottom: i === 0 ? 0 : normalize(3) }} key={i}>
                                    <View style={{ width: Dimensions.get('window').width / 2 }}>
                                        <Text style={{ paddingLeft: normalize(16), fontSize: normalize(16) }}>{i + 1}). {l.itemName}</Text>
                                    </View>
                                    <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: normalize(16) }}>{l.qty - l.qtyCN}</Text>
                                    </View>
                                    <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', right: normalize(16) }}>
                                        <Text style={{ fontFamily: font.semi, fontSize: normalize(16), color: 'orange', alignSelf: 'flex-end' }}>{l.amountedit} ฿</Text>
                                    </View>
                                </View>
                            ))
                        }
                    </View>

                    <View style={{ borderTopWidth: 0.5, borderTopColor: 'gray', left: normalize(10) }}>
                        {
                            this.state.ShowMomey.map((l, i) => (
                                <View style={{ marginTop: normalize(20) }} key={i}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: Dimensions.get('window').width / 3 }}>
                                            <Text style={{ fontFamily: font.semi, fontSize: normalize(17) }}>ราคาทั้งหมด : </Text>
                                        </View>
                                        <View style={{ width: Dimensions.get('window').width / 3, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: 'orange', fontFamily: font.semi, fontSize: normalize(17) }}> {l.SUM} ฿</Text>
                                        </View>
                                    </View>
                                    {/* <View style={{ marginTop: 5, justifyContent: 'center' }}>
                                        <Text style={{ fontWeight: 'bold' }}>หมายเหตุ :  </Text>
                                    </View> */}
                                </View>
                            ))
                        }
                    </View>

                    <View style={{ left: normalize(10), marginTop: normalize(10) }}>
                        {
                            (() => {
                                if (this.state.statusEdit == 1) {
                                    return (
                                        <Badge warning style={{ alignItems: 'center', justifyContent: 'center' }} >
                                            <Text style={{ fontSize: normalize(16), color: 'white', fontFamily: font.semi }}>***บิลนี้มีการแก้ไข***</Text>
                                        </Badge>
                                    )
                                }
                            })()
                        }
                    </View>

                </Content>
            </Container>

        )

    }
}

const GraphQL = compose(History)
export default withApollo(GraphQL)

const subDetail = gql`
    query subDetail($invoiceNumber:String!){
        subDetail(invoiceNumber: $invoiceNumber){
            invoiceNumber
            itemCode
            itemName
            qty
            qtyCN
            amountedit
            priceOfUnit
            amountbox
            Note
        }
    }
`
const summoneydetail = gql`
    query summoneydetail($invoiceNumber:String!){
        summoneydetail(invoiceNumber: $invoiceNumber){
            SUM
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