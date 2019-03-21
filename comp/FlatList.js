import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, CheckBox, TouchableOpacity } from 'react-native';
import { Icon, Body, Right, Button, ListItem, Badge } from 'native-base';
import { normalize } from '../functions/normalize';
import font from '../resource/font';
export const ListCheckJob = ({ item, index, onValueChange = (index) => { } }) => {
    return <ListItem noIndent >
        <CheckBox
            value={this.state.CF_ALL_INVOICE[i]}
            onValueChange={() => onValueChange(index)} />
        <Body>
            <View style={{ left: 0, right: 0, top: 0, bottom: 0, }}>
                <TouchableOpacity style={{ left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center' }}
                    onPress={() => navigate('CheckWork', { id: l.invoiceNumber, refresion: this._Re_worklist_query })}
                >
                    <Text style={styles.storeLabel}>{i + 1}).{l.invoiceNumber}</Text>
                    <Text note>{l.DELIVERYNAME}</Text>
                </TouchableOpacity>
            </View>
        </Body>
        <Right>
            <Button transparent
                onPress={() => navigate('CheckWork', { id: l.invoiceNumber, refresion: this._Re_worklist_query })}>

                <Icon name='ios-arrow-forward' style={{ color: 'gray' }} />
            </Button>
        </Right>
    </ListItem>
}

export const Empty = ({ title }) => {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: normalize(20) }}>
        <Image source={require('../resource/empty.png')} style={{ width: normalize(100), height: normalize(100) }} resizeMode={'contain'} />
        <Text style={{ fontFamily: font.medium, fontSize: normalize(20) }}>{title}</Text>
    </View>
}

export const Development = ({ title }) => {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: normalize(20) }}>
        <Image source={require('../resource/develop.png')} style={{ width: normalize(100), height: normalize(100) }} resizeMode={'contain'} />
        <Text style={{ fontFamily: font.medium, fontSize: normalize(20) }}>{title}</Text>
    </View>
}

export class RenderWork extends React.Component {

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.checked !== this.props.checked) {
            return true
        }

        return false
    }

    goDetailWork(work) {
        let { navigate, refresion } = this.props
        navigate('DetailWork', { id: work.invoiceNumber, Zone: work.Zone, address: work.addressShipment, Cusname: work.DELIVERYNAME, PAYMMODE: work.PAYMMODE, refresion: () => refresion(), customerID: work.customerID })
    }

    renderPaymode(work) {
        let paymode = '';
        switch (work.PAYMMODE.toUpperCase()) {
            case "CHEQUE": paymode = "เครดิต"; break;
            case "TRANSFER": paymode = "โอนบริษัท"; break;
            case "CASH": paymode = "เงินสด"; break;
            default: paymode = "-";
        }

        return <View style={{ paddingLeft: 0, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.storeLabel}>{work.invoiceNumber}</Text>
            <Badge success style={{ height: normalize(19), alignItems: 'center', justifyContent: 'center', marginLeft: normalize(10) }} >
                <Text style={{ fontSize: normalize(12), color: 'white' }}>{paymode}</Text>
            </Badge>
        </View>
    }

    render() {
        let { work, index, checked, onValueChange } = this.props
        return <View style={styles.detailContent}>
            <View style={{ backgroundColor: 'white', flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                <CheckBox value={checked} onValueChange={() => onValueChange(work, index)} />
                <TouchableOpacity style={{ position: 'absolute', left: "8%", right: 0, justifyContent: 'center' }} onPress={() => this.goDetailWork(work)}>
                    {this.renderPaymode(work)}
                    <Text style={{ fontSize: normalize(16) }} numberOfLines={1}>{work.DELIVERYNAME}</Text>
                </TouchableOpacity>
            </View>

            <View style={{ position: 'absolute', right: normalize(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.goDetailWork(work)}>
                    <Text style={{ marginTop: -normalize(27), fontFamily: font.semi, fontSize: normalize(16), color: 'orange', paddingHorizontal: normalize(5) }}>{work.SUM} ฿ </Text>
                    <Button transparent onPress={() => this.goDetailWork(work)}>
                        <Icon name='ios-arrow-forward' style={{ color: 'gray' }} />
                    </Button>
                </TouchableOpacity>
            </View>
        </View>
    }
}

export class RenderWorkSpecial extends React.Component {

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.checked !== this.props.checked) {
            return true
        }

        return false
    }

    goDetailWork(work) {
        let { navigate, refresion } = this.props
        navigate('DetailCN', { id: work.invoiceNumber, Zone: work.Zone, address: work.addressShipment, Cusname: work.DELIVERYNAME, detail_cn: work.comment, refresion: () => refresion() })
    }

    render() {
        let { work, index, checked, onValueChange } = this.props
        return <View style={styles.detailContent}>
            <View style={{ backgroundColor: 'white', flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                <CheckBox value={checked} onValueChange={() => onValueChange(work, index)} />
                <TouchableOpacity style={{ position: 'absolute', left: "8%", right: 0, justifyContent: 'center' }} onPress={() => this.goDetailWork(work)}>
                    <Text style={styles.storeLabel}>{work.invoiceNumber}</Text>
                    <Text style={{ fontSize: normalize(16) }} numberOfLines={1}>{work.DELIVERYNAME}</Text>
                </TouchableOpacity>
            </View>

            <View style={{ position: 'absolute', right: normalize(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.goDetailWork(work)}>
                    <Button transparent onPress={() => this.goDetailWork(work)}>
                        <Icon name='ios-arrow-forward' style={{ color: 'gray' }} />
                    </Button>
                </TouchableOpacity>
            </View>
        </View>
    }
}

const styles = StyleSheet.create({

    storeLabel: {
        fontSize: normalize(18),
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
        height: normalize(70),
        justifyContent: 'center',
    }
})