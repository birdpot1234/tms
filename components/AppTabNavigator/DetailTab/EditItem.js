import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import { gql, withApollo, compose } from 'react-apollo'
import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, Item, Input, Form, Textarea } from 'native-base';
import Modal from "react-native-modal";
import { normalize } from '../../../functions/normalize';
import font from '../../../resource/font';
// const update = React.addons.update;

class EditItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text_arr: [],
            showWorkEdit: [],
            item_arr: [],
            id: [],
            inputvalue: [],
            visibleModal: null,
            reason: "",
            latitude: 1,
            longitude: 1,
            error: null,
            cn_amount: [],
        };
    }

    componentDidMount = () => {
        this.props.client.resetStore();
        this.subDetail();
    }

    subDetail = () => {
        this.props.client.query({
            query: subDetail,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id
            }
        }).then((result) => {
            this.setState({ showWorkEdit: result.data.subDetail })
        }).catch((err) => {
            console.log("ERR OF EDIT WORK", err)
        });
    }

    editsubwork = (q_CN, it_C, reason, id) => {
        this.props.client.mutate({
            mutation: editsubwork_new,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id,
                "qtyCN": q_CN,
                "itemCode": it_C,
                "ReasonCN": reason,
                "id": id,
            }
        }).then((result) => {
            if (result.data.editsubwork && result.data.editsubwork.status) {
                this.insertedit(it_C)
            }
        }).catch((err) => {
            console.log(err)
        });
    }

    insertedit = (it_C) => {
        this.props.client.mutate({
            mutation: insertedit,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id,
                "itemCode": it_C,
            }
        }).catch((err) => {
            console.log(err)
        });
    }

    tracking = () => {
        this.props.client.mutate({
            mutation: tracking,
            variables: {
                "invoice": this.props.navigation.state.params.id,
                "status": "9",
                "messengerID": global.NameOfMess,
                "lat": this.state.latitude,
                "long": this.state.longitude,
            }
        }).then(() => {
            this.props.navigation.goBack()
            this.props.navigation.state.params.refresion()
        }).catch((err) => {
            console.log("ERR OF TRACKING", err)
        });
    }

    _renderButton = (text, onPress) => (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.button}>
                <Text style={{ fontSize: normalize(18), fontFamily: font.regular }}>{text}</Text>
            </View>
        </TouchableOpacity>
    );

    _renderModalContent = () => (
        <View style={styles.modalContent}>
            <Text style={{ fontSize: normalize(18), fontFamily: font.semi }}>สาเหตุที่แก้ไขรายการ</Text>
            <Form style={{ width: Dimensions.get('window').width / 1.3 }}>
                <Textarea
                    rowSpan={5}
                    bordered
                    placeholder="เหตุผล..."
                    maxLength={255}
                    keyboardType='default'
                    style={{ fontFamily: font.regular, fontSize: normalize(16) }}
                    onChangeText={(text) => this.setState({ reason: text })}
                />
            </Form>
            <View style={{ flexDirection: 'row' }}>
                {this._renderButton('ยกเลิก', () => this.setState({ visibleModal: null }))}
                {this._renderButton('ตกลง', () => {
                    this.state.text_arr.map((p, i) => {
                        if (p != '') {
                            this.editsubwork(parseInt(p), this.state.item_arr[i], this.state.reason, this.state.id[i])
                        }
                        this.setState({ visibleModal: null })
                        this.tracking()
                    })
                })}
            </View>
        </View>
    );

    onChangeText = (text, l, i) => {
        if (parseInt(text) > l.qty || parseInt(text) < 0) {
            Alert.alert(
                "คุณใส่ค่าเกินจำนวน",
                "กรุณาใส่ค่าใหม่อีกครั้ง",
                [
                    {
                        text: 'OK', onPress: () => {
                            let v = this.state.inputvalue.slice();
                            v[i] = ''
                            this.setState({ inputvalue: v })
                        }
                    }
                ]
            )
        } else {
            let a = this.state.text_arr.slice();
            let b = this.state.item_arr.slice();
            let v = this.state.inputvalue.slice();
            let line = this.state.id.slice();
            b[i] = l.itemCode
            a[i] = text
            v[i] = text
            line[i] = l.id
            this.setState({
                text_arr: a,
                item_arr: b,
                inputvalue: v,
                id: line
            })

        }
    }

    render() {
        return (
            <Container>
                <Content style={{ backgroundColor: 'white' }}>

                    <View style={{ margin: normalize(10) }}>
                        <Text style={{ fontFamily: font.semi, color: 'black', fontSize: normalize(17) }}>รหัสบิล : {this.props.navigation.state.params.id}</Text>
                    </View>


                    <View style={{ justifyContent: 'space-around', flexDirection: 'row' }}>
                        <View style={{ width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: normalize(17), fontFamily: font.semi }}>ชื่อ</Text>
                        </View>
                        <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: normalize(17), fontFamily: font.semi }}>จำนวนตามบิล</Text>
                        </View>
                        <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: normalize(17), fontFamily: font.semi }}>จำนวนที่CN</Text>
                        </View>
                    </View>

                    <View>
                        {
                            this.state.showWorkEdit.map((l, i) => (
                                <View style={{ flexDirection: 'row', paddingTop: normalize(3), paddingBottom: i === 0 ? 0 : normalize(3) }} key={i}>
                                    <View style={{ width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ paddingLeft: normalize(16), fontSize: normalize(16), fontFamily: font.medium }}>{i + 1}.) {l.itemName}</Text>
                                    </View>
                                    <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: normalize(16), fontFamily: font.medium }}>{l.qty}</Text>
                                    </View>
                                    <Item style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', alignItems: 'center' }}>
                                        <Input keyboardType='numeric'
                                            placeholder={l.qtyCN.toString()}
                                            placeholderTextColor="gray"
                                            underlineColorAndroid='white'
                                            style={{
                                                textAlign: 'center', fontSize: normalize(16), fontFamily: font.medium,
                                                paddingBottom: 0, marginBottom: 0, paddingTop: 0, marginTop: 0, marginRight: normalize(16),
                                            }}
                                            value={this.state.inputvalue[i]}
                                            onChangeText={(text) => this.onChangeText(text, l, i)}
                                        />
                                    </Item>
                                </View>
                            ))
                        }
                    </View>
                </Content>


                <View>
                    <Modal isVisible={this.state.visibleModal === 1}>
                        {this._renderModalContent()}
                    </Modal>
                </View>

                <Footer style={{
                    backgroundColor: '#66c2ff',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Button success
                            style={{
                                width: normalize(200),
                                height: '80%',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={() => {
                                if (this.state.text_arr.length == 0) {
                                    this.setState({ visibleModal: null });
                                } else {
                                    this.setState({ visibleModal: 1 })
                                }
                            }}
                        >
                            <Text style={{ color: 'white', fontFamily: font.semi, fontSize: normalize(20) }}>ยืนยันการแก้ไข</Text>
                        </Button>
                    </View>
                </Footer>
            </Container>

        )

    }
}

const GraphQL = compose(EditItem)
export default withApollo(GraphQL)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'lightblue',
        padding: normalize(12),
        margin: normalize(16),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: normalize(22),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
})

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
            id
        }
    }
`
const editsubwork = gql`
    mutation editsubwork($invoiceNumber:String!,$qtyCN:Int!,$itemCode:String!,$ReasonCN:String!){
        editsubwork(invoiceNumber: $invoiceNumber,qtyCN: $qtyCN,itemCode: $itemCode,ReasonCN: $ReasonCN){
            status
        }
    }
`
const editsubwork_new = gql`
    mutation editsubwork_new($invoiceNumber:String!,$qtyCN:Int!,$itemCode:String!,$ReasonCN:String!,$id:Int!){
        editsubwork_new(invoiceNumber: $invoiceNumber,qtyCN: $qtyCN,itemCode: $itemCode,ReasonCN: $ReasonCN,id:$id){
            status
        }
    }
`

const insertedit = gql`
    mutation insertedit(
        $invoiceNumber:String!,
        $itemCode:String!,
    ){
        insertedit(
            invoiceNumber: $invoiceNumber,
            itemCode: $itemCode,
        ){
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