//import liraries
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import * as ApiService from '../../Utils/Utils';
import Toast from 'react-native-simple-toast';
import {useFocusEffect} from '@react-navigation/native';
import AuthContext from '../../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import {GlobalColor} from '../../constants/Colors';
import {GlobalFontSize} from '../../constants/FontSize';
import Text from '../../components/reusable/Text';
import {Header} from '../../components/reusable/Header';
import ListEmptyComponent from '../../components/reusable/ListEmptyComponent';
import {LoadingScreen} from '../../components/reusable/LoadingScreen';
import { useNavigation } from '@react-navigation/native';

const ShortfallDeduction = () => {
  const {authContext, AppUserData} = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  const [Attendance, setAttendance] = useState([]);
  const [salDedList, setSalDedList] = useState('');
  const [refresh, setrefresh] = useState(false);
  const navigation = useNavigation();

  let usrAccess = AppUserData?.data?.userFlag;

// $&

  const stopLoader = () => {
    try {
      setLoader(false);
      setrefresh(false);
    } catch (error) {
// $&
    }
  };

  const SalDedList = (pulldown = false) => {
    if (!pulldown) {
      setLoader(true);
    }

    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;
    let apiData = {
      UserName: userId,
    };

    ApiService.PostMethode('/GetShtfllSalDedRprt', apiData, token, authContext)
      .then(result => {
// $&
        stopLoader(false);
        ApiResult = result.Value;
        setAttendance(result.Value);
      })
      .catch(error => {
        stopLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  useEffect(() => {
    SalDedList();
  }, []);

  if (loader) {
    return (
      <SafeAreaView style={{flex: 1}}>
        {/* <Header title={"Salary Deduction"} back/> */}
        <LoadingScreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: GlobalColor.PrimaryLight,
      }}>
      {/* <Header title="Salary Deduction" back/> */}
      {usrAccess == 'Y'?
      (
        <View style={{flex: 1}}>
        <FlatList
          contentContainerStyle={{flexGrow: 1}}
          ListEmptyComponent={() => (
            <ListEmptyComponent
              title="No Data Found"
              enableRefresh={true}
              onRefreshCallback={() => SalDedList(true)}
              refreshing={refresh}></ListEmptyComponent>
          )}
          data={Attendance}
          keyExtractor={({item, index}) => index}
          renderItem={({item, index}) => {
           
            return (
             
              <TouchableOpacity
                onPress={() => console.log(item['PAYROLL MONTH'])}
                style={styles.canteen}>
                {/* <Text style={{fontSize: 13}}>{item.Date}</Text> */}
                <Text style={{fontSize: 13}}>
                {item['WEEK NUMBER']}{' (' +item.TYPE}{' )'}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      ):

      (
        <View style={{flex: 1}}>
        <FlatList
          contentContainerStyle={{flexGrow: 1}}
          ListEmptyComponent={() => (
            <ListEmptyComponent
              title="No Data Found"
              enableRefresh={true}
              onRefreshCallback={() => SalDedList(true)}
              refreshing={refresh}></ListEmptyComponent>
          )}
          data={Attendance}
          style={{marginBottom:"10%"}}
          keyExtractor={({item, index}) => index}
          renderItem={({item, index}) => {
           
            return (
             
              <TouchableOpacity
              
                onPress={()=> 
                  
                  item.Code == 'R'? null :
                  navigation.navigate('ApplyLeaveDuShort', {
                  finYear:item['FIN YEAR'],  
                  salDeductPay: item['PAYROLL MONTH'],
                  payrollMonth:item['PAYROLL DESC'],
                  period:item['WEEK NUMBER'],
                  totalDays:item['TOTAL DAYS'],
                  
                })
              }
                // onPress={() => console.log(item.Date)}
                style={styles.canteen}>
                  <View>
                    <View style ={{flexDirection:'row',justifyContent:'space-between'}}>
                <Text Bold style={{fontSize: 13,color:'#43C6DB',textDecorationLine: 'underline'}}>{item['PAYROLL MONTH']}</Text>
                <Text style={{fontSize: 13,}}>
                  {"              "+"Block "+item['WEEK NUMBER']}{' (' +item.TYPE}{' )'}
                </Text>
                </View>
                <View style ={{flexDirection:'row',justifyContent:'space-between',marginVertical:5}}>
                <Text Bold style={{fontSize: 13,color:'#43C6DB',textDecorationLine: 'underline'}}>No. of Days</Text>
                <Text style={{fontSize: 13,}}>
                  {item['TOTAL DAYS']}
                </Text>
                </View>
                
                </View>
                
              </TouchableOpacity>
            );
          }}
        />
      </View>
      )

      }
    
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexGrow: 1,
    backgroundColor: GlobalColor.PrimaryLight,
  },
  gradient: {
    padding: 20,
  },
  container: {
    flexDirection: 'row',
  },
  canteen: {
    top: 10,
    marginVertical: 10,
    width: '100%',
    backgroundColor: '#fff',
    alignSelf: 'center',
    padding: 10,
    paddingVertical: 15,
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
  },
});

// //make this component available to the app
export default ShortfallDeduction;
