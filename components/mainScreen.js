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
import DetailCN from './AppTabNavigator/DetailTab/DetailCN';
import AddCN from './AppTabNavigator/DetailTab/AddCN';
import SearchView from './AppTabNavigator/DetailTab/SearchView';
import AutoSearch from './AppTabNavigator/SearchTab/AutoSearch';
import Submit_TSC from './AppTabNavigator/SubmitWork/Submit_TSC';
import SubmitAll_TSC from './AppTabNavigator/SubmitWork/SubmitAll_TSC';
import RecieveWork from './AppTabNavigator/SpecialWork/RecieveWork'
import CNDetail from './AppTabNavigator/CN_DL/CNDetail'
import { createStackNavigator, createBottomTabNavigator } from "react-navigation";
import customButton from './AppTabNavigator/testComponent/customButton'
import { normalize, width } from '../functions/normalize';
import font from '../resource/font';

import { HeaderTitle, HeaderBack } from '../comp/Header'

export const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? normalize(30) : StatusBar.currentHeight;
export function paddingStatus() {
    return Platform.OS === 'ios' ? { height: (height > 812 || width > 812) ? normalize(60) : normalize(50) } :
        Platform.Version >= 20 ?
            { height: StatusBar.currentHeight + normalize(55), borderTopColor: "#66c2ff", borderTopWidth: normalize(20) } : null
}

export const navigationOptions = {
    headerStyle: {
        backgroundColor: "#66c2ff",
        shadowColor: 'transparent',
        shadowRadius: 0,
        shadowOffset: {
            height: 0,
        },
        borderColor: 'transparent',
        borderWidth: 0,
        elevation: 0,
        paddingVertical: normalize(8),
        ...paddingStatus()
    },
    headerTitleStyle: {
        alignItems: 'center',
        textAlign: 'center',
        alignSelf: 'center',
        fontFamily: font.medium,
        width
    },
    headerTextStyle: {
        textAlign: 'center',
        flexGrow: 1
    },
    drawerLockMode: 'locked-open',
    gesturesEnabled: false,
    headerMode: 'screen',
    mode: Platform.OS === 'ios' ? 'modal' : 'card',
    cardStack: {
        gesturesEnabled: false
    },
    // drawerLockMode: 'locked-closed'
}


class mainScreen extends Component {

    static navigationOptions = {
        header: null
    }

    render() {

        return (
            <AppStackNavigator />
        );
    }
}

export default mainScreen;

