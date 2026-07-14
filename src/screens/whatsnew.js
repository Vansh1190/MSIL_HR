//import liraries
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  FlatList,
  SafeAreaView,
  ScrollView,
  Platform
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AuthContext from '../context/AuthContext';
import * as ApiService from '../Utils/Utils';
import Toast from 'react-native-simple-toast';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { GlobalColor } from '../constants/Colors';
import { GlobalFontSize } from '../constants/FontSize';
import Text from '../components/reusable/Text';
import { Header } from '../components/reusable/Header';
import { LoadingScreen } from '../components/reusable/LoadingScreen';
import ListEmptyComponent from '../components/reusable/ListEmptyComponent';




// create a component
const Whatsnew = ({ navigation }) => {
  const [loader, setLoader] = useState(false)
  const { authContext, AppUserData } = useContext(AuthContext);
  const [appLink, setAppLink] = useState('');
  const [refresh, setrefresh] = useState(false);


  const stopLoader = () => {
    try {
      setLoader(false);
      setrefresh(false);
    } catch(error){
// $&
    }
  }


  const GetAPPLinkApi = (pulldown=false) => {
    if(!pulldown){
      setLoader(true);
    }

    let token = AppUserData.token;
    let userId = AppUserData?.data?.userId
    let apiData = {
      UserName: AppUserData?.data?.username,
      LinkName: "HR_ASSIST",
      LinkCat : "",
      LinkType: ""
    }


    ApiService.PostMethode('/GetAPPLink', apiData, token, authContext)
      .then(result => {
        let responseData = result.Value
        stopLoader(false);
        if(Platform.OS === 'ios'){
// $&
          let result = responseData.filter(element => {
            return element.LINK_APP_CATG == "WHATS_NEW"
          });
// $&
         
          setAppLink(result);
        }else{
          let result = responseData.filter(element => {            
            return element.LINK_APP_CATG == "WHATS_NEW"
          });
// $&
// $&
          setAppLink(result);
        }        
      })
      .catch(error => {
        stopLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };


  const linkOpen = (link) => {

// $&


    if(
      link.LINK_APP_CATG == 'HRASSIST_OTH_APP' && link.LINK_TYPE != 'In-House_App' && link.LINK_LINK5 == 'ANDROID'){
// $&
// $&

      downloadApp(link.LINK_LINK1);
    }else if(link.LINK_APP_CATG == 'HRASSIST_OTH_APP' && link.LINK_TYPE == 'In-House_App' && link.LINK_LINK5 == 'ANDROID'){
// $&
// $&
      downloadInhouseApp(link.LINK_LINK1, link.LINK_LINK4);
    }
  }

  useEffect(() => {
    GetAPPLinkApi()
  }, [])


  const downloadApp = (link)=>{
    let pack_name= link.split("=");
// $&
    if(Platform.OS === 'android'){
// $&
      var SendIntentAndroid = require('react-native-send-intent');
      SendIntentAndroid.isAppInstalled(pack_name[1]).then(isInstalled => {
        if(isInstalled){
          SendIntentAndroid.openApp(pack_name[1]).then(wasOpened => {
            if(!wasOpened){
              Linking.openURL(link);    
            }
          });
        }else{
          Linking.openURL(link);    
        }
      });
    }else{
      Linking.openURL(link);
    }
  }

  const downloadInhouseApp = (link, link4)=>{
    let pack_name= link.split("=");
// $&
// $&
    if(Platform.OS === 'android'){
      var SendIntentAndroid = require('react-native-send-intent');
      SendIntentAndroid.isAppInstalled(link4).then(isInstalled => {
        if(isInstalled){
// $&
         // // console.log($1);
          SendIntentAndroid.openApp(link4).then(wasOpened => {
            if(!wasOpened){
              Linking.openURL(link);    
            }
          });
        }else{
// $&
          Linking.openURL(link);    
        }
      });
    }else{
      Linking.openURL(link);
    }
  }
  



  if(loader){
    return(
    <SafeAreaView style={styles.container}>
      <Header title ="What's New"/>
      <LoadingScreen/>
    </SafeAreaView>
    )
  }


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
      <Header title ="What's New"/>
          <View style={{ flex: 1, paddingHorizontal:10, }}>
            <ScrollView style = {{marginTop:10,marginBottom:20}}>
            <FlatList
              contentContainerStyle={{ flex:1, alignSelf:'center' }}
              data={appLink}
              numColumns={1}
              ListEmptyComponent={<ListEmptyComponent title="No Data Found" enableRefresh={true} onRefreshCallback={()=>GetAPPLinkApi(true)} refreshing={refresh} />}
              showsVerticalScrollIndicator={false}
              key={'whats'}
              keyExtractor={( item ) => item.LINK_ID.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => {
                    //linkOpen(item);
// $&
                  }}
                  style={styles.button}>
                  <Image
                    source={{ uri: item.LINK_LINK3 }}
                    style={{ width: "90%", height: 550 }}
                  />
                  {/* <Text Bold style={{ fontSize: 15, paddingVertical: 5, color: '#4a4a4a' }}>
                    {item.LINK_DESC}
                  </Text> */}
                </TouchableOpacity>
              )} />
              </ScrollView>
          </View>
      </View>
    </SafeAreaView>)
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',    
  },
  button:{
    minWidth:"90%",
    maxWidth:"90%",
    justifyContent: 'center',
    borderColor:'#43C6DB',
    borderWidth:0.5,
    margin:17,
    paddingVertical: 15,
    backgroundColor: GlobalColor.White,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1.29,
    shadowRadius: 10.65,
    elevation: 5,
    alignItems: 'center',
    borderRadius: 0,
    
  }
});

//make this component available to the app
export default Whatsnew;
