//import liraries
import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Image, SafeAreaView, ActivityIndicator,Alert ,AsyncStorage} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast'
import * as ApiService from '../../Utils/Utils';
import AuthContext from '../../context/AuthContext';
import { GlobalColor } from '../../constants/Colors';
import { GlobalFontSize } from '../../constants/FontSize';
import TextInput from '../../components/reusable/TextInput'
import { Header } from '../../components/reusable/Header';
import { LoadingScreen } from '../../components/reusable/LoadingScreen';
import ListEmptyComponent from '../../components/reusable/ListEmptyComponent';
import Text from '../../components/reusable/Text';
import Button from '../../components/reusable/Button';
import moment from 'moment';
// create a component
const ManageBooking = ({ navigation, }) => {
  const [gst, setGst] = useState([])
  const [bking, setbking] = useState([])

  const { authContext, AppUserData } = useContext(AuthContext);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [searchText, setSearchText] = useState('');


  const [loader, setLoader] = useState(false);
  const [refresh, setrefresh] = useState(false);

  const stopLoader = () => {
    try {
      setLoader(false);
      setrefresh(false);
    } catch (error) {
// $&
    }
  }


  
//Get_bookings

  const CancelBooking = (bk_id) => {
    let token = AppUserData.token
    let userId = AppUserData?.data?.userId;
    let userNt = AppUserData?.data?.userNT;

    let apiData = {
       
      UserName:userNt,
      BookingID:bk_id
    };

// $&

    setLoader(true);
    ApiService.PostMethode('/Cancel_Bookings', apiData, token)
      .then(result => {
        setLoader(false);
        let ApiValue = result.Value
// $&
        if(ApiValue == 'Deleted Succesfully')
        {
          setLoader(false);

        

         Alert.alert(result.Value);
         GetBookingApi();
          //Toast.show("Gate pass Generated Successfully");
          
        }
        else{
          setLoader(false);
          Alert.alert(result.Value);
        }
        //setGst(ApiValue)
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const GetBookingApi = () => {
    let token = AppUserData.token
    let UserName = AppUserData.data
    let userNt = AppUserData?.data?.userNT;
    let userId = AppUserData?.data?.userId;
    
    let apiData = {
       
      UserName:userId,
    
    };
    console.log(apiData);
    setLoader(true);
    ApiService.PostMethode('/getbookedrooms', apiData, token)
      .then(result => {
        setLoader(false);
        let ApiValue = result.Value
// $&
        setbking(ApiValue);
       // setGst(ApiValue)
      })
      .catch(error => {
        setLoader(false);
         console.log(error);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  useEffect(() => {
   
    
    GetBookingApi();
  }, [])

  if (loader) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title={"Manage Booking"} back />
        <LoadingScreen />
      </SafeAreaView>
    )
  }

  return (

    <SafeAreaView style={styles.container}>
      <Header title={"Manage Booking"} />
      {loader == true ? (
        <Spinner
          visible={loader}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
      ) : null}

      {/* BODY   ##########################3############       */}

      {/* SEARCH BOX */}
      <View style={styles.MainContainer}>
   

      {/* FLATLIST */}
      <FlatList
      style={{flexGrow:1,}}
        showsVerticalScrollIndicator={false}
        data={bking}
        style={{marginBottom:"30%"}}
        contentContainerStyle={{ flexGrow:1 }}
        ListEmptyComponent={() => <ListEmptyComponent title="No Data Found" enableRefresh={true} onRefreshCallback={() => GetGSTDetailstApi()} refreshing={refresh}></ListEmptyComponent>}
        keyExtractor={(item, index) => index}
        renderItem={({ item, index }) => {
          return (
            <View>
              <TouchableOpacity style={styles.TouchableOpacity}>
                <View
                  style={styles.HeadingContainer}>
                  <Text Bold style={{ fontSize: 13, color: GlobalColor.White, padding: 10, }}>
                    {"Booked Room "}{item.ROOM}
                  </Text>
                </View>
                <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
                  <Text style={styles.GStBox}>Booked By</Text>
                  <Text style={{ color: GlobalColor.Black ,fontSize:13}}>{item.BOOKED_BY}</Text>
                  <Text style={styles.GStBox}>Co-occupant</Text>
                  <Text style={{ color: GlobalColor.Black ,fontSize:13}}>{item.CO_OCCUPTD}</Text>
                  <Text style={styles.GStBox}>Booking Start Time</Text>
                  <Text style={{ color: GlobalColor.Black,fontSize:13 }}>{ moment(item.RMBK_START_TIME).format('DD-MMM-YYYY H:mm:ss a')}</Text>
                  <Text style={styles.GStBox}>Booking End Time</Text>
                  <Text style={{ color: GlobalColor.Black,fontSize:13 }}>{ moment(item.RMBK_END_TIME).format('DD-MMM-YYYY H:mm:ss a')}</Text>
                  <Text style={styles.GStBox}>Meeting Reason</Text>
                  <Text style={{ color: GlobalColor.Black,fontSize:13 }}>{item.RMBK_REMARKS}</Text>
                </View>

                <View style={{marginVertical: 10,flexDirection:'row',flex:1,width:"100%"}}>
                <View style={{width:"45%",marginHorizontal:7}}>
                           <Button  onPress={() => 
                  navigation.navigate('BookRoomModify', {
                  bookFrom:moment(item.RMBK_START_TIME).format('DD-MMM-YYYY H:mm:01'),
                  bookTo:moment(item.RMBK_END_TIME).format('DD-MMM-YYYY H:mm:00'),
                  bookCo:item.CO_OCCUPTD,
                  bookRsn:item.RMBK_REMARKS,
                  bookedRoom:item.ROOM,
                  roomId:item.RMBK_ROOM_ID,
                  rmbkID:item.RMBK_ID
                }


                
                
                )}
                title="Modify" textStyle={{fontSize:13,}}>
                              </Button>
                </View>
                
                <View style={{width:"45%",}}>
                             <Button  onPress={() => {

                             Alert.alert('Delete', 'Are you sure you want to delete ?', [
                            {
                               text: 'Cancel',
                              onPress: () => console.log('Cancel Pressed'),
                              style: 'cancel', 
                            },
                         {text: 'OK', onPress: () => CancelBooking(item.RMBK_ID)},
                        ]);
                                    
                              }} title="Delete" textStyle={{fontSize:13,}}>
                              </Button> 
                              </View>
                </View>

<View>

</View>

              </TouchableOpacity>
            </View>
          );
        }}
      />
      </View>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({  
  container: {
    flex: 1,
    backgroundColor: GlobalColor.PrimaryLight,   
  },
  MainContainer:{
    flex:1,
    paddingHorizontal:20,  
  },
  SearchContainer: {
    marginVertical: 10,
    width: '100%',
    flexDirection: 'row',
    borderWidth: 0,
    borderRadius: 5,
    alignSelf: 'center',
    backgroundColor: "#fff",
    color: GlobalColor.Primary,
    fontSize: GlobalFontSize.Small,
    fontFamily: 'Roboto-Regular',
    textAlign: 'left',
    paddingHorizontal: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 4,

  },


  TouchableOpacity: {
    width: '100%',
    paddingTop: 1,
    backgroundColor: GlobalColor.White,
    alignSelf: 'center',
    margin: 10,
    paddingVertical: 10,
    shadowColor: GlobalColor.ShadowColor,
    shadowOffset: {
      width: -0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 5,
    borderRadius: 8,
  },
  HeadingContainer:{
    width: '100%',
    backgroundColor: '#43C6DB',
    alignSelf: 'center',
    overflow: 'hidden',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  searchIcon: {
    padding: 10,
  },
  GStBox: {
    fontSize: 13,
    color: GlobalColor.LightDark,
    paddingVertical: 10,
    paddingBottom: 5,
    letterSpacing: 1,
  },
  spinnerTextStyle: {
    color: GlobalColor.White,
  },
});

//make this component available to the app
export default ManageBooking;
