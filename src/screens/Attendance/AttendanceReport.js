//import liraries
import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Platform, Alert,Dimensions,Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import Geolocation from '@react-native-community/geolocation';

import AuthContext from '../../context/AuthContext';
import Toast from 'react-native-simple-toast'
import * as ApiService from '../../Utils/Utils';
import { useFocusEffect } from '@react-navigation/native';
import Button from './../../components/reusable/Button'
import { GlobalColor } from '../../constants/Colors';
import { GlobalFontSize } from '../../constants/FontSize';
import Text from '../../components/reusable/Text';
import { LoadingScreen } from './../../components/reusable/LoadingScreen';
import ListEmptyComponent from '../../components/reusable/ListEmptyComponent';
import { DataTable } from 'react-native-paper';
import Modal from 'react-native-modal';
import Feather from 'react-native-vector-icons/Feather';



const AttendanceReport = () => {
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [openSecond, setOpenSecond] = useState(false);
    const [MarkAttandance, setMarkAttandance] = useState(0);
    const [loader, setLoader] = useState(false)
    const [MapLisenceKey, setMapLisenceKey] = useState("");
    const [location, setLocation] = useState('');
    const { authContext, AppUserData } = useContext(AuthContext);
    // To Hide or show based on getGpsAvailable
    const [ShowAttandanceTabs, setShowAttandanceTabs] = useState(false);
    const [RawPunches, setRawPunches] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalLoader, setmodalLoader] = useState(false);
    const [firstOUT, setfirstOut] = useState('');
    const [secondOUT, setsecondOUT] = useState('');
    const [expOUT, setexpOUT] = useState('');
    const [shiftData, setShiftData] = useState('');

    let usrAccess = AppUserData?.data?.userFlag;

// $&



