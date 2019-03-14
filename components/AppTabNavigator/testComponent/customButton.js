import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, ScrollView, TouchableOpacity,Keyboard } from 'react-native'
import { gql, withApollo, compose } from 'react-apollo'
import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, Input, Item, Grid, Col, ActionSheet, Badge,Textarea } from 'native-base';
import Communications from 'react-native-communications';

const customButton = () =>{

    return(
        <Button title="Add props"
        onPress={()=>Alert("add prop")}
        />
    )
}
export default customButton