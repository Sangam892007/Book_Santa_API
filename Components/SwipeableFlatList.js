import React from 'react';
import {Text, View, TouchableOpacity, Stylesheet} from 'react-native'
import {Dimensions} from 'react-native';
import {ListItem, Icon} from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
import db from '../Config';

export default class SwipeableFlatList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            allnotifications:this.props.allNotifications,
        }
        
    }
    renderItem = (data)=>{
        console.log(data)
        var {item,index} = data
        return(
        <ListItem key = {index} bottomDivider>
       <Icon name = "book" type = "font-awsome" color = "red"/>
        <ListItem.Title>
        {item.Book_Name}
        </ListItem.Title>
        <ListItem.Subtitle>
        {item.message}
        </ListItem.Subtitle>
        <ListItem.Subtitle>
        {index}
        </ListItem.Subtitle>
        </ListItem>
        )
    }
    renderHiddenItem = ({item,i})=>{
        console.log("HiddenItem")
       return(
        <View>
            <Text>
                Swipe to delete
            </Text>
        </View>
       )
    }
    UpdateMarkAsRead = (notifications)=>{
        console.log(notifications)
        db.collection("ALL_NOTIFICATIONS").doc(notifications.Doc_ID).update({
            Notification_Status:"Read"
        })

    }
    OnSwipeValueChange = (swipeData)=>{
        var allnotifications = this.state.allnotifications
        //console.log(swipeData)
        const {key,value} = swipeData
        if (value < -Dimensions.get("window").width/2) {
            const newData = [...allnotifications]
            
            //console.log(allnotifications[key])
            this.UpdateMarkAsRead(allnotifications[key])
            
        newData.splice(key, 1)
        this.setState({
            allnotifications:newData,
        })
        //console.log(allnotifications)
        
        }
    }

    render(){
        return(
            <View>
                <SwipeListView 
                disableRightSwipe
                data = {this.state.allnotifications}
                renderItem = {this.renderItem }
                renderHiddenItem = {this.renderHiddenItem}
                rightOpenValue = {-Dimensions.get('window').width}
                previewRowKey = {'0'}
                previewOpenValue = {-100}
                previewOpenDelay = {10000}
                onSwipeValueChange = {this.OnSwipeValueChange}
                keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }
}