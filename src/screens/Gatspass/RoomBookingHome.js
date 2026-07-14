//import liraries
import React , { Component,useContext,useEffect ,useState}from 'react';
import { View, StyleSheet, TouchableOpacity, Image, SafeAreaView,Alert } from 'react-native';
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


const RoomBookingHome = ({  }) => {
  
  const {authContext, AppUserData} = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  let usrAccess = AppUserData?.data?.userFlag;
  const navigation = useNavigation();

  const getRoomAccess = () => {
    let userId = AppUserData?.data?.userId;
   
  
      let apiData = {
         "UserName":userId,
       
      };
// $&
      let token = AppUserData.token;
      setLoader(true);
      ApiService.PostMethode('/GetRoomAccess', apiData, token, authContext)
        .then(result => {
          setLoader(false);

// $&

          let responseData = result.Value;
// $&
if(responseData == '')
{
// $&
}
else{
  Alert.alert('Room Booking', responseData, [
    
     
    {text: 'OK', onPress: () =>
    navigation.navigate("HomeGate")
   //  console.log("Ok")    
    },
  ]);
}
          
     
  
       
        
     
// $&
      
         
        })
        .catch(error => {
          setLoader(false);
          // // console.log($1);
          ApiService.showErrorMessage(error, authContext);
        });
  
  };

  useEffect(() => {
    getRoomAccess(); 
   
  }, []);

  // ]);
  return (
    <SafeAreaView style={{ flex: 1, width: '100%', height: '100%', backgroundColor: GlobalColor.PrimaryLight, position: 'relative' }}>
      <Header title="Meeting Room Booking" />
      
      
    
      <View style={{width:"100%",paddingHorizontal:10}}>
    
        <TouchableOpacity
          style={styles.canteen}
          onPress={() => navigation.navigate("BookRoom")}>
         
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
                source={require('../../assets/Images/canteen/bookroom.png')}
                style={{ width: 32, height: 32 }}
              />
            </View>
          </View>
          <View
            style={styles.MenuContainer}>
            <Text style={{fontSize:13}} Bold>Book Room</Text>
            <Feather name="corner-up-right" color={'#43C6DB'} size={18} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.canteen}
          onPress={() => navigation.navigate("ViewRoom")}>
         
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
                source={require('../../assets/Images/canteen/viewroom.png')}
                style={{ width: 32, height: 32 }}
              />
            </View>
          </View>
          <View
            style={styles.MenuContainer}>
            <Text style={{fontSize:13}} Bold>View Room</Text>
            <Feather name="corner-up-right" color={'#43C6DB'} size={18} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.canteen}
          onPress={() => navigation.navigate("ManageBooking")}>
         
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
                source={require('../../assets/Images/canteen/manageroom.png')}
                style={{ width: 32, height: 32 }}
              />
            </View>
          </View>
          <View
            style={styles.MenuContainer}>
            <Text style={{fontSize:13}} Bold>Manage Booking</Text>
            <Feather name="corner-up-right" color={'#43C6DB'} size={18} />
          </View>
        </TouchableOpacity>

      

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
export default RoomBookingHome;
