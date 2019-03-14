import React, { Component } from 'react'
import { Text, StyleSheet, View, Dimensions, RefreshControl, CheckBox, Alert, TouchableOpacity,Image } from 'react-native'
import { Icon, Container, Header, Left, Body, Title, Right, Tab, Tabs, TabHeading, Button, Subtitle, ListItem, Content, Badge, Accordion, Footer, ActionSheet } from 'native-base';
import { gql, withApollo, compose } from 'react-apollo'
import Swipeout from 'react-native-swipeout'

var BUTTONS = [
  { text: "ลูกค้ากดผิด", icon: "md-arrow-dropright", iconColor: "#2c8ef4", status: "B1" },
  { text: "ร้านปิด", icon: "md-arrow-dropright", iconColor: "#f42ced", status: "B2" },
  { text: "Order ซ้ำ", icon: "md-arrow-dropright", iconColor: "#ea943b", status: "B3" },
  { text: "สินค้าผิด", icon: "md-arrow-dropright", iconColor: "#fa213b", status: "B4" },
  { text: "เซลล์ key ผิด", icon: "md-arrow-dropright", iconColor: "#2c8ef4", status: "B5" },
  { text: "ลูกค้าสั่งร้านอื่นมาแล้ว", icon: "md-arrow-dropright", iconColor: "#f42ced", status: "B6" },
  { text: "เซลล์บอกราคาลูกค้าผิด", icon: "md-arrow-dropright", iconColor: "#ea943b", status: "B7" },
  { text: "Cancel", icon: "close", iconColor: "#25de5b" }
];
var CANCEL_INDEX = 4;

class AddMediaTab extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showWork_CN: [],
      showZone_CN: [],
      show_SUC_CN: [],
      refreshing_2_CN: false,
      CF_ALL_INVOICE_CN: [],
      stack_IVOICE_CN: [],
      status_CHECKBOX: false,
      activeRowKey_CN:null,
      indexRow_CN:null,
      status_checkBillRework_CN:null,
    }
  //  this.props.client.resetStore();
    this.queryZONE_CN();
    this.worksub_CN();
    this.sucesswork_CN();
  }
   
  // static navigationOptions = {
  //   tabBarLabel: "่เคลม",
  //   tabBarIcon: ({ tintColor }) => (
  //     <Icon name="ios-construct" style={{
  //       color:
  //         tintColor
  //     }} />
  //   ),
  // }

  _RELOAD_MAIN2 = () => {
    this.props.client.resetStore();
    this.setState({ refreshing_2_CN: true });
    this.queryZONE_CN();
    this.worksub_CN();
    this.sucesswork_CN();
    this.setState({ CF_ALL_INVOICE_CN: [], stack_IVOICE_CN: [] })
    this.setState({ refreshing_2_CN: false });
    this.setState({CF_ALL_INVOICE:false})
  }

  checkDATA = (e) => {
    return (e == null) || (e == false)
  }
  logcath =()=>{

    const { navigate } = this.props.navigation
    navigate('AddCN',{id:''})
  }
  worksub_CN = () => {
    console.log('worksub_CN')

    this.props.client.query({
      query: tsc_worklist,
      variables: {
        "MessengerID": global.NameOfMess
      }
    }).then((result) => {
      console.log("worksub_CN.................")
      console.log("CNNN",result.data.tsc_worklist)
      this.setState({
        showWork_CN: result.data.tsc_worklist
      })
    }).catch((err) => {
      console.log(err)
    });
  }
