import React, { useState, useEffect, useContext } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { GlobalColor } from "../../constants/Colors";
import { GlobalFontSize } from "../../constants/FontSize";
import Text from './Text';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../context/AuthContext'; // Adjust path as needed
import * as ApiService from '../../Utils/Utils'; // Adjust path

export const HeaderMgrTaxi = ({ back = false, title = "", onPress }) => {
  const navigation = useNavigation();
  const { AppUserData, authContext } = useContext(AuthContext); // Get from context

  const [taxiMenu, setTaxiMenu] = useState('ManagerTaxi'); // Fixed: setTaxiMenu
  const [loader, setLoader] = useState(false); // Local loader if needed

  const showTaxiRental = () => {
    if (!AppUserData?.token || !AppUserData?.data?.username) return;

    const token = AppUserData.token;
    const apiData = {
      "UserName": AppUserData?.data?.username
    };

    setLoader(true);

    ApiService.PostMethode('/GetTaxiCutoff', apiData, token, authContext)
      .then(result => {
        const responseData = result.Result || 'Y'; // Default to new version
        console.log("---Taxi Cutoff Response---", responseData);

        // Update navigation target based on response
        setTaxiMenu(responseData === 'N' ? 'ManagerTaxiOld' : 'ManagerTaxi');
      })
      .catch(error => {
        console.log("Error fetching taxi cutoff:", error);
        ApiService.showErrorMessage(error, authContext);
        // Fallback to default
        setTaxiMenu('ManagerTaxi');
      })
      .finally(() => {
        setLoader(false);
      });
  };

  // Call every 2 seconds
  useEffect(() => {
    showTaxiRental(); // Initial call

    const interval = setInterval(() => {
      showTaxiRental();
    }, 2000); // Every 2 seconds

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [AppUserData?.data?.username]); // Re-run if username changes

  return (
    <LinearGradient
      colors={['#FF6347', '#FF6347', '#FF6347']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', width: 80, justifyContent: 'space-between', alignItems: 'center' }}>
          {back ? (
            <Ionicons
              name="chevron-back-outline"
              size={25}
              color={'white'}
              onPress={() => navigation.navigate(taxiMenu)} // Now uses dynamic screen
            />
          ) : (
            <>
              <Ionicons
                name="chevron-back-outline"
                size={25}
                color={'white'}
                onPress={() => navigation.goBack()}
              />
              <Ionicons
                name="menu-outline"
                size={25}
                color={'white'}
                onPress={() => navigation.openDrawer()}
              />
            </>
          )}
        </View>

        <Text Bold style={{ color: '#fff', fontSize: GlobalFontSize.H4, marginLeft: 15 }}>
          {title}
        </Text>
      </View>

      {onPress ? (
        <TouchableOpacity onPress={onPress} style={{ position: 'absolute', right: 10, top: 15 }}>
          <Image
            source={require("../../assets/Images/setting.png")}
            style={{ width: 30, height: 30, tintColor: '#fff' }}
          />
        </TouchableOpacity>
      ) : null}
    </LinearGradient>
  );
};

const styles = {
  container: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  }
};

export default HeaderMgrTaxi;