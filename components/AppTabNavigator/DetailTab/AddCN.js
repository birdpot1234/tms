import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, ScrollView, TouchableOpacity,TextInput,Keyboard,RefreshControl,ActivityIndicator } from 'react-native'
import { gql, withApollo, compose } from 'react-apollo'
import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, Input, Item, Grid, Col, ActionSheet, Badge,ListItem,Form, Textarea,Picker } from 'native-base';
import Communications from 'react-native-communications';
import CompleteFlatList from 'react-native-complete-flatlist';
import { SearchBar } from 'react-native-elements'
import Moment from 'moment';


class AddCN extends Component {

    static navigationOptions = {
        header: null
    }

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
            searchTerm:"",
            inv: this.props.navigation.state.params.id,
            refreshing_2: false,
            zone:"",
            customer:"",
            Description:'',
            Address:'',
            load:false,
            car_type:null,
            
        }
        this.props.client.resetStore();
      //  this.headerSearch();
       // this.setParm();
    //    this.getPay()
  
    }
    setParm =()=>{
      

        console.log('2355554544543533543545351535')
 
   }
   _RELOAD_MAIN2 = () => {
    this.props.client.resetStore();
    this.setState({ refreshing_2: true });
    //this.setParm();

    this.setState({ refreshing_2: false });
  }

    _RELOAD_DETAILWORK = () => {
        this.props.client.resetStore();
       // this.subDetail();
      //  this.summoneydetail();
      //  this.submitedit();
    }

    _RELOAD_TO_GOBACK = () => {
        this.props.navigation.state.params.refresion()
        this.props.navigation.goBack()
    }
   
     submitCN= () => {
        const { navigate } = this.props.navigation
        if(this.props.navigation.state.params.id.invoiceNumber==undefined ||this.state.Description=='')
        {
            Alert.alert(
                'ไม่สามารถสร้างงานคืนได้ ',
                'กรุณากรอกข้อมูลให้ครบ'
               
              )
        }
        else{
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
                    create_date:"",
                    user_request_code:global.NameOfMess,
                    user_request_name:this.props.navigation.state.params.id.customerName,
                    user_request_department:"DPLUS",
                    user_request_tel:"",
                    receive_from:this.props.navigation.state.params.id.customerName,
                    receive_date:"",
                    receive_time_first:"",
                    receive_time_end:"",
                    send_to:"",
                    send_date:"",
                    send_time_first:"",
                    send_time_end:"",
                    send_tel:"",
                    task_group:"",
                    task_group_document:"",
                    task_group_amount:"",
                    task_group_quantity:"",
                    task_group_pic:"",
                    comment:this.state.Description,
                    work_type:"",
                    status:4,
                    messenger_code:global.NameOfMess,
                    messenger_name:"",
                    car_type:this.state.car_type,
                    shipment_staff_1:"",
                    shipment_staff_2:"",
                    messenger_comment:"",
                    task_detail:"",
                    status_finish:0,
                    customerID:this.props.navigation.state.params.id.customerID,
                    customerName:this.props.navigation.state.params.id.customerName,
                    Zone:this.props.navigation.state.params.id.Zone,
                    address_shipment:this.props.navigation.state.params.id.addressShipment,
                    detail_cn:this.state.Description
                    
                }]),
            })
                .then((resp) => resp.json())
                .then((respJSON) => {
                    console.log("confirm resp", respJSON);
                    if(respJSON.status==200)
                    {
                        this.setState({
                           
                            load:true
                         })
                        this.props.navigation.state.params.refresion()
                        this.props.navigation.goBack()
                    }
                    else{
                        Alert.alert(
                            'บันทึกรายการไม่สำเสร็จ ',
                            'กรุณาลองใหม่อีกครั้ง'
                           
                          )
                    }
                }).catch((err) => {
                    console.log("confirm err", err)
                });
      }

    
    
    log =(data,index) =>{
        console.log(data.invoiceNumber)
        console.log(data.customerName)
        console.log(index)
    }
    logsubmit=()=>{
        console.log(this.state.Description)
        console.log(this.state.Address)
      
    }
    _handleSearch=(text)=>{
        console.log(text)
      console.log('onhand Select')
      
    }
    log1 =(data) =>{
    
        return(  
            <ListItem style={{ paddingTop: 5 }}>
     
     <View  >

     <TouchableOpacity onPress={() => this.log(data)}>
       <View style={{ paddingLeft: 0, flexDirection: 'row' }}>
      
         <Text style={styles.storeLabel}>INVOICE</Text>
     
       </View>
       <View style={{ paddingLeft: 0, flexDirection: 'row', paddingEnd: 0 }}>
         <Text style={{ fontSize: 12 }}>INVOICE</Text>
       </View>
         
     </TouchableOpacity>
     </View>
     <View style={{ position: 'absolute', right: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
     <TouchableOpacity onPress={() => this.log(data)}>
       <Text style={{ fontSize: 13, color: 'orange', paddingHorizontal: 30 }}>INVOICE </Text>
       </TouchableOpacity>
      
     </View>
   </ListItem>)
       
    }
    headerSearch = () => {
        this.props.client.query({
            query: select_INV,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            this.setState({
                showINV: result.data.select_INV
            })
             console.log( result.data.select_INV)
        }).catch((err) => {
            console.log(err)
        });
    }

 
    render() {

        const { navigate } = this.props.navigation
        let { sContainer, sSearchBar, sTextItem } = styles;
        return (
            <Container>
            <Header style={{ backgroundColor: '#66c2ff' }}>
                <Left>
                    <Button transparent
                        onPress={() => { navigate('AddMediaTab') }}>
                        <Icon name='arrow-back' />
                    </Button>
                </Left>
                <Body>
                    <Title>สร้างงาน CN</Title>
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
            <Content     refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing_2}
                  onRefresh={this._RELOAD_MAIN2}
                />
              }>
        
                    <View style={{ margin: 10 }}>
                    <View>
                       

                            <SearchBar
                                placeholder="Search..."
                                 lightTheme
                                inputStyle={{backgroundColor: 'white '}}
                                containerStyle={{backgroundColor: 'white'}}
                                round
                                onFocus  ={() =>  { navigate('AutoSearch') }}
                                icon={{ color: '#3B6693', style: styles.searchIcon, name: 'search' }}
                                //clearIcon={{ color: '#86939e', name: 'close' }}
                                value ={this.props.navigation.state.params.id.invoiceNumber==undefined?'Search':this.props.navigation.state.params.id.invoiceNumber}
                              //  onChangeText={text => this.searchFilterFunction(text)}
                                autoCorrect={false}
                            />
                         
     
                           
                    </View>
                     

                    <View style={{ margin: 10 }}>
                    <Text >ห้าง : {this.props.navigation.state.params.id.Zone} </Text>

                    <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#4682b4' }}>ชื่อลูกค้า : {this.props.navigation.state.params.id.customerName} </Text>
                    <Text>ที่อยู่ : {this.props.navigation.state.params.id.addressShipment}  </Text>
                    <Text>ชื่อผู้ส่งงาน :  {global.NameOfMess}</Text>
                   
                    <Text>วันที่ : {Moment().format('L')} </Text>
                
                              
                    </View>
                

                 <Picker 
                                    selectedValue={this.state.car_type}
                                    style={{ height: 20, width: 100,borderColor:'gray',borderWidth:1,color: '#4682b4',fontWeight: 'bold',fontSize: 17}}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ car_type: itemValue })
                                    }>
                                    <Picker.Item label="2ล้อ" value="2ล้อ" />
                                    <Picker.Item label="4ล้อ" value="4ล้อ" />
                                    <Picker.Item label="6ล้อ" value="6ล้อ" />
                                </Picker>
                    
                </View> 

                <View style={{ margin: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 17,  }}>รายละเอียด</Text>

             
                </View>
               
         
                <Textarea style={{height:150,margin:20,padding:10,borderColor:'gray',borderWidth:1}}
                    rowSpan={5}
                    bordered
                    placeholder="เหตุผล..."
                    maxLength={255}
                    //keyboardType='default'
                    returnKeyType='done'
                    onSubmitEditing={Keyboard.dismiss}
                    onChangeText={(text) => this.setState({ Description: text })}
                />
         
         
               

            </Content>

         
         <TouchableOpacity onPress={() =>        Alert.alert(
                            "ยืนยันการสร้างงานพิเศษ",
                            "โปรดตรวจสอบรายการก่อนการยืนยัน",
                            [
                                { text: "ยกเลิก", onPress: () => console.log("Cancle") },
                                // { text: "ยืนยัน", onPress: () => this.saveSign() }
                                { text: "ยืนยัน", onPress: () => this.submitCN() }
                            ]
                        ) }>
          <Footer style={{
            backgroundColor: '#ff6c00',
            justifyContent: 'center',
            alignItems: 'center'
          }} >

            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>บันทึก</Text>


          </Footer>
        </TouchableOpacity>
        </Container>

    //   <CompleteFlatList
    //   searchKey={['invoiceNumber', 'customerName', 'Zone']}
    //   highlightColor="yellow"
 
    //   pullToRefreshCallback={() => {
    //     alert('refreshing');
    //   }}
    //   data={this.state.showINV}
    //   renderSeparator={null}
    //   renderItem={this.cell.bind(this)}
    // />


        )

    }
}

const GraphQL = compose(AddCN)
export default withApollo(GraphQL)
const styles = StyleSheet.create({
    textAreaContainer: {
      borderColor: 'gray',
      borderWidth: 1,
      padding: 5,
      margin :10
    },
    textArea: {
      height: 150,
      justifyContent: "flex-start"
    },
    searchBox:{
        width:'70%',
        padding:10,
        borderWidth:1,
        borderColor: 'gray',
  
       
    },
    inline:{
        flexDirection: 'row', 
        alignSelf: 'flex-start'
    }
  })
const select_INV = gql`
    query select_INV($MessengerID:String!){
        select_INV(MessengerID: $MessengerID){
            invoiceNumber
            customerName
            addressShipment
            Zone
            DateUpdate
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

const submitCN = gql`
    mutation submit_CN($TSC:String!,$Zone:String!,$Address:String!,$Customer:String!,$CustomerID:String!,$MessNo:String!,$Detail:String!,){
        submit_CN(TSC: $TSC,Zone: $Zone,Address: $Address,Customer: $Customer,CustomerID: $CustomerID,MessNo: $MessNo,Detail: $Detail){
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