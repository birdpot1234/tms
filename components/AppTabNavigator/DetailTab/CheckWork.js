import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, TouchableOpacity } from 'react-native'
import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer } from 'native-base';
import { gql, withApollo, compose } from 'react-apollo'

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
        this.props.client.resetStore();
      //  this.checkwork();
        this.datailwork();
        this.datailsum();
    }


    checkpending = () => {
      
        const { navigate } = this.props.navigation
        
        this.props.client.query({
            query: selectpendingwork,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
       
            console.log(result.data.selectpendingwork.status)
            if(result.data.selectpendingwork.status){
                Alert.alert(
                    'คุณยังมีงานที่ยังค้างการส่งหรือยังไม่สรุปยอด',
                    'คุณต้องการเคลียงานเก่า?',
                    [
    
                    
                        { text: 'ใช่', onPress: () => navigate("Search") },
                    ]
                )
                navigate("Search")
            }
            else{
             
                    this.GET_LOCATE()
              
            }
          
        }).catch((err) => {
            console.log(err)
        });
       
    }

    GET_LOCATE = () => {
        this.confirmworksome();
        // navigator.geolocation.getCurrentPosition(
        //     (position) => {
        //         console.log("wokeeey");
        //         console.log(position);
        //         this.setState({
        //             latitude: position.coords.latitude,
        //             longitude: position.coords.longitude,
        //             error: null,
        //         }, () => this.confirmworksome());
        //     },
        //     (error) => this.setState({ error: error.message }),
        //     { enableHighAccuracy: true, timeout: 15000, maximumAge: 3000 },
        // );
    }

    datailwork = () => {
        this.props.client.query({
            query: selectDetailWork_DL,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id
            }
        }).then((result) => {
            console.log()
            this.setState({
                ShowData: result.data.selectDetailWork_DL
            })
            console.log(this.state.ShowData)
            // console.log(this.state.ShowData)
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
            this.setState({
                ShowSUM: result.data.selectsum_DL
            })
            // console.log(this.state.ShowSUM)
        }).catch((err) => {
            console.log(err)
        });
    }

    confirmworksome = () => {
        // const { navigate } = this.props.navigation
        console.log("confirmworksome")
console.log(this.props.navigation.state.params.id)

        this.props.client.mutate({
            mutation: confirmworksome_DL,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id,
                "numBox":this.props.navigation.state.params.NumBox,
                "MessengerID":global.NameOfMess
            }
        }).then((result) => {
            if (result.data.confirmworksome_DL.status) {
                this.tracking()
                console.log(result.data.confirmworksome_DL.status)
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

    tracking = () => {
        console.log("tracking")
        // console.log(this.props.navigation.state.params.id)

        this.props.client.mutate({
            mutation: tracking_DL,
            variables: {
                "invoice": this.props.navigation.state.params.id,
                "status": "5",
                "messengerID": global.NameOfMess,
                "lat": this.state.latitude,
                "long": this.state.longitude,
                "box":this.props.navigation.state.params.NumBox
            }
        }).then((result) => {
            console.log("Tracking ", result.data.tracking_DL.status)
            this.props.navigation.state.params.refresion()
            this.props.navigation.goBack()
        }).catch((err) => {
            console.log("ERR OF TRACKING", err)
        });
    }

    render() {

        const { navigate } = this.props.navigation

        return (

            <Container>
                <Header style={{ backgroundColor: '#66c2ff' }}>
                    <Left>
                        <Button transparent
                            onPress={() => navigate('Home')}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>รายละเอียด</Title>
                    </Body>
                    <Right />
                </Header>

                <Content>

                    <View style={{ margin: 10 }}>
                        <Text style={{ fontWeight: 'bold', color: 'black' }}>รหัสบิล: {this.props.navigation.state.params.id}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', width: Dimensions.get('window').width, borderBottomColor: 'gray', borderBottomWidth: 0.5 }}>

                        <View style={{ width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>ชื่อ</Text>
                        </View>

                        <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>จำนวน</Text>
                        </View>
                        <View style={{ width: Dimensions.get('window').width / 4, right: 0, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>ราคา</Text>

                        </View>


                    </View>

                    <View>

                        {
                            this.state.ShowData.map((l, i) => (

                                <View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: Dimensions.get('window').width / 2, justifyContent: 'center' }}>
                                            <Text style={{ paddingLeft: 5 }}>{i + 1}). {l.itemName}</Text>
                                        </View>
                                        <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ fontWeight: 'bold' }}>{l.qty}</Text>
                                        </View>
                                        <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', right: 5 }}>

                                            <Text style={{ fontWeight: 'bold', color: 'orange', right: 5, alignSelf: 'flex-end' }}>{l.amount} ฿</Text>

                                        </View>

                                    </View>

                                </View>

                            ))
                        }

                        <View style={{ borderTopWidth: 0.5, borderTopColor: 'gray' }}>
                            {
                                this.state.ShowSUM.map((l, i) => (
                                    // <View style={{ margin: 30, marginTop: 5, justifyContent: 'center' }}>
                                    //     <Text style={{ fontWeight: 'bold' }}>ราคาทั้งหมด : </Text>
                                    //     <Text>หมายเหตุ :  </Text>
                                    // </View>
                                    <View style={{ marginTop: 25 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ width: Dimensions.get('window').width / 3, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ fontWeight: 'bold' }}>ราคาทั้งหมด : </Text>
                                            </View>
                                            <View style={{ width: Dimensions.get('window').width / 3, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ color: 'orange', fontWeight: 'bold' }}> {l.SUM} ฿</Text>
                                            </View>
                                        </View>
                                        <View style={{ margin: 26, marginTop: 5, justifyContent: 'center' }}>
                                            <Text style={{ fontWeight: 'bold' }}>หมายเหตุ :  </Text>
                                        </View>
                                    </View>
                                ))
                            }
                        </View>
                    </View>

                </Content>
                <TouchableOpacity onPress={
                    () => Alert.alert(
                        'ตรวจงานนี้',
                        'คุณต้องการยืนยันการตรวจงานนี้?',
                        [
                            { text: 'ไม่', onPress: () => console.log("no") },
                            { text: 'ใช่', onPress: () => this.checkpending() },
                        ]
                    )
                }>
                    <Footer style={{
                        backgroundColor: '#ff6c00',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} >

                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>ยืนยันการตรวจงาน</Text>


                    </Footer>
                </TouchableOpacity>
            </Container>

        )

    }

}

// export default CheckWork;

const GraphQL = compose(CheckWork)
export default withApollo(GraphQL)


const datailwork = gql`
    query datailwork($invoiceNumber:String!){
        datailwork(invoiceNumber: $invoiceNumber){
            invoiceNumber
            itemCode
            itemName
            qty
            amount
            priceOfUnit
            amountbox
            Note
        }
    }
`

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
const datailsum = gql`
    query datailsum($invoiceNumber:String!){
        datailsum(invoiceNumber: $invoiceNumber){
            SUM
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
const confirmworksome = gql`
    mutation confirmworksome($invoiceNumber:String!){
        confirmworksome(invoiceNumber: $invoiceNumber){
            status
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
const selectpendingwork = gql`
        query selectpendingwork($MessengerID:String!){
            selectpendingwork(MessengerID: $MessengerID){
                    status
               }
                }
            `

const styles = StyleSheet.create({})
