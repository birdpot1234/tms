import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator,TouchableOpacity,StyleSheet } from 'react-native';
import { List, ListItem, SearchBar } from 'react-native-elements';

import { gql, withApollo, compose } from 'react-apollo'
import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, Input, Item, Grid, Col, ActionSheet, Badge } from 'native-base';
import Communications from 'react-native-communications';
import CompleteFlatList from 'react-native-complete-flatlist';

class AutoSearch extends Component {
    static navigationOptions = {
        header: null
    }
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

  // makeRemoteRequest = () => {
  //   const url = `https://randomuser.me/api/?&results=20`;
  //   this.setState({ loading: true });

  //   fetch(url)
  //     .then(res => res.json())
  //     .then(res => {
  //       this.setState({
  //         data: res.results,
  //         error: res.error || null,
  //         loading: false,
  //       });
  //       this.arrayholder = res.results;
  //     })
  //     .catch(error => {
  //       this.setState({ error, loading: false });
  //     });
  // };

  headerSearch = () => {
    this.props.client.query({
        query: select_INV,
        variables: {
            "MessengerID": global.NameOfMess
        }
    }).then((result) => {
        if(result.data.select_INV.length==0)
        {
            this.setState({
                data: [],
                loading: false,
            })
            this.arrayholder = [];
        }else{
            this.setState({
                data: result.data.select_INV,
                loading: false,
            })
            this.arrayholder = result.data.select_INV;
        }
       
         console.log( result.data.select_INV)
    }).catch((err) => {
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
    console.log(this.arrayholder);
    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.invoiceNumber.toUpperCase()} ${item.customerName.toUpperCase()} `;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      data: newData,
    });
  };

//   renderHeader = () => {
//     const { navigate } = this.props.navigation
//     return (
  
//     );
//   };

  render() {
    const { navigate } = this.props.navigation
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }
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
            <Title>ค้นหาชุดเอกสาร</Title>
        </Body>
        <Right />
       
    </Header>
    <Content>
        {/* <SearchBar
        placeholder="Search..."
        lightTheme
        round
        onChangeText={text => this.searchFilterFunction(text)}
        autoCorrect={false}
      /> */}
          <SearchBar
                                placeholder="Search..."
                                 lightTheme
                                inputStyle={{backgroundColor: 'white '}}
                                containerStyle={{backgroundColor: 'white'}}
                                round
                                // onFocus  ={() =>  { navigate('AutoSearch') }}
                                icon={{ color: '#3B6693', style: styles.searchIcon, name: 'search' }}
                                clearIcon={{ color: '#86939e', name: 'close' }}
                                onChangeText={text => this.searchFilterFunction(text)}
                                //value ={this.props.navigation.state.params.id.invoiceNumber==undefined?'Search':this.props.navigation.state.params.id.invoiceNumber}
                              //  onChangeText={text => this.searchFilterFunction(text)}
                                autoCorrect={false}
                            />
   
   
      {/* <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}> */}
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
                   // <TouchableOpacity   onPress={() =>  { navigate('ProfileTab') }}>
             <TouchableOpacity   onPress={() =>  { navigate('AddCN',{id:item}) }}>
      
            <ListItem
              roundAvatar
              title={`${item.invoiceNumber}`}
              subtitle={item.customerName}
            //   avatar={{ uri: item.picture.thumbnail }}
              containerStyle={{ borderBottomWidth: 0 }}
            />
            </TouchableOpacity>
          )}
          keyExtractor={item => item.invoiceNumber}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
        />
      {/* </List> */}
      </Content>
     </Container>
      
    );
  }
}

//export default AutoSearch;

const GraphQL = compose(AutoSearch)
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
            customerID
            customerName
            addressShipment
            Zone
            DateUpdate
        }
    }
`