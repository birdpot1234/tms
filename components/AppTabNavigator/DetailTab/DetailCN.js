import React, { Component } from 'react'
import { Text, StyleSheet, TextInput, Alert, View, Platform, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import { gql, withApollo, compose } from 'react-apollo'
import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, Input, Item, Grid, Col, ActionSheet, Badge } from 'native-base';
import Communications from 'react-native-communications';
import { normalize } from '../../../functions/normalize';
import font from '../../../resource/font';
var BUTTONS = [
    { text: "admin คลังไม่อยู่", icon: "md-arrow-dropright", iconColor: "#2c8ef4", status: "B1" },
    { text: "Cancel", icon: "close", iconColor: "#25de5b" }
];

class DetailCN extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showINV: [],
            showDetailWork: [],
            latitude: 1,
            longitude: 1,
            error: null,
            ShowMomey: [],
            showTel: "",
            statusEdit: 0,
        }
    }


    _RELOAD_TO_GOBACK = () => {
        this.props.navigation.state.params.refresion()
        this.props.navigation.goBack()
    }

    submitwork = (s) => {
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
                    (position) => {
                        let { latitude, longitude } = position.coords
                        this.tracking(s, 1, latitude, longitude)
                    },
                    (error) => {
                        console.log(error)
                        this.tracking(s, 1, -1, -1)
                    }
                );
            }
        }).catch((err) => {
            console.log("err of submitwork", err)
        });
    }


    tracking = (s, n, latitude, longitude) => {
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

    render() {
        const { navigate } = this.props.navigation
        return (
            <Container>
                <Content>
                    <View style={{ margin: normalize(10) }}>
                        <Text style={{ fontFamily: font.semi, color: 'black', fontSize: normalize(17) }}>รหัสบิล: {this.props.navigation.state.params.id}</Text>
                        <Text style={{ fontSize: normalize(17), fontFamily: font.medium }}>ห้าง : <Text style={{ fontFamily: font.light }}>{this.props.navigation.state.params.Zone}</Text></Text>
                        <Text style={{ fontFamily: font.semi, fontSize: normalize(17), color: '#4682b4' }}>ชื่อลูกค้า : {this.props.navigation.state.params.Cusname} </Text>
                        <Text style={{ fontSize: normalize(17), fontFamily: font.medium, color: '#4682b4' }}>ที่อยู่ : <Text style={{ fontFamily: font.light }}>{this.props.navigation.state.params.address} </Text></Text>
                        <Text style={{ fontSize: normalize(17), fontFamily: font.medium }}>ชื่อผู้ส่งงาน : <Text style={{ fontFamily: font.light }}>{global.NameOfMess}</Text></Text>
                    </View>

                    <View style={{ marginHorizontal: normalize(10) }}>
                        <Text style={{ fontSize: normalize(18), fontFamily: font.semi }}>รายละเอียด</Text>
                    </View>

                    <View style={styles.textAreaContainer} >
                        <TextInput
                            style={styles.textArea}
                            value={this.props.navigation.state.params.detail_cn}
                            underlineColorAndroid="transparent"
                            placeholderTextColor="grey"
                            numberOfLines={10}
                            multiline={true}
                            editable={false}
                        />
                    </View>
                </Content>

                <TouchableOpacity
                    onPress={() =>
                        Alert.alert(
                            "ยืนยันการส่งงาน",
                            "คุณต้องการยืนยัน การส่งงาน -สำเร็จ- หรือ -ไม่สำเร็จ- ?",
                            [
                                {
                                    text: "ไม่", onPress: () =>
                                        ActionSheet.show(
                                            {
                                                options: BUTTONS,
                                                title: "รายงานการส่ง",
                                                itemStyle: { fontFamily: font.regular, fontSize: normalize(16), lineHeight: normalize(20) },
                                                titleStyle: { fontFamily: font.semi, fontSize: normalize(18) }
                                            },
                                            buttonIndex => buttonIndex && buttonIndex !== 1 && this.submitwork(BUTTONS[buttonIndex].status)
                                        )
                                },
                                { text: "ใช่", onPress: () => navigate("Submit_TSC", { id: this.props.navigation.state.params.id, refresion: this._RELOAD_TO_GOBACK }) }
                            ]
                        )
                    }>
                    <Footer style={{
                        backgroundColor: '#ff6c00',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} >
                        <Text style={{ color: 'white', fontFamily: font.semi, fontSize: normalize(20) }}>ส่งงาน</Text>
                    </Footer>
                </TouchableOpacity>
            </Container>

        )

    }
}

const GraphQL = compose(DetailCN)
export default withApollo(GraphQL)
const styles = StyleSheet.create({
    textAreaContainer: {
        borderColor: 'gray',
        borderWidth: 1,
        paddingVertical: normalize(5),
        paddingHorizontal: normalize(5),
        marginHorizontal: normalize(10),
        marginTop: normalize(3)
    },
    textArea: {
        height: normalize(150),
        textAlignVertical: "top",
        fontFamily: font.regular,
        fontSize: normalize(16),
    }
})

const submit_TSC = gql`
    mutation submit_TSC($TSC:String!,$status_work:String!){
                    submit_TSC(TSC: $TSC,status_work: $status_work){
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