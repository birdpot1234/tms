import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { gql, withApollo, compose } from 'react-apollo'
import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, Input, Item, Grid, Col, ActionSheet, Badge } from 'native-base';
import Communications from 'react-native-communications';
import Moment from 'moment';
import { normalize } from '../../../functions/normalize';
import font from '../../../resource/font';

class ReciveWork extends Component {
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
        // this.props.client.resetStore();
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


    GET_LOCATE = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let { latitude, longitude } = position.coords
                this.confirmworksome(latitude, longitude);
            },
            (error) => {
                console.log(error)
                this.confirmworksome(-1, -1)
            }
        );
    }


    confirmworksome = (latitude, longitude) => {
        this.props.client.mutate({
            mutation: receive_SC,
            variables: {
                "TSC": this.props.navigation.state.params.id
            }
        }).then((result) => {
            if (result.data.receive_SC.status) {
                this.tracking(latitude, longitude)
            } else {
                Alert.alert(
                    'ตรวจงานไม่สำเร็จ',
                    'มีการตรวจงานนี้ไปแล้ว',
                    [
                        { text: 'ตกลง', onPress: () => console.log("ok") },
                    ]
                )
            }
        }).catch((err) => {
            console.log(err)
        });
    }

    tracking = (latitude, longitude) => {
        this.props.client.mutate({
            mutation: tracking_CN,
            variables: {
                "invoice": this.props.navigation.state.params.id,
                "status": '5',
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
                this.props.navigation.goBack()
                this.props.navigation.state.params.refresion()
            }
        }).catch((err) => {
            console.log("ERR OF TRACKING", err)
        });
    }

    render() {
        const { receive_success, id, user_request_name, user_request_tel, receive_from,
            send_tel, receive_date, send_to, send_date, task_group_document, task_group_quantity, comment } = this.props.navigation.state.params

        return (
            <Container>
                <Content>
                    <View style={{ margin: normalize(10) }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Text style={{ fontFamily: font.semi, color: 'black', fontSize: normalize(17) }}>รหัสบิล: {id}</Text>
                            {!!receive_success && <Text style={{ fontFamily: font.semi, backgroundColor: '#A9FC93', paddingHorizontal: normalize(3), marginLeft: normalize(3) }}>ตรวจรับงานแล้ว</Text>}
                        </View>
                        {/*####################### ROW 1 #######################*/}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.label}>ผู้ของาน </Text>
                                <Text style={styles.text}>{user_request_name || '-'}</Text>
                            </View>

                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.label}>โทร </Text>
                                <Text style={styles.text}>{user_request_tel || '-'}</Text>
                            </View>
                        </View>

                        {/*####################### ROW 2 #######################*/}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.label}>รับของจาก </Text>
                                <Text style={styles.text}>{receive_from || '-'}</Text>
                            </View>

                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.label}>โทร </Text>
                                <Text style={styles.text}>{send_tel || '-'}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.label}>วันที่รับของ </Text>
                            <Text style={styles.text}>{receive_date || '-'}</Text>
                        </View>

                        <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.label}>ไปส่งของที่่ </Text>
                            <Text style={styles.text}>{send_to || '-'}</Text>
                        </View>

                        <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.label}>วันที่ไปส่งของ </Text>
                            <Text style={styles.text}>{send_date || '-'}</Text>
                        </View>

                        <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.label}>ประเภทงาน </Text>
                            <Text style={styles.text}>{task_group_document ? task_group_document + " " : ''}{task_group_quantity}</Text>
                        </View>
                    </View>

                    <Text style={{ fontFamily: font.semi, fontSize: normalize(17), marginHorizontal: normalize(10) }}>รายละเอียด</Text>
                    <View style={styles.textAreaContainer} >
                        <TextInput
                            style={styles.textArea}
                            value={comment}
                            underlineColorAndroid="transparent"
                            placeholderTextColor="grey"
                            numberOfLines={10}
                            multiline={true}
                            editable={false}
                        />
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
                        <Footer style={{ backgroundColor: '#ff6c00', justifyContent: 'center', alignItems: 'center' }} >
                            <Text style={{ color: 'white', fontFamily: font.semi, fontSize: normalize(20) }}>ยืนยันการตรวจงาน</Text>
                        </Footer>
                    </TouchableOpacity>}
            </Container>

        )

    }
}

const GraphQL = compose(ReciveWork)
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
    },
    label: {
        fontSize: normalize(16),
        fontFamily: font.medium,
        flex: 1
    },
    text: {
        fontSize: normalize(16),
        flex: 2
    }
})
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

const selectpendingwork = gql`
        query selectpendingwork($MessengerID:String!){
            selectpendingwork(MessengerID: $MessengerID){
                    status
               }
                }
            `
const receive_SC = gql`
        mutation receive_SC($TSC:String!){
                receive_SC(TSC: $TSC){
                        status
                   }
                    }
                `