checkBillRework = (inb) => {

    console.log(inb)
    this.props.client.query({
      query: checkBillRework_sp,
      variables: {
        "invoiceNumber": inb
      }
    }).then((result) => {
      console.log(result.data.checkBillRework_sp.status)
      this.setState({
        status_checkBillRework_CN: result.data.checkBillRework_sp.status
      })
      if(!result.data.checkBillRework_sp.status)
      {
        Alert.alert(
          'ไม่สามารถถอยบิลนี้ได้ ',
          'บิล :'+inb+' ได้ถูกสรุปยอดไปแล้ว'
         
        )
      }
      else{
        Alert.alert(
          "คุณต้องการถอยบิล",
          'คุณต้องการถอยบิล:'+inb+'' ,
          [
            {
              text: "ไม่", 
               
            },
            { text: "ถอย", onPress: () =>this.AlertBillRework(inb)}
          ]
        )
      }
    }).catch((err) => {
      console.log(err)
    });
  }


  AlertBillRework = (inb) => {
  
    this.props.client.mutate({
      mutation: Rework_sp,
      variables: {
       
        "invoiceNumber": inb
      }
    }).then((result) => {
      this._RELOAD_MAIN2()
    }).catch((err) => {
      console.log("err of submitwork", err)
    });


  }
  _RELOAD_TO_GOBACK = () => {
    this.props.navigation.state.params.refresion()
    this.props.navigation.goBack()
}


  queryZONE_CN = () => {
    console.log("queryZONE_CN")

    this.props.client.query({
      query: TSC_select_Zone,
      variables: {
        "MessengerID": global.NameOfMess
      }
    }).then((result) => {
      console.log(result.data.TSC_select_Zone)
      this.setState({
        showZone_CN: result.data.TSC_select_Zone
      })
    }).catch((err) => {
      console.log(err)
    });
  }

  sucesswork_CN = () => {
    console.log("sucesswork_CN")

    this.props.client.query({
      query: sucesswork_CN,
      variables: {
        "MessengerID": global.NameOfMess
      }
    }).then((result) => {
      console.log(result.data.sucesswork_CN)
      this.setState({
        show_SUC_CN: result.data.sucesswork_CN
      })
    }).catch((err) => {
      console.log(err)
    });
  }
  submitwork = (s, in_V, n) => {
    this.props.client.mutate({
        mutation: submit_TSC,
        variables: {
            "TSC": in_V,
            "status_work": s
           
        }
    }).then((result) => {
        console.log(result.data.submit_TSC.status)
        if(!result.data.submit_TSC.status)
        {
            Alert.alert(
                "ส่งไม่สำเร็จ",
                "กรุณากดส่งใหม่อีกครั้ง",
            )
        }
        else{
            this.tracking(s,in_V, n)
        }
       // this.submiitdetail(s)
    }).catch((err) => {
        console.log("err of submitwork", err)
    });
}
  // submitwork = (s, in_V, n) => {
  //   console.log(s)
  //   this.props.client.mutate({
  //     mutation: submitwork,
  //     variables: {
  //       "status": s,
  //       "invoiceNumber": in_V
  //     }
  //   }).then((result) => {
  //     this.submiitdetail(s, in_V, n)
  //   }).catch((err) => {
  //     console.log("err of submitwork", err)
  //   });
  // }

  // submiitdetail = (s, in_V, n) => {
  //   this.props.client.mutate({
  //     mutation: submiitdetail,
  //     variables: {
  //       "invoiceNumber": in_V
  //     }
  //   }).then((result) => {
  //     this.tracking(s, in_V, n)
  //   }).catch((err) => {
  //     console.log("err of submiitdetail", err)
  //   });
  // }

  tracking = (s, in_V, n) => {
    console.log("tracking")

    this.props.client.mutate({
      mutation: tracking_CN,
      variables: {
        "invoice": in_V,
        "status": s,
        "messengerID": global.NameOfMess,
        "lat": 1,
        "long": 1,
      }
    }).then((result) => {
      if (n == 0) {
      
      } else if (n == 1) {
        if(!result.data.tracking_CN.status)
        {
            Alert.alert(
                "ส่งไม่สำเร็จ",
                "กรุณากดส่งใหม่อีกครั้ง",
            )
        }
        else{
          this._RELOAD_MAIN2()
        }
       
      }
    }).catch((err) => {
      console.log("ERR OF TRACKING", err)
    });
  }
  checksubmitbill = () => {
    const { navigate } = this.props.navigation
    console.log("tracking")
    console.log(this.state.showWork_CN.length)

    if(this.state.showWork_CN.length>0)
    {
      Alert.alert(
        'ไม่สามารถสรุปยอดได้ ',
        'คุณยังมีงานค้างส่งอีก :'+this.state.showWork_CN.length+'  งาน                             กรุณาส่งงานให้หมดทุกงานก่อน'
       
      )
    }
    else{
      navigate('SumBill')
    }
 
  }
  OnhandSelect =(inb)=>{
    this.setState({
      indexRow_CN:inb,
    })
    const inb_text = this.state.indexRow_CN

    console.log(inb)
  }
  


  render() {

    const { navigate } = this.props.navigation
    const swipeSetting = {
      autoClose : true,
      onClose:(secId,rowId,direction)=>{
        if(this.state.activeRowKey_CN != null)
        {
          this.setState({
            activeRowKey_CN:null
          })
        }
      },
      onOpen:(secId,rowId,direction) =>{
        console.log(rowId)
        this.setState({
          activeRowKey_CN: ''
        })
      },
      right:[
        {
          onPress:() =>{
             const delInv = this.state.activeRowKey_CN
            Alert.alert(
              'ถอยงาน',
              'คุณยืนยันที่จะถอยงานใช่หรือไม่',
              [
                {text:'ไม่',onPress:()=>console.log('cancel Presed'),style:'cancel'},
                {text:'ใช่',onPress:()=>{
                  
console.log('INV',delInv)

                }},
              ],
              {cancelable:true}
            );
          },
          text:'ถอยงาน',type :'delete'
        }
      ],
      rowId:this.props.index,
      selectionId:1,

    }
    return (

      <Container>
        <Header style={{ backgroundColor: '#66c2ff' }}>
          <Left>
            <Button transparent
              onPress={() => { this.props.client.resetStore(); navigate("MainMenu") }}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>งานพิเศษ</Title>
          </Body>
          <Right />
        </Header>

        <Tabs locked>
          <Tab heading={<TabHeading style={{ backgroundColor: '#66c2ff' }}><Icon name="md-cart" /><Text style={{ color: 'white' }}>  รายการส่ง</Text></TabHeading>}>
            <Content
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing_2_CN}
                  onRefresh={this._RELOAD_MAIN2}
                />
              }
            >
        
             <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5 }}>
                <CheckBox
                  value={this.state.status_CHECKBOX}
                  onValueChange={() => {
                    this.setState({ status_CHECKBOX: !this.state.status_CHECKBOX })
                    this.state.showWork_CN.map((i, k) => {
                      let n = this.state.CF_ALL_INVOICE_CN;
                      let s = this.state.stack_IVOICE_CN;
                      n[k] = !this.state.status_CHECKBOX
                      s[k] = i.invoiceNumber
                      this.setState({
                        CF_ALL_INVOICE_CN: n,
                        stack_IVOICE_CN: s
                      })
                    })
                  }} />
                <Text>เลือกทั้งหมด</Text>
              </View>

              {
                (() => {
                  if (this.state.showWork_CN.length > 0) {
                    return (
                      <View>
                        {
                          this.state.showZone_CN.map((val, j) => (
                            <Accordion
                              dataArray={[{ test: "test" }]}
                              renderHeader={(expanded) => (
                                <View
                                  style={{ flexDirection: "row", padding: 10, justifyContent: "space-between", alignItems: "center", backgroundColor: "#E2E2E1" }}
                                >
                                  <Text style={{ fontWeight: "600" }}>
                                    {"  "}{val.Zone}
                                  </Text>
                                  {expanded
                                    ? <Icon style={{ fontSize: 18 }} name="remove-circle" />
                                    : <Icon style={{ fontSize: 18 }} name="add-circle" />}
                                </View>
                              )}
                              renderContent={() => this.state.showWork_CN.map((l, i) => {
                                if (l.Zone == val.Zone) {
                                  return (
                                    <View style={styles.detailContent}>
                                      <View style={{ paddingLeft: 0, flexDirection: 'row' }}>
                                        <CheckBox
                                          value={this.state.CF_ALL_INVOICE_CN[i]}
                                          onValueChange={() => {
                                            if (this.state.CF_ALL_INVOICE_CN[i] == true) {
                                              let n = this.state.CF_ALL_INVOICE_CN.slice();
                                              let s = this.state.stack_IVOICE_CN.slice();
                                              n[i] = false
                                              s[i] = l.invoiceNumber
                                              this.setState({
                                                CF_ALL_INVOICE_CN: n,
                                                stack_IVOICE_CN: s
                                              }, () => {
                                                console.log("if 1 CF", this.state.CF_ALL_INVOICE_CN)
                                                console.log("if 1 CF", this.state.stack_IVOICE_CN)
                                              })

                                            }
                                            else if (this.state.CF_ALL_INVOICE_CN[i] == false) {
                                              let n = this.state.CF_ALL_INVOICE_CN.slice();
                                              let s = this.state.stack_IVOICE_CN.slice();
                                              n[i] = true
                                              s[i] = l.invoiceNumber
                                              this.setState({
                                                CF_ALL_INVOICE_CN: n,
                                                stack_IVOICE_CN: s
                                              }, () => {
                                                console.log("if 2 CF", this.state.CF_ALL_INVOICE_CN)
                                                console.log("if 1 CF", this.state.stack_IVOICE_CN)
                                              })

                                            }
                                            else {
                                              let n = this.state.CF_ALL_INVOICE_CN.slice();
                                              let s = this.state.stack_IVOICE_CN.slice();
                                              n[i] = true
                                              s[i] = l.invoiceNumber
                                              this.setState({
                                                CF_ALL_INVOICE_CN: n,
                                                stack_IVOICE_CN: s
                                              }, () => {
                                                console.log("if 3 CF", this.state.CF_ALL_INVOICE_CN)
                                                console.log("if 1 CF", this.state.stack_IVOICE_CN)
                                              })

                                            }

                                          }} />
                                        <TouchableOpacity style={{ position: 'absolute', left: "8%", right: 0, justifyContent: 'center' }} onPress={() => navigate('DetailCN', { id: l.invoiceNumber, Zone: l.Zone, address: l.addressShipment, Cusname: l.customerName,detail_cn:l.comment, refresion: this._RELOAD_MAIN2 })}>
                                          {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.storeLabel}>{l.invoiceNumber}</Text>
                                    <Text style={{ paddingHorizontal: 3 }}>{l.DELIVERYNAME}</Text>
                                  </View> */}

                                          <View style={{ paddingLeft: 0, flexDirection: 'row' }}>
                                            <Text style={styles.storeLabel}>{l.invoiceNumber}</Text>
                                          </View>
                                          <View style={{ paddingLeft: 0, flexDirection: 'row', marginBottom: 5 }}>
                                            <Text style={{ fontSize: 12 }}>{l.DELIVERYNAME}</Text>
                                          </View>
                                        </TouchableOpacity>
                                      </View>


                                      <View style={{ position: 'absolute', right: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => navigate('DetailCN', { id: l.invoiceNumber, Zone: l.Zone, address: l.addressShipment, Cusname: l.customerName,detail_cn:l.comment, refresion: this._RELOAD_MAIN2 })}>
                                          {/* <Text style={{ fontWeight: 'bold', fontSize: 13, color: 'orange', paddingHorizontal: 5 }}>{l.SUM} ฿ </Text> */}
                                          <Button transparent
                                            onPress={() => navigate('DetailCN', { id: l.invoiceNumber, Zone: l.Zone, address: l.addressShipment, Cusname: l.customerName,detail_cn:l.comment, refresion: this._RELOAD_MAIN2 })}
                                          >
                                            <Icon name='ios-arrow-forward' style={{ color: 'gray' }} />
                                          </Button>
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                  
                                  )
                                  
                                }
                              })}
                            />
                          ))
                        }
                      </View>
                    )
                  } else {
                    return (
                      <View style={{ alignItems: 'center', marginTop: 20, borderColor: 'gray', borderWidth: 0.5 }}>
                        <Text>คุณไม่มีงานที่ต้องส่ง</Text>
                        <Text> หรือ </Text>
                        <Text>กรุณาลากลงเพื่อทำการรีโหลด</Text>
                      </View>
                    )
                  }
                })()
              }
              


            </Content>
            <View style={{ flexDirection: "row",marginLeft: 5 , justifyContent: "space-between", alignItems: "center"}}  >
              <View style={{ paddingLeft: 0, flexDirection: 'row' }}>
                
                  
                <Text style={{marginTop:7}}></Text>
                </View>
                <TouchableOpacity onPress={() => navigate('AddCN', { id:'',refresion: this._RELOAD_MAIN2  })}>
                { <Icon style={{ fontSize: 60,color: "green"}} name="add-circle" />}
                </TouchableOpacity>
                 </View>
            <TouchableOpacity onPress={() => {
              if (this.state.CF_ALL_INVOICE_CN.every(this.checkDATA)) {
                Alert.alert(
                  'ไม่สามารถส่งงานได้',
                  'กรุณาเลือกงานที่จะส่ง'
                )
              } else {
                Alert.alert(
                  "ยืนยันการส่งงาน",
                  "คุณต้องการยืนยัน การส่งงาน -สำเร็จ- หรือ -ไม่สำเร็จ- ?",
                  [
                    {
                      text: "ไม่สำเร็จ", onPress: () =>
                        ActionSheet.show(
                          {
                            options: BUTTONS,
                            cancelButtonIndex: CANCEL_INDEX,
                            title: "รายงานการส่ง"
                          },
                          buttonIndex => {
                            this.state.CF_ALL_INVOICE_CN.map((val, i) => {
                              if ((val == true) && ((i + 1) != this.state.CF_ALL_INVOICE_CN.length)) {
                                this.submitwork(BUTTONS[buttonIndex].status, this.state.stack_IVOICE_CN[i], 0)
                        
                              }
                              else if ((val == true) && ((i + 1) == this.state.CF_ALL_INVOICE_CN.length)) {
                                this.submitwork(BUTTONS[buttonIndex].status, this.state.stack_IVOICE_CN[i], 1)
                            
                              }
                            });

                          }
                        )
                    },
                    { text: "สำเร็จ", onPress: () => navigate("SubmitAll_TSC", { check_box: this.state.CF_ALL_INVOICE_CN, in_V: this.state.stack_IVOICE_CN, refresionTO: this._RELOAD_MAIN2 }) }
                  ]
                )
              }
            }}>
              <Footer style={{
                backgroundColor: '#ff6c00',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                 
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>ยืนยันการส่งงาน</Text>
                </View>
              </Footer>
            </TouchableOpacity>
          </Tab>

          {/* ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}

          <Tab heading={<TabHeading style={{ backgroundColor: '#66c2ff' }}><Icon name="md-checkbox-outline" /><Text style={{ color: 'white' }}>  ส่งสำเร็จ</Text></TabHeading>}>
            <Content
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing_2_CN}
                  onRefresh={this._RELOAD_MAIN2}
                />
              }
            >
              {
                this.state.show_SUC_CN.map(k => (
               
                           <ListItem style={{ paddingTop: 5 }}>
                    
                    <View  >
               
                    <TouchableOpacity onPress={() => this.checkBillRework(k.tsc_document)}>
                      <View style={{ paddingLeft: 0, flexDirection: 'row' }}>
                     
                        <Text style={styles.storeLabel}>{k.tsc_document}</Text>
                    
                      </View>
                      <View style={{ paddingLeft: 0, flexDirection: 'row', paddingEnd: 0 }}>
                        <Text style={{ fontSize: 12 }}>{k.CustomerName}</Text>
                      </View>
                        
                    </TouchableOpacity>
                    </View>
                    <View style={{ position: 'absolute', right: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => this.checkBillRework(k.invoiceNumber)}>
                      <Text style={{ fontSize: 13, color: 'orange', paddingHorizontal: 30 }}></Text>
                      </TouchableOpacity>
                      {
                        (() => {
                          if (k.status_finish == "A1") {
                            return (
                              <View style={{ alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width / 5.5 }} >
                                <Badge success style={{ height: 19, alignItems: 'center', justifyContent: 'center' }} >
                                <TouchableOpacity onPress={() => this.checkBillRework(k.invoiceNumber)}>
                                  <Text style={{ fontSize: 12, color: 'white' }}>ส่งสำเร็จ</Text>
                                  </TouchableOpacity>
                                </Badge>
                              </View>
                            )
                          } else if (k.status_finish == "A2") {
                            return (

                              <View style={{ alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width / 5.5  }} >
                                <Badge warning style={{ height: 19, alignItems: 'center', justifyContent: 'center' }} >
                                <TouchableOpacity onPress={() => this.checkBillRework(k.invoiceNumber)}>
                                  <Text style={{ fontSize: 12, color: 'white' }}>มีการแก้ไข</Text>
                                  </TouchableOpacity>
                                </Badge>
                              </View>

                            )
                          } else {
                            return (
                              <View style={{ alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width / 5.5  }} >
                                <Badge style={{ height: 19, alignItems: 'center', justifyContent: 'center' }} >
                                <TouchableOpacity onPress={() => this.checkBillRework(k.invoiceNumber)}>
                                  <Text style={{ fontSize: 12, color: 'white' }}>ส่งไม่สำเร็จ</Text>
                                  </TouchableOpacity>
                                </Badge>
                              </View>
                            )
                          }
                        })()
                      }
                    </View>
                  </ListItem>
               
           
                ))
              }
            </Content>


            {/* <TouchableOpacity onPress={() => navigate('SumBill')}> */}
            {/* <TouchableOpacity onPress={() => this.checksubmitbill()}>
              <Footer style={{
                backgroundColor: '#ff6c00',
                justifyContent: 'center',
                alignItems: 'center'
              }} >

                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>สรุปยอดเงิน</Text>


              </Footer>
            </TouchableOpacity> */}
          </Tab>

        </Tabs>

      </Container>
    );
  }


}

