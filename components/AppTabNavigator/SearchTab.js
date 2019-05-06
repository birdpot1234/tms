import React, { Component } from 'react'
import { Text, StyleSheet, View, Dimensions, RefreshControl, CheckBox, Alert, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native'
import { Icon, Container, Tab, Tabs, TabHeading, ListItem, Content, Badge, Accordion, Footer, ActionSheet } from 'native-base';
import { gql, withApollo, compose } from 'react-apollo'
import { normalize } from '../../functions/normalize';
import { Empty, RenderWork } from '../../comp/FlatList'
import font from '../../resource/font';
import { StatusWork, Paymode } from '../../comp/Badge';
var BUTTONS = [
  { text: "ลูกค้ากดผิด", icon: "md-arrow-dropright", iconColor: "#2c8ef4", status: "B1" },
  { text: "ร้านปิด", icon: "md-arrow-dropright", iconColor: "#f42ced", status: "B2" },
  { text: "Order ซ้ำ", icon: "md-arrow-dropright", iconColor: "#ea943b", status: "B3" },
  { text: "สินค้าผิด", icon: "md-arrow-dropright", iconColor: "#fa213b", status: "B4" },
  { text: "เซลล์ key ผิด", icon: "md-arrow-dropright", iconColor: "#2c8ef4", status: "B5" },
  { text: "ลูกค้าสั่งร้านอื่นมาแล้ว", icon: "md-arrow-dropright", iconColor: "#f42ced", status: "B6" },
  { text: "เซลล์บอกราคาลูกค้าผิด", icon: "md-arrow-dropright", iconColor: "#ea943b", status: "B7" },

  { text: "ลูกค้าไม่โอนเงิน", icon: "md-arrow-dropright", iconColor: "#ea943b", status: "B8" },
  { text: "ลูกค้าไม่มีเงินจ่าย", icon: "md-arrow-dropright", iconColor: "#ea943b", status: "B9" },
  { text: "Cancel", icon: "close", iconColor: "#25de5b", status: "" }
];

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
      stack_tran: [],
      status_CHECKBOX: false,
      showWork_CN: [],
      loading: false
    }
  }

  componentDidMount = () => {
    this.queryZONE();
    this.worksub(); // 
    this.sucesswork();
    this.worksub_CN();
  }

  _RELOAD_MAIN2 = () => {
    this.props.client.resetStore();
    this.setState({ refreshing_2: true });
    this.queryZONE();
    this.worksub();
    this.sucesswork();
    this.worksub_CN();
  }

  checkDATA = (e) => {
    return (e == null) || (e == false)
  }


  queryZONE = () => {
    this.props.client.query({
      query: queryZONE,
      variables: {
        "MessengerID": global.NameOfMess
      }
    }).then((result) => {
      this.setState({ showZone: result.data.queryZONE })
    }).catch((err) => {
      console.log(err)
    });
  }

  worksub = () => {
    this.props.client.query({
      query: worksub_DL,
      variables: {
        "MessengerID": global.NameOfMess
      }
    }).then((result) => {
      this.setState({
        showWork: result.data.worksub_DL,
        loading: true,
      })
    }).catch((err) => {
      console.log('worksub', err)
    });
  }

  worksub_CN = () => {
    this.props.client.query({
      query: tsc_worklist,
      variables: {
        "MessengerID": global.NameOfMess
      }
    }).then((result) => {
      this.setState({
        showWork_CN: result.data.tsc_worklist
      })
    }).catch((err) => {
      console.log(err)
    });
  }

  sucesswork = () => {
    this.props.client.query({
      query: sucessworkV2,
      variables: {
        "MessengerID": global.NameOfMess
      }
    }).then((result) => {
      this.setState({ show_SUC: result.data.sucessworkV2, refreshing_2: false, CF_ALL_INVOICE: [], stack_IVOICE: [], stack_tran: [], loading: true, })
    }).catch((err) => {
      console.log(err)
    });
  }

  checkBillRework = (inb) => {
    this.props.client.query({
      query: checkBillRework,
      variables: {
        "invoiceNumber": inb
      }
    }).then((result) => {
      if (!result.data.checkBillRework.status) {
        Alert.alert('ไม่สามารถถอยบิลนี้ได้ ', 'บิล :' + inb + ' ได้ถูกสรุปยอดไปแล้ว')
      } else {
        Alert.alert(
          "คุณต้องการถอยบิล",
          'คุณต้องการถอยบิล:' + inb + '',
          [
            { text: "ไม่", },
            { text: "ถอย", onPress: () => this.AlertBillRework(inb) }
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
    }).then(() => {
      this._RELOAD_MAIN2()
    }).catch((err) => {
      console.log("err of AlertBillRework", err)
    });
  }

  del_blacklist = (inb) => {
    this.props.client.mutate({
      mutation: del_Blacklist,
      variables: {
        "invoice": inb,
        "messengerID": global.NameOfMess
      }
    }).catch((err) => {
      console.log("err of del_blacklist", err)
    });
  }

  submitwork = (s, in_V, n) => {
    if (s == 'B8' || s == 'B9') {
      this.props.client.mutate({
        mutation: Blacklist,
        variables: {
          "status": s,
          "invoice": in_V,
          "messengerID": global.NameOfMess
        }
      }).catch((err) => {
        console.log("err of Blacklist", err)
      });
    }

    this.props.client.mutate({
      mutation: submitworkV2_nonsig,
      variables: {
        "status": s,
        "invoiceNumber": in_V
      }
    }).then(() => {
      if (n == 1) {
        this._RELOAD_MAIN2()
      }
    }).catch((err) => {
      console.log("err of submitwork", err)
    });
  }

  // สรุปยอดเงิน
  checksubmitbill = () => {
    const { navigate } = this.props.navigation
    if (this.state.showWork.length > 0) {
      Alert.alert(
        'ไม่สามารถสรุปยอดได้ ',
        'คุณยังมีงานค้างส่งอีก :' + this.state.showWork.length + '  งาน                             กรุณาส่งงานให้หมดทุกงานก่อน'
      )
    } else if (this.state.showWork_CN.length > 0) {
      Alert.alert(
        'ไม่สามารถสรุปยอดได้ ',
        'คุณยังมีงานพิเศษค้างส่งอีก :' + this.state.showWork_CN.length + '  งาน                             กรุณาส่งงานให้หมดทุกงานก่อน'
      )
    } else {
      navigate('SumBill')
    }
  }

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  onConfirm = () => {
    let { CF_ALL_INVOICE } = this.state
    if (this.isEmpty(CF_ALL_INVOICE)) {
      Alert.alert(
        'ไม่สามารถส่งงานได้',
        'กรุณาเลือกงานที่จะส่ง'
      )
    } else {
      Alert.alert("ยืนยันการส่งงาน", "คุณต้องการยืนยัน การส่งงาน -สำเร็จ- หรือ -ไม่สำเร็จ- ?",
        [
          {
            text: "ไม่สำเร็จ", onPress: () =>
              ActionSheet.show({
                options: BUTTONS,
                title: "รายงานการส่ง",
                itemStyle: { fontFamily: font.regular, fontSize: normalize(16), lineHeight: normalize(20) },
                titleStyle: { fontFamily: font.semi, fontSize: normalize(18) }
              },
                buttonIndex => ((buttonIndex || buttonIndex === 0) && buttonIndex !== 9) && this.onFailed(buttonIndex))
          },
          { text: "สำเร็จ", onPress: () => this.onSubmitAll() }
        ]
      )
    }
  }

  onFailed = (buttonIndex) => {
    let { stack_IVOICE } = this.state;
    let filter = stack_IVOICE.filter(el => el);
    filter.forEach(async (el, i) => {
      let stop = ((i + 1) !== filter.length) ? 0 : 1;
      await this.submitwork(BUTTONS[buttonIndex].status, el, stop)
    })
  }

  onSubmitAll = () => {
    let newArr = this.state.stack_IVOICE.filter(el => el !== null)
    let findArr = this.state.showWork.find(el => el.invoiceNumber === newArr[0])
    this.onCheckEmail(findArr)
  }

  onCheckEmail = async (findArr) => {
    try {
      let { customerID, customerName } = findArr
      const { navigate } = this.props.navigation
      navigate("SubmitALLJob", {
        check_box: this.state.CF_ALL_INVOICE,
        in_V: this.state.stack_IVOICE,
        PAYMMODE: this.state.stack_tran,
        refresionTO: this._RELOAD_MAIN2,
        customerID,
        Cusname: customerName,
      })
    } catch (error) {
      console.log(error)
    }
  }

  onValueChangeCheckAll = () => {
    let { showWork } = this.state
    let n = this.state.CF_ALL_INVOICE;
    let s = this.state.stack_IVOICE;
    let t = this.state.stack_tran;
    if (this.state.status_CHECKBOX) {
      n = [];
      s = [];
      t = [];
    } else {
      showWork.forEach((el, i) => {
        n[el.invoiceNumber] = true
        s.push(el.invoiceNumber)
        t.push(el.PAYMMODE)
      })
    }

    this.setState({
      status_CHECKBOX: !this.state.status_CHECKBOX,
      CF_ALL_INVOICE: n,
      stack_IVOICE: s,
      stack_tran: t
    })
  }

  /**
  * index
  */
  onValueChange = (work, index) => {
    let n = this.state.CF_ALL_INVOICE;
    let s = this.state.stack_IVOICE;
    let t = this.state.stack_tran;

    if (this.state.CF_ALL_INVOICE[work.invoiceNumber]) {
      delete n[work.invoiceNumber]
      let findIndex = s.findIndex(el => el === work.invoiceNumber)
      s.splice(findIndex, 1)
      t.splice(findIndex, 1)
    } else {
      n[work.invoiceNumber] = !this.state.CF_ALL_INVOICE[work.invoiceNumber]
      t.push(work.PAYMMODE)
      s.push(work.invoiceNumber)
    }

    // n[index] = !this.state.CF_ALL_INVOICE[index]
    // s[index] = !this.state.CF_ALL_INVOICE[index] ? work.invoiceNumber : null
    // t[index] = this.state.CF_ALL_INVOICE[index] ? 'Default' : work.PAYMMODE
    this.setState({ CF_ALL_INVOICE: n, stack_IVOICE: s, stack_tran: t })
  }

  checkfordel = (invoiceNumber, id) => {
    this.props.client.query({
      query: countinv_DL,
      variables: {
        "invoiceNumber": invoiceNumber,
        "MessengerID": global.NameOfMess,
      }
    }).then((result) => {
      if (result.data.countinv_DL[0].count_inv > 1) {
        this.delinvoice(invoiceNumber, id)
      } else {
        Alert.alert(
          "ไม่สามารถลบได้",
          "ลบไม่ได้เนื่องจากบิลนี้มีเพียง " + result.data.countinv_DL[0].count_inv + " บิล",
          [
            { text: "OK", onPress: () => console.log('') }
          ]
        )
      }
    }).catch((err) => {
      console.log("err of submitedit", err)
    });
  }

  delinvoice = (invoiceNumber, id) => {
    this.props.client.mutate({
      mutation: delinvoice,
      variables: {
        "invoiceNumber": invoiceNumber,
        "id": id,
      }
    }).then(() => {
      this._RELOAD_MAIN2()
    }).catch((err) => {
      console.log("ERR OF TRACKING", err)
    });
  }

  del_amount = (invoice) => {
    this.props.client.mutate({
      mutation: del_amount,
      variables: {
        "invoice": invoice,
      }
    }).then(() => {
      this.edit_amount(invoice)
    }).catch((err) => {
      console.log("ERR OF TRACKING", err)
    });
  }

  edit_amount = (invoice) => {
    this.props.client.mutate({
      mutation: edit_amount,
      variables: {
        "invoice": invoice,
      }
    }).then(() => {
      this._RELOAD_MAIN2()
    }).catch((err) => {
      console.log("ERR OF TRACKING", err)
    });

  }

  render() {
    let { loading } = this.state
    return (
      <Container>
        <Tabs locked>
          <Tab heading={<TabHeading style={{ backgroundColor: '#66c2ff' }}>
            <Icon name="md-cart" style={{ fontSize: normalize(24) }} />
            <Text style={{ color: 'white', fontSize: normalize(18) }}>  รายการส่ง</Text>
          </TabHeading>}>
            {loading ?
              <View style={{ flex: 1 }}>
                <Content
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing_2}
                      onRefresh={this._RELOAD_MAIN2}
                    />
                  }
                >
                  {this.state.showZone.length > 0 && <View style={{
                    flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width, borderBottomColor: 'gray', borderBottomWidth: 0.5,
                    marginBottom: normalize(5),
                    paddingVertical: normalize(10),
                    paddingLeft: normalize(10)
                  }}>
                    <CheckBox value={this.state.status_CHECKBOX} onValueChange={() => this.onValueChangeCheckAll()} />
                    <Text style={{ fontSize: normalize(16) }}>เลือกทั้งหมด</Text>
                  </View>}

                  {this.state.showZone.length > 0 ?
                    this.state.showZone.map((item, index) => {
                      return this.renderShowZone(item, index)
                    }) : <Empty title={'ไม่มีรายการส่งงาน'} />}


                </Content>
                <TouchableOpacity onPress={this.onConfirm}>
                  <Footer style={{
                    backgroundColor: '#ff6c00',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Text style={{ color: 'white', fontFamily: font.semi, fontSize: normalize(20) }}>ยืนยันการส่งงาน</Text>
                  </Footer>
                </TouchableOpacity>
              </View> : <ActivityIndicator size={'small'} style={{ marginTop: normalize(10) }} />}
          </Tab>

          {/* ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}

          <Tab heading={<TabHeading style={{ backgroundColor: '#66c2ff' }}>
            <Icon name="md-checkbox-outline" style={{ fontSize: normalize(24) }} />
            <Text style={{ color: 'white', fontSize: normalize(18) }}>  ส่งสำเร็จ</Text>
          </TabHeading>}>
            <Content
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing_2}
                  onRefresh={this._RELOAD_MAIN2}
                />
              }>

              <FlatList
                data={this.state.show_SUC}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => this.renderWorkSuccess(item, index)}
                ListEmptyComponent={<Empty title={'ไม่มีรายการส่งสำเร็จ'} />}
              />
            </Content>

            <TouchableOpacity onPress={() => this.checksubmitbill()}>
              <Footer style={{
                backgroundColor: '#ff6c00',
                justifyContent: 'center',
                alignItems: 'center'
              }} >
                <Text style={{ color: 'white', fontFamily: font.semi, fontSize: normalize(20) }}>สรุปยอดเงิน</Text>
              </Footer>
            </TouchableOpacity>
          </Tab>

        </Tabs>

      </Container>
    );
  }

  renderShowZone = (item, index) => {
    let itemZone = item
    let showWork = this.state.showWork.filter(el => el.Zone === itemZone.Zone)
    return <Accordion
      key={item.Zone}
      dataArray={[{ Zone: item.Zone }]}
      renderHeader={(expanded) => (
        <View style={{ flexDirection: "row", padding: normalize(10), justifyContent: "space-between", alignItems: "center", backgroundColor: "#E2E2E1" }}>
          <Text style={{ fontFamily: font.semi, fontSize: normalize(18), paddingLeft: normalize(10), color: 'black' }}>{item.Zone}</Text>
          {expanded
            ? <Icon style={{ fontSize: normalize(18) }} name="remove-circle" />
            : <Icon style={{ fontSize: normalize(18) }} name="add-circle" />}
        </View>
      )}
      renderContent={() =>
        <FlatList
          data={showWork}
          extraData={[this.state.CF_ALL_INVOICE, this.state.status_CHECKBOX, this.state.refreshing_2]}
          keyExtractor={(item, index) => item.id}
          removeClippedSubviews={false}
          renderItem={({ item, index }) => this.renderWork(item, index, itemZone)}
        />
      }
    />
  }

  /**
   * item => showZone
   */
  renderWork = (work, index, item) => {
    const { navigate } = this.props.navigation
    // if (work.Zone === item.Zone) {
    return <RenderWork
      work={work}
      index={index}
      navigate={navigate}
      refreshing_2={this.state.refreshing_2}
      checked={this.state.CF_ALL_INVOICE[work.invoiceNumber]}
      onValueChange={(work, index) => this.onValueChange(work, index)}
      del_amount={(invoiceNumber) => this.del_amount(invoiceNumber)}
      checkforDel={(invoiceNumber, id) => this.checkfordel(invoiceNumber, id)}
      refresion={() => this._RELOAD_MAIN2()}
    />
    // }
  }

  renderWorkSuccess = (item, index) => {
    return <ListItem style={{ paddingTop: normalize(5), marginLeft: 0 }} key={index}>
      <View style={{ paddingLeft: normalize(10) }}>
        <TouchableOpacity onPress={() => this.checkBillRework(item.invoiceNumber)}>
          <Paymode item={item} />
          <Text style={{ fontSize: normalize(16) }}>{item.DELIVERYNAME}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ position: 'absolute', right: normalize(10), top: normalize(7), flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity onPress={() => this.checkBillRework(item.invoiceNumber)}>
          <Text style={{ fontFamily: font.semi, fontSize: normalize(16), color: 'orange', paddingHorizontal: normalize(5) }}>{item.SUM} ฿ </Text>
        </TouchableOpacity>

        <StatusWork item={item} checkBillRework={(invoiceNumber) => this.checkBillRework(invoiceNumber)} />
      </View>
    </ListItem>
  }
}

const GraphQL = compose(SearchTab)
export default withApollo(GraphQL)



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



const submitworkV2_nonsig = gql`
      mutation submitworkV2_nonsig($status:String!, $invoiceNumber:String!){
        submitworkV2_nonsig(status: $status, invoiceNumber: $invoiceNumber){
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

const delinvoice = gql`
    mutation delinvoice($invoiceNumber:String!,$id:String!){
        delinvoice(invoiceNumber: $invoiceNumber,id:$id){
            status
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

const del_amount = gql`
    mutation del_amount( $invoice:String!){
          del_amount(invoice: $invoice){
          status
        }
        }
    `

const edit_amount = gql`
    mutation edit_amount( $invoice:String!){
          edit_amount(invoice: $invoice){
          status
        }
        }
    `