import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import { gql, withApollo, compose } from 'react-apollo'
import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, Item, Input, Form, Textarea } from 'native-base';
import Modal from "react-native-modal";
// const update = React.addons.update;

class EditItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text_arr: [],
            showWorkEdit: [],
            item_arr: [],
            id:[],
            inputvalue: [],
            visibleModal: null,
            reason: "",
            latitude: 1,
            longitude: 1,
            error: null,
            testset:[],
            cn_amount:[],
            cn_add :0,
        };
        this.props.client.resetStore();
        this.subDetail();
        this. setest();
    }
    setest = ()=>{
        this.setState({
            cn_add:0,
            testset:"bird"
        })
    }

    subDetail = () => {
        this.props.client.query({
            query: subDetail,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id
            }
        }).then((result) => {
            this.setState({
                showWorkEdit: result.data.subDetail,
               // testset:"bird"
            })
        }).catch((err) => {
            console.log("ERR OF EDIT WORK", err)
        });
    }

    editsubwork = (q_CN, it_C, reason,id) => {
        console.log("editsubwork")
        console.log(q_CN, it_C, reason)
        this.props.client.mutate({
            mutation: editsubwork_new,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id,
                "qtyCN": q_CN,
                "itemCode": it_C,
                "ReasonCN": reason,
                "id":id,
            }
        }).then((result) => {
            if (result.data.editsubwork.status) {
                this.insertedit(it_C)
            } else {
                console.log("no")
            }
        }).catch((err) => {
            console.log(err)
        });
    }

    insertedit = (it_C) => {
        console.log("insertedit")
        this.props.client.mutate({
            mutation: insertedit,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id,
                "itemCode": it_C,
            }
        }).then((result) => {
            if (result.data.insertedit.status) {
                console.log("yes")
            } else {
                console.log("no")
            }
        }).catch((err) => {
            console.log(err)
        });
    }

    tracking = () => {
        console.log("tracking")

        this.props.client.mutate({
            mutation: tracking,
            variables: {
                "invoice": this.props.navigation.state.params.id,
                "status": "9",
                "messengerID": global.NameOfMess,
                "lat": this.state.latitude,
                "long": this.state.longitude,
            }
        }).then((result) => {
            console.log("Tracking ", result.data.tracking.status)
            this.props.navigation.state.params.refresion()
            this.props.navigation.goBack()
        }).catch((err) => {
            console.log("ERR OF TRACKING", err)
        });
    }

    _renderButton = (text, onPress) => (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.button}>
                <Text>{text}</Text>
            </View>
        </TouchableOpacity>
    );

    _renderModalContent = () => (
        <View style={styles.modalContent}>
            <Text style={{ fontSize: 16, fontWeight: '900' }}>สาเหตุที่แก้ไขรายการ</Text>
            <Form style={{ width: Dimensions.get('window').width / 1.3 }}>
                <Textarea
                    rowSpan={5}
                    bordered
                    placeholder="เหตุผล..."
                    maxLength={255}
                    keyboardType='default'
                    onChangeText={(text) => this.setState({ reason: text })}
                />
            </Form>
            <View style={{ flexDirection: 'row' }}>
                {this._renderButton('ยกเลิก', () => this.setState({ visibleModal: null }))}
                {this._renderButton('ตกลง', () => {
                    this.state.text_arr.map((p, i) => {
                        if (p != '') {
                            this.editsubwork(parseInt(p), this.state.item_arr[i], this.state.reason,this.state.id[i])
                        }
                        console.log(i)
                        this.setState({ visibleModal: null })
                        this.tracking()
                        // navigator.geolocation.getCurrentPosition(
                        //     (position) => {
                        //         console.log("wokeeey");
                        //         console.log(position);
                        //         this.setState({
                        //             latitude: position.coords.latitude,
                        //             longitude: position.coords.longitude,
                        //             error: null,
                        //         }, () => {
                        //             this.tracking()
                        //         });
                        //     },
                        //     (error) => this.setState({ error: error.message }),
                        //     { enableHighAccuracy: true, timeout: 15000, maximumAge: 3000 },
                        // );
                    })
                })}
            </View>
        </View>
    );

    render() {

        const { navigate } = this.props.navigation

        return (

            <Container>
                <Header style={{ backgroundColor: '#66c2ff' }}>
                    <Left>
                        <Button transparent
                            onPress={() => navigate('DetailWork')}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>แก้ไขรายละเอียด</Title>
                    </Body>
                    <Right />
                </Header>

                <Content style={{ backgroundColor: 'white' }}>

                    <View style={{ margin: 10 }}>
                        <Text style={{ fontWeight: 'bold', color: 'black' }}>รหัสบิล : {this.props.navigation.state.params.id}</Text>
                    </View>

                    <View style={{ justifyContent: 'space-around', flexDirection: 'row' }}>

                        <View style={{ width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>ชื่อ</Text>
                        </View>
                        <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>จำนวนตามบิล</Text>
                        </View>
                        <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>จำนวนที่CN</Text>
                        </View>

                    </View>

                    <View>
                        {
                            this.state.showWorkEdit.map((l, i) => (
                                <View style={{ flexDirection: 'row' }}>

                                    <View style={{ width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{paddingLeft: 5}}>{i+1}.) {l.itemName}</Text>
                                    </View>
                                    <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text>{l.qty}</Text>
                                    </View>
                                    <Item style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', alignItems: 'center' }}>
                                        <Input keyboardType='numeric'
                                            placeholder={l.qtyCN.toString()}
                                            placeholderTextColor="gray"
                                            underlineColorAndroid='white'
                                            value={this.state.inputvalue[i]}
                                          //value = {this.state.testset}
                                            onChangeText={
                                                (text) => {
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
                                                    }
                                                    else {
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
                                                            id:line
                                                        })

                                                    }
                                                }
                                            } />
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
                                width: 200,
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
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>ยืนยันการแก้ไข</Text>
                        </Button>
                    </View>
                </Footer>
            </Container>

        )

    }
}

// onPress={() => {
//     if (this.state.text_arr.length == 0) {
//         console.log("null")
//         console.log("ARRAY_TEXT", this.state.text_arr)
//         console.log("ARRAY_ITEM", this.state.item_arr)
//     }
//     else {
//         console.log("notnull")

//         console.log("ARRAY_TEXT", this.state.text_arr)
//         console.log("ARRAY_ITEM", this.state.item_arr)
//         this.state.text_arr.map(p => {
//             if(p == '')
//             {
//                 console.log("yes '' ")
//             }
//         })
//     }
// }}

// if (this.state.text_arr.length == 0) {
//     this.setState({ promptVisible: false });
// } else {
//     this.state.text_arr.map((p,i) => {
//         // if (p != '') {
//         //     this.editsubwork(parseInt(p),this.state.item_arr[i])
//         // }
//         console.log(i)
//     })
// }

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
        padding: 12,
        margin: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
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