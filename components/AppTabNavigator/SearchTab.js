import React, { Component } from 'react'
import { Text, StyleSheet, View, Dimensions, RefreshControl, CheckBox, Alert, TouchableOpacity } from 'react-native'
import { Icon, Container, Header, Left, Body, Title, Right, Tab, Tabs, TabHeading, Button, Subtitle, ListItem, Content, Badge, Accordion, Footer, ActionSheet } from 'native-base';
import { gql, withApollo, compose } from 'react-apollo'
import Swipeout from 'react-native-swipeout'
import NumberFormat from 'react-number-format'
// var BUTTONS = [
//   { text: "ลูกค้ากดผิด", icon: "md-arrow-dropright", iconColor: "#2c8ef4", status: "B1" },
//   { text: "ร้านปิด", icon: "md-arrow-dropright", iconColor: "#f42ced", status: "B2" },
//   { text: "Order ซ้ำ", icon: "md-arrow-dropright", iconColor: "#ea943b", status: "B3" },
//   { text: "สินค้าผิด", icon: "md-arrow-dropright", iconColor: "#fa213b", status: "B4" },
//   { text: "เซลล์ key ผิด", icon: "md-arrow-dropright", iconColor: "#2c8ef4", status: "B5" },
//   { text: "ลูกค้าสั่งร้านอื่นมาแล้ว", icon: "md-arrow-dropright", iconColor: "#f42ced", status: "B6" },
//   { text: "เซลล์บอกราคาลูกค้าผิด", icon: "md-arrow-dropright", iconColor: "#ea943b", status: "B7" },
//   { text: "Cancel", icon: "close", iconColor: "#25de5b" }
// ];
var CANCEL_INDEX = 9;