const LoadInitial = () => {

  GetEmplShift();

  GetRawPunch();

  //Exp_out();

}


  
useFocusEffect(

  React.useCallback(() => {

    const unsubscribe = LoadInitial();

    return () => unsubscribe;

  }, [])

);

    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };

    const Exp_out = () => {
      let apiData = {
        "UserName": AppUserData?.data?.userId
      };
      // // console.log($1);
      // AppUserData?.data?.userId
      //setmodalLoader(true);
      setModalVisible(true);
      let token = AppUserData.token;
      setLoader(true);
      ApiService.PostMethode('/GetExpTmeOut', apiData, token, authContext)
        .then(result => {
          setLoader(false);
// $&
          let responseData = result.Value;
// $&
          let f_out = responseData[0];
          let s_out = responseData[1];
          let ex_out = responseData[2];
 
// $&
// $&
// $&
// $&
          setfirstOut(f_out.split(" ")[1]);
          setsecondOUT(s_out.split(" ")[1]);
          setexpOUT(ex_out.split(" ")[1]);
         
 
         
       
        })
        .catch(error => {
          setLoader(false);
          // // console.log($1);
          ApiService.showErrorMessage(error, authContext);
        });
    }

    const GetEmplShift = () => {

      let userId = AppUserData?.data?.userId;
  
      let token = AppUserData.token;
  
      let fromdate = moment(fromDate).format('DD-MMM-YYYY');
  
      let toDate = moment(toDate).format('DD-MMM-YYYY');
  
      let apiData = {
  
          "FromDate": fromdate,
  
          "ToDate": toDate,
  
          "EmplID": userId
  
      };
  
      setLoader(true);
  
      // // console.log($1);
  
      // // console.log($1);
  
      ApiService.PostMethode('/GetEmplShift', apiData, token, authContext)
  
          .then(result => {
  
              // // console.log($1);
  
              setLoader(false);
  
              let ApiResult = result.Value
  
              setShiftData(result.Value[0]['SHIFT']);
  
             // setShiftData(ApiResult)
  
          })
  
          .catch(error => {
  
              setLoader(false);
  
              // // console.log($1);
  
              ApiService.showErrorMessage(error, authContext);
  
          });
  
  }
 
 
  
    const GetRawPunch = () => {
      let apiData = {
        "FromDate": moment(fromDate).format('DD-MMM-YYYY'),
        "ToDate": moment(toDate).format('DD-MMM-YYYY'),
        "StaffNo": AppUserData?.data?.userId
      };
      // // console.log($1);
      // AppUserData?.data?.userId
      let token = AppUserData.token;
      setLoader(true);
      ApiService.PostMethode('/GetRawPunch', apiData, token, authContext)
        .then(result => {
// $&
          setLoader(false);
          if (result.Value) {
            setRawPunches(result.Value);
          }
        })
        .catch(error => {
          setLoader(false);
          // // console.log($1);
          ApiService.showErrorMessage(error, authContext);
        });
    }
  
  
    const renderItem = ({ item }) => {
      // console.log("first data sujsdhg", item)
      return (
        <View style={styles.renderitem}>
          <Text style={{fontSize:13}}>{item['Staff No']}</Text>
          <Text style={{fontSize:13}}>{item.Date.slice(0, 12)}</Text>
          <Text style={{fontSize:13}}>{item.Date.slice("12", 17)}</Text>
          {/* <Text>{item.Date}</Text> */}
          <Text style={{fontSize:13}}>{item['Moble/Machine']}</Text>
        </View>
      )
    }
  
  
    const handelDate = () => {
      if (fromDate > toDate) {
        Alert.alert('from date should be less then to date');
      } else {
        GetRawPunch();
      }
    }
    if (loader) {
      return (
        <LoadingScreen />
      )
    }
  
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>

          <View style={{ flex: 1 }}>
            <View
              style={styles.reportView}>
              <View
                style={{
                  width: '48%',
                }}>
                <Text style={styles.titleLabel}>From</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: 'gray',
                    padding: 3,
                  }}>
                  <Text style={{ color: 'gray' ,fontSize:13}}>
                    {moment(fromDate).format('MMM Do YYYY')}
                  </Text>
                  <View>
                    <View>
                      <TouchableOpacity onPress={() => setOpen(true)}>
                        <Ionicons
                          name="calendar-outline"
                          size={25}
                          color={'#43C6DB'}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              <View
                style={{
                  width: '48%',
                }}>
                <Text style={styles.titleLabel}>To</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: 'gray',
                    padding: 3,
                  }}>
                  <Text style={{ color: 'gray' ,fontSize:13}}>
                    {moment(toDate).format('MMM Do YYYY')}
                  </Text>
                  <View>
                    <View>
                      <TouchableOpacity
                        onPress={() => (setOpenSecond(true))}>
                        <Ionicons
                          name="calendar-outline"
                          size={25}
                          color={'#43C6DB'}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              {/* DatePicker */}

              <DatePicker
                modal
                open={open}
                date={fromDate}
                mode='date'
                onConfirm={fromDate => {
                  setOpen(false);
                  setFromDate(fromDate);
// $&

                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
              <DatePicker
                modal
                mode='date'
                open={openSecond}
                date={toDate}
                onConfirm={toDate => {
                  setOpenSecond(false);
                  setToDate(toDate);
// $&
                }}
                onCancel={() => {
                  setOpenSecond(false);
                }}
              />
            </View>
            <Button onPress={() => { handelDate() }} title={"Submit"}></Button>

           { usrAccess == 'Y'?null:

(shiftData == 'ZZ'? null:

            <TouchableOpacity style ={{ alignItems:'center'}}
             onPress={() => {
              Exp_out();
            }}>
            <Image
                      source={require('../../assets/Images/exp_time.gif')}
                      style={[styles.profileImg1, {marginRight: 5}]}
                    />
            </TouchableOpacity>
)


}


            <DataTable
              style={{
                width: '100%',
                backgroundColor: '#fff',
                marginVertical: 10,
                flex: 1
              }}>

              <DataTable.Header style={{ backgroundColor: '#fff' }}>
                <DataTable.Title>
                  <Text Bold style={{ color: GlobalColor.Primary, fontSize: 14 }}>Staff Id</Text>
                </DataTable.Title>
                <DataTable.Title numeric >
                  <Text Bold style={{ color: GlobalColor.Primary, fontSize: 14 }}>
                    Date
                  </Text>
                </DataTable.Title>
                <DataTable.Title numeric>
                  <Text Bold style={{ color: GlobalColor.Primary, fontSize: 14 }}>Time</Text>
                </DataTable.Title>
                <DataTable.Title numeric>
                  <Text Bold style={{ color: GlobalColor.Primary, fontSize: 14 }}>Source</Text>
                </DataTable.Title>
              </DataTable.Header>

              <FlatList
                contentContainerStyle={{ flexGrow: 1, }}
                data={RawPunches}
                style={{marginBottom:'5%'}}
                renderItem={renderItem}
                ListEmptyComponent={() => <ListEmptyComponent title="No Data Found" subtitle="Please select dates and submit to view data"></ListEmptyComponent>}
                keyExtractor={item => item.Date.toString()}
              />
            </DataTable>
          </View>

          <Modal
          backdropOpacity={0.7}
          coverScreen={true}
          isVisible={isModalVisible}>
          <View
            style={{
              minHeight: 230,
              borderRadius: 15,
              backgroundColor: GlobalColor.White,
            }}>
            {modalLoader ? (
              <LoadingScreen />
            ) : (
              <View style={styles.modal}>
                <TouchableOpacity style={styles.ModalCloseIcon}>
                  <Feather
                    name="x-circle"
                    color={'#43C6DB'}
                    size={25}
                    onPress={toggleModal}
                    style ={{marginVertical:10,marginHorizontal:10}}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    width: 90,
                    height: 90,
                    borderWidth: 3,
                    borderColor: '#43C6DB',
                    borderRadius: 65,
                    marginTop: 20,
                  }}>
 
 
                   
                 {expOUT == null?
                 <Image
                 source={require('../../assets/Images/sad.gif')}
                 style={[styles.profileImg, {marginRight: 5}]}
               />
               :
               <Image
                      source={require('../../assets/Images/work.gif')}
                      style={[styles.profileImg, {marginRight: 5}]}
                    />
                }
                   
                 
                </View>
                {expOUT == null?
                <View  style={{
                  paddingVertical: 15,
                  alignSelf: 'center',
                  alignItems: 'center',
                }} >
                <Text
                style={{
                  paddingHorizontal: 5,
                  fontSize: 13,
                  fontWeight: 'bold',
                }}
                >No Data Found</Text>
                </View>:
                <View
                  style={{
                    paddingVertical: 15,
                    alignSelf: 'center',
                    alignItems: 'center',
                  }}>
                   <Text style={{
                    paddingHorizontal: 20,
                    fontSize: 13,}}>
                      <Text
                      style={{
                        paddingHorizontal: 5,
                        fontSize: 13,
                        fontWeight: 'bold',
                      }}
                      >{firstOUT == ''?'Expected Second':'Expected First'} Half Time Out  - </Text>
                      {firstOUT == ''?secondOUT:firstOUT}
                      </Text>
          <Text style={{
                    paddingHorizontal: 20,
                    fontSize: 13,}}>
                      <Text
                      style={{
                        paddingHorizontal: 5,
                        fontSize: 13,
                        fontWeight: 'bold',
                      }}>Expected Shift Time Out  - </Text>
                      {expOUT}
                      </Text>
 
                 
                </View>
}
                <View
                  style={{
                    // height: '23%',
                    marginTop: 5,
                    // backgroundColor:'yellow',
                    flexDirection: 'row',
                    alignSelf: 'center',
                    justifyContent: 'space-around',
                    width: '50%',
                    alignItems: 'flex-end',
                  }}>
               
                 
                </View>
              </View>
            )}
          </View>
        </Modal>
 
      </View>
    </View>
  )
}

