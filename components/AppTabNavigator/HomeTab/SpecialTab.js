import React, { Component } from 'react'
import { Text, View, CheckBox, Dimensions, RefreshControl, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, List, ListItem, Item, TabHeading, Tab, Tabs } from 'native-base';
import { gql, withApollo, compose } from 'react-apollo'
import { normalize } from '../../../functions/normalize';
import { Empty } from '../../../comp/FlatList';
import font from '../../../resource/font';

class SpecialTab extends Component {
    constructor(props) {
        super(props)

        this.state = {
            refreshing_1: false,
            status_CHECKBOX: false,
            specialJob: this.props.specialJob,
            specialJobGreen: this.props.specialJobGreen,
            CF_ALL_INVOICE: [],
            stack_IVOICE: [],
            loading: true,
            showTable: this.props.showTable // props
        }
    }

    onRefreshSpecial = async () => {
        this.setState({ CF_ALL_INVOICE: [], stack_IVOICE: [], status_CHECKBOX: false })
        await this.props.onRefreshSpecial()
    }

    /**
    * @param number i // index
    */
    onValueChange = (item, i) => {
        let n = this.state.CF_ALL_INVOICE.slice();
        let s = this.state.stack_IVOICE.slice();
        if (this.state.CF_ALL_INVOICE[i] == true) {
            n[i] = false
            s[i] = null
        } else {
            n[i] = true
            s[i] = item.tsc_document
        }
        this.setState({ CF_ALL_INVOICE: n, stack_IVOICE: s })
    }

    onValueChangeCheckAll = () => {
        let { specialJob } = this.state
        let n = this.state.CF_ALL_INVOICE;
        let s = this.state.stack_IVOICE;
        specialJob.forEach((el, i) => {
            n[i] = !this.state.status_CHECKBOX
            s[i] = el.tsc_document
        })

        this.setState(prev => ({
            status_CHECKBOX: !prev.status_CHECKBOX,
            CF_ALL_INVOICE: n,
            stack_IVOICE: s,
        }))
    }

