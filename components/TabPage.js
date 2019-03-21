import React, { Component } from 'react'
import { Text, StyleSheet, View, Platform, StatusBar } from 'react-native'

import HomeTab from './AppTabNavigator/HomeTab';
import AddMediaTab from './AppTabNavigator/AddMediaTab';
import LikesTab from './AppTabNavigator/LikesTab';
import ProfileTab from './AppTabNavigator/ProfileTab';
import SearchTab from './AppTabNavigator/SearchTab';

import CheckWork from './AppTabNavigator/DetailTab/CheckWork';
import MapScreen from './AppTabNavigator/DetailTab/MapScreen'
import DetailWork from './AppTabNavigator/DetailTab/DetailWork';
import EditItem from './AppTabNavigator/DetailTab/EditItem';
import SubmitJob from './AppTabNavigator/DetailTab/SubmitJob';
import History from './AppTabNavigator/DetailTab/History';
import DetailCN from './AppTabNavigator/DetailTab/DetailCN';
import AddCN from './AppTabNavigator/DetailTab/AddCN';
import SearchView from './AppTabNavigator/DetailTab/SearchView';
import AutoSearch from './AppTabNavigator/SearchTab/AutoSearch';
import Submit_TSC from './AppTabNavigator/SubmitWork/Submit_TSC';
import SubmitAll_TSC from './AppTabNavigator/SubmitWork/SubmitAll_TSC';
import RecieveWork from './AppTabNavigator/SpecialWork/RecieveWork'
import MainMenu from './MainMenu';
import { TabNavigator, StackNavigator } from 'react-navigation'

import { Icon } from 'native-base'

class TabPage extends Component {

    static navigationOptions = {
        header: null
    }

    render() {

        return (
            <AppTabNavigator screenProps={{ rootNavigation: this.props.screenProps.rootNavigation }} />
        )
    }
}

export default TabPage;


// const mainmenu = StackNavigator({
//     MainMenu: {
//         screen: MainMenu,
//         navigationOptions: () => ({
//             header: null
//         }),
//     },
//     navigationOptions: () => ({
//         tabBarLabel: "main",
//         tabBarIcon: ({ tintColor }) => (
//             <Icon name="md-car" style={{
//                 color:
//                     tintColor
//             }} />
//         )
//     }),
//     path: 'MainMenu'

// })
const Checking = StackNavigator({
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
    },
    RecieveWork: {
        screen: RecieveWork,
        navigationOptions: () => ({
            header: null
        }),
    }
})

const Working = StackNavigator({
    Search: {
        screen: SearchTab,
        navigationOptions: () => ({
            header: null
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
})

const AppTabNavigator = TabNavigator({
    HomeTab: {
        screen: Checking,
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
        screen: Working,
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
        screen: StackNavigator({
            AddMediaTab: {
                screen: AddMediaTab,
                navigationOptions: () => ({
                    header: null
                }),
            },
            DetailCN: {
                screen: DetailCN,
                navigationOptions: () => ({
                    header: null
                }),
            },
            AddCN: {
                screen: AddCN,
                navigationOptions: () => ({
                    header: null
                }),
            },
            SearchView: {
                screen: SearchView,
                navigationOptions: () => ({
                    header: null
                }),
            },
            AutoSearch: {
                screen: AutoSearch,
                navigationOptions: () => ({
                    header: null
                }),
            },
            ProfileTab: {
                screen: ProfileTab,
                navigationOptions: () => ({
                    header: null
                }),
            },
            Submit_TSC: {
                screen: Submit_TSC,
                navigationOptions: () => ({
                    header: null
                }),
            },

            navigationOptions: () => ({
                tabBarLabel: "งานพิเศษ",
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="md-car" style={{
                        color:
                            tintColor
                    }} />
                )
            }),


        }),
    },
    LikesTab: {
        screen: StackNavigator({
            Like: {
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
        screen: StackNavigator({
            ProfileTab: {
                screen: ProfileTab,
                navigationOptions: () => ({
                    header: null
                }),
            }


        }),
        navigationOptions: () => ({
            tabBarLabel: "BlackList",
            tabBarIcon: ({ tintColor }) => (
                <Icon name="paper" style={{
                    color:
                        tintColor
                }} />
            )
        }),
        path: 'profile'

    }
}, {
        animationEnabled: true,
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
    });

const styles = StyleSheet.create({})
