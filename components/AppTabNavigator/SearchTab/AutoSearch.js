import React, { Component } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, TextInput, Text } from 'react-native';
import { ListItem } from 'react-native-elements';

import { gql, withApollo, compose } from 'react-apollo'
import { Icon, Container, Content } from 'native-base';
import { normalize, width } from '../../../functions/normalize';
import font from '../../../resource/font';
import { Empty } from '../../../comp/FlatList';

class AutoSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      error: null,

    };
    this.arrayholder = [];
  }


  componentDidMount() {
    this.headerSearch();
  }

  headerSearch = () => {
    this.props.client.query({
      query: select_INV,
      variables: {
        "MessengerID": global.NameOfMess
      }
    }).then((result) => {
      if (result.data.select_INV.length == 0) {
        this.setState({ data: [], loading: false, })
        this.arrayholder = [];
      } else {
        this.setState({ data: result.data.select_INV, loading: false, })
        this.arrayholder = result.data.select_INV;
      }
    }).catch(() => {
      this.setState({ error, loading: false });
    });
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%',
        }}
      />
    );
  };

  searchFilterFunction = text => {
    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.invoiceNumber.toUpperCase()} ${item.customerName.toUpperCase()} `;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    this.setState({ data: newData, });
  };


  render() {
    return (<Container>
      <Content contentContainerStyle={{ flex: 1, width }}>
        <View style={styles.search}>
          <Icon name={'search'} style={{ width: normalize(20), height: normalize(20) }} />
          <TextInput
            style={{ fontSize: normalize(20), fontFamily: font.medium, marginLeft: normalize(10), width: '100%', padding: 0, margin: 0 }}
            placeholder={'ค้นหา'}
            underlineColorAndroid={'transparent'}
            onChangeText={text => this.searchFilterFunction(text)}
            autoCorrect={false}
          />
        </View>

        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => { navigate('AddCN', { id: item }) }}>
              <ListItem
                roundAvatar
                title={<Text style={{ fontSize: normalize(18), fontFamily: font.medium, color: 'black' }}>{item.invoiceNumber}</Text>}
                subtitle={<Text style={{ fontSize: normalize(16), fontFamily: font.regular }}>{item.customerName}</Text>}
                containerStyle={{ borderBottomWidth: 0 }}
              />
            </TouchableOpacity>
          )}
          keyExtractor={item => item.invoiceNumber}
          ListEmptyComponent={<Empty title='ไม่มีรายการพิเศษ' />}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
        />
      </Content>
    </Container>)
  }
}

//export default AutoSearch;

const GraphQL = compose(AutoSearch)
export default withApollo(GraphQL)
const styles = StyleSheet.create({
  search: {
    flexDirection: 'row', alignItems: 'center', width: width * 0.9, borderRadius: normalize(20), borderWidth: 1,
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(3),
    margin: normalize(10),
  }
})
const select_INV = gql`
    query select_INV($MessengerID:String!){
        select_INV(MessengerID: $MessengerID){
            invoiceNumber
            customerID
            customerName
            addressShipment
            Zone
            DateUpdate
        }
    }
`