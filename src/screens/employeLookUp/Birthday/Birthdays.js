//import liraries
import React, {useState, useEffect, useRef, useContext} from 'react';
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Animated,
  ActivityIndicator,
  Linking,
  Platform,
  SafeAreaView,
} from 'react-native';
import Modal from 'react-native-modal';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-simple-toast';
import * as ApiService from '../../../Utils/Utils';
import AuthContext from '../../../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {useFocusEffect} from '@react-navigation/native';
import {GlobalColor} from '../../../constants/Colors';
import {GlobalFontSize} from '../../../constants/FontSize';
import Text from '../../../components/reusable/Text';
import ListEmptyComponent from '../../../components/reusable/ListEmptyComponent';
import {LoadingScreen} from '../../../components/reusable/LoadingScreen';
import {Decrypt} from '../../../Service/Helper';

// create a component
const Birthdays = () => {
  const {authContext, AppUserData} = useContext(AuthContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [todayBirthday, setTodayBirthday] = useState([]);
  const [tomorrowBirthday, SetTomorrowBirthday] = useState([]);
  const [modalItem, setModalItem] = useState();
  const [staffNo, setStaffNo] = useState();
  const [empPhoto, setEmpPhoto] = useState();
  const [refresh, setrefresh] = useState(false);
  const [modalLoader, setmodalLoader] = useState(false);

  const stopLoader = () => {
    try {
      setLoader(false);
      setrefresh(false);
      setmodalLoader(false);
    } catch (error) {
// $&
    }
  };

  const PostBirthdayData = () => {
    let userId = AppUserData?.data?.userId;
    let apiData = {PFlag: userId};
    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/GetEmplBirthday', apiData, token, authContext)
      .then(result => {
// $&
        stopLoader(false);
        let tommorowData = [];
        let todayData = [];
        let ApiValue = result.Value;
        ApiValue.filter(Element => {
          // // console.log($1);
          let todayResult = Decrypt(Element.BIRTHDATE).includes('TODAY');
          // // console.log($1);
          let tommorowResult = Decrypt(Element.BIRTHDATE).includes('TOMORROW');
          if (todayResult) {
            todayData.push(Element);
            setTodayBirthday(todayData);
          } else if (tommorowResult) {
            tommorowData.push(Element);
            SetTomorrowBirthday(tommorowData);
          }
        });
      })
      .catch(error => {
        stopLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  // emp Profile Data
  const GetUserDetails = item => {
    let apiData = {StaffNo: Decrypt(item['Staff No'])};
// $&
    let token = AppUserData.token;
    setmodalLoader(true);
    setModalVisible(true);
    ApiService.PostMethode('/GetEmpSearch', apiData, token, authContext)
      .then(result => {
        let response = result.Value;
        if (response.Table) {
          // // console.log($1);
          let profile =
            response.Table[0] && response.Table
              ? response.Table[0].profile_photo
              : '';
          setModalItem(item);
          setEmpPhoto(profile);
          stopLoader(false);
          setModalVisible(true);
        } else {
          stopLoader(false);
          setModalVisible(false);
          Toast.show('User not found');
        }
      })
      .catch(error => {
        stopLoader(false);
        setModalVisible(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = PostBirthdayData();
      return () => unsubscribe;
    }, []),
  );

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const [CurrentPage, setCurrentPage] = useState(0);

  const handleCurrentPage = index => {
    setCurrentPage(index);
  };

  if (loader) {
    return <LoadingScreen />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        <View style={{width: '100%'}}>
          <SegmentedControlTab
            borderRadius={0}
            values={['Today', 'Tomorrow']}
            selectedIndex={CurrentPage}
            onTabPress={index => {
              handleCurrentPage(index);
            }}
            tabsContainerStyle={styles.tabsContainerStyle}
            tabStyle={styles.tabStyle}
            tabTextStyle={styles.tabTextStyle}
            activeTabStyle={styles.activeTabStyle}
            activeTabTextStyle={styles.activeTabTextStyle}
          />
        </View>

        <View style={{flex: 1, paddingVertical: 10}}>
          {CurrentPage == 0 ? (
            <View style={{flexGrow: 1,marginBottom:70}}>
              <FlatList
                contentContainerStyle={{flexGrow: 1}}
                style={{marginBottom:"22%"}}
                ListEmptyComponent={() => (
                  <ListEmptyComponent
                    title="No Data Found"
                    enableRefresh={true}
                    onRefreshCallback={() => PostBirthdayData()}
                    refreshing={refresh}></ListEmptyComponent>
                )}
                data={todayBirthday}
                ListHeaderComponent={
                  <Image
                    source={{
                      uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Birthday_candles.jpg/1200px-Birthday_candles.jpg',
                    }}
                    style={styles.img}
                  />
                }
                keyExtractor={({item, index}) => index}
                renderItem={({item, index}) => {
                  return (
                    <View style={{flex: 1}}>
                      <TouchableOpacity
                        onPress={() => {
                          GetUserDetails(item);
                        }}>
                        <View
                          style={[
                            styles.itemView,
                            // {transform: [{scale}], opacity},
                          ]}>
                          <View
                            style={{
                              borderRightWidth: 2,
                              paddingVertical: 8,
                              width: '20%',
                            }}>
                            <Text style={{textAlign: 'center',fontSize:13}}>
                              {Decrypt(item.BIRTHDATE).includes('TODAY')
                                ? Decrypt(item.DIRC_CODE)
                                : null}
                            </Text>
                          </View>
                          <View
                            style={{
                              width: '80%',
                              paddingVertical: 5,
                              paddingLeft: 15,
                            }}>
                            <Text style={{fontSize:13}}Bold>
                              {Decrypt(item.BIRTHDATE).includes('TODAY')
                                ? Decrypt(item.Name)
                                : null}
                            </Text>
                            <Text style={{fontSize:12}}>
                              {Decrypt(item.BIRTHDATE).includes('TODAY')
                                ? Decrypt(item.Email)
                                : null}
                            </Text>

                            <View style={{flexDirection: 'row'}}>
                              <Text style={{fontSize:13}}>
                                {Decrypt(item.BIRTHDATE).includes('TODAY')
                                  ? Decrypt(item.Desg)
                                  : null}{' '}
                              </Text>
                              <Text style={{fontSize:13}}>
                                |{' '}
                                {Decrypt(item.BIRTHDATE).includes('TODAY')
                                  ? Decrypt(item.Dept)
                                  : null}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </View>
          ) : (
            <View style={{flexGrow: 1,marginBottom:70}}>
              <FlatList
                contentContainerStyle={{flexGrow: 1}}
                style={{marginBottom:"22%"}}
                ListEmptyComponent={() => (
                  <ListEmptyComponent
                    title="No Data Found"
                    enableRefresh={true}
                    onRefreshCallback={() => PostBirthdayData()}
                    refreshing={refresh}></ListEmptyComponent>
                )}
                data={tomorrowBirthday}
                keyExtractor={({item, index}) => index}
                renderItem={({item, index}) => (
                  <View style={{flex: 1}}>
                    <TouchableOpacity
                      onPress={() => {
                        GetUserDetails(item);
                      }}>
                      <View style={styles.itemView}>
                        <View
                          style={{
                            borderRightWidth: 2,
                            paddingVertical: 8,
                            width: '20%',
                          }}>
                          <Text style={{textAlign: 'center',fontSize:13}}>
                            {Decrypt(item.DIRC_CODE)}
                          </Text>
                        </View>
                        <View
                          style={{
                            width: '80%',
                            paddingVertical: 5,
                            paddingLeft: 15,
                          }}>
                          <Text style={{fontSize:13}}Bold>
                            {Decrypt(item.Name)}
                          </Text>
                          <Text style={{fontSize:12}}>{Decrypt(item.Email)}</Text>

                          <View style={{flexDirection: 'row'}}>
                            <Text style={{fontSize:12}}>{Decrypt(item.Desg)} </Text>
                            <Text style={{fontSize:12}}>| {Decrypt(item.Dept)}</Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          )}
        </View>

        {/* Modal Code Goes here */}
        <Modal
          backdropOpacity={0.7}
          coverScreen={true}
          isVisible={isModalVisible}>
          <View
            style={{
              minHeight: 400,
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
                    size={30}
                    onPress={toggleModal}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    width: 150,
                    height: 150,
                    borderWidth: 5,
                    borderColor: '#43C6DB',
                    borderRadius: 75,
                    marginTop: 80,
                  }}>
                  {empPhoto ? (
                    <Image
                      source={{uri:empPhoto}}
                      style={[styles.profileImg, {marginRight: 5}]}
                    />
                  ) : (
                    <Image
                      source={require('../../../assets/Images/Avtar.png')}
                      style={[styles.profileImg, {marginRight: 5}]}
                    />
                  )}
                </View>
                <View
                  style={{
                    paddingVertical: 15,
                    alignSelf: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    Bold
                    style={{color: GlobalColor.Primary, lineHeight: 20,fontSize:13}}>
                    {modalItem && modalItem.Name && Decrypt(modalItem.Name)}
                  </Text>
                  <Text style={{color: GlobalColor.Primary, lineHeight: 20,fontSize:13}}>
                    {modalItem && modalItem.Email && Decrypt(modalItem.Email)}
                  </Text>

                  <View style={{flexDirection: 'row'}}>
                    <Text style={{color: GlobalColor.Primary, lineHeight: 20,fontSize:13}}>
                    {modalItem && modalItem.Desg && Decrypt(modalItem.Desg)}
                    </Text>
                    <Text style={{color: GlobalColor.Primary, lineHeight: 20,fontSize:13}}>
                      {' '}
                      | {modalItem && modalItem.Dept && Decrypt(modalItem.Dept)}
                    </Text>
                  </View>
                </View>
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
                  <TouchableOpacity
                    onPress={() => {
                      //Linking.openURL(`mailto:${Decrypt(modalItem.Email)}`);
                      var url = `sms:${Decrypt(modalItem.MOB_NO)}${Platform.OS === "ios" ? "&" : "?"}body=${"Wish you a very Happy Birthday!"}`
                      Linking.openURL(url);
                      
                    }}
                    style={{
                      borderWidth: 1,
                      width: 40,
                      height: 40,
                      borderColor: '#43C6DB',
                      borderRadius: 100,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Feather
                      name="mail"
                      size={18}
                      color={'#43C6DB'}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      width: 40,
                      height: 40,
                      borderColor: '#43C6DB',
                      borderRadius: 100,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      Linking.openURL(`tel:${Decrypt(modalItem.MOB_NO)}`);
                    }}>
                    <Feather
                      name="phone-call"
                      size={18}
                      color={'#43C6DB'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
  },
  tabsContainerStyle: {
    marginTop: 10,
    borderRadius: 0,
    width: '100%',
  },
  tabStyle: {
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 0,
    borderColor: '#43C6DB',
  },
  tabTextStyle: {
    fontSize: 12,
    color: 'grey',
    fontFamily: 'Roboto-Bold',
  },
  activeTabStyle: {
    backgroundColor: GlobalColor.PrimaryLight,
    borderBottomWidth: 4,
    borderBottomColor: '#43C6DB',
  },
  activeTabTextStyle: {
    color: '#43C6DB'
  },

  img: {
    width: '100%',
    height: '15%',
    marginTop: 10,
    overflow: 'hidden',
    borderRadius: 10,
    alignSelf: 'center',
  },
  itemView: {
    backgroundColor: '#fff',
    width: '100%',
    borderLeftWidth: 5,
    borderLeftColor: '#43C6DB',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    alignSelf: 'center',
    justifyContent: 'space-around',
    paddingTop: 15,
    paddingBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 2.0,
    elevation: 2,
    // borderTopLeftRadius: 15,
    // borderBottomLeftRadius: 15,
    // borderTopRightRadius: 15,
  },
  modal: {
    height: 150,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: GlobalColor.PrimaryLight,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    position: 'relative',
  },
  profileImg: {
    height: 110,
    width: 110,
    borderRadius: 60,
    marginLeft: 5,
  },
  ModalCloseIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 55,
  },
  img: {
    width: '100%',
    height: 150,
    marginTop: 10,
    overflow: 'hidden',
    borderRadius: 0,
    alignSelf: 'center',
    marginVertical: 10,
  },
});

//make this component available to the app
export default Birthdays;
