//import libraries
import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Image, SafeAreaView, ActivityIndicator, Alert, AsyncStorage, Modal, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';
import * as ApiService from '../../Utils/Utils';
import AuthContext from '../../context/AuthContext';
import { GlobalColor } from '../../constants/Colors';
import { GlobalFontSize } from '../../constants/FontSize';
import TextInput from '../../components/reusable/TextInput';
import { Header } from '../../components/reusable/Header';
import { LoadingScreen } from '../../components/reusable/LoadingScreen';
import ListEmptyComponent from '../../components/reusable/ListEmptyComponent';
import Text from '../../components/reusable/Text';
import Button from '../../components/reusable/Button';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { DataTable, Card, Title, Paragraph } from 'react-native-paper';

// create a component
const UniformMgmt = ({ navigation }) => {
  const [gst, setGst] = useState([]);
  const [uniformData, setUniformData] = useState([]);
  const [uniformSize, setUniformSize] = useState([]);
  const [LeaveDetailModal, setLeaveDetailModal] = useState(false);
  const [ItemCodeV, setItemCodeV] = useState('');
  const [ItemCodeOld, setItemCodeOld] = useState('');
  const [selctSprVsn, setSlctVsn] = useState(false);

  const { authContext, AppUserData } = useContext(AuthContext);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [superVisionDef, setSuperVisionDef] = useState([]);
  const [SuperReq, setSuperReq] = useState('');

  const [loader, setLoader] = useState(false);
  const [refresh, setrefresh] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [uniformAccess, setUniformAccess] = useState('N'); 

  const stopLoader = () => {
    try {
      setLoader(false);
      setrefresh(false);
    } catch (error) {
      // console.log($1);
    }
  };

  const options = [
    {
      label: 'Yes',
      value: 'Y',
    },
    {
      label: 'No',
      value: 'N',
    },
  ];

  //Get_bookings
  const CancelBooking = (bk_id) => {
    let token = AppUserData.token;
    let userId = AppUserData?.data?.userId;

    let apiData = {
      UserName: userId,
      BookingID: bk_id,
    };

    setLoader(true);
    ApiService.PostMethode('/Cancel_Bookings', apiData, token)
      .then((result) => {
        setLoader(false);
        let ApiValue = result.Value;
        if (ApiValue == 'Deleted Succesfully') {
          setLoader(false);
          Alert.alert(result.Value);
          GetBookingApi();
        } else {
          setLoader(false);
          Alert.alert(result.Value);
        }
      })
      .catch((error) => {
        setLoader(false);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const UniformDetailData = () => {
    let token = AppUserData.token;
    let EmpId = AppUserData.data;

    let apiData = {
      EmpId: AppUserData?.data?.username,
    };
    // console.log($1);
    setLoader(true);
    ApiService.PostMethode('/UniformDetails', apiData, token)
      .then((result) => {
        setLoader(false);
        let ApiValue = result.Value;
        // console.log($1);
        setUniformData(ApiValue);
      })
      .catch((error) => {
        setLoader(false);
        // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const getSize = (desc) => {
    let token = AppUserData.token;
    let apiData = {
      EMPL_ID: AppUserData?.data?.username,
      ITEM_DESC: desc,
    };

    setLoader(true);
    ApiService.PostMethode('/GetUnifSize', apiData, token)
      .then((result) => {
        setLoader(false);
        let ApiValue = result.Value;

        // Transform API response for dropdown
        const formattedSizes = ApiValue.map((item) => ({
          label: item.ITEM_SIZE,
          value: item.ITEM_CODE,
        }));

        setUniformSize(formattedSizes);
      })
      .catch((error) => {
        setLoader(false);
        // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const GetUniformAccess = () => {

    let token = AppUserData.token;

    let apiData = {

      EmpId: AppUserData?.data?.username,

    };

 

    setLoader(true);

    ApiService.PostMethode('/GetUniformAccess', apiData, token)

      .then((result) => {

        setLoader(false);

        let ApiValue = result.Result; // Extract Result from response

        // console.log($1);

        setUniformAccess(ApiValue); // Set Y or N

      })

      .catch((error) => {

        setLoader(false);

        // console.log($1);

        ApiService.showErrorMessage(error, authContext);

      });

  };



  const UpdateSize = (new_item_code, old_itemCode) => {
    if (!new_item_code || !old_itemCode) {
      Toast.show('All fields are required.');
      return;
    }

    let token = AppUserData.token;

    let apiData = {
      USER_ID: AppUserData?.data?.username,
      ITEM_CODE: new_item_code,
      OLD_ITEM_CODE: old_itemCode,
    };

    // console.log($1);
    // console.log($1);

    setLoader(true);
    ApiService.PostMethode('/UpdtUnifSize', apiData, token)
      .then((result) => {
        setLoader(false);
        // console.log($1);

        if (result.success === true) {
          Toast.show(result.p_output);
          UniformDetailData();
        } else {
          Toast.show('Problem in Data Updation');
          UniformDetailData();
        }

        setLeaveDetailModal(false);
        setItemCodeOld('');
        setItemCodeV('');
      })
      .catch((error) => {
        setLoader(false);
        // console.log($1);
        setLeaveDetailModal(false);
        setItemCodeOld('');
        setItemCodeV('');
        ApiService.showErrorMessage(error, authContext);
      });
  };

  useEffect(() => {
    UniformDetailData();
  }, []);

  if (loader) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title={'Uniform Management'} back />
        <LoadingScreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title={'Uniform Management'} />
      {loader == true ? (
        <Spinner visible={loader} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} />
      ) : null}

      {/* BODY   ##########################3############       */}

      {/* SEARCH BOX */}
      <View style={styles.MainContainer}>
        <DataTable style={{ backgroundColor: '#fff' }}>
          <DataTable.Header>
            <DataTable.Title style={{ flex: 2 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 14, color: GlobalColor.Primary }}>Item</Text>
            </DataTable.Title>
            <DataTable.Title numeric style={{ flex: 1.2 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 14, color: GlobalColor.Primary }}>Size</Text>
            </DataTable.Title>
            <DataTable.Title numeric style={{ flex: 1.3 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 14, color: GlobalColor.Primary }}>Quantity</Text>
            </DataTable.Title>
            {uniformAccess === 'Y' && (

<DataTable.Title numeric style={{ flex: 1 }}>

  <Text style={{ fontWeight: 'bold', fontSize: 14, color: GlobalColor.Primary }}>Action</Text>

</DataTable.Title>

)}
          </DataTable.Header>

          {Array.isArray(uniformData) &&
            uniformData.map((item, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell style={{ flex: 3 }}>{item.ITEM}</DataTable.Cell>
                <DataTable.Cell numeric style={{ flex: 1.2 }}>{item.SIZE}</DataTable.Cell>
                <DataTable.Cell numeric style={{ flex: 1.3 }}>{item.QUANTITY}</DataTable.Cell>
                {uniformAccess === 'Y' && (

<DataTable.Cell numeric style={{ flex: 1 }}>

  <TouchableOpacity

    onPress={() => {

      setSelectedItem(item); // set the clicked item

      getSize(item.ITEM);

      setItemCodeOld(item.ITEM_CODE);

      setLeaveDetailModal(true); // open modal

    }}

  >

    <Text style={{ color: 'blue' }}>Edit</Text>

  </TouchableOpacity>

</DataTable.Cell>

)}
              </DataTable.Row>
            ))}
        </DataTable>
      </View>

      <Modal transparent={true} visible={LeaveDetailModal} animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              padding: 20,
              borderRadius: 10,
              width: '90%',
              maxHeight: '50%',
              alignItems: 'center',
              elevation: 5,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                paddingBottom: 10,
                borderBottomWidth: 0.5,
                borderColor: '#43C6DB',
              }}
            >
              <Text
                Bold
                style={{
                  fontSize: 16,
                  color: '#43C6DB',
                  textDecorationLine: 'underline',
                }}
              >
                Edit Uniform
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setLeaveDetailModal(false);
                }}
              >
                <Ionicons name="close-circle-outline" size={24} color={'#43C6DB'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ width: '100%', marginTop: 10 }}>
              <View style={{ width: '100%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      marginRight: 15,
                      width: 80,
                    }}
                  >
                    Item
                  </Text>
                  <TextInput
                    value={selectedItem?.ITEM || ''}
                    editable={false}
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      paddingVertical: 8,
                      borderRadius: 8,
                      backgroundColor: GlobalColor.White,
                      borderColor: '#43C6DB',
                      fontSize: 14,
                      height: 40,
                    }}
                  />
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      marginRight: 15,
                      width: 80,
                    }}
                  >
                    Size
                  </Text>
                  <SelectDropdown
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem.label;
                    }}
                    defaultValue={superVisionDef}
                    rowTextForSelection={(item, index) => {
                      return item.label;
                    }}
                    data={uniformSize}
                    onSelect={(selectedItem, index) => {
                      setSlctVsn(true);
                      setItemCodeV(selectedItem.value);
                    }}
                    buttonStyle={styles.dropdown2BtnStyle}
                    buttonTextStyle={styles.dropdown2BtnTxtStyle}
                    renderDropdownIcon={(isOpened) => {
                      return (
                        <FontAwesome
                          name={isOpened ? 'chevron-up' : 'chevron-down'}
                          color={'#43C6DB'}
                          size={14}
                        />
                      );
                    }}
                    dropdownIconPosition={'right'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                    rowStyle={styles.dropdown2RowStyle}
                    rowTextStyle={styles.dropdown2RowTxtStyle}
                  />
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      marginRight: 15,
                      width: 80,
                    }}
                  >
                    Quantity
                  </Text>
                  <TextInput
                    value={selectedItem?.QUANTITY?.toString() || ''}
                    editable={false}
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      paddingVertical: 8,
                      borderRadius: 8,
                      backgroundColor: 'lightgrey',
                      borderColor: '#43C6DB',
                      fontSize: 14,
                      height: 40,
                    }}
                  />
                </View>
              </View>
            </ScrollView>

            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                paddingTop: 15,
                borderTopWidth: 0.5,
                borderColor: '#43C6DB',
              }}
            >
              <TouchableOpacity
                style={{
                  padding: 12,
                  borderRadius: 5,
                  backgroundColor: '#43C6DB',
                  minWidth: 100,
                  alignItems: 'center',
                }}
                onPress={() => {
                  UpdateSize(ItemCodeV, ItemCodeOld);
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 14,
                  }}
                  Bold
                >
                  Ok
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: 12,
                  marginLeft: 10,
                  borderRadius: 5,
                  backgroundColor: '#43C6DB',
                  minWidth: 100,
                  alignItems: 'center',
                }}
                onPress={() => {
                  setLeaveDetailModal(false);
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 14,
                  }}
                  Bold
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalColor.PrimaryLight,
  },
  MainContainer: {
    flex: 1,
    paddingHorizontal: 6,
  },
  renderitem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginTop: 10,
    borderWidth: 0.5,
    borderColor: GlobalColor.LightDark,
  },
  SearchContainer: {
    marginVertical: 10,
    width: '100%',
    flexDirection: 'row',
    borderWidth: 0,
    borderRadius: 5,
    alignSelf: 'center',
    backgroundColor: '#fff',
    color: GlobalColor.Primary,
    fontSize: GlobalFontSize.Small,
    fontFamily: 'Roboto-Regular',
    textAlign: 'left',
    paddingHorizontal: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 4,
  },
  TouchableOpacity: {
    width: '100%',
    paddingTop: 1,
    backgroundColor: GlobalColor.White,
    alignSelf: 'center',
    margin: 10,
    paddingVertical: 10,
    shadowColor: GlobalColor.ShadowColor,
    shadowOffset: {
      width: -0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 5,
    borderRadius: 8,
  },
  HeadingContainer: {
    width: '100%',
    backgroundColor: '#43C6DB',
    alignSelf: 'center',
    overflow: 'hidden',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  searchIcon: {
    padding: 10,
  },
  GStBox: {
    fontSize: 13,
    color: GlobalColor.LightDark,
    letterSpacing: 1,
  },
  spinnerTextStyle: {
    color: GlobalColor.White,
  },
  dropdown2BtnStyle: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 3,
    backgroundColor: '#FFF',
    borderColor: '#43C6DB',
  },
  dropdown2BtnTxtStyle: { textAlign: 'left', fontSize: 14 },
  dropdown2DropdownStyle: { backgroundColor: GlobalColor.White },
  dropdown2RowStyle: {
    backgroundColor: GlobalColor.White,
    borderBottomColor: '#43C6DB',
  },
  dropdown2RowTxtStyle: { textAlign: 'left', fontSize: 16 },
});

//make this component available to the app
export default UniformMgmt;