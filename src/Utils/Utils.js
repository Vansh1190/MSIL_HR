import React, {useContext, useEffect, useState} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ScrollView,
    TextInput,
    SafeAreaView,
    Alert
  } from 'react-native';
import axios from "axios";
import { API_SERVICES_URL } from "../API/Api";
import Toast from 'react-native-simple-toast';
import AuthContext from '../context/AuthContext';
import {fetch} from 'react-native-ssl-pinning';


export const PostMethode = async(url, data, token, context=null) =>{
    let PostUrl = API_SERVICES_URL + url;
    // // console.log($1);
    /*
    fetch(PostUrl, {
        method: "POST" ,
        timeoutInterval: 2000, // milliseconds
        body: data,
        // your certificates array (needed only in android) ios will pick it automatically
        sslPinning: {
            certs: ["mycert"] // your certificates name (without extension), for example cert1.cer, cert2.cer
        },
        headers: {
            Accept: "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*", "e_platform": "mobile",
            authToken: token,
        }
    })
    .then(response => {
        // console.log(`response received ${response}`)
        return response.data;
    })
    .catch(err => {
        // console.log(`error: ${err}`)
        throw error
    })

*/
    try {
           return fetch(PostUrl, {
            method: "POST" ,
            timeoutInterval: 0, // milliseconds
            body: JSON.stringify(data),
            disableAllSecurity: true,
            // your certificates array (needed only in android) ios will pick it automatically
            sslPinning: {
                certs: ["mycert"] // your certificates name (without extension), for example cert1.cer, cert2.cer
            },
            headers: {
                Accept: "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*", "e_platform": "mobile",
                "x-origin": "com.maruti.hrapp",
                authToken: token,
              'Content-Type': 'application/json',
            }
        }).then(res=>JSON.parse(res.bodyString))    
    } catch (error) {
// $&
        throw error.json()
    }
}





export const PostMethodes =  async (url, data, token, context=null) => {
    let PostUrl = API_SERVICES_URL + url;
// $&

    try {

        let response = await axios({
            method: "post",
            url: PostUrl,
            data: data,
            headers: {
                Accept: "application/json",
                authToken: token,
            }
        });
        return response.data;
    } catch (error) {
            throw error
    }    
}

export const getRawurl = async (url) => {

    try {
        let response = await axios.get(url)
        // console.log("Api resp",response)
        return response.data;
    } catch (error) {
        throw handleError(error)
    }
}


const handleError = (err) => {
    let error = err;
    if (err.response && err.response.data.hasOwnProperty('message'))
        error = err.response.data;
    else if (!err.hasOwnProperty('message')) error = err.toJSON();
    return new Error(error.message);
}



export const showErrorMessage = (error, context=null) => {
// $&
    let showErrorMessage = error.bodyString ? JSON.parse(error.bodyString): null;
    if(error && error.status){
        if(error.status == "403" || error.status == "401"){
            UseLogout(context);
            return;
        }else if (showErrorMessage && showErrorMessage.hasOwnProperty('Message')){
            Toast.show(showErrorMessage.Message);    
            return;
        }     
        Toast.show(error.status + " Something Went Wrong");    
    }else{
        Toast.show("Something Went Wrong");
    }
    return;


    if (error.response) {
        if(error.response.status == "403" || error.response.status == "401"){
            UseLogout(context);
            return;
        }else if (error.response && error.response.data.hasOwnProperty('Message')){
            Toast.show(error.response.data.Message);    
            return;
        }
        Toast.show(error.toString());
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
// $&
        Toast.show("Network Error");
      } else {
        Toast.show("Something Went Wrong");
        // Something happened in setting up the request that triggered an Error
// $&
      }
}


const UseLogout = (context) => {
    context.signOut(),
    Alert.alert(
        "Unauthorised",
        "Session Expired login again",
        [
          { text: "OK", 
        //   onPress: () => context.signOut(),
           style: "cancel"}
        ]
      );
}