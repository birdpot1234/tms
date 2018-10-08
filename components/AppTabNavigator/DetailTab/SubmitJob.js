import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, ScrollView, TouchableOpacity, AppRegistry,TouchableHighlight,CheckBox } from 'react-native'
import { gql, withApollo, compose } from 'react-apollo'
import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, Input, Item, Grid, Col } from 'native-base';
import SignatureCapture from 'react-native-signature-capture';
import Moment from 'moment';
import mainservice from '../../services/mainService'
class SubmitJob extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            latitude: 1,
            longitude: 1,
            error: null,
            image:null,
            sig_status:false,
            partname:null,
            status_CHECKBOX: false,
            date:Moment(new Date).format('d-MM-YYYY'),
            time:Moment(new Date).format('h-mm-ss'),
        }
        this.props.client.resetStore();
    }

    submitedit = () => {
        console.log("submitedit")
        this.props.client.query({
            query: submitedit,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id
            }
        }).then((result) => {
            if (result.data.submitedit.status) {
               this.submitwork("A2")
               // this.submit_inv()
               // console.log('A2')
            } else {
                this.submitwork("A1")
              
               // console.log('A1')
            }
        }).catch((err) => {
            console.log(err)
        });
    }

    submit_inv =() =>{
        var www = "http://www.dplus-system.com:3401/upload/"
        var name = global.NameOfMess+"_"+this.state.date+"_"+this.state.time
        var filename = name+'.png'
        var url = www+filename
        console.log(this.props.navigation.state.params.id)
        console.log(url)
        this.props.client.mutate({
            mutation: submit_inv,
            variables: {
                
                "invoiceNumber": this.props.navigation.state.params.id,
                "filename":url
            }
        }).then((result) => {
           console.log("success",this.props.navigation.state.params.id)
        }).catch((err) => {
            console.log("err of submitwork", err)
        });
    }
    submitwork = (s) => {
        var payType =null
        payType = (this.state.status_CHECKBOX)?"Transfer":"Cash"
        this.props.client.mutate({
            mutation: submitwork,
            variables: {
                "status": s,
                "invoiceNumber": this.props.navigation.state.params.id,
                "paymentType":payType
            }
        }).then((result) => {
          //  this.submit_inv()
            this.submiitdetail(s)
        }).catch((err) => {
            console.log("err of submitwork", err)
        });
    }

    submiitdetail = (s) => {
        console.log("submiitdetail")
        this.props.client.mutate({
            mutation: submiitdetail,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id
            }
        }).then((result) => {
            // navigator.geolocation.getCurrentPosition(
            //     (position) => {
            //         console.log("wokeeey");
            //         console.log(position);
            //         this.setState({
            //             latitude: position.coords.latitude,
            //             longitude: position.coords.longitude,
            //             error: null,
            //         }, () => this.tracking(s));
            //     },
            //     (error) => this.setState({ error: error.message }),
            //     { enableHighAccuracy: true, timeout: 15000, maximumAge: 3000 },
            // );
           // console.log("Tracking ", result.data.tracking.status)
            //this.props.navigation.state.params.refresion()
            //this.props.navigation.goBack()
            this.tracking(s)
        }).catch((err) => {
            console.log("err of submiitdetail", err)
        });
    }


    tracking = (s) => {
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
            console.log("Tracking ", result.data.tracking.status)
            this.props.navigation.state.params.refresion()
            this.props.navigation.goBack()
        }).catch((err) => {
            console.log("ERR OF TRACKING", err)
        });
    }
    showlog = (im) => {
        console.log('555555')
        console.log(im)

    
    }
 
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
    // insert_inv =(fileName)=>{
    //     var intsert_inv = null
    //     for(){
            
    //     }
    // }
    
    
 
 
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
                    <Title>ยืนยันการส่งงาน</Title>
                </Body>
                <Right />
            </Header>

            {/* <Content style={{ height: 200 }}> */}
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
            <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width, borderBottomColor: 'gray', borderBottomWidth: 0.5, marginBottom: 5 }}>
                        <View style={{ marginLeft: 20 }}>
                            <CheckBox
                                value={this.state.status_CHECKBOX}
                                onValueChange={() => {
                                    this.setState({ status_CHECKBOX: !this.state.status_CHECKBOX })
                                   
                                }} />
                        </View>
                        <Text>ชำระแบบโอน</Text>
                    </View>


            {/* </Content> */}

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
                    <TouchableOpacity  onPress={() => { this.resetSign() } }  >
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
                                // { text: "ยืนยัน", onPress: () => this.saveSign() }
                                { text: "ยืนยัน", onPress: () => this.saveSign() }
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
      
            
        );
    }

    saveSign() {
        if(this.state.sig_status)
        {
            console.log('In save sign')
            this.signComponent.saveImage();
          this.submitedit()
       
    
        }
        else{
            Alert.alert(
                'คุณยังไม่ได้เซ็น ',
                'กรุณาเซ็น'
               
              )
        }
        
        //console.log(this.refs["sign"])
       // const base64String  = `data:image/png;base64,${result.encoded}`;
       // this.setState({image:base64String })
       // this.showlog(1)
    }
  
    resetSign = () => {
        this.signComponent.resetImage();
      
        this.setState({ sig_status: false})
    }

    _onSaveEvent=(result) =>{
        //result.encoded - for the base64 encoded png
        //result.pathName - for the file path name
        //const base64String  = `data:image/png;base64,${result.encoded}`;
        const partname = result.pathName;
        console.log(partname);
        
        this.pic();
        this.submit_inv();
       // this.aa();
    }
    _onDragEvent = () => {
         // This callback will be called when the user enters signature
        console.log("dragged");
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
    con:{
        flex:1,
        backgroundColor:'#fff',
        alignItems:'center',
        justifyContent:'center',

    }
});
 
//AppRegistry.registerComponent('SubmitJob', () => SubmitJob);
const GraphQL = compose(SubmitJob)
export default withApollo(GraphQL)

const submitwork = gql`
    mutation submitwork($status:String!, $invoiceNumber:String!,$paymentType:String!){
        submitwork(status: $status, invoiceNumber: $invoiceNumber, paymentType: $paymentType){
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
const submiitdetail =gql`
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