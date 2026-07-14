//import liraries
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  SafeAreaView,
  Linking,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ActivityIndicator} from 'react-native-paper';
import AuthContext from '../../context/AuthContext';
import * as ApiService from '../../Utils/Utils';
import Toast from 'react-native-simple-toast';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {GlobalColor} from '../../constants/Colors';
import {GlobalFontSize} from '../../constants/FontSize';
import Text from '../../components/reusable/Text';
import {Header} from '../../components/reusable/Header';
import ListEmptyComponent from '../../components/reusable/ListEmptyComponent';
import {LoadingScreen} from '../../components/reusable/LoadingScreen';
import {Decrypt} from '../../Service/Helper';
import { useNavigation } from '@react-navigation/native';

// create a component
const ReportsToEmpProfile = ({route}) => {
  let userId = route.params.data;
  const navigation = useNavigation();
 

  const [loader, setLoader] = useState(false);
  const {authContext, AppUserData} = useContext(AuthContext);
  const [employeeData, setEmployeeData] = useState([]);
  const [empphoto, setPhoto] = useState('');
  const [reportIDD, setReportIdd] = useState('');
  const [refresh, setrefresh] = useState(false);
  let usrAccess = AppUserData?.data?.userFlag;

// $&

  const employeProfile = () => {
    let token = AppUserData.token;
    let userNem = route.params.reportsID;

    let apiData = {
      // UserName: userId
      StaffNO: userNem,
    };
// $&
    // return;
    setLoader(true);
    // ApiService.PostMethode('/GetEmployeeProfile', apiData, token, authContext)
    ApiService.PostMethode('/GetEmpSearch', apiData, token, authContext)
      .then(result => {
        stopLoader();
        if (result.Value?.Table.length > 0) {
          // // console.log($1);
          // let responseData = result.Value.Table;
          // let Profile = responseData?.[0].profile_photo;

          let responseData = result.Value.Table;
          let Profile = responseData?.[0].profile_photo;
          let reportsId = Decrypt(responseData[0].EMPL_REPORT_EMPL_ID).replace(/\D/g, '');
// $&
          setReportIdd(reportsId);

          
// $&
          // // console.log($1);
          setEmployeeData(responseData);
          setPhoto(Profile);
        } else {
          Toast.show('No Data Found');
        }
      })
      .catch(error => {
        stopLoader();
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const employeToProfile = (userId) => {
    let token = AppUserData.token;
    let userNem = route.params.reporterId;

    let apiData = {
      // UserName: userId
      StaffNO: userId,
    };
// $&
    // return;
    setLoader(true);
    // ApiService.PostMethode('/GetEmployeeProfile', apiData, token, authContext)
    ApiService.PostMethode('/GetEmpSearch', apiData, token, authContext)
      .then(result => {
        stopLoader();
        if (result.Value?.Table.length > 0) {
          // // console.log($1);
          // let responseData = result.Value.Table;
          // let Profile = responseData?.[0].profile_photo;

          let responseData = result.Value.Table;
          let Profile = responseData?.[0].profile_photo;
          let reportsId = Decrypt(responseData[0].EMPL_REPORT_EMPL_ID).split(/[(),?,.]/,)[2];
// $&
          setReportIdd(reportsId);

          
// $&
          // // console.log($1);
          setEmployeeData(responseData);
          setPhoto(Profile);
        } else {
          Toast.show('No Data Found');
        }
      })
      .catch(error => {
        stopLoader();
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const stopLoader = () => {
    try {
      setLoader(false);
      setrefresh(false);
    } catch (error) {
// $&
    }
  };

  useEffect(() => {
    employeProfile();
  }, []);

  if (loader) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title={'Employee Profile'} back />
        <LoadingScreen />
      </SafeAreaView>
    );
  }

  if (loader || employeeData.length == 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title={'Employee Profile'} back />
        <ListEmptyComponent
          enableRefresh={true}
          onRefreshCallback={() => employeProfile(true)}
          refreshing={refresh}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title={'Employee Profile'} back />
      {loader == true ? (
        <Spinner
          visible={loader}
          textContent={'Loading...'}
          textStyle={{color: '#fff'}}
        />
      ) : null}

      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          width: '90%',
          alignSelf: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          borderRadius: 8,
          marginTop: 60,
          marginBottom: 20,
        }}>
        <View
          style={{
            borderWidth: 5,
            borderColor: '#fff',
            shadowColor: '#000',
            shadowOffset: {
              width: 5,
              height: 5,
            },
            shadowOpacity: 0.5,
            shadowRadius: 3.84,
            elevation: 5,
            justifyContent: 'center',
            alignSelf: 'center',
            borderRadius: 100,
            marginTop: '-12%',
          }}>
          {empphoto ? (
            <Image
              source={{uri: `${empphoto}`}}
              style={{
                width: 100,
                height: 100,
                overflow: 'hidden',
                borderRadius: 100,
                alignSelf: 'center',
              }}
            />
          ) : (
            <Image
              source={require('../../assets/Images/Avtar.png')}
              style={{
                width: 100,
                height: 100,
                overflow: 'hidden',
                borderRadius: 100,
                alignSelf: 'center',
              }}
            />
          )}
        </View>

        <View style={{flex: 1, paddingBottom: 20}}>
          <FlatList
            contentContainerStyle={{flexGrow: 1, marginBottom: 20}}
            data={employeeData}
            style={{marginBottom:"22%"}}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => {
              return (
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('../../assets/Images/dataNotFound.png')}
                    style={{width: 300, height: 300, resizeMode: 'contain'}}
                  />
                  <Text style={{fontSize: 20, textAlign: 'center'}}>
                    No Data found
                  </Text>
                </View>
              );
            }}
            keyExtractor={({item, index}) => item}
            renderItem={({item, index}) => (
              <View style={{flex: 1}}>
                <Text
                  style={{
                    color: 'gray',
                    fontSize: 18,
                    textAlign: 'center',
                    padding: 5,
                    letterSpacing: 1,
                  }}>
                  {Decrypt(item.EMPL_NAME)}
                </Text>
                <View style={styles.box}>
                  <Text style={styles.header}>Employee ID</Text>
                  <Text style={styles.empproffont}>{Decrypt(item.EMPL_ID)}</Text>
                </View>
                <View style={styles.box}>
                  <Text style={styles.header}>Designation</Text>
                  <Text style={styles.empproffont}>{Decrypt(item.EMPL_DESG_CODE)}</Text>
                </View>

                <View style={styles.box}>
                  <Text style={styles.header}>Department</Text>
                  <Text style={styles.empproffont}>{Decrypt(item.EMPL_DEPT_CODE)}</Text>
                </View>

                <View style={styles.box}>
                  <Text style={styles.header}>Division</Text>
                  <Text style={styles.empproffont}>{Decrypt(item.EMPL_DIVN_CODE)}</Text>
                </View>

                {usrAccess != 'Y' ? (  <View style={styles.box}>
                  <Text style={styles.header}>Email</Text>
                  <Text style={styles.empproffont}> {Decrypt(item.EMPL_EMAIL_ID)}</Text>
                </View>):null}

                {usrAccess != 'Y' ? (   <View style={styles.box}>
                  <Text style={styles.header}>Phone No.</Text>
                  <TouchableOpacity
                    onPress={() => {
                      let phoneNumber = Decrypt(item.PHNE_PERS);
// $&
                      Linking.openURL(`tel:${phoneNumber}`);
                    }}>
                    <Text style={{color:'#43C6DB', fontWeight:'700',fontSize:14}} Bold>
                      {Decrypt(item.PHNE_PERS)}
                    </Text>
                  </TouchableOpacity>
                </View>) :null}

               {usrAccess != 'Y' ? (   <View style={styles.box}>
                <TouchableOpacity onPress={()=>Linking.openURL(`tel:${Decrypt(item.PHNE_EXTN)}`)}>
                  <Text style={styles.header}>Offical Phone No.</Text>
                  <Text style={{color:'#43C6DB', fontWeight:'700',fontSize:14}}> {Decrypt(item.PHNE_EXTN)}</Text>
                  </TouchableOpacity>
                </View>) :null}
               
                    <TouchableOpacity
                        onPress={()=> 
                          
                          employeToProfile(reportIDD)
                        //   navigation.navigate('EmployProfile', {
                        //   reporterId:reportIDD,
                        // })
                      }
                >
                <View style={styles.box}>
                  <Text style={styles.header}>Reports To</Text>
                  <Text style={{color:'#43C6DB', fontWeight:'700',fontSize:14}}>{Decrypt(item.EMPL_REPORT_EMPL_ID)}</Text>
                </View>
                </TouchableOpacity>
                <View style={styles.box}>
                  <Text style={styles.header}>Location</Text>
                  <Text style={styles.empproffont}>{Decrypt(item.LOCN_DESC)}</Text>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    borderBotttomWidth: 1,
    borderBottomColor: GlobalColor.Secondary,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 5,
  },
  header: {
    fontSize: 15,
    color: 'gray',
    paddingVertical: 5,
  },
  empproffont:{
    fontSize:13
  }
});

//make this component available to the app
export default ReportsToEmpProfile;
