import React from 'react';
import {TouchableOpacity ,View ,Text, TextInput, StyleSheet, Modal, Alert, ScrollView, KeyboardAvoidingView,} from 'react-native';
import MyHeader from "../Components/Myheader";
import firebase from 'firebase';
import db from '../Config';
import {BookSearch} from 'react-native-google-books';
import { ThemeProvider } from 'react-native-elements';
//AIzaSyAetsyOsXjUXevtnwrxJs-nD7ZKyTHBxV0 (google api Key)

export default class RequestScreen extends React.Component{
    constructor(){
        super()
        this.state = {
           UserID:firebase.auth().currentUser.email,
           Book_Name:'',
           Reason:'',
           Book_Status:'',
           Request_ID:'',
           Date:'',
           Image_Link:'',
           IsBookRequestActive:'',
           ShowFlatList:false,
           DataSource:'',
           Doc_ID:'',
           User_DocID:'',
           RequestedBookName:'',

        }
    }
    GetBooksFromAPI = async(Book_Name)=>{
        this.setState({
            Book_Name:Book_Name
        })
        if (this.state.Book_Name.lenght > 2) {
            var books = await BookSearch.searchbook(Book_Name,'AIzaSyAetsyOsXjUXevtnwrxJs-nD7ZKyTHBxV0')
            this.setState({
                DataSource:books.data,
                ShowFlatList:true
            })
            
        }
    }
    GetBookRequest = ()=>{
        db.collection('REQUESTED_BOOKS').where("User_ID","==",this.state.UserID).get()
        .then(snapshot=>{
            snapshot.forEach(Doc=>{
                if (Doc.data().Book_Status !== "received") {
                    this.setState({
                        Request_ID:Doc.data().Request_ID,
                        RequestedBookName:Doc.data().Book_Name,
                        Book_Status:Doc.data().Book_Status,
                        Doc_ID:Doc.id
                    })
                }
            })
        })
    }
    AddRequest = async(Book_Name)=>{
        var requestID = Math.random().toString(25).substring(7),
        var books = await BookSearch.searchbook(Book_Name,'AIzaSyAetsyOsXjUXevtnwrxJs-nD7ZKyTHBxV0')
        db.collection("REQUESTED_BOOKS").add({
            User_ID:this.state.UserID,
            Book_Name:this.state.Book_Name,
            Reason:this.state.Reason,
            Request_ID:requestID,
            Book_Status:"requested",
            Date:firebase.firestore.FieldValue.serverTimestamp(),
            Image_Link:books.data[0].volumeInfo.imageLinks.smallThumbnail
        })
        await this.GetBookRequest()
        db.collection('USERS').where("Email_ID","==",this.state.UserID).get()
        .then().then(snapshot=>{
            snapshot.forEach(Doc=>{
                db.colllection('USERS').doc(Doc.id).update({
                    IsBookRequestActive:true
                })
            })
        })
        this.setState({
            Book_Name:'',
            Reason:'',
            Request_ID:requestID,
        })
        alert("Request Submitted");
    }
    receivedBooks = Book_Name=>{
        db.collection('RECEIVED_BOOKS').add({
            User_ID:this.state.UserID,
            Book_Name:this.state.Book_Name,
            Request_ID:requestID,
            Book_Status:"received",
        })
    }
    GetIsBookRequestActive = ()=>{
        db.collection('USERS').where("Email_ID","==",this.state.UserID)
        .onSnapshot(Doc=>{
            Doc.forEach(doc=>{
                this.setState({
                    IsBookRequestActive:doc.data().IsBookRequestActive,
                    User_DocID:doc.id,

                })
            })
        })
    }
    render(){
        return(
            <View style = {{flex:1}}>
                <MyHeader title = "REQUEST HERE" navigation = {this.props.navigation}/>
                <KeyboardAvoidingView style = {styles.keyBoardStyle}>
                    <TextInput placeholder = "Book Name" style = {styles.formTextInput} onChangeText = {(text)=>{
                            this.setState({
                                Book_Name:text,
                            })
                        }}
                        value = {this.state.FirstName}/>
                        <TextInput placeholder = "Reason"  style = {styles.formTextInput} multiline = {true} numberOfLines = {5} onChangeText = {(text)=>{
                            this.setState({
                                Reason:text,
                            })
                        }}>
                    </TextInput>
                    <TouchableOpacity style = {styles.button} onPress = {()=>{
                        this.AddRequest();
                    }}>
                        <Text>
                            REQUEST BOOK
                        </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
                
            </View>
        )
    }
}
const styles = StyleSheet.create({ 
    keyBoardStyle : { flex:1, 
        alignItems:'center', 
        justifyContent:'center' }, 
    formTextInput:{ width:"75%",
        height:35,
        alignSelf:'center', 
        borderColor:'#ffab91', 
        borderRadius:10, 
        borderWidth:1, 
        marginTop:20, 
        padding:10, }, 
    button:{ width:"75%", 
        height:50, 
        justifyContent:'center', 
        alignItems:'center', 
        borderRadius:10, 
        backgroundColor:"#ff5722", 
        shadowColor: "#000", 
    shadowOffset: { width: 0, 
        height: 8, }, 
        shadowOpacity: 0.44, 
        shadowRadius: 10.32, 
        elevation: 16, 
        marginTop:20 }, } )