const AppStackNavigator = createStackNavigator({
    MainMenu: {
        screen: MainMenu,
        navigationOptions: {
            headerRight: <View />,
            headerTitle: <View style={{ flex: 1 }}>
                <Image source={require('../assets/dplus.png')} resizeMode={'contain'} style={{ borderRadius: 15, width: normalize(40), height: normalize(40), alignSelf: 'center' }} />
            </View>,
            headerLeft: <View />,
            ...navigationOptions
        }
    },

    TabPageLink: {
        screen: createBottomTabNavigator({
            HomeTab: {
                screen: createStackNavigator({
                    Home: {
                        screen: HomeTab,
                        navigationOptions: () => ({
                            ...navigationOptions,
                            headerTitle: <HeaderTitle title={'ตรวจงาน'} />,
                            headerLeft: <HeaderBack />,
                            headerRight: <View />
                        }),
                    },
                    CheckWork: {
                        screen: CheckWork,
                        navigationOptions: () => ({
                            ...navigationOptions,
                            headerTitle: <HeaderTitle title={'รายละเอียด'} />,
                            headerLeft: <HeaderBack />,
                            headerRight: <View />
                        }),
                    },
                    RecieveWork: {
                        screen: RecieveWork,
                        navigationOptions: () => ({
                            ...navigationOptions,
                            headerTitle: <HeaderTitle title={'รายละเอียดงานพิเศษ'} />,
                            headerLeft: <HeaderBack />,
                            headerRight: <View />
                        }),
                    }
                }),
                navigationOptions: () => ({
                    tabBarLabel: "ตรวจ",
                    tabBarIcon: ({ tintColor }) => (
                        <Icon name="ios-create" style={{ color: tintColor, fontSize: normalize(30) }} />
                    )
                })
            },
            SearchTab: {
                screen: createStackNavigator({
                    Search: {
                        screen: SearchTab,
                        navigationOptions: () => ({
                            ...navigationOptions,
                            headerTitle: <HeaderTitle title={'ส่งงาน'} />,
                            headerLeft: <HeaderBack />,
                            headerRight: <View />
                        }),
                    },
                    SubmitALLJob: {
                        screen: SubmitALLJob,
                        navigationOptions: () => ({
                            ...navigationOptions,
                            headerTitle: <HeaderTitle title={'ยืนยันการส่งงาน'} />,
                            headerLeft: <HeaderBack />,
                            headerRight: <View />
                        }),
                    },
                    DetailWork: {
                        screen: DetailWork,
                        navigationOptions: () => ({
                            ...navigationOptions,
                            headerTitle: <HeaderTitle title={'รายละเอียดบิล'} />,
                            headerLeft: <HeaderBack />,
                            headerRight: <View />
                        }),
                    },
                    EditItem: {
                        screen: EditItem,
                        navigationOptions: () => ({
                            ...navigationOptions,
                            headerTitle: <HeaderTitle title={'แก้ไขรายละเอียด'} />,
                            headerLeft: <HeaderBack />,
                            headerRight: <View />
                        }),
                    },
                    CNDetail: {
                        screen: CNDetail,
                        navigationOptions: () => ({
                            ...navigationOptions,
                            headerTitle: <HeaderTitle title={'ทำรายการส่วนลด'} />,
                            headerLeft: <HeaderBack />,
                            headerRight: <View />
                        }),
                    },
                    SubmitJob: {
                        screen: SubmitJob,
                        navigationOptions: () => ({
                            ...navigationOptions,
                            headerTitle: <HeaderTitle title={'ยืนยันการส่งงาน'} />,
                            headerLeft: <HeaderBack />,
                            headerRight: <View />
                        }),
                    },
                    SumBill: {
                        screen: SumBill,
                        navigationOptions: () => ({
                            ...navigationOptions,
                            headerTitle: <HeaderTitle title={'สรุปยอดเงิน'} />,
                            headerLeft: <HeaderBack />,
                            headerRight: <View />
                        }),
                    },
                    DetailBill: {
                        screen: DetailBill,
                        navigationOptions: () => ({
                            ...navigationOptions,
                            headerTitle: <HeaderTitle title={'รายละเอียดยอดเงิน'} />,
                            headerLeft: <HeaderBack />,
                            headerRight: <View />
                        }),
                    },
                    customButton: {
                        screen: customButton,
                        navigationOptions: () => ({
                            header: null
                        }),
                    }
                }),
                navigationOptions: () => ({
                    tabBarLabel: "ส่งงาน",
                    tabBarIcon: ({ tintColor }) => (
                        <Icon name="md-car" style={{ color: tintColor, fontSize: normalize(30) }} />
                    )
                }),
                path: 'search'
            },
            AddMediaTab: {

                screen: createStackNavigator({
                    AddMediaTab: {
                        screen: AddMediaTab,
                        navigationOptions: () => ({
                            ...navigationOptions,
                            headerTitle: <HeaderTitle title={'งานพิเศษ'} />,
                            headerLeft: <HeaderBack />,
                            headerRight: <View />
                        }),
                    },
                    DetailCN: {
                        screen: DetailCN,
                        navigationOptions: () => ({
                            ...navigationOptions,
                            headerTitle: <HeaderTitle title={'รายละเอียดงานพิเศษ'} />,
                            headerLeft: <HeaderBack />,
                            headerRight: <View />
                        }),
                    },
                    AddCN: {
                        screen: AddCN,
                        navigationOptions: () => ({
                            ...navigationOptions,
                            headerTitle: <HeaderTitle title={'สร้างงาน CN'} />,
                            headerLeft: <HeaderBack />,
                            headerRight: <View />
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
                            ...navigationOptions,
                            headerTitle: <HeaderTitle title={'ค้นหาชุดเอกสาร'} />,
                            headerLeft: <HeaderBack />,
                            headerRight: <View />
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
                            ...navigationOptions,
                            headerTitle: <HeaderTitle title={'ยืนยันการส่งงานพิเศษ'} />,
                            headerLeft: <HeaderBack />,
                            headerRight: <View />
                        }),
                    },
                    SubmitAll_TSC: {
                        screen: SubmitAll_TSC,
                        navigationOptions: () => ({
                            ...navigationOptions,
                            headerTitle: <HeaderTitle title={'ยืนยันการส่งงานพิเศษ'} />,
                            headerLeft: <HeaderBack />,
                            headerRight: <View />
                        }),
                    },
                }),
                navigationOptions: () => ({
                    tabBarLabel: "งานพิเศษ",
                    tabBarIcon: ({ tintColor }) => (
                        <Icon name="shuffle" style={{
                            color:
                                tintColor
                        }} />
                    )
                }),
            },
            LikesTab: {
                screen: createStackNavigator({
                    Like: {
                        screen: LikesTab,
                        navigationOptions: () => ({
                            ...navigationOptions,
                            headerTitle: <HeaderTitle title={'ประวัติการส่งงาน'} />,
                            headerLeft: <HeaderBack />,
                            headerRight: <View />
                        }),
                    },
                    History: {
                        screen: History,
                        navigationOptions: () => ({
                            ...navigationOptions,
                            headerTitle: <HeaderTitle title={'รายละเอียดการส่งงาน'} />,
                            headerLeft: <HeaderBack />,
                            headerRight: <View />
                        }),
                    },
                }),
                navigationOptions: () => ({
                    tabBarLabel: "ประวัติ",
                    tabBarIcon: ({ tintColor }) => (
                        <Icon name="paper" style={{
                            color:
                                tintColor
                        }} />
                    )
                }),
                path: 'like'
            },
            ProfileTab: {
                screen: createStackNavigator({
                    ProfileTab: {
                        screen: ProfileTab,
                        navigationOptions: () => ({
                            ...navigationOptions,
                            headerTitle: <HeaderTitle title={'รายชื่อลูกค้าไม่โอนเงินตามกำหนด'} titleStyle={{ fontSize: normalize(18) }} />,
                            headerLeft: <HeaderBack />,
                            headerRight: <View />
                        }),
                    }
                }),
                navigationOptions: () => ({
                    tabBarLabel: "Blacklist",
                    tabBarIcon: ({ tintColor }) => (
                        <Icon name="paper" style={{
                            color:
                                tintColor
                        }} />
                    )
                }),
            }
        }, {
                animationEnabled: false,
                swipeEnabled: false,
                lazy: true,
                tabBarPosition: "bottom",
                tabBarOptions: {
                    style: {
                        ...Platform.select({
                            android: {
                                backgroundColor: 'white'
                            }
                        }),
                        margin: 0,
                        height: normalize(60)
                    },
                    labelStyle: {
                        fontSize: normalize(14),
                    },
                    indicatorStyle: {
                        backgroundColor: '#00BFFF'
                    },
                    activeTintColor: '#000',
                    inactiveTintColor: '#d1cece',
                    showLabel: true,
                    showIcon: true,
                },
                backBehavior: 'none'
            }),
        navigationOptions: () => ({
            header: null,
        })
    }
},
    {
        initialRouteName: 'MainMenu',
        // statusBarBackgroundColor: '#33adff'
    });