class SearchTab extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showWork: [],
      showZone: [],
      show_SUC: [],
      refreshing_2: false,
      CF_ALL_INVOICE: [],
      stack_IVOICE: [],
      stack_tran:[],
      status_CHECKBOX: false,
      activeRowKey:null,
      indexRow:null,
      status_checkBillRework:null,
      showWork_CN: [],
      BUTTONS:[],
      CANCEL_INDEX:null,
      

    }
    //this.props.client.resetStore();
    //this.logss();
    this.queryZONE();
    this.worksub();
    this.sucesswork();
    this.worksub_CN();
    this.reason();
    //this._RELOAD_MAIN2();
 //   this.logss();
  }
  

  _RELOAD_MAIN2 = () => {
    this.props.client.resetStore();
    this.setState({ refreshing_2: true });
    this.queryZONE();
    this.worksub();
    this.worksub_CN();
    this.sucesswork();
    this.setState({ CF_ALL_INVOICE: [], stack_IVOICE: [],stack_tran:[] })
    this.setState({ refreshing_2: false });
  }

  checkDATA = (e) => {
    return (e == null) || (e == false)
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
      console.log(result.data.reasonfail.length)
      this.setState({
        BUTTONS: result.data.reasonfail,
       // CANCEL_INDEX:result.data.reasonfail.length-1
      })
      console.log(this.state.BUTTONS)
    }).catch((err) => {
      console.log(err)
    });
  }
  worksub = () => {
    console.log('worksub')

    this.props.client.query({
      query: worksub_DL,
      variables: {
        "MessengerID": global.NameOfMess
      }
    }).then((result) => {
      console.log("workSub.................")
      console.log(result.data.worksub_DL)
      this.setState({
        showWork: result.data.worksub_DL
      })
    }).catch((err) => {
      console.log(err)
    });
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
      console.log(result.data.worksub_CN)
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
      query: checkBillRework,
      variables: {
        "invoiceNumber": inb
      }
    }).then((result) => {
      console.log(result.data.checkBillRework.status)
      this.setState({
        status_checkBillRework: result.data.checkBillRework.status
      })
      if(!result.data.checkBillRework.status)
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
    this.del_blacklist(inb)
    this.props.client.mutate({
      mutation: Rework,
      variables: {
       
        "invoiceNumber": inb
      
      }
    }).then((result) => {
      this._RELOAD_MAIN2()
    }).catch((err) => {
      console.log("err of submitwork", err)
    });


  }
  del_blacklist = (inb) => {
    
    this.props.client.mutate({
      mutation: del_Blacklist,
      variables: {
       
        "invoice": inb,
        "messengerID": global.NameOfMess
      }
    }).then((result) => {
      //this._RELOAD_MAIN2()
    }).catch((err) => {
      console.log("err of submitwork", err)
    });


  }


  queryZONE = () => {
    console.log("queryZone")

    this.props.client.query({
      query: queryZONE,
      variables: {
        "MessengerID": global.NameOfMess
      }
    }).then((result) => {
      console.log(result.data.queryZONE)
      this.setState({
        showZone: result.data.queryZONE
      })
    }).catch((err) => {
      console.log(err)
    });
  }

  sucesswork = () => {
    console.log("sucesswork")

    this.props.client.query({
      query: sucessworkV2,
      variables: {
        "MessengerID": global.NameOfMess
      }
    }).then((result) => {
      console.log(result.data.sucessworkV2)
      this.setState({
        show_SUC: result.data.sucessworkV2
      })
    }).catch((err) => {
      console.log(err)
    });
  }

  submitwork = (s, in_V, n) => {
    if(s =='B8')
    {
      console.log('ลูกค้าไม่โอน',in_V)
      this.props.client.mutate({
        mutation: Blacklist,
        variables: {
          "status": s,
          "invoice": in_V,
          "messengerID":global.NameOfMess
        }
      }).then((result) => {
        console.log(result.data.Blacklist.status)
      }).catch((err) => {
        console.log("err of submitwork", err)
      });
    

    }
    console.log(s)
    this.props.client.mutate({
      mutation: submitworkV2_nonsig,
      variables: {
        "status": s,
        "invoiceNumber": in_V
      }
    }).then((result) => {
      if (n == 0) {
        console.log("submitwork ")
      } else if (n == 1) {
        this._RELOAD_MAIN2()
      }
     // this.submiitdetail(s, in_V, n)
    }).catch((err) => {
      console.log("err of submitwork", err)
    });
  }

  submiitdetail = (s, in_V, n) => {
    this.props.client.mutate({
      mutation: submiitdetail,
      variables: {
        "invoiceNumber": in_V
      }
    }).then((result) => {
      this.tracking(s, in_V, n)
    }).catch((err) => {
      console.log("err of submiitdetail", err)
    });
  }

  tracking = (s, in_V, n) => {
    console.log("tracking")

    this.props.client.mutate({
      mutation: tracking,
      variables: {
        "invoice": in_V,
        "status": s,
        "messengerID": global.NameOfMess,
        "lat": 1,
        "long": 1,
      }
    }).then((result) => {
      if (n == 0) {
        console.log("Tracking ", result.data.tracking.status)
      } else if (n == 1) {
        this._RELOAD_MAIN2()
      }
    }).catch((err) => {
      console.log("ERR OF TRACKING", err)
    });
  }
  checksubmitbill = () => {
    const { navigate } = this.props.navigation
    console.log("tracking")
    console.log(this.state.showWork.length)

    if(this.state.showWork.length>0)
    {
      Alert.alert(
        'ไม่สามารถสรุปยอดได้ ',
        'คุณยังมีงานค้างส่งอีก :'+this.state.showWork.length+'  งาน                             กรุณาส่งงานให้หมดทุกงานก่อน'
       
      )
    }
    else if(this.state.showWork_CN.length>0)
    {
      Alert.alert(
        'ไม่สามารถสรุปยอดได้ ',
        'คุณยังมีงานพิเศษค้างส่งอีก :'+this.state.showWork_CN.length+'  งาน                             กรุณาส่งงานให้หมดทุกงานก่อน'
       
      )
    }
    else{
      navigate('SumBill')
    }
 
  }
  OnhandSelect =(inb)=>{
    this.setState({
      indexRow:inb,
    })
    const inb_text = this.state.indexRow

    console.log(inb)
  }
  


  render() {

    const { navigate } = this.props.navigation
    const swipeSetting = {
      autoClose : true,
      onClose:(secId,rowId,direction)=>{
        if(this.state.activeRowKey != null)
        {
          this.setState({
            activeRowKey:null
          })
        }
      },
      onOpen:(secId,rowId,direction) =>{
        console.log(rowId)
        this.setState({
          activeRowKey: ''
        })
      },
      right:[
        {
          onPress:() =>{
             const delInv = this.state.activeRowKey
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
            <Title>ส่งงาน</Title>
          </Body>
          <Right />
        </Header>

        <Tabs locked>
          <Tab heading={<TabHeading style={{ backgroundColor: '#66c2ff' }}><Icon name="md-cart" /><Text style={{ color: 'white' }}>  รายการส่ง</Text></TabHeading>}>
            <Content
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing_2}
                  onRefresh={this._RELOAD_MAIN2}
                />
              }
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5 }}>
                <CheckBox
                  value={this.state.status_CHECKBOX}
                  onValueChange={() => {
                    this.setState({ status_CHECKBOX: !this.state.status_CHECKBOX })
                    this.state.showWork.map((i, k) => {
                      let n = this.state.CF_ALL_INVOICE;
                      let s = this.state.stack_IVOICE;
                      let t = this.state.stack_tran;
                      n[k] = !this.state.status_CHECKBOX
                      s[k] = i.invoiceNumber
                      t[k] = i.PAYMMODE
                      this.setState({
                        CF_ALL_INVOICE: n,
                        stack_IVOICE: s,
                        stack_tran:t
                      })
                    })
                  }} />
                <Text>เลือกทั้งหมด</Text>
              </View>

              {
                (() => {
                  if (this.state.showWork.length > 0) {
                    return (
                      <View>
                        {
                          this.state.showZone.map((val, j) => (
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
                              renderContent={() => this.state.showWork.map((l, i) => {
                                if (l.Zone == val.Zone) {
                                  return (
                                    <View style={styles.detailContent}>
                                      <View style={{ paddingLeft: 0, flexDirection: 'row' }}>
                                        <CheckBox
                                          value={this.state.CF_ALL_INVOICE[i]}
                                          onValueChange={() => {
                                            if (this.state.CF_ALL_INVOICE[i] == true) {
                                              let n = this.state.CF_ALL_INVOICE.slice();
                                              let s = this.state.stack_IVOICE.slice();
                                              let t = this.state.stack_tran.slice();
                                              n[i] = false
                                              s[i] = l.invoiceNumber
                                              t[i]=l.PAYMMODE
                                              this.setState({
                                                CF_ALL_INVOICE: n,
                                                stack_IVOICE: s,
                                                stack_tran:t
                                              }, () => {
                                                console.log("if 1 CF", this.state.CF_ALL_INVOICE)
                                                console.log("if 1 CF", this.state.stack_IVOICE)
                                                console.log("if 1 CF", this.state.stack_tran)
                                              })

                                            }
                                            else if (this.state.CF_ALL_INVOICE[i] == false) {
                                              let n = this.state.CF_ALL_INVOICE.slice();
                                              let s = this.state.stack_IVOICE.slice();
                                              let t = this.state.stack_tran.slice();
                                              n[i] = true
                                              s[i] = l.invoiceNumber
                                              t[i] = l.PAYMMODE
                                              this.setState({
                                                CF_ALL_INVOICE: n,
                                                stack_IVOICE: s,
                                                stack_tran: t
                                              }, () => {
                                                console.log("if 2 CF", this.state.CF_ALL_INVOICE)
                                                console.log("if 1 CF", this.state.stack_IVOICE)
                                              })

                                            }
                                            else {
                                              let n = this.state.CF_ALL_INVOICE.slice();
                                              let s = this.state.stack_IVOICE.slice();
                                              let t = this.state.stack_tran.slice();
                                              n[i] = true
                                              s[i] = l.invoiceNumber
                                              t[i] = l.PAYMMODE
                                              this.setState({
                                                CF_ALL_INVOICE: n,
                                                stack_IVOICE: s,
                                                stack_tran: t
                                              }, () => {
                                                console.log("if 3 CF", this.state.CF_ALL_INVOICE)
                                                console.log("if 1 CF", this.state.stack_IVOICE)
                                              })

                                            }

                                          }} />
                                        <TouchableOpacity style={{ position: 'absolute', left: "8%", right: 0, justifyContent: 'center' }} onPress={() => navigate('DetailWork', { id: l.invoiceNumber, Zone: l.Zone, address: l.addressShipment, Cusname: l.DELIVERYNAME,PAYMMODE:l.PAYMMODE,index:l.id, refresion: this._RELOAD_MAIN2 })}>
                                          {
                                            (() => {
                                              if (l.PAYMMODE == "CHEQUE") {
                             
                                                return (
                                                  // <View style={{ alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width / 5.5 }} >
                                                  //   <Badge success style={{ height: 19, alignItems: 'center', justifyContent: 'center' }} >
                                                  //     <TouchableOpacity onPress={() => this.checkBillRework(k.invoiceNumber)}>
                                                  //       <Text style={{ fontSize: 12, color: 'white' }}>ส่งสำเร็จ</Text>
                                                  //     </TouchableOpacity>
                                                  //   </Badge>
                                                  // </View>
                                                         <View style={{ paddingLeft: 0, flexDirection: 'row' }}>
                                                         <Text style={styles.storeLabel}>{l.invoiceNumber} </Text>
                                                         {/* <Text style={styles.storeLabel}>เครดิต </Text> */}
                                                         <Badge success style={{ height: 19, alignItems: 'center', justifyContent: 'center' }} >
                                                         
                                                             <Text style={{ fontSize: 12, color: 'white' }}>เครดิต</Text>
                                                           
                                                         </Badge>
                                                       </View>
                                                )
                                              } else if
                                              (l.PAYMMODE == "TRANSFER") {
                                                return (
                                                  // <View style={{ alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width / 5.5 }} >
                                                  //   <Badge success style={{ height: 19, alignItems: 'center', justifyContent: 'center' }} >
                                                  //     <TouchableOpacity onPress={() => this.checkBillRework(k.invoiceNumber)}>
                                                  //       <Text style={{ fontSize: 12, color: 'white' }}>ส่งสำเร็จ</Text>
                                                  //     </TouchableOpacity>
                                                  //   </Badge>
                                                  // </View>
                                                         <View style={{ paddingLeft: 0, flexDirection: 'row' }}>
                                                         <Text style={styles.storeLabel}>{l.invoiceNumber} </Text>
                                                         {/* <Text style={styles.storeLabel}>เครดิต </Text> */}
                                                         <Badge success style={{ height: 19, alignItems: 'center', justifyContent: 'center' }} >
                                                         
                                                             <Text style={{ fontSize: 12, color: 'white' }}>โอนบริษัท</Text>
                                                           
                                                         </Badge>
                                                       </View>
                                                )
                                              }
                                              else if
                                              (l.PAYMMODE == "CASH") {
                                                return (
                                                  // <View style={{ alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width / 5.5 }} >
                                                  //   <Badge success style={{ height: 19, alignItems: 'center', justifyContent: 'center' }} >
                                                  //     <TouchableOpacity onPress={() => this.checkBillRework(k.invoiceNumber)}>
                                                  //       <Text style={{ fontSize: 12, color: 'white' }}>ส่งสำเร็จ</Text>
                                                  //     </TouchableOpacity>
                                                  //   </Badge>
                                                  // </View>
                                                         <View style={{ paddingLeft: 0, flexDirection: 'row' }}>
                                                         <Text style={styles.storeLabel}>{l.invoiceNumber} </Text>
                                                         {/* <Text style={styles.storeLabel}>เครดิต </Text> */}
                                                         <Badge success style={{ height: 19, alignItems: 'center', justifyContent: 'center',backgroundColor: 'orange' }} >
                                                         
                                                             <Text style={{ fontSize: 12, color: 'white' }}>เงินสด</Text>
                                                           
                                                         </Badge>
                                                       </View>
                                                )
                                              }
                                              
                                              else {
                                                return (
                                                  // <View style={{ alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width / 5.5 }} >
                                                  //   <Badge style={{ height: 19, alignItems: 'center', justifyContent: 'center' }} >
                                                  //     <TouchableOpacity onPress={() => this.checkBillRework(k.invoiceNumber)}>
                                                  //       <Text style={{ fontSize: 12, color: 'white' }}>ส่งไม่สำเร็จ</Text>
                                                  //     </TouchableOpacity>
                                                  //   </Badge>
                                                  // </View>
                                                  <View style={{ paddingLeft: 0, flexDirection: 'row' }}>
                                                  <Text style={styles.storeLabel}>{l.invoiceNumber} </Text>
                                                  {/* <Text style={styles.storeLabel}>เครดิต </Text> */}
                                                  {/* <Badge success style={{ height: 19, alignItems: 'center', justifyContent: 'center' }} >
                                                  
                                                      <Text style={{ fontSize: 12, color: 'white' }}>เงินสด</Text>
                                                    
                                                  </Badge> */}
                                                </View>
                                                )
                                              }
                                            })()
                                          }
                                              

                                   
                                     
                                          <View style={{ paddingLeft: 0, flexDirection: 'row', marginBottom: 5 }}>
                                            <Text style={{ fontSize: 12 }}>{l.DELIVERYNAME}</Text>
                                          </View>
                                        </TouchableOpacity>
                                      </View>


                                      <View style={{ position: 'absolute', right: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => navigate('DetailWork', { id: l.invoiceNumber, Zone: l.Zone, address: l.addressShipment, Cusname: l.DELIVERYNAME, refresion: this._RELOAD_MAIN2 })}>
                                          <Text style={{ fontWeight: 'bold', fontSize: 13, color: 'orange', paddingHorizontal: 5 }}>{l.SUM} ฿ </Text>
                                          <Button transparent
                                            onPress={() => navigate('DetailWork', { id: l.invoiceNumber, Zone: l.Zone, address: l.addressShipment, Cusname: l.DELIVERYNAME,PAYMMODE:l.PAYMMODE, refresion: this._RELOAD_MAIN2 })}
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
            <TouchableOpacity onPress={() => {
              if (this.state.CF_ALL_INVOICE.every(this.checkDATA)) {
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
                            options: this.state.BUTTONS,
                            cancelButtonIndex: CANCEL_INDEX,
                            title: "รายงานการส่ง"
                          },
                          buttonIndex => {
                            this.state.CF_ALL_INVOICE.map((val, i) => {
                              if ((val == true) && ((i + 1) != this.state.CF_ALL_INVOICE.length)) {
                                this.submitwork(this.state.BUTTONS[buttonIndex].status, this.state.stack_IVOICE[i], 0)
                              
                              }
                              else if ((val == true) && ((i + 1) == this.state.CF_ALL_INVOICE.length)) {
                                this.submitwork(this.state.BUTTONS[buttonIndex].status, this.state.stack_IVOICE[i], 1)
                             
                              }
                            });

                          }
                        )
                    },
                    { text: "สำเร็จ", onPress: () => navigate("SubmitALLJob", { check_box: this.state.CF_ALL_INVOICE, in_V: this.state.stack_IVOICE,PAYMMODE:this.state.stack_tran, refresionTO: this._RELOAD_MAIN2 }) }
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
                  refreshing={this.state.refreshing_2}
                  onRefresh={this._RELOAD_MAIN2}
                />
              }
            >
              {
                this.state.show_SUC.map(k => (
               
                           <ListItem style={{ paddingTop: 5 }}>
                    
                    <View  >
               
                    <TouchableOpacity onPress={() => this.checkBillRework(k.invoiceNumber)}>
                    {
                                            (() => {
                                              if (k.paymentType == "CHEQUE") {
                             
                                                return (
                                          
                                                         <View style={{ paddingLeft: 0, flexDirection: 'row' }}>
                                                         <Text style={styles.storeLabel}>{k.invoiceNumber} </Text>
                                                         {/* <Text style={styles.storeLabel}>เครดิต </Text> */}
                                                         <Badge success style={{ height: 19, alignItems: 'center', justifyContent: 'center' }} >
                                                         
                                                             <Text style={{ fontSize: 12, color: 'white' }}>เครดิต</Text>
                                                           
                                                         </Badge>
                                                       </View>
                                                )
                                              } else if
                                              (k.paymentType == "TRANSFER") {
                                                return (
                                              
                                                         <View style={{ paddingLeft: 0, flexDirection: 'row' }}>
                                                         <Text style={styles.storeLabel}>{k.invoiceNumber} </Text>
                                                         {/* <Text style={styles.storeLabel}>เครดิต </Text> */}
                                                         <Badge success style={{ height: 19, alignItems: 'center', justifyContent: 'center' }} >
                                                         
                                                             <Text style={{ fontSize: 12, color: 'white' }}>โอนบริษัท</Text>
                                                           
                                                         </Badge>
                                                       </View>
                                                )
                                              }
                                              else if
                                              (k.paymentType == "CASH") {
                                                return (
                                             
                                                         <View style={{ paddingLeft: 0, flexDirection: 'row' }}>
                                                         <Text style={styles.storeLabel}>{k.invoiceNumber} </Text>
                                                         {/* <Text style={styles.storeLabel}>เครดิต </Text> */}
                                                         <Badge success style={{ height: 19, alignItems: 'center', justifyContent: 'center',backgroundColor: 'orange' }} >
                                                         
                                                             <Text style={{ fontSize: 12, color: 'white' }}>เงินสด</Text>
                                                           
                                                         </Badge>
                                                       </View>
                                                )
                                              }
                                              
                                              else {
                                                return (
                                            
                                                  <View style={{ paddingLeft: 0, flexDirection: 'row' }}>
                                                  <Text style={styles.storeLabel}>{k.invoiceNumber} </Text>
                                             
                                                </View>
                                                )
                                              }
                                            })()
                                          }
                      {/* <View style={{ paddingLeft: 0, flexDirection: 'row' }}>
                     
                        <Text style={styles.storeLabel}>{k.invoiceNumber}</Text>
                    
                      </View> */}
                      <View style={{ paddingLeft: 0, flexDirection: 'row', paddingEnd: 0 }}>
                        <Text style={{ fontSize: 12 }}>{k.DELIVERYNAME}</Text>
                      </View>
                        
                    </TouchableOpacity>
                    </View>
                    <View style={{ position: 'absolute', right: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => this.checkBillRework(k.invoiceNumber)}>
                      {/* <Text style={{ fontSize: 13, color: 'orange', paddingHorizontal: 30 }}>{k.SUM} ฿ </Text> */}
                      <NumberFormat
                                        value={k.SUM}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        fixedDecimalScale={true}
                                        decimalScale={2}
                                        renderText={value => <Text style={{ fontSize: 13, color: 'orange', paddingHorizontal: 30 }}>{value} ฿</Text>}
                                    /> 
                      </TouchableOpacity>
                      {
                        (() => {
                          if (k.status == "A1") {
                            return (
                              <View style={{ alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width / 5.5 }} >
                                <Badge success style={{ height: 19, alignItems: 'center', justifyContent: 'center' }} >
                                <TouchableOpacity onPress={() => this.checkBillRework(k.invoiceNumber)}>
                                  <Text style={{ fontSize: 12, color: 'white' }}>ส่งสำเร็จ</Text>
                                  </TouchableOpacity>
                                </Badge>
                              </View>
                            )
                          } else if (k.status == "A2") {
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
            <TouchableOpacity onPress={() => this.checksubmitbill()}>
              <Footer style={{
                backgroundColor: '#ff6c00',
                justifyContent: 'center',
                alignItems: 'center'
              }} >

                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>สรุปยอดเงิน</Text>


              </Footer>
            </TouchableOpacity>
          </Tab>

        </Tabs>

      </Container>
    );
  }


}

const GraphQL = compose(SearchTab)
export default withApollo(GraphQL)


const worksub = gql`
    query worksub($MessengerID:String!){
            worksub(MessengerID: $MessengerID){
            invoiceNumber
            customerName
          DELIVERYNAME
          Zone
          addressShipment
          SUM
      }
  }
`

const worksub_DL = gql`
    query worksub_DL($MessengerID:String!){
      worksub_DL(MessengerID: $MessengerID){
            invoiceNumber
            customerName
          DELIVERYNAME
          Zone
          addressShipment
          SUM
          PAYMMODE
          id
      }
  }
`
const checkBillRework = gql`
    query checkBillRework($invoiceNumber:String!){
      checkBillRework(invoiceNumber: $invoiceNumber){
            status
      }
  }
`
const Rework = gql`
    mutation Rework($invoiceNumber:String!){
      Rework(invoiceNumber: $invoiceNumber){
            status
          }
          }
      `

const queryZONE = gql`
  query queryZONE($MessengerID:String!){
            queryZONE(MessengerID: $MessengerID){
            Zone
          }
          }
        `

const sucesswork = gql`
  query sucesswork($MessengerID:String!){
            sucesswork(MessengerID: $MessengerID){
            invoiceNumber
          status
          DELIVERYNAME
          SUM
          paymentType
      }
  }
`
const sucessworkV2 = gql`
  query sucessworkV2($MessengerID:String!){
    sucessworkV2(MessengerID: $MessengerID){
            invoiceNumber
          status
          DELIVERYNAME
          SUM
          paymentType
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
const submitworkV2_nonsig = gql`
      mutation submitworkV2_nonsig($status:String!, $invoiceNumber:String!){
        submitworkV2_nonsig(status: $status, invoiceNumber: $invoiceNumber){
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
  const del_Blacklist = gql`
          mutation del_Blacklist(
              $invoice:String!,
          
              $messengerID:String!
           
    ){
      del_Blacklist(
          invoice: $invoice,
          messengerID: $messengerID
         ){
            status
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
  }
})