import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, ScrollView, TouchableOpacity,Linking,ActivityIndicator } from 'react-native'
import { gql, withApollo, compose } from 'react-apollo'
import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, Input, Item, Grid, Col, ActionSheet, Badge } from 'native-base';
import Communications from 'react-native-communications';
import buttomcustomer from '../testComponent/customButton'
import customButton from '../testComponent/customButton';
import Geocoder from 'react-native-geocoding';
// var BUTTONS = [
//     { text: "ลูกค้ากดผิด", icon: "md-arrow-dropright", iconColor: "#2c8ef4", status: "B1" },
//     { text: "ร้านปิด", icon: "md-arrow-dropright", iconColor: "#f42ced", status: "B2" },
//     { text: "Order ซ้ำ", icon: "md-arrow-dropright", iconColor: "#ea943b", status: "B3" },
//     { text: "สินค้าผิด", icon: "md-arrow-dropright", iconColor: "#fa213b", status: "B4" },
//     { text: "เซลล์ key ผิด", icon: "md-arrow-dropright", iconColor: "#2c8ef4", status: "B5" },
//     { text: "ลูกค้าสั่งร้านอื่นมาแล้ว", icon: "md-arrow-dropright", iconColor: "#f42ced", status: "B6" },
//     { text: "เซลล์บอกราคาลูกค้าผิด", icon: "md-arrow-dropright", iconColor: "#ea943b", status: "B7" },
//     { text: "Cancel", icon: "close", iconColor: "#25de5b" }
// ];
//var CANCEL_INDEX = 9;

