import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, TextInput, TouchableOpacity, Alert, Platform, StatusBar } from 'react-native'

import { Icon, Container, Header, Left, Body, Right, Content, Button, Form, Item, Label, Input, Title, Tab } from 'native-base'

import MainMenu from './MainMenu';

import HomeTab from './AppTabNavigator/HomeTab';
import AddMediaTab from './AppTabNavigator/AddMediaTab';
import LikesTab from './AppTabNavigator/LikesTab';
import ProfileTab from './AppTabNavigator/ProfileTab';
import SearchTab from './AppTabNavigator/SearchTab';

import CheckWork from './AppTabNavigator/DetailTab/CheckWork';
import MapScreen from './AppTabNavigator/DetailTab/MapScreen';
import DetailWork from './AppTabNavigator/DetailTab/DetailWork';
import EditItem from './AppTabNavigator/DetailTab/EditItem';
import SubmitJob from './AppTabNavigator/DetailTab/SubmitJob';
import DetailBill from './AppTabNavigator/DetailTab/DetailBill';
import SumBill from './AppTabNavigator/DetailTab/SumBill';
import SubmitALLJob from './AppTabNavigator/DetailTab/SubmitALLJob';
import History from './AppTabNavigator/DetailTab/History';

import { StackNavigator, TabNavigator } from "react-navigation";


class mainScreen extends Component {

    static navigationOptions = {
        header: null
    }

    render() {

        return (
            <Container>
                {/* <StatusBar backgroundColor="#33adff"
                    barStyle="light-content" hidden={false} /> */}
                <AppStackNavigator />
            </Container>
        );
    }
}

export default mainScreen;

const AppStackNavigator = StackNavigator({
    MainMenu: {
        screen: MainMenu
        
    },
    // *** routeแยกหน้า
    // TabPage: { 
    //     screen: ({navigation}) => <TabPage screenProps={{ rootNavigation: navigation }} />,
    //     navigationOptions: () => ({
    //         header: null
    //       }),
    // },
    
    TabPageLink: {
     
        screen: TabNavigator({
            HomeTab: {
                screen: StackNavigator({
                    Home: {
                        screen: HomeTab,
                        navigationOptions: () => ({
                            header: null
                        }),
                    },
                    CheckWork: {
                        screen: CheckWork,
                        navigationOptions: () => ({
                            header: null
                        }),
                    }
                }),
                navigationOptions: () => ({
                    tabBarLabel: "ตรวจ",
                    tabBarIcon: ({ tintColor }) => (
                        <Icon name="ios-create" style={{
                            color:
                                tintColor
                        }} />
                    )
                })
            },
            SearchTab: {
                screen: StackNavigator({
                    Search: {
                        screen: SearchTab,
                        navigationOptions: () => ({
                            header: null,
                        }),
                    },
                    SubmitALLJob: {
                        screen: SubmitALLJob,
                        navigationOptions: () => ({
                            header: null,
                        }),
                    },
                    DetailWork: {
                        screen: DetailWork,
                        navigationOptions: () => ({
                            header: null
                        }),
                    },
                    EditItem: {
                        screen: EditItem,
                        navigationOptions: () => ({
                            header: null
                        }),
                    },
                    MapScreen: {
                        screen: MapScreen,
                        navigationOptions: () => ({
                            header: null
                        }),
                    },
                    SubmitJob: {
                        screen: SubmitJob,
                        navigationOptions: () => ({
                            header: null
                        }),
                    },
                    SumBill: {
                        screen: SumBill,
                        navigationOptions: () => ({
                            header: null
                        }),
                    },
                    DetailBill: {
                        screen: DetailBill,
                        navigationOptions: () => ({
                            header: null
                        }),
                    },
                }),
                navigationOptions: () => ({
                    tabBarLabel: "ส่งงาน",
                    tabBarIcon: ({ tintColor }) => (
                        <Icon name="md-car" style={{
                            color:
                                tintColor
                        }} />
                    )
                }),
                path: 'search'
            },
            AddMediaTab: {
                screen: AddMediaTab
            },
            LikesTab: {
                screen: StackNavigator({
                    Like:{
                        screen: LikesTab,
                        navigationOptions: () => ({
                            header: null
                        }),
                    },
                    History: {
                        screen: History,
                        navigationOptions: () => ({
                            header: null
                        }),
                    },
                
              
                }),
                navigationOptions: () => ({
                    tabBarLabel: "ประวัติ",
                    tabBarIcon: ({ tintColor }) => (
                        <Icon name="md-car" style={{
                            color:
                                tintColor
                        }} />
                    )
                }),
                path: 'like'
            },
            ProfileTab: {
                screen: ProfileTab
            }
        }, {
                animationEnabled: false,
                swipeEnabled: false,
                tabBarPosition: "bottom",
                tabBarOptions: {
                    style: {
                        ...Platform.select({
                            android: {
                                backgroundColor: 'white'
                            }
                        })
                    }, indicatorStyle: {
                        backgroundColor: '#00BFFF'
                    },
                    activeTintColor: '#000',
                    inactiveTintColor: '#d1cece',
                    showLabel: true,
                    showIcon: true,
                },
            }),
        navigationOptions: () => ({
            header: null,
            // statusBarBackgroundColor: '#33adff'
        })
    }
},
    {
        initialRouteName: 'MainMenu',
        // statusBarBackgroundColor: '#33adff'
    });

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerWrapper: {
        flex: 1,
        alignItems: "center"
    },
    headerText: {
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 20,
        color: 'black'
    }
});