// define your styles
const styles = StyleSheet.create({
    container: {
      flex: 1,      
      position: 'relative',
      backgroundColor: GlobalColor.PrimaryLight
    },
    reportView: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#fff',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      padding: 10,
      marginVertical: 10,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      borderRadius: 0,
    },

    modal: {
      height: 105,
      width: '100%',
      alignSelf: 'center',
      backgroundColor: GlobalColor.PrimaryLight,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 50,
      position: 'relative',
    },

    content: {
      top: 10,
      alignItems: 'center',
      padding: 10,
      backgroundColor: 'white',
      borderRadius: 5,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 2.0,
      elevation: 5,
      marginVertical: 10
    },
    circle: {
      height: 100,
      width: 100,
      borderWidth: 3,
      borderColor: 'green',
      borderRadius: 100,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 8,
      marginVertical: 30,
    },
    renderitem: {
      paddingVertical: 15,
      paddingHorizontal: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#fff',
      marginTop: 10,
      borderWidth: 0.5,
      borderColor: GlobalColor.LightDark,
      
    },
    titleLabel: {
      color: GlobalColor.Primary,
      fontWeight: '500',
      fontSize: 14
    },
    profileImg: {
      height: 50,
      width: 50,
      borderRadius: 40,
      marginLeft: 5,
    },

    profileImg1: {
      height:Dimensions.get('window').height/8.5,
      width: "100%",
      marginLeft: 5,
      marginVertical:5,
      marginBottom:-35,
     
    },
 

  
  });
  
  //make this component available to the app

export default AttendanceReport