class DetailWork extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            showDetailWork: [],
            latitude: 1,
            longitude: 1,
            error: null,
            ShowMomey: [],
            showTel: "",
            statusEdit: 0,
            BUTTONS:[],
            CANCEL_INDEX:null,
            Amount_CNZ:0,
            SumAmount:0,
            load:false,
        }
        this.props.client.resetStore();
        this.log();
        this.subDetail();
        this.summoneydetail();
        this.submitedit();
        this.reason();
        this.AmountCN();
        this.CN_Price();
    }

    _RELOAD_DETAILWORK = () => {
        this.props.client.resetStore();
        this.subDetail();
        this.summoneydetail();
        this.submitedit();
        this.AmountCN();
        this.CN_Price();
    }

    _RELOAD_TO_GOBACK = () => {
        this.props.navigation.state.params.refresion()
        this.props.navigation.goBack()
    }
    log = () => {
            console.log('15615115315151515135135151513')
    }

    reason = () => {
        console.log('worksub')
    
        this.props.client.query({
          query: reasonfail,
          variables: {
            "MessengerID": global.NameOfMess
          }
        }).then((result) => {
          console.log("workSub.................")
          console.log(result.data.reasonfail)
          this.setState({
            BUTTONS: result.data.reasonfail,
            CANCEL_INDEX:result.data.reasonfail.length-1

          })
          console.log(this.state.BUTTONS)
        }).catch((err) => {
          console.log(err)
        });
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
            // console.log( result.data.subDetail)
        }).catch((err) => {
            console.log(err)
        });
    }

    submitwork = (s) => {
        if(s =='B8')
    {

      this.props.client.mutate({
        mutation: Blacklist,
        variables: {
          "status": s,
          "invoice": this.props.navigation.state.params.id,
          "messengerID":global.NameOfMess
        }
      }).then((result) => {
        console.log(result.data.Blacklist.status)
      }).catch((err) => {
        console.log("err of submitwork", err)
      });
    

    }
        this.props.client.mutate({
            mutation: submitwork,
            variables: {
                "status": s,
                "invoiceNumber": this.props.navigation.state.params.id
            }
        }).then((result) => {
            this.submiitdetail(s)
        }).catch((err) => {
            console.log("err of submitwork", err)
        });
    }

    submiitdetail = (s) => {
        this.props.client.mutate({
            mutation: submiitdetail,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id
            }
        }).then((result) => {
            this.tracking(s, 1)
            // navigator.geolocation.getCurrentPosition(
            //     (position) => {
            //         console.log("wokeeey");
            //         console.log(position);
            //         this.setState({
            //             latitude: position.coords.latitude,
            //             longitude: position.coords.longitude,
            //             error: null,
            //         }, () => this.tracking(s, 1));
            //     },
            //     (error) => this.setState({ error: error.message }),
            //     { enableHighAccuracy: true, timeout: 15000, maximumAge: 3000 },
            // );
        }).catch((err) => {
            console.log("err of submiitdetail", err)
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
            // console.log(this.state.ShowSUM)
        }).catch((err) => {
            console.log(err)
        });
    }
    AmountCN = () => {
        this.props.client.query({
            query: AmountCN,
            variables: {
                "Invoice": this.props.navigation.state.params.id
            }
        }).then((result) => {
            this.setState({
                SumAmount: result.data.AmountCN[0].Sum_Amount
            })
            // console.log(this.state.ShowSUM)
        }).catch((err) => {
            console.log(err)
        });
    }
    CN_Price = () => {
        this.props.client.query({
            query: CN_Price,
            variables: {
                "Invoice": this.props.navigation.state.params.id
            }
        }).then((result) => {
            this.setState({
                Amount_CNZ: result.data.CN_Price[0].Amount_CN
            })
            // console.log(this.state.ShowSUM)
        }).catch((err) => {
            console.log(err)
        });
    }
    telCustomer = () => {
        this.props.client.query({
            query: telCustomer,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id,
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            this.setState({
                showTel: result.data.telCustomer[0].telCustomer
            }, () => {
                Communications.phonecall(this.state.showTel, true)
            })

            // console.log( result.data.telCustomer)
        }).catch((err) => {
            console.log(err)
        });
    }
    tracking = (s, n) => {
        console.log("tracking")

        this.props.client.mutate({
            mutation: tracking,
            variables: {
                "invoice": this.props.navigation.state.params.id,
                "status": s,
                "messengerID": global.NameOfMess,
                "lat": this.state.latitude,
                "long": this.state.longitude,
            }
        }).then((result) => {
            if (n == 1) {
                this.props.navigation.state.params.refresion()
                this.props.navigation.goBack()
            }
            else if (n == 2) {

                this.telCustomer();

            }
            else {
                console.log("Tracking ", result.data.tracking.status)
            }
        }).catch((err) => {
            console.log("ERR OF TRACKING", err)
        });
    }

    submitedit = () => {
        this.props.client.query({
            query: submitedit,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id,
            }
        }).then((result) => {
            if (result.data.submitedit.status) {
                this.setState({
                    statusEdit: 1
                })
            } else {
                this.setState({
                    statusEdit: 0
                })
            }

        }).catch((err) => {
            console.log("err of submitedit", err)
        });
    }
    checkfordel = ()=>{
        this.props.client.query({
            query: 	countinv_DL,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id,
                "MessengerID": global.NameOfMess,
            }
        }).then((result) => {
             if (result.data.countinv_DL[0].count_inv>1) {
                this.delinvoice()
             } else {
                Alert.alert(
                    "ไม่สามารถลบได้",
                    "ลบไม่ได้เนื่องจากบิลนี้มีเพียง "+result.data.countinv_DL[0].count_inv+" บิล",
                    [
                        
                        { text: "OK", onPress: () => console.log('') }
                    ]
                )
             }
          //  console.log(result.data.countinv_DL[0].count_inv)

        }).catch((err) => {
            console.log("err of submitedit", err)
        });
    }
    delinvoice =() =>{
        console.log('del',this.props.navigation.state.params.id)
        console.log('id',this.props.navigation.state.params.index)
        this.props.client.mutate({
            mutation: delinvoice,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id,
                "id": this.props.navigation.state.params.index,
              
            }
        }).then((result) => {
          
                this.props.navigation.state.params.refresion()
                this.props.navigation.goBack()
            
              //  this.telCustomer();

         
        }).catch((err) => {
            console.log("ERR OF TRACKING", err)
        });
    }
    getToken(address) {
        this.setState({
           
            load:true
           
         })
        return fetch('http://dplus-system.com:3499/tms/api/token')
          .then((response) => response.json())
          .then((responseJson) => {
           console.log(responseJson.res.status.status_desc[0].APIKey);
           this.getMap(address,responseJson.res.status.status_desc[0].APIKey)
          })
          .catch((error) => {
            Alert.alert(
                "กรุณาลองใหม่อีกครั้ง",
                "",
                [
                
                    { text: "รับทราบ", onPress: () => this.errorMap() }
                ]
            )
          });
      }
    errorMap=()=>{
        this.setState({
           
            load:false
           
         })
         
    }
      
    getMap=(address,apiKey)=>{
        Geocoder.init(apiKey); // use a valid API key
        Geocoder.from(address)
		.then(json => {
            var location = json.results[0].geometry.location;
            console.log(address)
            console.log(location);
            this.setState({
           
                load:false
               
             })
            Linking.openURL('geo:37.7749,-122.4194?q='+location.lat+','+location.lng+' ')

            
		})
        .catch(error => 
           // console.warn("error",error)
          
                Alert.alert(
                 "ที่อยู่จัดส่งไม่ชัดเจน",
                 "กรุณาแจ้ง IT ตรวจสอบ",
                 [
                 
                     { text: "รับทราบ", onPress: () => this.errorMap() }
                 ]
             )
     )
    }


    render() {

        const { navigate } = this.props.navigation

        return (

            <Container>
                <Header style={{ backgroundColor: '#66c2ff' }}>
                    <Left>
                        <Button transparent
                            onPress={() => { navigate('Search') }}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>รายละเอียด</Title>
                    </Body>
                    <Right />
                </Header>
                <View style={[styles.container, styles.horizontal]}>
                    {

                        this.state.load ?
                            <ActivityIndicator size="small" color="#00ff00" />
                            :


                            <View />

                    }
                </View>


                <Content>

                    <View style={{ margin: 10 }}>

                        <Text>รหัสบิล : {this.props.navigation.state.params.id}</Text>
                        <Text >ห้าง : {this.props.navigation.state.params.Zone} </Text>
                        <Text >ชื่อลูกค้า : {this.props.navigation.state.params.Cusname} </Text>
                        <TouchableOpacity  onPress={() => this.getToken(this.props.navigation.state.params.address)}>
                         <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#4682b4' }}>ที่อยู่ : {this.props.navigation.state.params.address}  <Icon name='md-locate' style={{ color: "red",marginTop:5 }}  /> </Text>
                         </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', width: Dimensions.get('window').width, borderBottomColor: 'gray', borderBottomWidth: 0.5 }}>

                        <View style={{ width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>ชื่อ</Text>
                        </View>

                        <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>จำนวน</Text>
                        </View>
                        <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>ราคา</Text>

                        </View>

                    </View>

                    <View>
                        {
                            this.state.showDetailWork.map((l, i) => (
                                <View style={{ flexDirection: 'row' }}>

                                    <View style={{ width: Dimensions.get('window').width / 2 }}>
                                        <Text style={{ paddingLeft: 5 }}>{i + 1}). {l.itemName}</Text>
                                    </View>
                                    <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text>{l.qty - l.qtyCN}</Text>
                                    </View>
                                    <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', right: 5 }}>
                                        <Text style={{ fontWeight: 'bold', color: 'orange', right: 5, alignSelf: 'flex-end' }}>{l.amountedit} ฿</Text>
                                    </View>
                                </View>
                            ))
                        }
                    </View>
                    <View style={{ borderTopWidth: 0.5, borderTopColor: 'gray', left: 10 }}>
                        {
                            this.state.ShowMomey.map((l, i) => (
                                <View style={{ marginTop: 20 }} >
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: Dimensions.get('window').width / 3 }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>ราคาทั้งหมด : </Text>
                                        </View>
                                        <View style={{ width: Dimensions.get('window').width / 3, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: 'orange', fontWeight: 'bold', fontSize: 17 }}> {l.SUM} ฿</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: Dimensions.get('window').width / 3 }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 17,color:"red" }}>ราคาส่วนลด : </Text>
                                        </View>
                                        <View style={{ width: Dimensions.get('window').width / 3, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: 'orange', fontWeight: 'bold', fontSize: 17,color:"red" }}> {this.state.Amount_CNZ} ฿</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: Dimensions.get('window').width / 3 }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 17,color:"#229954" }}>ราคาสุทธิ : </Text>
                                        </View>
                                        <View style={{ width: Dimensions.get('window').width / 3, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: 'orange', fontWeight: 'bold', fontSize: 17,color:"#229954" }}>  {this.state.SumAmount} ฿</Text>
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 5, justifyContent: 'center' }}>
                                        <Text style={{ fontWeight: 'bold' }}>หมายเหตุ :  </Text>
                                    </View>
                                </View>
                            ))
                        }
                    </View>

                    <View style={{ left: 10, marginTop: 10 }}>
                        {
                            (() => {
                                if (this.state.statusEdit == 1) {
                                    return (
                                        <Badge warning style={{ alignItems: 'center', justifyContent: 'center' }} >
                                            <Text style={{ fontSize: 14, color: 'white', fontWeight: 'bold' }}>***บิลนี้มีการแก้ไข***</Text>
                                        </Badge>
                                    )
                                }
                            })()
                        }
                    </View>
               

                </Content>

                <Footer style={{ height: 200 }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                    }}>
                        <TouchableOpacity onPress={() => {
                                   Alert.alert(
                                    "ยืนยันที่จะลบงานนี้ออก",
                                    "ลบงานเนื้องจากงานซ้ำหรือมียอดบิลไม่ตรง",
                                    [
                                        {
                                            text: "ไม่", onPress: () =>
                                             console.log('NO')
                                        },
                                        { text: "ใช่", onPress: () => this.checkfordel() }
                                    ]
                                )
                        }}>
                            <View style={{
                                width: Dimensions.get('window').width / 2,
                                height: 100, backgroundColor: '#FFBC66', justifyContent: 'center', alignItems: 'center'
                            }} >
                                <Image source={require('../../../assets/icon/recyclebin.png')}
                                    style={{ width: 70, height: 70 }} />
                                <Text style={{ fontWeight: 'bold', marginTop: 2 }}>ลบบิลเบิ้ล</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigate('EditItem', { id: this.props.navigation.state.params.id, refresion: this._RELOAD_DETAILWORK })} >
                            <View style={{
                                width: Dimensions.get('window').width / 2,
                                height: 100, backgroundColor: '#FFFD66', justifyContent: 'center', alignItems: 'center'
                            }} >
                                <Image source={require('../../../assets/icon/clam.png')}
                                    style={{ width: 70, height: 70 }} />
                                <Text style={{ fontWeight: 'bold', marginTop: 2 }}>แก้ไขรายการ</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                    }}>
                        <TouchableOpacity onPress={() =>  navigate('CNDetail',{id:this.props.navigation.state.params.id, refresion: this._RELOAD_DETAILWORK })} >
                            <View style={{ width: Dimensions.get('window').width / 2, height: 100, backgroundColor: '#66FFB3', justifyContent: 'center', alignItems: 'center' }} >
                                <Image source={require('../../../assets/icon/check.png')}
                                    style={{ width: 70, height: 70 }} />
                                <Text style={{ fontWeight: 'bold', marginTop: 2 }}>CN</Text>
                            </View>
                        </TouchableOpacity>

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
                                                        options: this.state.BUTTONS,
                                                        cancelButtonIndex: this.state.CANCEL_INDEX,
                                                        title: "รายงานการส่ง"
                                                    },
                                                    buttonIndex => {
                                                        this.submitwork(this.state.BUTTONS[buttonIndex].status)
                                                    }
                                                )
                                        },
                                        { text: "ใช่", onPress: () => navigate("SubmitJob", { id: this.props.navigation.state.params.id,PAYMMODE:this.props.navigation.state.params.PAYMMODE, refresion: this._RELOAD_TO_GOBACK }) }
                                    ]
                                )
                            }
                        >
                            <View style={{ width: Dimensions.get('window').width / 2, height: 100, backgroundColor: '#FFA566', justifyContent: 'center', alignItems: 'center' }} >
                                <Image source={require('../../../assets/icon/file.png')}
                                    style={{ width: 70, height: 70 }} />
                                <Text style={{ fontWeight: 'bold', marginTop: 2 }}>ส่งงาน</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Footer>
            </Container>

        )

    }
}
const styles = StyleSheet.create({
    signature: {
        flex: 1,
        borderColor: '#000033',
        borderWidth: 0.5,
    },
    buttonStyle: {
        flex: 1, justifyContent: "center", alignItems: "center", height: 50,
        backgroundColor: "#eeeeee",
        margin: 50
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
      }
});