const GraphQL = compose(AddMediaTab)
export default withApollo(GraphQL)


const worksub_CN = gql`
    query worksub_CN($MessengerID:String!){
            worksub_CN(MessengerID: $MessengerID){
            invoiceNumber
            customerName
          DELIVERYNAME
          Zone
          addressShipment
          SUM
      }
  }
`
const tsc_worklist = gql`
    query tsc_worklist($MessengerID:String!){
      tsc_worklist(MessengerID: $MessengerID){
            invoiceNumber
            customerName
          DELIVERYNAME
          Zone
          addressShipment
          detail_cn
          comment
          
      }
  }
`
const checkBillRework_sp = gql`
    query checkBillRework_sp($invoiceNumber:String!){
      checkBillRework_sp(invoiceNumber: $invoiceNumber){
            status
      }
  }
`
const Rework_sp = gql`
    mutation Rework_sp($invoiceNumber:String!){
      Rework_sp(invoiceNumber: $invoiceNumber){
            status
          }
          }
      `

const queryZONE_CN = gql`
  query queryZONE_CN($MessengerID:String!){
            queryZONE_CN(MessengerID: $MessengerID){
            Zone
          }
          }
        `
const TSC_select_Zone = gql`
  query TSC_select_Zone($MessengerID:String!){
    TSC_select_Zone(MessengerID: $MessengerID){
            Zone
          }
          }
        `

const sucesswork_CN = gql`
  query sucesswork_CN($MessengerID:String!){
            sucesswork_CN(MessengerID: $MessengerID){
              tsc_document
              status_finish
              CustomerName
          
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
 const submit_TSC = gql`
    mutation submit_TSC($TSC:String!,$status_work:String!){
        submit_TSC(TSC: $TSC,status_work: $status_work){
            status
        }
    }
`


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center"
  },
  storeLabel: {
    fontSize: 18,
    color: 'black'
  },
  detailContent: {
    width: Dimensions.get('window').width,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    paddingBottom: 5,
    height: 50,
    justifyContent: 'center'
  }, TouchableOpacityStyle:{
  
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
 
  }, FloatingButtonStyle: {
  
    resizeMode: 'contain',
    width: 50,
    height: 50,
  }
})