import axios from 'axios';
import * as a from '../API/Api';
import {fetch} from 'react-native-ssl-pinning';
import Toast from 'react-native-simple-toast';


export const AuthPost = (url, data)=>{
  let PostUrl = a.API_BASE_URL + url;
  try {
      return fetch(PostUrl, {
      method: "POST" ,
      timeoutInterval: 0, // milliseconds
      body: JSON.stringify(data),
      // body: data,
      disableAllSecurity: true,
      // your certificates array (needed only in android) ios will pick it automatically
      sslPinning: {
          certs: ["mycert"] // your certificates name (without extension), for example cert1.cer, cert2.cer
      },
      headers: {
          Accept: "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*", "e_platform": "mobile",
          "x-origin": "com.maruti.hrapp",
          'Content-Type': 'application/json; charset=utf-8',
      }
  }).then(res=>JSON.parse(res.bodyString))    
  } catch (error) {
    throw error.json()
  }
}



export default new (class AuthService {
  async ThirtPartyGet(url) {
    let postUrl = url;
    try {
      let res = await axios.get(postUrl, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      return res.data;
    } catch (e) {
      throw handler(e);
    }
  }

  handler(err) {
    let error = err;
    if (err.response && err.response.data.hasOwnProperty('message'))
      error = err.response.data;
    else if (!err.hasOwnProperty('message')) error = err.toJSON();
    return new Error(error.message);
  }
})();


export const showErrorMessage = (error, context=null) => {
  let showErrorMessage = error.bodyString ? JSON.parse(error.bodyString): null;
  if(error && error.status){
      if(error.status == "403" || error.status == "401"){
          Toast.show("Invalid credentials");    
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
}