const GraphQL = compose(DetailWork)

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
const countinv_DL = gql`
    query countinv_DL($invoiceNumber:String!,$MessengerID:String!){
        countinv_DL(invoiceNumber: $invoiceNumber,MessengerID: $MessengerID){
            count_inv
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

const AmountCN = gql`
    query AmountCN($Invoice:String!){
        AmountCN(Invoice: $Invoice){
            Sum_Amount
        }
    }
`
const CN_Price = gql`
    query CN_Price($Invoice:String!){
        CN_Price(Invoice: $Invoice){
            Amount_CN
        }
    }
`
const telCustomer = gql`
    query telCustomer($invoiceNumber:String!, $MessengerID:String!){
        telCustomer(invoiceNumber: $invoiceNumber, MessengerID: $MessengerID){
            telCustomer
        }
    }
`
const submitwork = gql`
    mutation submitwork($status:String!, $invoiceNumber:String!){
        submitwork(status: $status, invoiceNumber: $invoiceNumber){
            status
        }
    }
`

const submiitdetail = gql`
    mutation submiitdetail($invoiceNumber:String!){
        submiitdetail(invoiceNumber: $invoiceNumber){
            status
        }
    }
`

const delinvoice = gql`
    mutation delinvoice($invoiceNumber:String!,$id:String!){
        delinvoice(invoiceNumber: $invoiceNumber,id:$id){
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
const Blacklist = gql`
          mutation Blacklist(
              $invoice:String!,
              $status:String!,
              $messengerID:String!
           
    ){
          Blacklist(
          invoice: $invoice,
          status: $status,
          messengerID: $messengerID
         ){
            status
          }
          }
      `
const reasonfail = gql`
    query reasonfail($MessengerID:String!){
      reasonfail(MessengerID: $MessengerID){
        
        text
        icon
        iconColor
        status
      }
  }
`