    checkpending_SC = (selection) => {
        this.setState({ refreshing_1: true }, () => {
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
                    if (selection == 0) {
                        this.GET_LOCATE_SC()
                    } else {
                        // this.checkinvoice()
                        this.setState({ refreshing_1: false }, () => navigate("Search"))
                    }
                }
            }).catch((err) => {
                this.setState({ refreshing_1: false })
                console.log(err)
            });
        })
    }


    GET_LOCATE_SC = () => {
        try {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    let { latitude, longitude } = position.coords
                    let { stack_IVOICE } = this.state
                    let filter = stack_IVOICE.filter(el => el);
                    filter.forEach(async (val, i) => {
                        let stop = ((i + 1) !== filter.length) ? 0 : 1 // เช็คว่าตัวสุดท้ายหรือเปล่า
                        await this.tracking_SC(val, stop, latitude, longitude)
                    })
                },
                (error) => {
                    this.setState({ refreshing_1: false })
                    console.log(error)
                    let { stack_IVOICE } = this.state
                    let filter = stack_IVOICE.filter(el => el);
                    filter.forEach(async (val, i) => {
                        let stop = ((i + 1) !== filter.length) ? 0 : 1 // เช็คว่าตัวสุดท้ายหรือเปล่า
                        await this.tracking_SC(val, stop, 1, 1)
                    })
                },
            );
        } catch (error) {
            this.setState({ refreshing_1: false })
            console.log(error)
        }
    }

    tracking_SC = (inV, i, latitude, longitude) => {
        this.props.client.mutate({
            mutation: tracking_CN,
            variables: {
                "invoice": inV,
                "status": "5",
                "messengerID": global.NameOfMess,
                "lat": latitude,
                "long": longitude,
            }
        }).then(() => {
            this.confirmworksome_SC(inV, i)
        }).catch((err) => {
            this.setState({ refreshing_1: false })
            console.log("ERR OF TRACKING", err)
        });
    }

    confirmworksome_SC = (inV, i) => {
        console.log('confirmworksome_SC', inV, i)
        this.props.client.mutate({
            mutation: receive_SC,
            variables: {
                "TSC": inV
            }
        }).then((result) => {
            if (!result.data.receive_SC.status) {
                Alert.alert(
                    'ตรวจงานไม่สำเร็จ',
                    'มีการตรวจงานไปแล้ว',
                    [
                        { text: 'ตกลง', onPress: () => this.setState({ refreshing_1: false }) },
                    ]
                )
            } else {
                if (i == 1) {
                    this.onRefreshSpecial();
                }
            }

        }).catch((err) => {
            this.setState({ refreshing_1: false })
            console.log(err)
        });
    }


    checkDATA = (e) => {
        return (e == null) || (e == false)
    }

    render() {
        let { status_CHECKBOX, loading } = this.state;
        let { specialJob, specialJobGreen } = this.props;
        return (
            <View style={{ flex: 1 }}>
                {loading ? <Content refreshControl={
                    <RefreshControl
                        refreshing={this.props.refreshing_1}
                        onRefresh={this.onRefreshSpecial}
                    />
                }>
                    {specialJob.length > 0 && <View style={{
                        flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width, borderBottomColor: 'gray', borderBottomWidth: 0.5,
                        marginBottom: normalize(5), paddingVertical: normalize(10)
                    }}>
                        <View style={{ marginLeft: normalize(10) }}>
                            <CheckBox
                                value={status_CHECKBOX}
                                onValueChange={this.onValueChangeCheckAll} />
                        </View>
                        <Text style={{ fontSize: normalize(16) }}>เลือกทั้งหมด</Text>
                    </View>}

                    <FlatList
                        data={specialJob}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => this.renderCheckSpecial(item, index)}
                        ListEmptyComponent={<Empty title={'ไม่มีรายการงานพิเศษ'} />}
                    />

                    {/*####################### รับงานแล้ว #######################*/}
                    <FlatList
                        data={specialJobGreen}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => this.renderReceive(item, index)}
                        ListHeaderComponent={() => specialJobGreen.length > 0 && <View style={{ paddingVertical: normalize(8) }}>
                            <Text style={{ fontSize: normalize(18), fontFamily: font.semi, marginLeft: normalize(8) }}>รายการพิเศษที่ตรวจงานแล้ว</Text>
                        </View>}
                    />



                </Content> : <View style={{ flex: 1 }} />}
                {loading && this.renderFooterSpecial()}
            </View>

        )
    }

    renderCheckSpecial = (item, index) => {
        const { navigate } = this.props.navigation
        return <ListItem style={{ paddingLeft: normalize(10), marginLeft: 0 }} >
            <CheckBox value={this.state.CF_ALL_INVOICE[index]} onValueChange={() => this.onValueChange(item, index)} />
            <Body style={{ marginLeft: normalize(3) }}>
                <View style={{ left: 0, right: 0, top: 0, bottom: 0, }}>
                    <TouchableOpacity style={{ left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center' }}
                        onPress={() => navigate('RecieveWork', {
                            id: item.tsc_document, cusname: item.customerName, Zone: item.Zone, address: item.address_shipment, task_detail: item.task_detail,
                            user_request_name: item.user_request_name, user_request_tel: item.user_request_tel, receive_date: item.receive_date, receive_time_first: item.receive_time_first,
                            send_to: item.send_to, send_time_first: item.send_time_first, send_tel: item.send_tel, task_group: item.task_group, task_group_document: item.task_group_document, task_group_quantity: item.task_group_quantity, receive_from: item.receive_from,
                            comment: item.comment, send_date: item.send_date, refresion: this.onRefreshSpecial, receive_success: 0
                        })}
                    >
                        <Text style={styles.storeLabel}>{index + 1}). {item.tsc_document}</Text>
                        <Text style={{ fontSize: normalize(16) }} numberOfLines={1}>{item.customerName}</Text>
                    </TouchableOpacity>
                </View>
            </Body>
            <Right>
                <Button transparent
                    onPress={() => navigate('RecieveWork', {
                        id: item.tsc_document, cusname: item.customerName, Zone: item.Zone, address: item.address_shipment, task_detail: item.task_detail,
                        user_request_name: item.user_request_name, user_request_tel: item.user_request_tel, receive_date: item.receive_date, receive_time_first: item.receive_time_first,
                        send_to: item.send_to, send_time_first: item.send_time_first, send_tel: item.send_tel, task_group: item.task_group, task_group_document: item.task_group_document, task_group_quantity: item.task_group_quantity, receive_from: item.receive_from,
                        comment: item.comment, send_date: item.send_date, refresion: this.onRefreshSpecial, receive_success: 0
                    })}>
                    <Icon name='ios-arrow-forward' style={{ color: 'gray' }} />
                </Button>
            </Right>
        </ListItem >
    }

    /**
    * FlatList สำหรับตรวจงานแล้ว
    */
    renderReceive = (item, index) => {
        const { navigate } = this.props.navigation
        return <ListItem noIndent style={{ backgroundColor: "#A9FC93", marginLeft: 0, paddingLeft: normalize(10) }}>
            <Body style={{ marginLeft: normalize(3) }}>
                <TouchableOpacity style={{ left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center' }}
                    onPress={() => navigate('RecieveWork', {
                        id: item.tsc_document, cusname: item.customerName, Zone: item.Zone, address: item.address_shipment, task_detail: item.task_detail,
                        user_request_name: item.user_request_name, user_request_tel: item.user_request_tel, receive_date: item.receive_date, receive_time_first: item.receive_time_first,
                        send_to: item.send_to, send_time_first: item.send_time_first, send_tel: item.send_tel, task_group: item.task_group, task_group_document: item.task_group_document, task_group_quantity: item.task_group_quantity, receive_from: item.receive_from,
                        comment: item.comment, send_date: item.send_date, refresion: this.onRefreshSpecial, receive_success: 1
                    })}
                >
                    <Text style={styles.storeLabel}>{index + 1}). {item.tsc_document}</Text>
                    <Text style={{ fontSize: normalize(16) }} numberOfLines={1}>{item.customerName}</Text>
                </TouchableOpacity>
            </Body>
            <Right>
                <Button transparent
                    onPress={() => navigate('RecieveWork', {
                        id: item.tsc_document, cusname: item.customerName, Zone: item.Zone, address: item.address_shipment, task_detail: item.task_detail,
                        user_request_name: item.user_request_name, user_request_tel: item.user_request_tel, receive_date: item.receive_date, receive_time_first: item.receive_time_first,
                        send_to: item.send_to, send_time_first: item.send_time_first, send_tel: item.send_tel, task_group: item.task_group, task_group_document: item.task_group_document, task_group_quantity: item.task_group_quantity, receive_from: item.receive_from,
                        comment: item.comment, send_date: item.send_date, refresion: this.onRefreshSpecial, receive_success: 1
                    })}>
                    <Icon name='ios-arrow-forward' style={{ color: 'gray' }} />
                </Button>
            </Right>
        </ListItem>
    }

    renderFooterSpecial = () => {
        let { specialJob, CF_ALL_INVOICE } = this.state
        if (specialJob.length > 0) {
            return (
                <TouchableOpacity
                    onPress={() => {
                        if (CF_ALL_INVOICE.every(this.checkDATA)) {
                            Alert.alert('ไม่สามารถตรวจงานได้', 'กรุณาเลือกงาน')
                        } else {
                            Alert.alert(
                                'ตรวจงานทั้งหมด',
                                'คุณต้องการตรวจงานทั้งหมด?',
                                [
                                    { text: 'ไม่', onPress: () => console.log("no") },
                                    { text: 'ใช่', onPress: () => this.checkpending_SC(0) },
                                ]
                            )
                        }
                    }}>
                    <Footer style={{
                        backgroundColor: '#ff6c00',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{ color: 'white', fontFamily: font.semi, fontSize: normalize(20) }}>ตรวจงานทั้งหมด</Text>
                    </Footer>

                </TouchableOpacity>
            )
        } else if (specialJob.length == 0 && this.props.showTable.length == 0) {
            return (
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert(
                            'ยืนยันการออกรอบ',
                            'คุณต้องการออกรอบเลยหรือไม่?',
                            [
                                { text: 'ยกเลิก', onPress: () => console.log("no") },
                                { text: 'ยืนยัน', onPress: () => { this.checkpending_SC(1) } },
                            ]
                        )
                    }}>
                    <Footer style={{
                        backgroundColor: '#33CC33',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{ color: 'white', fontFamily: font.semi, fontSize: normalize(20) }}>ส่งงาน</Text>
                    </Footer>
                </TouchableOpacity>
            )
        }
    }
}

const selectpendingwork = gql`
        query selectpendingwork($MessengerID:String!){
            selectpendingwork(MessengerID: $MessengerID){
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
const receive_SC = gql`
         mutation receive_SC($TSC:String!){
                 receive_SC(TSC: $TSC){
                         status
                    }
                     }
                 `
const GraphQL = compose(SpecialTab)
export default withApollo(GraphQL)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center"
    },
    storeLabel: {
        fontSize: normalize(18),
        color: 'black'
    },
    detailContent: {
        width: Dimensions.get('window').width,
        backgroundColor: 'white',
        borderColor: 'gray',
        borderRightWidth: Math.floor(normalize(2)),
        borderLeftWidth: Math.floor(normalize(2)),
        borderTopWidth: Math.floor(normalize(1)),
        borderBottomWidth: Math.floor(normalize(1)),
        height: normalize(50),
        justifyContent: 'center'
    },
    detailContentGREEN: {
        width: Dimensions.get('window').width,
        borderColor: 'gray',
        borderRightWidth: Math.floor(normalize(2)),
        borderLeftWidth: Math.floor(normalize(2)),
        borderTopWidth: Math.floor(normalize(1)),
        borderBottomWidth: Math.floor(normalize(1)),
        height: normalize(50),
        justifyContent: 'center',
        backgroundColor: '#77F156'
    },
    horizontal: {
        flexDirection: 'row',
        padding: normalize(10),
        justifyContent: "center"
    }
})
