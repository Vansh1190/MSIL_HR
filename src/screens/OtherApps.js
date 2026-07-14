//import liraries
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  FlatList,
  SafeAreaView,
  Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AuthContext from '../context/AuthContext';
import * as ApiService from '../Utils/Utils';
import { GlobalColor } from '../constants/Colors';
import Text from '../components/reusable/Text';
import { Header } from '../components/reusable/Header';
import { LoadingScreen } from '../components/reusable/LoadingScreen';
import ListEmptyComponent from '../components/reusable/ListEmptyComponent';


// create a component
const OtherApps = ({ navigation }) => {
  const [loader, setLoader] = useState(false);
  const { authContext, AppUserData } = useContext(AuthContext);
  const [appLink, setAppLink] = useState([]);
  const [refresh, setrefresh] = useState(false);


  const stopLoader = () => {
    try {
      setLoader(false);
      setrefresh(false);
    } catch (error) {
      // no-op
    }
  };


  const GetAPPLinkApi = (pulldown = false) => {
    if (!pulldown) {
      setLoader(true);
    }

    let token = AppUserData.token;
    let apiData = {
      UserName: AppUserData?.data?.username,
      LinkName: 'HR_ASSIST',
      LinkCat: '',
      LinkType: ''
    };

    ApiService.PostMethode('/GetAPPLink', apiData, token, authContext)
      .then(result => {
        let responseData = result.Value || [];
        stopLoader(false);

        // FIX: filter by both platform AND category so that WHATS_NEW rows
        // (which also carry LINK_LINK5 = "IOS"/"ANDROID") do not bleed in here
        if (Platform.OS === 'ios') {
          let result = responseData.filter(element => {
            return (
              element.LINK_LINK5 == 'IOS' &&
              element.LINK_APP_CATG == 'HRASSIST_OTH_APP'
            );
          });
          setAppLink(result);
        } else {
          let result = responseData.filter(element => {
            return (
              element.LINK_LINK5 == 'ANDROID' &&
              element.LINK_APP_CATG == 'HRASSIST_OTH_APP'
            );
          });
          setAppLink(result);
        }
      })
      .catch(error => {
        stopLoader(false);
        ApiService.showErrorMessage(error, authContext);
      });
  };


  const linkOpen = (link) => {
    if (
      link.LINK_APP_CATG == 'HRASSIST_OTH_APP' &&
      link.LINK_TYPE != 'In-House_App' &&
      link.LINK_LINK5 == 'ANDROID'
    ) {
      downloadApp(link.LINK_LINK1);
    } else if (
      link.LINK_APP_CATG == 'HRASSIST_OTH_APP' &&
      link.LINK_TYPE == 'In-House_App' &&
      link.LINK_LINK5 == 'ANDROID'
    ) {
      downloadInhouseApp(link.LINK_LINK1, link.LINK_LINK4);
    } else if (link.LINK_LINK5 == 'IOS') {
      downloadInhouseAppIos(link.LINK_LINK4, link.LINK_LINK2);
    }
  };

  useEffect(() => {
    GetAPPLinkApi();
  }, []);


  const downloadApp = (link) => {
    let pack_name = link.split('=');
    if (Platform.OS === 'android') {
      var SendIntentAndroid = require('react-native-send-intent');
      SendIntentAndroid.isAppInstalled(pack_name[1]).then(isInstalled => {
        if (isInstalled) {
          SendIntentAndroid.openApp(pack_name[1]).then(wasOpened => {
            if (!wasOpened) {
              Linking.openURL(link);
            }
          });
        } else {
          Linking.openURL(link);
        }
      });
    } else {
      Linking.openURL(link);
    }
  };

  const downloadInhouseApp = (link, link4) => {
    if (Platform.OS === 'android') {
      var SendIntentAndroid = require('react-native-send-intent');
      SendIntentAndroid.isAppInstalled(link4).then(isInstalled => {
        if (isInstalled) {
          SendIntentAndroid.openApp(link4).then(wasOpened => {
            if (!wasOpened) {
              Linking.openURL(link);
            }
          });
        } else {
          Linking.openURL(link);
        }
      });
    } else {
      Linking.openURL(link);
    }
  };

  const downloadInhouseAppIos = (link, link4) => {
    if (Platform.OS === 'ios') {
      Linking.openURL(link4);
    } else {
      Linking.openURL(link4);
    }
  };


  if (loader) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Other Mobile Apps" />
        <LoadingScreen />
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Header title="Other Mobile Apps" />
        <View style={{ flex: 1, paddingHorizontal: 10, marginBottom: '15%' }}>
          <FlatList
            contentContainerStyle={{}}
            data={appLink}
            numColumns={2}
            ListEmptyComponent={
              <ListEmptyComponent
                title="No Data Found"
                enableRefresh={true}
                onRefreshCallback={() => GetAPPLinkApi(true)}
                refreshing={refresh}
              />
            }
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.LINK_ID.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => linkOpen(item)}
                style={styles.button}>
                <Image
                  source={{ uri: item.LINK_LINK3 }}
                  style={{ width: 50, height: 50 }}
                />
                <Text
                  Bold
                  style={{ fontSize: 15, paddingVertical: 5, color: '#4a4a4a', marginTop: 5 }}>
                  {item.LINK_DESC}
                </Text>
              </TouchableOpacity>
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
    backgroundColor: '#fff',
  },
  button: {
    display: 'flex',
    minWidth: 150,
    maxWidth: 200,
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 17,
    borderColor: '#43C6DB',
    borderWidth: 0.5,
    paddingVertical: 15,
    backgroundColor: GlobalColor.White,
    shadowColor: 'gray',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    borderRadius: 0,
  }
});

//make this component available to the app
export default OtherApps;