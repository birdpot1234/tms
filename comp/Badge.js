import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Badge } from 'native-base';
import { normalize } from '../functions/normalize';

export const Paymode = ({ item }) => {
    function checkPaymode() {
        switch (item.paymentType.toUpperCase()) {
            case "CHEQUE": return "เครดิต";
            case "TRANSFER": return "โอนบริษัท";
            case "CASH": return "เงินสด";
            default: return null;
        }
    }
    let paymode = checkPaymode()
    return <View style={{ paddingLeft: 0, flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.storeLabel}>{item.invoiceNumber}</Text>
        {paymode && <Badge success style={{ height: normalize(19), alignItems: 'center', justifyContent: 'center', marginLeft: normalize(10), marginTop: normalize(5) }} >
            <Text style={{ fontSize: normalize(12), color: 'white' }}>{paymode}</Text>
        </Badge>}
    </View>
}

export const StatusWork = ({ item, checkBillRework = (invoiceNumber) => { } }) => {
    if (item.status == "A1") {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', }} >
                <Badge success style={{ height: normalize(19), alignItems: 'center', justifyContent: 'center' }} >
                    <TouchableOpacity onPress={() => checkBillRework(item.invoiceNumber)}>
                        <Text style={{ fontSize: normalize(15), color: 'white' }}>ส่งสำเร็จ</Text>
                    </TouchableOpacity>
                </Badge>
            </View>
        )
    } else if (item.status == "A2") {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', }} >
                <Badge warning style={{ height: normalize(19), alignItems: 'center', justifyContent: 'center' }} >
                    <TouchableOpacity onPress={() => checkBillRework(item.invoiceNumber)}>
                        <Text style={{ fontSize: normalize(15), color: 'white' }}>มีการแก้ไข</Text>
                    </TouchableOpacity>
                </Badge>
            </View>
        )
    } else {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', }} >
                <Badge style={{ height: normalize(19), alignItems: 'center', justifyContent: 'center' }} >
                    <TouchableOpacity onPress={() => checkBillRework(item.invoiceNumber)}>
                        <Text style={{ fontSize: normalize(15), color: 'white' }}>ส่งไม่สำเร็จ</Text>
                    </TouchableOpacity>
                </Badge>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    storeLabel: {
        fontSize: normalize(18),
        color: 'black'
    },
})