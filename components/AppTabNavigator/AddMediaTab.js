import React, { Component } from 'react'
import { Text, StyleSheet, View, Dimensions, RefreshControl, CheckBox, Alert, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native'
import { Icon, Container, Header, Left, Body, Title, Right, Tab, Tabs, TabHeading, Button, Subtitle, ListItem, Content, Badge, Accordion, Footer, ActionSheet } from 'native-base';
import { gql, withApollo, compose } from 'react-apollo'
import Swipeout from 'react-native-swipeout'
import { normalize } from '../../functions/normalize';
import { Empty, RenderWorkSpecial } from '../../comp/FlatList';
import font from '../../resource/font';
import { StatusWork } from '../../comp/Badge';

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
      loading: false
    }
    //  this.props.client.resetStore();
  }

  componentDidMount = () => {
    this.queryZONE_CN();
    this.worksub_CN();
    this.sucesswork_CN();
  }

  _RELOAD_MAIN2 = () => {
    this.props.client.resetStore();
    this.setState({ refreshing_2_CN: true });
    this.queryZONE_CN();
    this.worksub_CN();
    this.sucesswork_CN();
  }

  checkDATA = (e) => {
    return (e == null) || (e == false)
  }

  queryZONE_CN = () => {
    this.props.client.query({
      query: TSC_select_Zone,
      variables: {
        "MessengerID": global.NameOfMess
      }
    }).then((result) => {
      this.setState({ showZone_CN: result.data.TSC_select_Zone })
    }).catch((err) => {
      console.log(err)
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
        showWork_CN: result.data.tsc_worklist,
        loading: true
      })
    }).catch((err) => {
      console.log(err)
    });
  }


  sucesswork_CN = () => {
    this.props.client.query({
      query: sucesswork_CN,
      variables: {
        "MessengerID": global.NameOfMess
      }
    }).then((result) => {
      this.setState({
        show_SUC_CN: result.data.sucesswork_CN,
        CF_ALL_INVOICE_CN: [],
        stack_IVOICE_CN: [],
        refreshing_2_CN: false,
        status_CHECKBOX: false
      })
    }).catch((err) => {
      console.log(err)
    });
  }

  checkBillRework = (inb) => {
    this.props.client.query({
      query: checkBillRework_sp,
      variables: {
        "invoiceNumber": inb
      }
    }).then((result) => {
      if (!result.data.checkBillRework_sp.status) {
        Alert.alert('ไม่สามารถถอยบิลนี้ได้ ', 'บิล :' + inb + ' ได้ถูกสรุปยอดไปแล้ว')
      } else {
        Alert.alert(
          "คุณต้องการถอยบิล",
          'คุณต้องการถอยบิล:' + inb,
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
    this.props.client.mutate({
      mutation: Rework_sp,
      variables: {
        "invoiceNumber": inb
      }
    }).then(() => {
      this._RELOAD_MAIN2()
    }).catch((err) => {
      console.log("err of submitwork", err)
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
      if (!result.data.submit_TSC.status) {
        Alert.alert("ส่งไม่สำเร็จ", "กรุณากดส่งใหม่อีกครั้ง")
      } else {
        this.GET_LOCATE(s, in_V, n);
      }
    }).catch((err) => {
      console.log("err of submitwork", err)
    });
  }

  GET_LOCATE = (s, in_V, n) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let { latitude, longitude } = position.coords
        this.tracking(s, in_V, n, latitude, longitude)
      },
      (error) => {
        console.log(error)
        this.tracking(s, in_V, n, -1, -1)
      }
    );
  }

  onFailed = (buttonIndex) => {
    let { stack_IVOICE_CN } = this.state
    let filter = stack_IVOICE_CN.filter(el => el);
    filter.forEach(async (el, i) => {
      let stop = ((i + 1) !== filter.length) ? 0 : 1;
      await this.submitwork(BUTTONS[buttonIndex].status, el, stop)
    })
  }

  tracking = (s, in_V, n, latitude, longitude) => {
    this.props.client.mutate({
      mutation: tracking_CN,
      variables: {
        "invoice": in_V,
        "status": s,
        "messengerID": global.NameOfMess,
        "lat": latitude,
        "long": longitude,
      }
    }).then(() => {
      if (n == 1) {
        this._RELOAD_MAIN2()
      }
    }).catch((err) => {
      console.log("ERR OF TRACKING", err)
    });
  }

  onValueChangeCheckAll = () => {
    let { showWork_CN } = this.state
    let n = this.state.CF_ALL_INVOICE_CN;
    let s = this.state.stack_IVOICE_CN;

    showWork_CN.forEach((el, i) => {
      n[i] = !this.state.status_CHECKBOX;
      s[i] = el.invoiceNumber
    })

    this.setState({
      status_CHECKBOX: !this.state.status_CHECKBOX,
      CF_ALL_INVOICE_CN: n,
      stack_IVOICE_CN: s
    })
  }

  onValueChange = (work, index) => {
    let n = this.state.CF_ALL_INVOICE_CN.slice();
    let s = this.state.stack_IVOICE_CN.slice();
    n[index] = !this.state.CF_ALL_INVOICE_CN[index];
    s[index] = !this.state.CF_ALL_INVOICE_CN[index] ? work.invoiceNumber : null
    this.setState({ CF_ALL_INVOICE_CN: n, stack_IVOICE_CN: s })
  }

  onConfirm = () => {
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
                  itemStyle: { fontFamily: font.regular, fontSize: normalize(16), lineHeight: normalize(20) },
                  titleStyle: { fontFamily: font.semi, fontSize: normalize(18) },
                  title: "รายงานการส่ง"
                },
                buttonIndex => ((buttonIndex || buttonIndex === 0) && buttonIndex !== 7) && this.onFailed(buttonIndex)
              )
          },
          { text: "สำเร็จ", onPress: () => this.onSubmitAll() }
        ]
      )
    }
  }

  onSubmitAll = () => {
    let { stack_IVOICE_CN } = this.state
    let newArr = stack_IVOICE_CN.filter(el => el !== null)
    let findArr = this.state.showWork_CN.find(el => el.invoiceNumber === newArr[0])
    this.onCheckEmail(findArr)
  }

  onCheckEmail = async (findArr) => {
    try {
      // let { customerID, customerName } = findArr
      const { navigate } = this.props.navigation
      navigate("SubmitAll_TSC", {
        check_box: this.state.CF_ALL_INVOICE_CN,
        in_V: this.state.stack_IVOICE_CN,
        refresionTO: this._RELOAD_MAIN2
      })
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    let { loading, showZone_CN } = this.state
    const { navigate } = this.props.navigation
    return (
      <Container>
        <Tabs locked>
          <Tab heading={<TabHeading style={{ backgroundColor: '#66c2ff' }}>
            <Icon name="md-cart" style={{ fontSize: normalize(24) }} />
            <Text style={{ color: 'white', fontSize: normalize(18) }}>  รายการส่ง</Text>
          </TabHeading>}>
            {loading ? <View style={{ flex: 1 }}>
              <Content
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing_2_CN}
                    onRefresh={this._RELOAD_MAIN2}
                  />
                }>

                {showZone_CN.length > 0 && <View style={{
                  flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width, borderBottomColor: 'gray', borderBottomWidth: 0.5,
                  marginBottom: normalize(5),
                  paddingVertical: normalize(10),
                  paddingLeft: normalize(10)
                }}>
                  <CheckBox value={this.state.status_CHECKBOX} onValueChange={() => this.onValueChangeCheckAll()} />
                  <Text style={{ fontSize: normalize(16) }}>เลือกทั้งหมด</Text>
                </View>}

                {this.state.showZone_CN.length > 0 ?
                  this.state.showZone_CN.map((item, index) => {
                    return this.renderShowZone(item, index)
                  }) : <Empty title={'ไม่มีรายการส่งงานพิเศษ'} />}

              </Content>


              <TouchableOpacity style={{ position: 'absolute', right: normalize(8), bottom: normalize(55) }}
                onPress={() => navigate('AddCN', { id: '', refresion: this._RELOAD_MAIN2 })}>
                <Icon style={{ fontSize: normalize(60), color: "green" }} name="add-circle" />
              </TouchableOpacity>

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
                  refreshing={this.state.refreshing_2_CN}
                  onRefresh={this._RELOAD_MAIN2}
                />
              }>

              <FlatList
                data={this.state.show_SUC_CN}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => this.renderWorkSuccess(item, index)}
                ListEmptyComponent={<Empty title={'ไม่มีรายการพิเศษส่งสำเร็จ'} />}
              />
            </Content>
          </Tab>
        </Tabs>
      </Container>
    );
  }


  renderShowZone = (item, index) => {
    let itemZone = item
    return <Accordion
      key={index}
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
          data={this.state.showWork_CN}
          extraData={[this.state.CF_ALL_INVOICE_CN, this.state.status_CHECKBOX]}
          keyExtractor={(item, index) => index.toString()}
          removeClippedSubviews={false}
          renderItem={({ item, index }) => this.renderWork(item, index, itemZone)}
        />}
    />
  }

  /**
   * item => showZone
   */
  renderWork = (work, index, item) => {
    const { navigate } = this.props.navigation;
    if (work.Zone === item.Zone) {
      return <RenderWorkSpecial
        work={work}
        index={index}
        navigate={navigate}
        checked={this.state.CF_ALL_INVOICE_CN[index]}
        onValueChange={(work, index) => this.onValueChange(work, index)}
        refresion={() => this._RELOAD_MAIN2()}
      />
    }
  }

  renderWorkSuccess = (item, index) => {
    return <ListItem style={{ paddingTop: normalize(5), marginLeft: 0 }} key={index}>
      <View style={{ paddingLeft: normalize(10) }}>
        <TouchableOpacity onPress={() => this.checkBillRework(item.tsc_document)}>
          <Text style={styles.storeLabel}>{item.tsc_document}</Text>
          <Text style={{ fontSize: normalize(16) }}>{item.CustomerName || '-'}</Text>
        </TouchableOpacity>
      </View>

      <View style={{ position: 'absolute', right: normalize(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        {
          (() => {
            if (item.status_finish == "A1") {
              return (
                <View style={{ alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width / 5.5 }} >
                  <Badge success style={{ height: normalize(19), alignItems: 'center', justifyContent: 'center' }} >
                    <TouchableOpacity onPress={() => this.checkBillRework(item.tsc_document)}>
                      <Text style={{ fontSize: normalize(15), color: 'white' }}>ส่งสำเร็จ</Text>
                    </TouchableOpacity>
                  </Badge>
                </View>
              )
            } else if (item.status_finish == "A2") {
              return (
                <View style={{ alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width / 5.5 }} >
                  <Badge warning style={{ height: normalize(19), alignItems: 'center', justifyContent: 'center' }} >
                    <TouchableOpacity onPress={() => this.checkBillRework(item.tsc_document)}>
                      <Text style={{ fontSize: normalize(15), color: 'white' }}>มีการแก้ไข</Text>
                    </TouchableOpacity>
                  </Badge>
                </View>
              )
            } else {
              return (
                <View style={{ alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width / 5.5 }} >
                  <Badge style={{ height: normalize(19), alignItems: 'center', justifyContent: 'center' }} >
                    <TouchableOpacity onPress={() => this.checkBillRework(item.tsc_document)}>
                      <Text style={{ fontSize: normalize(15), color: 'white' }}>ส่งไม่สำเร็จ</Text>
                    </TouchableOpacity>
                  </Badge>
                </View>
              )
            }
          })()
        }
      </View>
    </ListItem>
  }

}

const GraphQL = compose(AddMediaTab)
export default withApollo(GraphQL)

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
    fontSize: normalize(18),
    color: 'black'
  },
  detailContent: {
    width: Dimensions.get('window').width,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderRightWidth: Math.floor(normalize(2)),
    borderLeftWidth: Math.floor(normalize(2)),
    borderTopWidth: Math.floor(normalize(1)),
    borderBottomWidth: Math.floor(normalize(1)),
    height: normalize(50),
    justifyContent: 'center'
  }
})