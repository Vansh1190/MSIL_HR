import React, { useState, useEffect, useContext } from 'react';
import {
  View,
 
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  ActivityIndicator, SafeAreaView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import Toast from 'react-native-simple-toast'
import * as ApiService from '../../Utils/Utils';
import AuthContext from '../../context/AuthContext';
import Accordion from './CanteenComponent/Accordion';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { GlobalFontSize } from '../../constants/FontSize';
import { GlobalColor } from '../../constants/Colors';
import Text from '../../components/reusable/Text';
import { Header } from '../../components/reusable/Header';
import { Location } from './Locations/Location';


const Tab = createMaterialTopTabNavigator();
const FoodCount = ({ navigation }) => {
  const [loader, setLoader] = useState(false);
  const { authContext, AppUserData } = useContext(AuthContext);
  const [lunch, setLunch] = useState([]);
  const [snacks, setSnacks] = useState([]);
  const [dinner, setDinner] = useState([]);
  const [currentInd, setCurrentInd] = useState(0)
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState();


  const GetMenuCanttApi = () => {
    let token = AppUserData.token
    let userId = AppUserData.data
    let formatedDate = moment(date).format("DD-MMMM-YYYY").toUpperCase();
// $&
    let apiData;
    if (currentInd == 0) {
      apiData = {
        MenuType: "F",
        staffid: userId,
        MenuDate: formatedDate,
        MenuLocation: "002"
      }
// $&
    }
    else if (currentInd == 1) {
      apiData = {
        MenuType: "F",
        staffid: userId,
        MenuDate: formatedDate,
        MenuLocation: "010"
      }
// $&
    }
    else if (currentInd == 2) {
      apiData = {
        MenuType: "F",
        staffid: userId,
        MenuDate: formatedDate,
        MenuLocation: "011"
      }
// $&
    }
    else if (currentInd == 3) {
      apiData = {
        MenuType: "F",
        staffid: userId,
        MenuDate: formatedDate,
        MenuLocation: "041"
      }
// $&
    }
// $&
    setLoader(true);
    ApiService.PostMethode('/GetMenuCant', apiData, token, authContext)
      .then(result => {
        setLoader(false);
        let ApiValue = result.Value
// $&
        let lunch = result.Value.filter(item => {
          if (item.CANT_MEAL === "Lunch") {
            return item
          }
        })

        let snacks = result.Value.filter(item => {
          if (item.CANT_MEAL === "Snacks") {
            return item
          }
        })

        let dinner = result.Value.filter(item => {
          if (item.CANT_MEAL === "Dinner") {
            return item
          }
        })

        setLunch(lunch);
        setSnacks(snacks);
        setDinner(dinner);
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };
  useEffect(() => {
    GetMenuCanttApi()
// $&
// $&
  }, [currentInd, date])


  // Gurgaon

  const Gurgaon = ({ navigation }) => {
    const [isOpen, setIsOpen] = useState('');
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor:GlobalColor.PrimaryLight }}>
      <View style={styles.AccordianContainer}>
        {loader == true ? (
          <Spinner
            visible={loader}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
        ) : null}
        {/* <Calander /> */}
        <Accordion data={lunch} name={'Lunch'} handleDropDown={() => setIsOpen(isOpen === 'lunch' ? '' : 'lunch')} isOpen={isOpen === 'lunch'} />
        <Accordion data={snacks} name={'Snacks'} handleDropDown={() => setIsOpen(isOpen === 'snacks' ? '' : 'snacks')} isOpen={isOpen === 'snacks'} />
        <Accordion data={dinner} name={'Dinner'} handleDropDown={() => setIsOpen(isOpen === 'dinner' ? '' : 'dinner')} isOpen={isOpen === 'dinner'} />
     </View>
      </SafeAreaView>
    );
  };

  // GURGAON End

  // MANSEAR START
  const Manesar = ({ navigation }) => {
    const [isOpen, setIsOpen] = useState('');
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor:GlobalColor.PrimaryLight }}>
      <View style={styles.AccordianContainer}>
        {loader == true ? (
          <Spinner
            visible={loader}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
        ) : null}
        {/* <Calander /> */}
        <Accordion data={lunch} name={'Lunch'} handleDropDown={() => setIsOpen(isOpen === 'lunch' ? '' : 'lunch')} isOpen={isOpen === 'lunch'} />
        <Accordion data={snacks} name={'Snacks'} handleDropDown={() => setIsOpen(isOpen === 'snacks' ? '' : 'snacks')} isOpen={isOpen === 'snacks'} />
        <Accordion data={dinner} name={'Dinner'} handleDropDown={() => setIsOpen(isOpen === 'dinner' ? '' : 'dinner')} isOpen={isOpen === 'dinner'} />
     </View>
      </SafeAreaView>
    )
  };

  const Mpt = ({ navigation }) => {
    const [isOpen, setIsOpen] = useState('');
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor:GlobalColor.PrimaryLight }}>
      <View style={styles.AccordianContainer}>
        {loader == true ? (
          <Spinner
            visible={loader}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
        ) : null}
        {/* <Calander /> */}
        <Accordion data={lunch} name={'Lunch'} handleDropDown={() => setIsOpen(isOpen === 'lunch' ? '' : 'lunch')} isOpen={isOpen === 'lunch'} />
        <Accordion data={snacks} name={'Snacks'} handleDropDown={() => setIsOpen(isOpen === 'snacks' ? '' : 'snacks')} isOpen={isOpen === 'snacks'} />
        <Accordion data={dinner} name={'Dinner'} handleDropDown={() => setIsOpen(isOpen === 'dinner' ? '' : 'dinner')} isOpen={isOpen === 'dinner'} />
     </View>
      </SafeAreaView>
    );
  };

  const Rothak = ({ navigation }) => {
    const [isOpen, setIsOpen] = useState('');
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor:GlobalColor.PrimaryLight }}>
      <View style={styles.AccordianContainer}>
        {loader == true ? (
          <Spinner
            visible={loader}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
        ) : null}
        {/* <Calander /> */}
        <Accordion data={lunch} name={'Lunch'} handleDropDown={() => setIsOpen(isOpen === 'lunch' ? '' : 'lunch')} isOpen={isOpen === 'lunch'} />
        <Accordion data={snacks} name={'Snacks'} handleDropDown={() => setIsOpen(isOpen === 'snacks' ? '' : 'snacks')} isOpen={isOpen === 'snacks'} />
        <Accordion data={dinner} name={'Dinner'} handleDropDown={() => setIsOpen(isOpen === 'dinner' ? '' : 'dinner')} isOpen={isOpen === 'dinner'} />
        

     </View>
      </SafeAreaView>
    );
  };

  // if(loader){
  //   return(
  //     <SafeAreaView style={styles.LoadingContainer}>
  //     <Header title={"Notifications"} back/>
  //       <LoadingScreen/>
  //     </SafeAreaView>
  //   )
  // }

  return (
    <View style={{ flex: 1, width: '100%', height: '100%' }}>
       <Header title="Food Court"/>        
       <LinearGradient colors={['#43C6DB','#43C6DB','#43C6DB']} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.mystyl}>
        <View style={{flex:1,flexDirection:'row'}}>
      <Tab.Navigator
        swipeEnabled={false}
        screenOptions={{
          tabBarLabelStyle: { fontSize: GlobalFontSize.TabTitle, fontWeight:'700'},
          tabBarScrollEnabled: true,
          tabBarItemStyle: { paddingHorizontal:15, width:'auto' },
          tabBarActiveTintColor: '#fff',
          tabBarIndicatorStyle: { borderBottomWidth: 5, borderBottomColor: '#fff' },
          tabBarStyle: { backgroundColor:'transparent', elevation: 0 },
        }}
      >
        <Tab.Screen name="Gurgaon" component={Location} initialParams={{ MenuLocation: "002", MenuType: "F" }}/>
        <Tab.Screen name="Manesar" component={Location} initialParams={{ MenuLocation: "010", MenuType: "F" }}/>
        <Tab.Screen name="MPT" component={Location} initialParams={{ MenuLocation: "011", MenuType: "F" }}/>
        <Tab.Screen name="Rothak" component={Location} initialParams={{ MenuLocation: "041", MenuType: "F" }} />
        <Tab.Screen name="Kharkhoda" component={Location} initialParams={{ MenuLocation: "080", MenuType: "F" }} />
      </Tab.Navigator>
      </View>
      </LinearGradient>
    </View>
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
 mystyl:{
    backgroundColor:'transparent',
    height:'100%',
    flexDirection:'row',
  },
  // Gurgaon Lunch section
  lunchBoxContainer: {
    width: '100%',
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  lunchBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    paddingVertical: 15,
    // backgroundColor:'red'
  },
  calander: {   
    backgroundColor: GlobalColor.White,
    justifyContent: 'space-around',
    alignItems: 'center',
    width:"100%",
    alignSelf: 'center',
    flexDirection: 'row',
    paddingHorizontal:20,
    paddingVertical: 8, 
    marginVertical: 10,
    // marginHorizontal:20,
    borderRadius: 5,
    shadowColor: GlobalColor.Black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    borderRadius:5,
    elevation: 2,
  },
  AccordianContainer:{ marginTop: 70},

  // LoadingContainer: {
  //   flex: 1,
  //   backgroundColor:GlobalColor.PrimaryLight
  //   // backgroundColor: '#fff',
  // },
});

// //make this component available to the app
export default FoodCount;
