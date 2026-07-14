import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  ScrollView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import Toast from 'react-native-simple-toast'
import Spinner from 'react-native-loading-spinner-overlay/lib';
import * as ApiService from '../../../Utils/Utils';
import AuthContext from '../../../context/AuthContext';
import Accordion from './../CanteenComponent/Accordion';


import { GlobalColor } from '../../../constants/Colors'; 
import { GlobalFontSize } from '../../../constants/FontSize';
import Text from '../../../components/reusable/Text';
import { LoadingScreen } from '../../../components/reusable/LoadingScreen';



  // Gurgaon Tab Component
  export const Location = ({ navigation, route }) => {
    const [isOpen, setIsOpen] = useState('');
    const [loader, setLoader] = useState(false);
    const { authContext, AppUserData } = useContext(AuthContext);
    const [breakfast, setBreakfast] = useState([]);
    const [lunch, setLunch] = useState([]);
    const [snacks, setSnacks] = useState([]);
    const [dinner, setDinner] = useState([]);
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);




    useEffect(() => {
        GetMenuCanttApi()
    }, [date]);


      const GetMenuCanttApi = () => {
        let token = AppUserData.token
        let userId = AppUserData.data
        let formatedDate = moment(date).format("DD-MMMM-YYYY").toUpperCase();
        let apiData = {
            MenuType: route.params.MenuType,
            MenuDate: formatedDate,
            MenuLocation: route.params.MenuLocation,
            staffid: userId,            
        }
        setLoader(true);
        ApiService.PostMethode('/GetMenuCant', apiData, token, authContext)
          .then(result => {
            setLoader(false);
            let ApiValue = result.Value
// $&

            let breakfst = result.Value.filter(item => {
              if (item.CANT_MEAL === "Breakfast") {
                return item
              }
            })

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
            setBreakfast(breakfst);
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



    React.useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', (e) => {
          // Prevent default behavior
          // e.preventDefault();          
// $&
          GetMenuCanttApi();
          // Do something manually
          // ...
        });
        return unsubscribe;
      }, [navigation]);


    return (
      <SafeAreaView style={styles.screenContainer}>
          <View style={styles.calander}>
            <Text style={{fontSize:13}}>{moment(date).format('MMM Do YYYY')}</Text>
            <TouchableOpacity onPress={() => setOpen(true)}>
              <Ionicons name="calendar-outline" size={23} color={'#43C6DB'} />
            </TouchableOpacity>
            <DatePicker
                modal
                open={open}
                date={date}
                onConfirm={date => {
                setOpen(false);
                setDate(date)
// $&
                }}
                onCancel={() => {
                setOpen(false);
                }}
                mode="date"
            />
          </View>

            { loader ? (
                <LoadingScreen/>
            ):(
             <ScrollView style={styles.AccordianContainer}>
                 {breakfast == ''?null: <Accordion data={lunch} name={'Breakfast'} handleDropDown={() => setIsOpen(isOpen === 'lunch' ? '' : 'lunch')} isOpen={isOpen === 'lunch'} style={{fontSize:13}} />}
                <Accordion data={lunch} name={'Lunch'} handleDropDown={() => setIsOpen(isOpen === 'lunch' ? '' : 'lunch')} isOpen={isOpen === 'lunch'} style={{fontSize:13}} />
                <Accordion data={snacks} name={'Snacks'} handleDropDown={() => setIsOpen(isOpen === 'snacks' ? '' : 'snacks')} isOpen={isOpen === 'snacks'} style={{fontSize:13}}/>
                <Accordion data={dinner} name={'Dinner'} handleDropDown={() => setIsOpen(isOpen === 'dinner' ? '' : 'dinner')} isOpen={isOpen === 'dinner'} style={{fontSize:13}}/>
              </ScrollView>
            )
        }
      </SafeAreaView>
    );
  };


  const styles = StyleSheet.create({      
    screenContainer:{
      flex: 1, 
      backgroundColor: GlobalColor.PrimaryLight,
      paddingHorizontal:10
    },
    spinnerTextStyle: {
      color: GlobalColor.White
    },
    calander: {
      width: '100%',
      paddingHorizontal:20,
      backgroundColor: GlobalColor.White,
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'center',
      flexDirection: 'row',
      paddingVertical: 8,
      marginVertical: 10,
      borderRadius: 0,
      shadowColor: GlobalColor.Black,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 2,
    },
    AccordianContainer:{
        flex:1, 
    }
  });