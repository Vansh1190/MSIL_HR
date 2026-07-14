//import liraries
import React, { Component, useEffect, useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Linking, Image, SafeAreaView, Pressable, Modal } from 'react-native';
import Toast from 'react-native-simple-toast'
import * as ApiService from '../../Utils/Utils';
import AuthContext from '../../context/AuthContext';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Spinner from 'react-native-loading-spinner-overlay';
// import Modal from 'react-native-modal';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import ListEmptyComponent from '../../components/reusable/ListEmptyComponent';
import { GlobalColor } from '../../constants/Colors';
import Text from '../../components/reusable/Text';



// create a component
const Hospital = ({ locationName }) => {
  const myNavigation = useNavigation();
  const { authContext, AppUserData } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  const [hospitalList, setHospitallList] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItem, setModalItem] = useState('')
  const [hospitalLoc, setHospitalLoc] = useState([]);
  const [filterModal,setFilterModal] = useState(false);
  const [refresh, setrefresh] = useState(false);


  const stopLoader = () => {
    try {
      setLoader(false);
      setrefresh(false);
    } catch(error){
// $&
    }
}



  const GetHospListApi = (data) => {
    let token = AppUserData.token
    let apiData ;
    if(data==undefined){
      apiData = {
        "HospLoc" : "ALL"
      };
    }
    else {
      apiData= {
        "HospLoc":data
      }
    }
    setLoader(true);
    ApiService.PostMethode('/GetHospList', apiData, token, authContext)
      .then(result => {
        setFilterModal(false);
// $&
        setLoader(false);
        let ApiValue = result.Value
        setHospitallList(ApiValue)
      })
      .catch(error => {
        setFilterModal(false);
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };


  const GetHospLocnApi = () => {
    setFilterModal(true);
    let token = AppUserData.token
    let apiData = {}
    ApiService.PostMethode('/GetHospLocn', apiData, token, authContext)
      .then(result => {
        setLoader(false);
        // // console.log($1);
        let ApiValue = result.Value
// $&
        setHospitalLoc(ApiValue)
        setFilterModal(true)
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };


  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = GetHospListApi();
      return () => unsubscribe;
    }, [])
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Modal */}
        {loader == true ? (
          <Spinner
            visible={loader}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
        ) : null}

        <View style={styles.itemBox}>
          <Modal
            backdropOpacity={0.7}
            // animationType="slide"
            animationOut="fadeOut"
            transparent={true}
            visible={modalVisible}>
            <View style={styles.modalBoxDetail}>
              <View style={styles.modalBoxDetailInner}>      
              <TouchableOpacity style={{ position:'absolute', top:0, right:0 }} onPress={() =>setModalVisible(false)}>
                <Feather
                  name="x-circle"
                  color={GlobalColor.Danger}
                  size={25}                  
                  style={{ margin: 10 }}
                />
              </TouchableOpacity>
              <View style={{ alignItems: 'center' }}>
                <Image
                  source={require('../../assets/Images/hospitalnew.png')}
                  style={styles.modalImage}
                />
                <Text Bold>
                  {modalItem.HOSP_NAME}
                </Text>
                <Text style={[styles.modalText, { fontSize: 14, fontWeight: '500', marginTop:10 }]}>{modalItem.ADDR}</Text>

                <View style={styles.modalIcon}>
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL(`tel:${modalItem.HOSP_PHONE_NO}`)
                    }}
                  >
                    <Feather name="phone-call" size={30} color={'#43C6DB'} />
                  </TouchableOpacity>
                  <TouchableOpacity
                     onPress={() => {
                      Linking.openURL(`http://maps.google.com/maps?saddr=&daddr=${modalItem.ADDR}`)
                    }}>
                  <FontAwesome5 name='map-marked-alt' size={30} color={'#43C6DB'}/>
                  </TouchableOpacity>
                </View>

              </View>
              </View>
            </View>
          </Modal>

          {/* Filter Modal */}
          <Modal
            backdropOpacity={0.7}
            visible={filterModal}
            transparent={true}
            >
              <SafeAreaView style={{flex:1}}>
            <View style={[styles.modalBox,{ position:'relative',flex:1}]}>
              <TouchableOpacity style={{ position:'absolute',top:10, right:10, zIndex:555555 }}                   onPress={() =>
                    setFilterModal(false)}     
              >
                <Feather
                  name="x-circle"
                  color={GlobalColor.Primary}
                  size={20}             
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {                                                
                  GetHospListApi()
                }}
                style={{paddingVertical:10 }}>
                <Text Bold style={{ fontSize: 14, paddingHorizontal: 10, color:GlobalColor.Primary }}>Clear Filter</Text>
              </TouchableOpacity>



              <View style={{ paddingHorizontal:10, marginTop:20, flex:1, }}>
                <FlatList
                  contentContainerStyle={{ flexGrow:1 }}
                  data={hospitalLoc}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={() => {
                    return (
                      <ListEmptyComponent/>
                    )
                  }}
                  keyExtractor={( item, index ) => index.toString()}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {                                                
                          GetHospListApi(item.LOCN_DESC)
                        }}
                        style={{ borderBottomWidth: 0.5, borderBottomColor:GlobalColor.Secondary, paddingVertical:10 }}>
                        <Text Bold style={{ fontSize: 13, paddingHorizontal: 0 }}>{item.LOCN_DESC}</Text>
                      </TouchableOpacity>
                    )
                  }} />
              </View>
            </View>
            </SafeAreaView>
          </Modal>

          <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection:'row', padding:5 }}>
            <Text Bold style={{ marginRight:10}}>Filter</Text>
            <TouchableOpacity onPress={() => GetHospLocnApi()}>
              <Ionicons
                name="ios-filter"
                size={22}
                color={GlobalColor.Primary}                
              />
            </TouchableOpacity>
          </View>




          <FlatList
            contentContainerStyle={{ flexGrow:1,paddingVertical:"2%"}}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => {
              return (
                <ListEmptyComponent title="No Data Found" enableRefresh={true} onRefreshCallback={()=>GetHospListApi()} refreshing={refresh} ></ListEmptyComponent>
              )
            }}
            data={hospitalList}
            style={{marginBottom:"45%"}}
            keyExtractor={( item, index ) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.box}>
                <TouchableOpacity
                  onPress={() => {
                    setModalItem(item)
                    setModalVisible(true);
                  }}
                  style={{ flex:1}}>
                  <Text Bold style={{ fontSize: 13 }}>
                    {item.HOSP_NAME}
                  </Text>
                  <Text style={{ color: '#000',fontSize:13 }}>{item.ADDR}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ width: '10%' }}
                  onPress={() => {
                    Linking.openURL(`tel:${item.HOSP_PHONE_NO}`)
                  }}>
                  <Feather name="phone-call" size={17} color={'#43C6DB'} />
                </TouchableOpacity>
              </View>
            )}
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
  itemBox: {
    flex:1,
    width: '100%',
    paddingHorizontal:10
  },
  
  spinnerTextStyle: {
    color: '#FFF'
  },
  box: {
    width: '100%',
    backgroundColor:GlobalColor.White,
    paddingHorizontal:10,
    marginBottom:10,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: GlobalColor.Secondary,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalBox: {
    flex:1,
    width: '100%',
    padding: 10,
    // justifyContent: "center",
    // alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 0
  },

  modalBoxDetail:{
    backgroundColor:'rgba(0,0,0,0.7)',
    flex:1, 
    justifyContent:'center',
    alignItems:'center',
    paddingHorizontal:15
  },
  modalBoxDetailInner:{
    backgroundColor:GlobalColor.White,
    padding:20, 
    position:'relative'
  },
  modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center'
  },
  modalImage: {
    width: 80,
    height: 80,
    marginVertical: 10
  },
  modalIcon: {
    width: 150,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  }
});
//make this component available to the app
export default Hospital;
