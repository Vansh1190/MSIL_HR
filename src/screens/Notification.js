//import liraries
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { View, StyleSheet, Image, FlatList, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import ListEmptyComponent from '../components/reusable/ListEmptyComponent';
import Text from '../components/reusable/Text';
import { LoadingScreen } from '../components/reusable/LoadingScreen';
import { Header } from '../components/reusable/Header';
import { GlobalColor } from '../constants/Colors';
import { showErrorMessage } from '../Utils/Utils';
import { useFocusEffect } from '@react-navigation/native';

// create a component
const Notification = ({ navigation }) => {
  const [loader, setLoader] = useState(false);
  const [refresh, setrefresh] = useState(false);
  const [notifi, setNotifi] = useState([]);

  const stopLoader = () => {
    try {
      setLoader(false);
      setrefresh(false);
    } catch (error) {
// $&
    }
  }

//   const NotifiApi = async (pulldown = false) => {
//     if (!pulldown) {
//       //Set Loader
//       setLoader(true);
//     }
//     try {
//       //Set Axios Header
//       let axiosheader = {
//         headers: {
//           'authorization': 'Basic ZDU5NjEyY2ItYTI3NS00ZTYzLTkyMGItNGE4ODJmYjFiOTVm'
//         }
//       }
//       //Get Data
//       let resp = await axios.get('https://onesignal.com/api/v1/notifications?app_id=42fcb50a-922f-4b0e-9ba3-701d663beede', axiosheader)
//       // Remove Loader
//       stopLoader();
//       // Set Data
//       let result = resp?.data?.notifications
//       setNotifi(result);
// // $&
//     } catch (error) {
//       stopLoader();
//       showErrorMessage(error)
//     }
//   }

const NotifiApi = async (pulldown = false) => {
  if (!pulldown) {
    //Set Loader
    setLoader(true);
  }
  try {
    //Set Axios Header
    let axiosheader = {
      headers: {
        'authorization': 'Basic os_v2_app_ac6r55t3t5ckdggotbwt7fsuz3i27ag4pu2ufo4zugn2dypmxbpu7pqg4hc55j65asj43aasfktned7cwghmuujeabpb5irdlubm73i'
      }
    }
    //Get Data
//i27ag4pu2ufo4zugn2dypmxbp
    //os_v2_app_ac6r55t3t5ckdggotbwt7fsuz3i27ag4pu2ufo4zugn2dypmxbpu7pqg4hc55j65asj43aasfktned7cwghmuujeabpb5irdlubm73i
    let resp = await axios.get('https://onesignal.com/api/v1/notifications?app_id=00bd1ef6-7b9f-44a1-98ce-986d3f9654ce', axiosheader)
    // Remove Loader
    stopLoader();
    // Set Data
    let result = resp?.data?.notifications;
    //// console.log($1);
    setNotifi(result)
    // console.log($1);
  } catch (error) {
    stopLoader();
    showErrorMessage(error)
  }
}




  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = NotifiApi()
      return () => unsubscribe;
    }, [])
  );

  if (loader) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title={"Notifications"} back />
        <LoadingScreen />
      </SafeAreaView>
    )
  }



  return (
    <SafeAreaView style={styles.container}>
      <Header title={"Notifications"} back />
      <View style={{ flex: 1 }}>
        <View
          style={{
            marginHorizontal: 10,
            marginBottom: 0,
            paddingHorizontal: 10,
            flex: 1,
          }}>

          <FlatList
            contentContainerStyle={{ flexGrow: 1 }}
            data={notifi}
            ListEmptyComponent={() => <ListEmptyComponent title="No Data Found" enableRefresh={true} onRefreshCallback={() => NotifiApi(true)} refreshing={refresh} ></ListEmptyComponent>}
            showsVerticalScrollIndicator={false}
            onRefresh={() => NotifiApi(true)}
            refreshing={refresh}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View
                key={index}
                style={{
                  width: '100%',
                  backgroundColor: '#fff',
                  alignSelf: 'center',
                  marginTop: 14,
                  padding: 15,
                  paddingVertical: 10,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  borderRadius: 5,
                }}>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // paddingVertical: 10,
                  }}>
                  <View style={{ width: '80%' }}>
                    <Text style={{ fontSize: 14 }}>{item.contents.en}</Text>
                  </View>
                  <TouchableOpacity style={{ width: '20%', alignItems: 'flex-end' }}>
                    <Ionicons
                      name="notifications-circle-outline"
                      size={30}
                      color={'#43C6DB'}
                    />
                  </TouchableOpacity>
                </View>
                {/* {item.global_image ==} */}
                <Image source={item.global_image ? { uri: item.global_image } : require('./../assets/Images/notification.png')}
                  style={{ width: '100%', height: 180, resizeMode: 'cover', borderRadius: 0, marginVertical: 10 }} />

                {item.url ? (
                  <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
                    <Text style={styles.Link}>
                      {item.url ? item.url : ''}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  )
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalColor.PrimaryLight
    // backgroundColor: '#fff',
  },
  Link: {
    color: '#43C6DB',
    fontWeight: '700',
    fontSize: 14,
  },
  spinnerTextStyle: {
    color: '#fff'
  }
});

//make this component available to the app
export default Notification;
