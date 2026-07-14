// /import liraries
import React, { useState, useEffect, useRef, useContext } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ScrollView,
    SafeAreaView,
    Pressable,
    Alert,
    TextInput
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SelectDropdown from 'react-native-select-dropdown';
import { Formik } from 'formik';
import * as yup from 'yup';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-simple-toast'
import * as ApiService from '../../../Utils/Utils';
import AuthContext from '../../../context/AuthContext'
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { GlobalColor } from '../../../constants/Colors';
import Text from '../../../components/reusable/Text';
// import TextInput from '../../../components/reusable/TextInput';
import { HeaderMgr } from '../../../components/reusable/HeaderMgr';
import Button from '../../../components/reusable/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ListEmptyComponent from '../../../components/reusable/ListEmptyComponent';
import { LoadingScreen } from '../../../components/reusable/LoadingScreen';
import {Decrypt} from '../../../Service/Helper';




const ManagerAttandancePercentage = ({ navigation, route }) => {
  const { authContext, AppUserData } = useContext(AuthContext);
  const [Attendance, setAttendance] = useState('');
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


  const GetAttendancePercentageYearwise = (pulldown = false) => {
    if (!pulldown) {
      //Set Loader
      setLoader(true);
    }
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;


    let apiData = {
      "UserName": userId,
      "Years":3
    };

// $&

    ApiService.PostMethode('/GetAttendancePercentageYearwise', apiData, token, authContext)
      .then(result => {
// $&
        stopLoader(false);
        let ApiResult = result.Value
        setAttendance(ApiResult)
      })
      .catch(error => {
        stopLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  }



//   useFocusEffect(
//     React.useCallback(() => {
//       const unsubscribe = GetAttendancePercentageYearwise();
//       return () => unsubscribe;
//     }, [])
// );


 // Update useFocusEffect to include route.params.data as a dependency
 useFocusEffect(
  React.useCallback(() => {
    GetAttendancePercentageYearwise();
    // No explicit unsubscribe needed since the API call is synchronous
  }, [route?.params?.data]) // Add route.params.data as a dependency
);


  if (loader) {
    return (
      <SafeAreaView style={{ flex: 1, width: '100%', height: '100%' }}>
       

        <HeaderMgr title={"Attendance Percentage"} back/>
        <LoadingScreen />
      </SafeAreaView>
    )
  }




  return (
    <SafeAreaView style={{ flex: 1, width: '100%', height: '100%' }}>
      <HeaderMgr title={"Attendance Percentage"} back/>
      <View style={{ flex:1, paddingHorizontal:10 }}>
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          data={Attendance}
          ListEmptyComponent={() =>  <ListEmptyComponent title="No Data Found" enableRefresh={true} onRefreshCallback={() => GetAttendancePercentageYearwise(true)} refreshing={refresh} ></ListEmptyComponent>}
          keyExtractor={({ item, index }) => index}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={styles.canteen}>
                <Text style={{fontSize: 13}}>Financial year {item.MATT_FNYR_YEAR}</Text>
                <Text style={{fontSize: 13}}>{item.MATT_PERCENT}%</Text>
              </TouchableOpacity>
            )
          }}
        />
      </View>
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
  canteen: {
    marginVertical: 10,
    width: '100%',
    backgroundColor: '#fff',
    alignSelf: 'center',
    padding: 10,
    paddingVertical:15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    borderRadius: 0,
    borderLeftWidth: 5,
    borderLeftColor: "#FF6347",   
    marginBottom:2,
  },
});

// //make this component available to the app
export default ManagerAttandancePercentage;
