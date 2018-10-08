import React, { Component } from 'react';
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, ScrollView } from 'react-native';

import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, FooterTab, Fab } from 'native-base';
import MapView from 'react-native-maps';

export default class MapScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            active: 'true'
        }
    }

    render() {

        const { navigate } = this.props.navigation
        const { width, height } = Dimensions.get('window');
        const ratio = width / height;

        const coordinates = {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0922 * ratio,
        };


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
                        <Title>MAP</Title>
                    </Body>

                    <Right />
                </Header>

                <Content>
                    <View style={{ width, height }}>
                        <MapView style={styles.map}
                            initialRegion={{
                                latitude: 59.32932349999999,
                                longitude: 18.068580800000063,
                                latitudeDelta: 0.1,
                                longitudeDelta: 0.1
                            }}
                        >
                        </MapView>
                    </View>
                    <View style={{ bottom: 150 }}>
                        <Fab
                            active={this.state.active}
                            direction="up"
                            containerStyle={{}}
                            style={{ backgroundColor: '#5067FF' }}
                            position="bottomRight"
                            onPress={() => this.setState({ active: !this.state.active })}>
                            <Icon name="ios-apps" />
                            <Button style={{ backgroundColor: '#34A34F' }}>
                                <Icon name="ios-call" />
                            </Button>
                            <Button style={{ backgroundColor: '#FFEE21' }}>
                                <Icon name="md-checkbox-outline" />
                            </Button>
                        </Fab>
                    </View>
                </Content>

                {/* <Footer style={{
                    backgroundColor: '#66c2ff',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginHorizontal: 3 }}>
                        <Button success style={{
                            width: Dimensions.get('window').width / 2.5,
                            height: '80%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}
                        >
                            <Icon name='ios-call' />
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>CONFIRM</Text>
                        </Button>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginHorizontal: 3 }}>
                        <Button warning style={{
                            width: Dimensions.get('window').width / 2.5,
                            height: '80%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}
                        >
                            <Icon name='md-checkbox-outline' />
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>CONFIRM</Text>
                        </Button>
                    </View>
                </Footer> */}
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
});
