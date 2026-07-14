//import liraries
import React , { Component,useContext ,useState,useEffect,useCallback}from 'react';
import { View, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { GlobalFontSize } from '../../constants/FontSize';
import { GlobalColor } from '../../constants/Colors';
import Text from '../../components/reusable/Text';
import { Header } from '../../components/reusable/Header';
import AuthContext from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import * as ApiService from '../../Utils/Utils';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';

const HomePageGatepass = ({  }) => {
  const {authContext, AppUserData} = useContext(AuthContext);
  let usrAccess = AppUserData?.data?.userFlag;
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [loader, setLoader] = useState(false)
  const [refresh, setrefresh] = useState(false);

  const [rohtakGatepassFlag, setrohtakGatepassFlag] = useState('Y');

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  // useEffect(() => {
  //   if (AppUserData?.token && AppUserData?.data?.userId) {
  //     showRohtakGatepass();
  //   }
  // }, [AppUserData]);   // run only when AppUserData is ready

  useFocusEffect(
    useCallback(() => {
      if (AppUserData?.token && AppUserData?.data?.userId) {
        showRohtakGatepass();
      }
    }, [AppUserData?.token])
  );
  
  

//Stop Loader Function
const stopLoader = () => {
  setLoader(false);
  setrefresh(false);
}
  const showRohtakGatepass = () => {
    let token = AppUserData.token
    let EmplID =  AppUserData?.data?.userId;
    let userNt = AppUserData?.data?.userNT;
// $&
    let apiData = {
      "UserName": userNt
    }
 
    //Set Loader
    setLoader(true);
 
    ApiService.PostMethode('/GetGatepassCutoff', apiData, token, authContext)
      .then(result => {
// $&
 
        //stop Loader
        stopLoader();
 
        let responseData = result.Value;
        setrohtakGatepassFlag(responseData);
       
        console.log("---responseData---",responseData);

        // if(result.Result == 'N')
        // {
        //   myNavigation.navigate("PendingAlw");
         
        // }
        // else{
        //   myNavigation.navigate("ConsentHome");
        // }
 
       
        //setHideshow(result.Result);
// $&
       
          // alert(responseData)
       
      })
      .catch(error => {
        //stop Loader
        stopLoader();
        //Show Error Massage
        ApiService.showErrorMessage(error, authContext);
      });
  };


  // ]);
  return (
    <SafeAreaView style={{ flex: 1, width: '100%', height: '100%', backgroundColor: GlobalColor.PrimaryLight, position: 'relative' }}>
      <Header title="Gate Pass " />
      
      
    
      <View style={{width:"100%",paddingHorizontal:10}}>
        <TouchableOpacity
          style={styles.canteen}
          onPress={() => navigation.navigate("Gatepass")}>
          {/* <View style={{ width: '20%', justifyContent: "center" }}>
            <Image
              source={require('../../assets/Images/canteen/fork.png')}
              style={{ width: 45, height: 45 }}
              resizeMode={'cover'}
            />
          </View> */}

          <View style={styles.iconBox}>
            <View
              style={{
                width:45,
                height: 42,
                borderRadius: 100,
                borderWidth: 1,
                borderColor: '#43C6DB',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/Images/canteen/gatepassV.png')}
                style={{ width: 32, height: 32 }}
              />
            </View>
          </View>
          <View
            style={styles.MenuContainer}>
            <Text style={{fontSize:13}} Bold>Gatepass (Gurgaon,HO,Other Location)</Text>
            <Feather name="corner-up-right" color={'#43C6DB'} size={18} />
          </View>
        </TouchableOpacity>

{rohtakGatepassFlag == 'N'?null:

        <TouchableOpacity
          style={styles.canteen}
          onPress={() => navigation.navigate("EmpGatepassRohtak")}>
       
          <View style={styles.iconBox}>
            <View
              style={{
                width: 45,
                height: 42,
                borderRadius: 100,
                borderWidth: 1,
                borderColor: '#43C6DB',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/Images/canteen/gatepassV.png')}
                style={{ width: 32, height: 32 }}
              />
            </View>
          </View>
          <View
            style={styles.MenuContainer}>
            <Text style={{fontSize:13}} Bold>Employee Gatepass (Rohtak)</Text>
            <Feather name="corner-up-right" color={'#43C6DB'} size={18} />
          </View>
        </TouchableOpacity>
}
{rohtakGatepassFlag == 'N'?null:
        <TouchableOpacity
          style={styles.canteen}
          onPress={() => navigation.navigate("RohtakVisitorHome")}>
         
          <View style={styles.iconBox}>
            <View
              style={{
                width: 45,
                height: 42,
                borderRadius: 100,
                borderWidth: 1,
                borderColor: '#43C6DB',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/Images/canteen/gatepassV.png')}
                style={{ width: 32, height: 32 }}
              />
            </View>
          </View>
          <View
            style={styles.MenuContainer}>
            <Text style={{fontSize:13}} Bold>Visitor Gatepass (Rohtak)</Text>
            <Feather name="corner-up-right" color={'#43C6DB'} size={18} />
          </View>
        </TouchableOpacity>
}
               
      

      </View>

      {usrAccess != 'Y' ? (   
        <View style ={{ flex: 1,justifyContent: 'flex-end'}}>
         <TouchableOpacity
        style={styles.fullWidthButton}
        onPress={() => {
          navigation.navigate('ManagerMode');
        }}>
        <Image
          source={require('./../../assets/Images/setting.png')}
          style={{width: 25, height: 25, tintColor: '#fff'}}
        />
        <Text style={styles.fullWidthButtonText} >
          Go to Manager Mode
        </Text>
      </TouchableOpacity>
      </View>
      ):null}
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  gradient: {
    padding: 20,
  },
  container: {
    flexDirection: 'row',
  },
  fullWidthButton: {
    backgroundColor: '#43C6DB',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthButtonText: {
    color: GlobalColor.White,
    marginLeft: 8,
    fontSize:13
  },
  canteen: {
    top: 5,
    marginVertical: 5,
    backgroundColor: GlobalColor.White,
    alignSelf: 'center',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: GlobalColor.Black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    borderRadius: 5
  },
  MenuContainer: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  iconBox: {
    width: '20%',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// //make this component available to the app
export default HomePageGatepass;
