import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, ScrollView, TouchableOpacity,CheckBox,ActivityIndicator } from 'react-native'
import { gql, withApollo, compose } from 'react-apollo'
import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, Input, Item, Grid, Col } from 'native-base';
import SignatureCapture from 'react-native-signature-capture';
import Moment from 'moment';
class SubmitAll_TSC extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            latitude: 1,
            longitude: 1,
            error: null,
            sig_status:false,
            status_CHECKBOX: false,
            date:Moment(new Date).format('d-MM-YYYY'),
            time:Moment(new Date).format('h-mm-ss'),
            statuspic:false,
            inv:null,
            load:false,
        }
        
        this.props.client.resetStore();
        //this.getlalong();
    }

    getlalong = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log("wokeeey");
                console.log(position);
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                })
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 3000 },
        );
    
    }

    submitedit = (INVOICE, i) => {
        console.log(i)
        console.log('In save sign')
        console.log('INV',INVOICE);
        console.log(i)
        
        var name = global.NameOfMess+"_"+this.state.date+"_"+this.state.time
        var filename = name+'.png'
      
        if(!this.state.statuspic){
           // this.signComponent.saveImage();
             this.setState({
                statuspic:true,
              //  load:true,
             })
             this.saveSign()

        }
        this.submitwork("A1", INVOICE, i)
        this.submit_inv(INVOICE,filename)
     //   this.submitwork("A1", INVOICE, i)
     //   this.submit_inv(INVOICE,filename)
        // console.log("submitedit")
        // this.props.client.query({
        //     query: submitedit_CN,
        //     variables: {
        //         "invoiceNumber": INVOICE
        //     }
        // }).then((result) => {
     
        //       this.submitwork("A1", INVOICE, i)
        //       this.submit_inv(INVOICE,filename)
            
        // }).catch((err) => {
        //     console.log(err)
        // });
    }
    submit_inv =(INVOICE,filename) =>{
        var www = "http://www.dplus-system.com:3401/upload/"
        var url = www+filename
        console.log(INVOICE)
        console.log(url)
        this.props.client.mutate({
            mutation: submit_inv,
            variables: {
                
                "invoiceNumber": INVOICE,
                "filename":url
            }
        }).then((result) => {
           console.log("success",INVOICE)
        }).catch((err) => {
            console.log("err of submitwork", err)
        });
    }
    submitwork = (s, INVOICE, i) => {
        // var payType =null
        // payType = (this.state.status_CHECKBOX)?"Transfer":"Cash"
         this.props.client.mutate({
             mutation: submit_TSC,
             variables: {
                 "TSC": INVOICE,
                 "status_work": s
             }
         }).then((result) => {
            this.tracking(s, INVOICE, i)
            // const { navigate } = this.props.navigation
            // console.log(result.data.submit_TSC.status)
            //  if(!result.data.submit_TSC.status)
            //  {
            //      Alert.alert(
            //          "ส่งไม่สำเร็จ",
            //          "กรุณากดส่งใหม่อีกครั้ง",
            //      )
            //  }
            //  else{
                 //console.log('edit success',INVOICE)
             //   this.tracking(s, INVOICE, i)
                // if (i == 0) {
                //     console.log("Tracking ", result.data.submit_TSC.status)
                // } else if (i == 1) {
                //     //console.log("refresionTO",i)
                //     {navigate('AddMediaTab',{refresionTO:this.props.navigation.state.params.refresionTO()})}
                //     // onPress={() => navigate('DetailWork', { id: l.invoiceNumber, Zone: l.Zone, address: l.addressShipment, Cusname: l.DELIVERYNAME, refresion: this._RELOAD_MAIN2 })}
                //     // this.props.navigation.state.params.refresionTO()
                //     // this.props.navigation.goBack()
                // }
                //this.props.navigation.state.params.refresionTO()
                //this.props.navigation.goBack()
           //  }
            // this.submiitdetail(s)
         }).catch((err) => {
             console.log("err of submitwork", err)
         });
     }

 
    tracking = (s,INVOICE, i) => {
        console.log("tracking")

        this.props.client.mutate({
            mutation: tracking_CN,
            variables: {
                "invoice": INVOICE,
                "status": s,
                "messengerID": global.NameOfMess,
                "lat": this.state.latitude,
                "long": this.state.longitude,
            }
        }).then((result) => {
            const { navigate } = this.props.navigation
            console.log("Tracking ", result.data.tracking_CN.status)
            if(!result.data.tracking_CN.status)
            {
                Alert.alert(
                    "ส่งไม่สำเร็จ",
                    "กรุณากดส่งใหม่อีกครั้ง",
                )
            }
            else{
                if (i == 0) {
                    console.log("Tracking ", result.data.submit_TSC.status)
                } else if (i == 1) {
                    this.setState({
                       
                        load:true,
                     })
                    {navigate('AddMediaTab',{refresionTO:this.props.navigation.state.params.refresionTO()})}
                    
                }
            }
      
        }).catch((err) => {
            console.log("ERR OF TRACKING", err)
        });
    }
  


    // tracking = (s, INVOICE, i) => {
    //     console.log("tracking")

    //     this.props.client.mutate({
    //         mutation: tracking,
    //         variables: {
    //             "invoice": INVOICE,
    //             "status": s,
    //             "messengerID": global.NameOfMess,
    //             "lat": this.state.latitude,
    //             "long": this.state.longitude,
    //         }
    //     }).then((result) => {
    //         if (i == 0) {
    //             console.log("Tracking ", result.data.tracking.status)
    //         } else if (i == 1) {
    //             console.log("refresionTO")
    //             this.props.navigation.state.params.refresionTO()
    //             this.props.navigation.goBack()
    //         }
    //     }).catch((err) => {
    //         console.log("ERR OF TRACKING", err)
    //     });
    // }
    pic =()=>{

        const part = 'file:///storage/emulated/0/saved_signature/signature.png'
        const name = global.NameOfMess+"_"+this.state.date+"_"+this.state.time
        const fileName =name+'.png'
        // const part1 = source= require('../assets/icon/newspaper.png')
        var photo = {
            uri: part,
            type: 'image/png',
            name: fileName,
            size: 500,
          };
          var form = new FormData();
          form.append("productImage", photo);
          form.append("inv",this.props.navigation.state.params.id);

         fetch('http://www.dplus-system.com:3401/upload', {
         method: 'POST',
         headers: {
           Accept: 'application/json',
           'Content-Type': 'multipart/form-data',
         },
        //  body: JSON.stringify({
        //    inv: 'eiei',
        //    productImage: resw,
        //  }),
        
        body: form,
       }).then((response) => response.json())
           .then((responseJson) => {
             console.log('eiei')
            // this.insert_inv(fileName)
           })
           .catch((error) => {
             console.error(error);
           });
       
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
                        <Title>ยืนยันการส่งงาน</Title>
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
                 <View style={{ flex: 1, flexDirection: "column" }}>
                {/* <Text style={{alignItems:"center",justifyContent:"center"}}>Signature Capture Extended555 </Text> */}
                <SignatureCapture
                    style={[{flex:1},styles.signature]}
                   // ref="sign"
                    ref= {sign => this.signComponent = sign}
                    onSaveEvent={this._onSaveEvent}
                    onDragEvent={this._onDragEvent}
                    saveImageFileInExtStorage={true}
                    showNativeButtons={false}
                    showTitleLabel={false}
                    viewMode={"portrait"}/>

                {/* <View style={{ flex: 1, flexDirection: "row" }}>
                    <TouchableHighlight style={styles.buttonStyle}
                        onPress={() => { this.saveSign() } } >
                        <Text>Save</Text>
                    </TouchableHighlight>

                    <TouchableHighlight style={styles.buttonStyle}
                        onPress={() => { this.resetSign() } } >
                        <Text>Reset</Text>
                    </TouchableHighlight>

                </View> */}

            </View>
            {/* <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width, borderBottomColor: 'gray', borderBottomWidth: 0.5, marginBottom: 5 }}>
                        <View style={{ marginLeft: 20 }}>
                            <CheckBox
                                value={this.state.status_CHECKBOX}
                                onValueChange={() => {
                                    this.setState({ status_CHECKBOX: !this.state.status_CHECKBOX })
                                   
                                }} />
                        </View>
                        <Text>ชำระแบบโอน</Text>
                    </View> */}

                <Footer style={{ height: 140 }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                    }}>
                        <TouchableOpacity onPress={() => navigate('')} >
                            <View style={{
                                width: Dimensions.get('window').width / 2, height: 70, backgroundColor: '#FFFD66'
                                , justifyContent: 'center', alignItems: 'center'
                            }}>
                                <Image source={require('../../../assets/icon/photo-camera.png')}
                                    style={{ width: 50, height: 50 }} />
                                <Text style={{ fontWeight: 'bold', marginTop: 2 }}>ถ่ายภาพ</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigate('DetailWork')} >
                            <View style={{
                                width: Dimensions.get('window').width / 2, height: 70, backgroundColor: '#FFBC66'
                                , justifyContent: 'center', alignItems: 'center'
                            }}>
                                <Image source={require('../../../assets/icon/x-button.png')}
                                    style={{ width: 50, height: 50 }} />
                                <Text style={{ fontWeight: 'bold', marginTop: 2 }}>ยกเลิก</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                    }}>
                        <TouchableOpacity onPress={() => { this.resetSign() } } >
                            <View style={{
                                width: Dimensions.get('window').width / 2, height: 70, backgroundColor: '#FFA566'
                                , justifyContent: 'center', alignItems: 'center'
                            }}>
                                <Image source={require('../../../assets/icon/check.png')}
                                    style={{ width: 50, height: 50 }} />
                                <Text style={{ fontWeight: 'bold', marginTop: 2 }}>แก้ไขลายเซ็น</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() =>
                            Alert.alert(
                                "ยืนยันการส่งงาน",
                                "คุณต้องการยืนยันการส่งงานหรือไม่?",
                                [
                                    { text: "ยกเลิก", onPress: () => console.log("Cancle") },
                                    {
                                        text: "ยืนยัน", onPress: () => {
                                            if(!this.state.sig_status){
                                                Alert.alert(
                                                    'คุณยังไม่ได้เซ็น ',
                                                    'กรุณาเซ็น'
                                                   
                                                  )
                                            }
                                            else{
                                            this.props.navigation.state.params.check_box.map((val, i) => {
                                                if ((val == true) && ((i + 1) != this.props.navigation.state.params.check_box.length)) {
                                                   // console.log(this.props.navigation.state.params.in_V[i])
                                                    this.submitedit(this.props.navigation.state.params.in_V[i], 0)
                                                }
                                                else if ((val == true) && ((i + 1) == this.props.navigation.state.params.check_box.length)) {
                                                  
                                                    this.submitedit(this.props.navigation.state.params.in_V[i], 1)
                                                    //console.log(this.props.navigation.state.params.in_V[i])
                                                }
                                            });
                                        }
                                        }
                                    }
                                ]
                            )
                        } >
                            <View style={{
                                width: Dimensions.get('window').width / 2, height: 70, backgroundColor: '#66FFB3'
                                , justifyContent: 'center', alignItems: 'center'
                            }}>
                                <Image source={require('../../../assets/icon/file.png')}
                                    style={{ width: 50, height: 50 }} />
                                <Text style={{ fontWeight: 'bold', marginTop: 2 }}>ยืนยันส่งงาน</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Footer>
            </Container>

        )

    }
    saveSign() {
       console.log('In save sign')
           // console.log(this.signComponent)
            this.signComponent.saveImage();
            this.pic()
           // this.submitedit(INVOICE, i)
      
         
        
        //console.log(this.refs["sign"])
       // const base64String  = `data:image/png;base64,${result.encoded}`;
       // this.setState({image:base64String })
       // this.showlog(1)
    }

    resetSign = () => {
        this.signComponent.resetImage();
      
        this.setState({ sig_status: false})
    }

    _onSaveEvent(result) {
        //result.encoded - for the base64 encoded png
        //result.pathName - for the file path name
        console.log(result);
    }
    _onDragEvent = () => {
         // This callback will be called when the user enters signature
        console.log("dragged");
        //this.setState.sig_status = true;
        this.setState({ sig_status: true})
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
 


const GraphQL = compose(SubmitAll_TSC)
export default withApollo(GraphQL)

const submitwork = gql`
    mutation submitwork($status:String!, $invoiceNumber:String!,$paymentType:String!){
        submitwork(status: $status, invoiceNumber: $invoiceNumber, paymentType: $paymentType){
            status
        }
    }
`
const submitwork2 = gql`
    mutation submitwork2($status:String!, $invoiceNumber:String!,$paymentType:String!){
        submitwork2(status: $status, invoiceNumber: $invoiceNumber, paymentType: $paymentType){
            status
        }
    }
`
const submit_inv = gql`
    mutation submit_inv($invoiceNumber:String!,$filename:String!){
        submit_inv(invoiceNumber: $invoiceNumber, filename: $filename){
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

const submitedit = gql`
    query submitedit($invoiceNumber:String!){
        submitedit(invoiceNumber: $invoiceNumber){
            status
        }
    }
`
const submitedit_CN = gql`
    query submitedit_CN($invoiceNumber:String!){
        submitedit_CN(invoiceNumber: $invoiceNumber){
            status
        }
    }
`
const submit_TSC = gql`
    mutation submit_TSC($TSC:String!,$status_work:String!){
        submit_TSC(TSC: $TSC,status_work: $status_work){
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