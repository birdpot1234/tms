import React, { Component } from 'react'
import { Text, StyleSheet, Alert, View, TouchableOpacity, Keyboard, RefreshControl } from 'react-native'
import { gql, withApollo, compose } from 'react-apollo'
import { Container, Content, Footer, Textarea, Picker, Icon } from 'native-base';
import Moment from 'moment';
import { normalize, width } from '../../../functions/normalize';
import font from '../../../resource/font';


class AddCN extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showINV: [],
            latitude: 1,
            longitude: 1,
            error: null,
            ShowMomey: [],
            showTel: "",
            statusEdit: 0,
            searchTerm: "",
            inv: this.props.navigation.state.params.id,
            refreshing_2: false,
            zone: "",
            customer: "",
            Description: '',
            Address: '',
            load: false,
            car_type: null,

        }
        this.props.client.resetStore();
    }

    submitCN = () => {
        if (this.props.navigation.state.params.id.invoiceNumber == undefined || this.state.Description == '') {
            Alert.alert(
                'ไม่สามารถสร้างงานคืนได้ ',
                'กรุณากรอกข้อมูลให้ครบ'
            )
        } else {
            this.getMoviesFromApiAsync()
        }
    }

    getMoviesFromApiAsync() {
        let url = "http://www.dplus-system.com:3499/web-api/special-circles/add-task"
        fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify([{
                create_date: "",
                user_request_code: global.NameOfMess,
                user_request_name: this.props.navigation.state.params.id.customerName,
                user_request_department: "DPLUS",
                user_request_tel: "",
                receive_from: this.props.navigation.state.params.id.customerName,
                receive_date: "",
                receive_time_first: "",
                receive_time_end: "",
                send_to: "",
                send_date: "",
                send_time_first: "",
                send_time_end: "",
                send_tel: "",
                task_group: "",
                task_group_document: "",
                task_group_amount: "",
                task_group_quantity: "",
                task_group_pic: "",
                comment: this.state.Description,
                work_type: "",
                status: 4,
                messenger_code: global.NameOfMess,
                messenger_name: "",
                car_type: this.state.car_type,
                shipment_staff_1: "",
                shipment_staff_2: "",
                messenger_comment: "",
                task_detail: "",
                status_finish: 0,
                customerID: this.props.navigation.state.params.id.customerID,
                customerName: this.props.navigation.state.params.id.customerName,
                Zone: this.props.navigation.state.params.id.Zone,
                address_shipment: this.props.navigation.state.params.id.addressShipment,
                detail_cn: this.state.Description

            }]),
        })
            .then((resp) => resp.json())
            .then((respJSON) => {
                if (respJSON.status == 200) {
                    this.props.navigation.state.params.refresion()
                    this.props.navigation.goBack()
                } else {
                    Alert.alert(
                        'บันทึกรายการไม่สำเสร็จ ',
                        'กรุณาลองใหม่อีกครั้ง'
                    )
                }
            }).catch((err) => {
                console.log("confirm err", err)
            });
    }

    render() {
        const { navigate } = this.props.navigation
        let { invoiceNumber } = this.props.navigation.state.params.id
        return (
            <Container>
                <Content refreshControl={<RefreshControl refreshing={this.state.refreshing_2} />}>

                    <View style={{ margin: normalize(10) }}>
                        <TouchableOpacity style={styles.search} onPress={() => navigate('AutoSearch')}>
                            <Icon name={'search'} style={{ width: normalize(20), height: normalize(20) }} />
                            <Text style={{ fontSize: normalize(20), fontFamily: font.medium, marginLeft: normalize(10) }}>{invoiceNumber || 'ค้นหาเลขสินค้า'}</Text>
                        </TouchableOpacity>

                        <View style={{ margin: normalize(10) }}>
                            <Text style={{ fontSize: normalize(17), fontFamily: font.medium }}>ห้าง <Text style={{ fontFamily: font.light }}>{this.props.navigation.state.params.id.Zone}</Text></Text>
                            <Text style={{ fontFamily: font.semi, fontSize: normalize(17), color: '#4682b4' }}>ชื่อลูกค้า {this.props.navigation.state.params.id.Cusname} </Text>
                            <Text style={{ fontSize: normalize(17), fontFamily: font.medium }}>ที่อยู่ <Text style={{ fontFamily: font.light }}>{this.props.navigation.state.params.id.addressShipment} </Text></Text>
                            <Text style={{ fontSize: normalize(17), fontFamily: font.medium }}>ชื่อผู้ส่งงาน <Text style={{ fontFamily: font.light }}>{global.NameOfMess}</Text></Text>
                            <Text style={{ fontSize: normalize(17), fontFamily: font.medium }}>วันที่ <Text style={{ fontFamily: font.light }}>{Moment().format('L')}</Text></Text>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: normalize(17), fontFamily: font.medium }}>ประเภทการส่ง</Text>
                                <Picker
                                    selectedValue={this.state.car_type}
                                    style={{ height: normalize(20), borderColor: 'gray', borderWidth: 1, color: '#4682b4' }}
                                    onValueChange={(itemValue) => this.setState({ car_type: itemValue })}>
                                    <Picker.Item label="2ล้อ" value="2ล้อ" />
                                    <Picker.Item label="4ล้อ" value="4ล้อ" />
                                    <Picker.Item label="6ล้อ" value="6ล้อ" />
                                </Picker>
                            </View>
                        </View>
                    </View>

                    <View style={{ marginHorizontal: normalize(10) }}>
                        <Text style={{ fontSize: normalize(18), fontFamily: font.semi }}>รายละเอียด</Text>
                    </View>


                    <Textarea
                        style={{
                            height: normalize(150),
                            margin: normalize(20),
                            padding: normalize(10), borderColor: 'gray', borderWidth: 1,
                            fontFamily: font.regular,
                            fontSize: normalize(17)
                        }}
                        rowSpan={5}
                        bordered
                        placeholder="เหตุผล..."
                        maxLength={255}
                        returnKeyType='done'
                        onSubmitEditing={Keyboard.dismiss}
                        onChangeText={(text) => this.setState({ Description: text })}
                    />
                </Content>


                <TouchableOpacity onPress={() => Alert.alert(
                    "ยืนยันการสร้างงานพิเศษ",
                    "โปรดตรวจสอบรายการก่อนการยืนยัน",
                    [
                        { text: "ยกเลิก", onPress: () => console.log("Cancle") },
                        { text: "ยืนยัน", onPress: () => this.submitCN() }
                    ]
                )}>
                    <Footer style={{
                        backgroundColor: '#ff6c00',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} >
                        <Text style={{ color: 'white', fontFamily: font.semi, fontSize: normalize(20) }}>บันทึก</Text>
                    </Footer>
                </TouchableOpacity>
            </Container>
        )

    }
}

const GraphQL = compose(AddCN)
export default withApollo(GraphQL)
const styles = StyleSheet.create({
    search: {
        flexDirection: 'row', alignItems: 'center', width: width * 0.9, borderRadius: normalize(20), borderWidth: 1,
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(3)
    }
})



