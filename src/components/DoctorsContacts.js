//import liraries
import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView, Linking, SafeAreaView ,Platform,Dimensions} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-simple-toast'
import * as ApiService from '../Utils/Utils';
import AuthContext from '../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import Text from './reusable/Text';
import { Header } from './reusable/Header'; 
import { GlobalColor } from '../constants/Colors';
import { LoadingScreen } from './reusable/LoadingScreen';
import SegmentedControlTab from 'react-native-segmented-control-tab';
const { width, height } = Dimensions.get('window');

// create a component
const DoctorsContacts = ({ navigation, route }) => {
  const EmergencyContact = route.params.data.EMER_CODE;
  const PageName = route.params.pageName;
  // // console.log($1);

  const { authContext, AppUserData } = useContext(AuthContext);
  const [loader, setLoader] = useState(false)
  const [applyLeave, setapplyLeave] = useState(0);
  const [chairperson, setChairperson] = useState(null);
  const [CoChairperson, setCoChairperson] = useState(null)
  const [ExternalMem, setExternalMem] = useState([])
  const [Members, setMembers] = useState([])
  const [mpt, setMpt] = useState([])
  const [gurgaon, setGurgaon] = useState([])
  const [manesar, setManesar] = useState([])
  const [casting, setCasting] = useState([])
  const [rothak, setRothak] = useState([])
  const [kharkhoda, setKharkhoda] = useState([])
  const [HRSS, setHRSS] = useState([])
  const [Emotional, setEmotional] = useState([])


  const [tabValues, setTabValues] = useState([]);         // For LOVM_VALUE_DESC
const [locationData, setLocationData] = useState([]);   // Full API response (with code + desc)
const [groupedPoshData, setGroupedPoshData] = useState({});

  let usrAccess = AppUserData?.data?.userFlag;

  // // console.log($1);

  const GetPoshData = (LOVCode) => {

    let userId = AppUserData?.data?.userId;
   
    let apiData = {
  
      LOCNCODE: LOVCode,
  
      UserName: userId,
  
    };
   
    // // console.log($1);
   
    let token = AppUserData.token;
  
    setLoader(true);
   
    ApiService.PostMethode('/EmergencyPoshCell', apiData, token, authContext)
  
      .then(result => {
  
        setLoader(false);
  
        let ApiValue = result.Value;
  
        // // console.log($1);
   
        if (Array.isArray(ApiValue)) {
  
          // Group data by DESIGNATION
  
          const grouped = ApiValue.reduce((acc, item) => {
  
            const key = item.DESIGNATION;
  
            if (!acc[key]) acc[key] = [];
  
            acc[key].push(item);
  
            return acc;
  
          }, {});
  
          // Set grouped data into state
  
          setGroupedPoshData(grouped);  // <-- You need to declare this in your useState
  
        }
  
      })
  
      .catch(error => {
  
        setLoader(false);
  
        ApiService.showErrorMessage(error, authContext);
  
      });
  
  };
  
   
  
   
  
   

  const GetLocation = () => {

    let userId = AppUserData?.data?.userId;
   
    let apiData = {
  
      SystemName: "HR-ASSIST",
  
      ReportName: "POSH_LOCN",
  
      LOVName: "101",
  
      LOVCode: "",
  
      UserName: userId,
  
    };
   
    let token = AppUserData.token;
  
    setLoader(true);
   
    ApiService.PostMethode('/GetLOVM', apiData, token, authContext)
  
      .then(result => {
  
        setLoader(false);
  
        let ApiValue = result.Value;

        if (Array.isArray(ApiValue) && ApiValue.length > 0) {
          setLocationData(ApiValue);  // Store full data for future use
          setTabValues(ApiValue.map(item => item.LOVM_VALUE_DESC));  // Set tab labels
   
          // ✅ Automatically call GetPoshData with first LOVCode
          const firstLOVCode = ApiValue[0].LOVM_VALUE_CODE;
          GetPoshData(firstLOVCode);
        }
   
        
  
      })
  
      .catch(error => {
  
        setLoader(false);
  
        ApiService.showErrorMessage(error, authContext);
  
      });
  
  };
  
   

  const handleLeave = index => {
    // // console.log($1);
   if (index == 1) {
     // getfinancialyear();
   }
   setapplyLeave(index);
 };
  // GetEmerContactApi
  const GetEmerContactApi = () => {
    let apiData = {
      TypeCode: EmergencyContact
    }
    let token = AppUserData.token
    // // console.log($1);
    setLoader(true);
    ApiService.PostMethode('/GetEmerContact', apiData, token, authContext)
      .then(result => {
        setLoader(false);
        let ApiValue = result.Value
         console.log(ApiValue);
        let Gurgaon = [];
        let Mpt = [];
        let Manesar = [];
        let Casting = [];
        let Rothak = [];
        let Kharkhoda = [];
        let hrss =[];
        let emotion =[];
        let taxi =[];
        // // console.log($1);
        ApiValue.map((item) => {
          if (item.LOCN_DESC === "MPT ENGINE PLANT") {
            Mpt.push(item)
            setMpt(Mpt)
            // console.log("Mpt", Mpt)
          }
          else if (item.LOCN_DESC === "GURGAON FACTORY") {
            Gurgaon.push(item)
            setGurgaon(Gurgaon)
            //  console.log("Gurgaon", Gurgaon)
            //  console.log("Gurgaon", item)
          }
          else if (item.LOCN_DESC === "MANESAR") {
            Manesar.push(item)
            setManesar(Manesar)
            // console.log("Manesar", Manesar)
          }
          else if (item.LOCN_DESC === "MPT CASTING PLANT") {
            Casting.push(item)
            setCasting(Casting)
            // console.log("Casting", Casting)

          }
          else if (item.LOCN_DESC === "ROHTAK") {
            Rothak.push(item)
            setRothak(Rothak)
            //console.log("Rothak", Rothak)
          }

          else if (item.LOCN_DESC === "KHARKHODA PLANT") {
           console.log("kk",item);
            Kharkhoda.push(item)
            setKharkhoda(Kharkhoda)
            console.log("kk1",kharkhoda);
            
          }

          else if (item.LOCN_DESC === "HR-SS") {
            hrss.push(item)
            setHRSS(hrss)
            // console.log("HRSS", HRSS)
          }
          else if (item.LOCN_DESC === "HEAD OFFICE - DELHI") {
            emotion.push(item)
            setEmotional(emotion)
            // console.log("emotion", Emotional)
          }

        })
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  useEffect(() => {
    GetLocation();
    GetEmerContactApi();
    // // console.log($1);
    // // console.log($1);
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Header title={PageName}/>

      {loader == true ? (
        <LoadingScreen/>
      ) : (
        <>
          {PageName === 'POSH Cell' && tabValues.length > 0 && (
<ScrollView horizontal={true} style={{ marginTop: 10 }}>
<SegmentedControlTab
            borderRadius={2}
            values={tabValues}
            selectedIndex={applyLeave}
            onTabPress={index => {
              handleLeave(index);
              const selectedCode = locationData[index]?.LOVM_VALUE_CODE;
              if (selectedCode) {
                GetPoshData(selectedCode);
              }
            }}
            tabsContainerStyle={styles.tabsContainer}
            tabStyle={styles.tabStyle}
            tabTextStyle={styles.tabTextStyle}
            activeTabStyle={styles.activeTabStyle}
            activeTabTextStyle={styles.activeTabTextStyle}
          />
</ScrollView>
      )}
        <ScrollView
          style={{
            width: '95%',
            // maxHeight: PageName === 'POSH Cell' ? '90%' : '70%',
            marginTop: 10,
            paddingVertical: 10,
            marginVertical: 10,
            alignSelf: 'center',
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
            borderRadius: 5,
          }}>
          {PageName === 'POSH Cell' ? (
            
            <View>
       
         <ScrollView
  contentContainerStyle={{
    paddingBottom: groupedPoshData && Object.keys(groupedPoshData).length <= 3 ? 220 : 80,
  }}
>


{Object.keys(groupedPoshData).map((designation, index) => (
<View key={index} style={styles.boxsingle}>
<Text style={styles.headerText}>{designation.toUpperCase()}</Text>

    {groupedPoshData[designation].length === 1 ? (

      // Single member (like Chairperson or Co-chairperson)
<View>
<View style={styles.responseBox}>
<Text style={{ fontSize: 13 }}>{groupedPoshData[designation][0].NAME}</Text>

          {usrAccess !== 'Y' && (
<TouchableOpacity onPress={() => Linking.openURL(`tel:${groupedPoshData[designation][0].CONTACT_NUMBER}`)}>
<Feather name="phone-call" size={18} color={'#43C6DB'} />
</TouchableOpacity>

          )}
</View>

        {usrAccess !== 'Y' && (
<View style={styles.responseBox}>
<Text style={styles.linkcolor}>{groupedPoshData[designation][0].EMAIL_ID}</Text>
<TouchableOpacity onPress={() => Linking.openURL(`mailto:${groupedPoshData[designation][0].EMAIL_ID}`)}>
<Feather name="mail" size={18} color={'#43C6DB'} />
</TouchableOpacity>
</View>

        )}
</View>

    ) : (

      // Multiple members (like Executive Members or External Members)
<FlatList

        showsVerticalScrollIndicator={false}

        data={groupedPoshData[designation]}

        keyExtractor={item => item.CONTACT_NUMBER}

        renderItem={({ item }) => (
<View

            style={{

              width: '100%',

              alignSelf: 'center',

              paddingVertical: 10,

              alignItems: 'center',

              justifyContent: 'center',

              borderTopColor: '#80406A',

              borderStartColor: GlobalColor.Secondary,

              borderBottomColor: '#2757C3',

              borderEndColor: GlobalColor.Secondary,

              flexDirection: 'row',

            }}
>
<View style={{ width: '100%' }}>
<View style={styles.responseBox}>
<Text style={{ fontSize: 13 }}>{item.NAME}</Text>

                {usrAccess !== 'Y' && item.CONTACT_NUMBER && (
<TouchableOpacity onPress={() => Linking.openURL(`tel:${item.CONTACT_NUMBER}`)}>
<Feather name="phone-call" size={18} color={'#43C6DB'} />
</TouchableOpacity>

                )}
</View>

              {usrAccess !== 'Y' && (
<View style={styles.responseBox}>
<Text style={styles.linkcolor}>{item.EMAIL_ID}</Text>
<TouchableOpacity onPress={() => Linking.openURL(`mailto:${item.EMAIL_ID}`)}>
<Feather name="mail" size={18} color={'#43C6DB'} />
</TouchableOpacity>
</View>

              )}
</View>
</View>

        )}

      />

    )}
</View>

))}
<View style={{ height: 120 }} />
  {/* Map + FlatList rendering */}
  </ScrollView>


            </View>
          ) :
            <View>
              {
                PageName === "Doctor" ? (
                  <View style={{ marginBottom: 90 }}>
                    <View style={styles.boxsingle}>
                      <Text
                        Bold
                        style={styles.headerText}>
                        MPT ENGINE PLANT
                      </Text>
                      {mpt.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                        <FlatList
                          data={mpt}
                          keyExtractor={({ item, index }) => index}
                          renderItem={({ item, index }) => {
                            return (
                              <View style={styles.responseBox}>
                                <Text style={{fontSize:13}}>{item.EMER_XNUM}</Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    Linking.openURL(`tel:${item.EMER_XNUM}`)
                                  }}
                                >
                                  <Feather name="phone-call" size={18} color={'#43C6DB'} />
                                </TouchableOpacity>
                              </View>
                            )
                          }} />}
                    </View>
                    <View style={styles.boxsingle}>
                      <Text
                        Bold
                        style={styles.headerText}>
                        GURGAON PLANT
                      </Text>
                      {gurgaon.length == 0 ? <Text style={{paddingHorizontal:10,fontSize:13}}>Not Found</Text> :

                        <FlatList
                          data={gurgaon}
                          keyExtractor={({ item, index }) => index}
                          renderItem={({ item, index }) => {
                            return (
                              <View style={styles.responseBox}>
                                <Text style={{fontSize:13}}>{item.EMER_XNUM}</Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    Linking.openURL(`tel:${item.EMER_XNUM}`)
                                  }}
                                >
                                  <Feather name="phone-call" size={18} color={'#43C6DB'} />
                                </TouchableOpacity>
                              </View>
                            )
                          }} />

                      }
                    </View>
                    <View style={styles.boxsingle}>
                      <Text
                        Bold
                        style={styles.headerText}>
                        MANESAR PLANT
                      </Text>
                      {manesar.length == 0 ? <Text style={{paddingHorizontal:10,fontSize:13}}>Not Found</Text> :
                        <FlatList
                          data={manesar}
                          keyExtractor={({ item, index }) => index}
                          renderItem={({ item, index }) => {
                            return (
                              <View style={styles.responseBox}>
                                <Text style={{fontSize:13}}>{item.EMER_PNUM}</Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    Linking.openURL(`tel:${item.EMER_PNUM}`)
                                  }}
                                >
                                  <Feather name="phone-call" size={18} color={'#43C6DB'} />
                                </TouchableOpacity>
                              </View>
                            )
                          }} />}
                    </View>
                    
                    <View style={styles.boxsingle}>
                      <Text
                        Bold
                        style={styles.headerText}>
                        MPT CASTING PLANT
                      </Text>
                      {casting.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                        <FlatList
                          data={casting}
                          keyExtractor={({ item, index }) => index}
                          renderItem={({ item, index }) => {
                            return (
                              <View style={styles.responseBox}>
                                <Text style={{fontSize:13}}>{item.EMER_PNUM}</Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    Linking.openURL(`tel:${item.EMER_PNUM}`)
                                  }}
                                >
                                  <Feather name="phone-call" size={18} color={'#43C6DB'} />
                                </TouchableOpacity>
                              </View>
                            )
                          }} />}
                    </View>

                    

                    <View style={styles.boxsingle}>
                      <Text
                      Bold
                        style={styles.headerText}>
                        ROHTAK PLANT
                      </Text>
                      {rothak.length == 0 ? <Text style={{paddingHorizontal:10,fontSize:13}}>Not Found</Text> :
                        <FlatList
                          data={rothak}
                          keyExtractor={({ item, index }) => index}
                          renderItem={({ item, index }) => {
                            return (
                              <View style={styles.responseBox}>
                                <Text style={{fontSize:13}}>{item.EMER_PNUM}</Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    Linking.openURL(`tel:${item.EMER_PNUM}`)
                                  }}
                                >
                                  <Feather name="phone-call" size={18} color={'#43C6DB'} />
                                </TouchableOpacity>
                              </View>
                            )
                          }} />}
                    </View>  

                      <View style={styles.boxsingle}>
                      <Text
                        Bold
                        style={styles.headerText}>
                        KHARKHODA PLANT
                      </Text>
                      {kharkhoda.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                        <FlatList
                          data={kharkhoda}
                          keyExtractor={({ item, index }) => index}
                          renderItem={({ item, index }) => {
                            return (
                              <View style={styles.responseBox}>
                                <Text style={{fontSize:13}}>{item.EMER_PNUM}</Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    Linking.openURL(`tel:${item.EMER_PNUM}`)
                                  }}
                                >
                                  <Feather name="phone-call" size={18} color={'#43C6DB'} />
                                </TouchableOpacity>
                              </View>
                            )
                          }} />}
                    </View>   
                    <View style={styles.boxsingle}>
                      <Text
                        Bold
                        style={styles.headerText}>
                        Employee Wellness / Emotional Health (All Plants)
                      </Text>
                      {Emotional.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                        <FlatList
                          data={Emotional}
                          keyExtractor={({ item, index }) => index}
                          renderItem={({ item, index }) => {
                            return (
                              <View style={styles.responseBox}>
                                <Text style={{fontSize:13}}>{item.EMER_PNUM}</Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    Linking.openURL(`tel:${item.EMER_PNUM}`)
                                  }}
                                >
                                  <Feather name="phone-call" size={18} color={'#43C6DB'} />
                                </TouchableOpacity>
                              </View>
                            )
                          }} />}
                    </View> 
                    
                  </View>
                ) : 
                (PageName === "Vigilance") ? 
                (
                  <View style={{ marginBottom: 90 }}>
                    <View style={styles.boxsingle}>
                    <Text
                      Bold
                      style={styles.headerText}>
                      MPT ENGINE PLANT
                    </Text>
                    {mpt.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                      <FlatList
                        data={mpt}
                        keyExtractor={({ item, index }) => index}
                        renderItem={({ item, index }) => {
                          return (
                            <View style={styles.responseBox}>
                              <Text style={{fontSize:13}}>{item.EMER_XNUM}</Text>
                              <TouchableOpacity
                                onPress={() => {
                                  Linking.openURL(`tel:${item.EMER_XNUM}`)
                                }}
                              >
                                <Feather name="phone-call" size={18} color={'#43C6DB'} />
                              </TouchableOpacity>
                            </View>
                          )
                        }} />}
                    </View>
                    <View style={styles.boxsingle}>
                      <Text
                        Bold
                        style={styles.headerText}>
                        GURGAON PLANT
                      </Text>
                      {gurgaon.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :

                        <FlatList
                          data={gurgaon}
                          keyExtractor={({ item, index }) => index}
                          renderItem={({ item, index }) => {
                            return (
                              <View style={styles.responseBox}>
                                <Text style={{fontSize:13}}>{item.EMER_XNUM}</Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    Linking.openURL(`tel:${item.EMER_XNUM}`)
                                  }}
                                >
                                  <Feather name="phone-call" size={18} color={'#43C6DB'} />
                                </TouchableOpacity>
                              </View>
                            )
                          }} />}
                    </View>
                    
                    <View style={styles.boxsingle}>                      
                    <Text
                      Bold
                      style={styles.headerText}>
                      MANESAR PLANT
                    </Text>
                    {manesar.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                      <FlatList
                        data={manesar}
                        keyExtractor={({ item, index }) => index}
                        renderItem={({ item, index }) => {
                          return (
                            <View style={styles.responseBox}>
                              <Text style={{fontSize:13}}>{item.EMER_XNUM}</Text>
                              <TouchableOpacity
                                onPress={() => {
                                  Linking.openURL(`tel:${item.EMER_XNUM}`)
                                }}
                              >
                                <Feather name="phone-call" size={18} color={'#43C6DB'} />
                              </TouchableOpacity>
                            </View>
                          )
                        }} />}
                    </View>
                    <View style={styles.boxsingle}>
                      <Text
                        Bold
                        style={styles.headerText}>
                        MPT CASTING PLANT
                      </Text>
                      {casting.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                        <FlatList
                          data={casting}
                          keyExtractor={({ item, index }) => index}
                          renderItem={({ item, index }) => {
                            return (
                              <View style={styles.responseBox}>
                                <Text style={{fontSize:13}}>{item.EMER_XNUM}</Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    Linking.openURL(`tel:${item.EMER_XNUM}`)
                                  }}
                                >
                                  <Feather name="phone-call" size={18} color={'#43C6DB'} />
                                </TouchableOpacity>
                              </View>
                            )
                          }} />}
                    </View>

                    <View style={styles.boxsingle}>
                    <Text
                      Bold
                      style={styles.headerText}>
                      ROHTAK PLANT
                    </Text>
                    {rothak.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                      <FlatList
                        data={rothak}
                        keyExtractor={({ item, index }) => index}
                        renderItem={({ item, index }) => {
                          return (
                            <View style={styles.responseBox}>
                              <Text style={{fontSize:13}}>{item.EMER_XNUM}</Text>
                              <TouchableOpacity
                                onPress={() => {
                                  Linking.openURL(`tel:${item.EMER_XNUM}`)
                                }}
                              >
                                <Feather name="phone-call" size={18} color={'#43C6DB'} />
                              </TouchableOpacity>
                            </View>
                          )
                        }} />}
                    </View>

                    <View style={styles.boxsingle}>
                      <Text
                        Bold
                        style={styles.headerText}>
                        KHARKHODA PLANT
                      </Text>
                      {kharkhoda.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                        <FlatList
                          data={kharkhoda}
                          keyExtractor={({ item, index }) => index}
                          renderItem={({ item, index }) => {
                            return (
                              <View style={styles.responseBox}>
                                <Text style={{fontSize:13}}>{item.EMER_PNUM}</Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    Linking.openURL(`tel:${item.EMER_PNUM}`)
                                  }}
                                >
                                  <Feather name="phone-call" size={18} color={'#43C6DB'} />
                                </TouchableOpacity>
                              </View>
                            )
                          }} />}
                    </View>   

                  </View>
                ) 


                : (PageName === "Fire Control") ? (
                  <View style={{ marginBottom: 90 }}>
                    <View style={styles.boxsingle}>
                      <Text
                        Bold
                        style={styles.headerText}>
                        MPT ENGINE PLANT
                      </Text>
                      {mpt.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                        <FlatList
                          data={mpt}
                          keyExtractor={({ item, index }) => index}
                          renderItem={({ item, index }) => {
                            return (
                              <View style={styles.responseBox}>
                                <Text style={{fontSize:13}}>{item.EMER_PNUM}</Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    Linking.openURL(`tel:${item.EMER_PNUM}`)
                                  }}
                                >
                                  <Feather name="phone-call" size={18} color={'#43C6DB'} />
                                </TouchableOpacity>
                              </View>
                            )
                          }} />}
                    </View>
                    
                    <View style={styles.boxsingle}>
                      <Text
                        Bold
                        style={styles.headerText}>
                        GURGAON PLANT
                      </Text>
                      {gurgaon.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                        <FlatList
                          data={gurgaon}
                          keyExtractor={({ item, index }) => index}
                          renderItem={({ item, index }) => {
                            return (
                              <View style={styles.responseBox}>
                                <Text style={{fontSize:13}}>{item.EMER_XNUM}</Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    Linking.openURL(`tel:${item.EMER_XNUM}`)
                                  }}
                                >
                                  <Feather name="phone-call" size={18} color={'#43C6DB'} />
                                </TouchableOpacity>
                              </View>
                            )
                          }} />}
                    </View>

                    <View style={styles.boxsingle}>
                    <Text
                      Bold
                      style={styles.headerText}>
                      MANESAR PLANT
                    </Text>
                    {manesar.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                      <FlatList
                        data={manesar}
                        keyExtractor={({ item, index }) => index}
                        renderItem={({ item, index }) => {
                          return (
                            <View style={styles.responseBox}>
                              <Text style={{fontSize:13}}>{item.EMER_XNUM}</Text>
                              <TouchableOpacity
                                onPress={() => {
                                  Linking.openURL(`tel:${item.EMER_XNUM}`)
                                }}
                              >
                                <Feather name="phone-call" size={18} color={'#43C6DB'} />
                              </TouchableOpacity>
                            </View>
                          )
                        }} />}
                    </View>
                    <View style={styles.boxsingle}>
                    <Text
                      Bold
                      style={styles.headerText}>
                      MPT CASTING PLANT
                    </Text>
                    {casting.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                      <FlatList
                        data={casting}
                        keyExtractor={({ item, index }) => index}
                        renderItem={({ item, index }) => {
                          return (
                            <View style={styles.responseBox}>
                              <Text style={{fontSize:13}}>{item.EMER_PNUM}</Text>
                              <TouchableOpacity
                                onPress={() => {
                                  Linking.openURL(`tel:${item.EMER_PNUM}`)
                                }}
                              >
                                <Feather name="phone-call" size={18} color={'#43C6DB'} />
                              </TouchableOpacity>
                            </View>
                          )
                        }} />}
                    </View>

                    <View style={styles.boxsingle}>
                      <Text
                        Bold
                        style={styles.headerText}>
                        ROHTAK PLANT
                      </Text>
                      {rothak.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                        <FlatList
                          data={rothak}
                          keyExtractor={({ item, index }) => index}
                          renderItem={({ item, index }) => {
                            return (
                              <View style={styles.responseBox}>
                                <Text style={{fontSize:13}}>{item.EMER_PNUM}</Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    Linking.openURL(`tel:${item.EMER_PNUM}`)
                                  }}
                                >
                                  <Feather name="phone-call" size={18} color={'#43C6DB'} />
                                </TouchableOpacity>
                              </View>
                            )
                          }} />}
                    </View>

                    <View style={styles.boxsingle}>
                      <Text
                        Bold
                        style={styles.headerText}>
                        KHARKHODA PLANT
                      </Text>
                      {kharkhoda.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                        <FlatList
                          data={kharkhoda}
                          keyExtractor={({ item, index }) => index}
                          renderItem={({ item, index }) => {
                            return (
                              <View style={styles.responseBox}>
                                <Text style={{fontSize:13}}>{item.EMER_PNUM}</Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    Linking.openURL(`tel:${item.EMER_PNUM}`)
                                  }}
                                >
                                  <Feather name="phone-call" size={18} color={'#43C6DB'} />
                                </TouchableOpacity>
                              </View>
                            )
                          }} />}
                    </View>
                  </View>
                ) 
                : 
                (PageName === "Electricity") ? 
                (
                  <View style={{ marginBottom: 90 }}>
                    <View style={styles.boxsingle}>
                      <Text
                        Bold
                        style={styles.headerText}>
                        MPT ENGINE PLANT
                      </Text>
                      {mpt.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                        <FlatList
                          data={mpt}
                          keyExtractor={({ item, index }) => index}
                          renderItem={({ item, index }) => {
                            return (
                              <View style={styles.responseBox}>
                                <Text style={{fontSize:13}}>{item.EMER_XNUM}</Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    Linking.openURL(`tel:${item.EMER_XNUM}`)
                                  }}
                                >
                                  <Feather name="phone-call" size={18} color={'#43C6DB'} />
                                </TouchableOpacity>
                              </View>
                            )
                          }} />}
                    </View>

                    <View style={styles.boxsingle}>
                      <Text
                        Bold
                        style={styles.headerText}>
                        GURGAON PLANT
                      </Text>
                        {gurgaon.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                          <FlatList
                            data={gurgaon}
                            keyExtractor={({ item, index }) => index}
                            renderItem={({ item, index }) => {
                              return (
                                <View style={styles.responseBox}>
                                  <Text style={{fontSize:13}}>{item.EMER_XNUM}</Text>
                                  <TouchableOpacity
                                    onPress={() => {
                                      Linking.openURL(`tel:${item.EMER_XNUM}`)
                                    }}
                                  >
                                    <Feather name="phone-call" size={18} color={'#43C6DB'} />
                                  </TouchableOpacity>
                                </View>
                              )
                            }} />
                        }
                    </View>

                    <View style={styles.boxsingle}>
                      <Text
                        Bold
                        style={styles.headerText}>
                        MANESAR PLANT
                      </Text>
                      {manesar.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                        <View style={styles.responseBox}>
                          <Text style={{fontSize:13}}>{manesar[0].EMER_XNUM}</Text>
                          <TouchableOpacity onPress={() => {
                            Linking.openURL(`tel:${manesar[0].EMER_XNUM}`)
                          }}>
                            <Feather name="phone-call" size={18} color={'#43C6DB'} />
                          </TouchableOpacity>
                        </View>}
                    </View>
                    
                    <View style={styles.boxsingle}>
                      <Text
                        Bold
                        style={styles.headerText}>
                        MPT CASTING PLANT
                      </Text>
                      {casting.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                        <View style={styles.responseBox}>
                          <Text style={{fontSize:13}}>{casting[0].EMER_XNUM}</Text>
                          <TouchableOpacity onPress={() => {
                            Linking.openURL(`tel:${casting[0].EMER_XNUM}`)
                          }}>
                            <Feather name="phone-call" size={18} color={'#43C6DB'} />
                          </TouchableOpacity>
                        </View>}
                    </View>
                    
                    <View style={styles.boxsingle}>
                      <Text
                        Bold
                        style={styles.headerText}>
                        ROHTAK PLANT
                      </Text>
                      {rothak.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                        <View style={styles.responseBox}>
                          <Text style={{fontSize:13}}>{rothak[0].EMER_XNUM}</Text>
                          <TouchableOpacity onPress={() => {
                            Linking.openURL(`tel:${rothak[0].EMER_XNUM}`)
                          }}>
                            <Feather name="phone-call" size={18} color={'#43C6DB'} />
                          </TouchableOpacity>
                        </View>}
                    </View>

                    <View style={styles.boxsingle}>
                      <Text
                        Bold
                        style={styles.headerText}>
                        KHARKHODA PLANT
                      </Text>
                      {kharkhoda.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                        <FlatList
                          data={kharkhoda}
                          keyExtractor={({ item, index }) => index}
                          renderItem={({ item, index }) => {
                            return (
                              <View style={styles.responseBox}>
                                <Text style={{fontSize:13}}>{item.EMER_PNUM}</Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    Linking.openURL(`tel:${item.EMER_PNUM}`)
                                  }}
                                >
                                  <Feather name="phone-call" size={18} color={'#43C6DB'} />
                                </TouchableOpacity>
                              </View>
                            )
                          }} />}
                    </View>   

                  </View>
                ):
                (PageName === "Taxi Helpline") ? 
                (
                  <View style={{ marginBottom: 90 }}>
                    <View style={styles.boxsingle}>
                      <Text
                        Bold
                        style={styles.headerText}>
                        MPT ENGINE PLANT
                      </Text>
                      {mpt.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                        <FlatList
                          data={mpt}
                          keyExtractor={({ item, index }) => index}
                          renderItem={({ item, index }) => {
                            return (
                              <View style={styles.responseBox1}>
  
  {/* LEFT: Label */}
  <Text style={{ fontSize: 13, width: '40%' }}>
    {item.EMER_SPOC}
  </Text>

  {/* MIDDLE: Number (aligned right) */}
  <Text style={{ fontSize: 13, width: '40%', textAlign: 'right' }}>
    {item.EMER_XNUM}
  </Text>

  {/* RIGHT: Call Icon */}
  <TouchableOpacity
    style={{ width: '20%', alignItems: 'flex-end' }}
    onPress={() => Linking.openURL(`tel:${item.EMER_XNUM}`)}
  >
    <Feather name="phone-call" size={18} color={'#43C6DB'} />
  </TouchableOpacity>

</View>

                            )
                          }} />}
                    </View>

                    <View style={styles.boxsingle}>
                      <Text
                        Bold
                        style={styles.headerText}>
                        GURGAON PLANT
                      </Text>
                        {gurgaon.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                          <FlatList
                            data={gurgaon}
                            keyExtractor={({ item, index }) => index}
                            renderItem={({ item, index }) => {
                              return (
                                <View style={styles.responseBox1}>
  
                                {/* LEFT: Label */}
                                <Text style={{ fontSize: 13, width: '40%' }}>
                                  {item.EMER_SPOC}
                                </Text>
                              
                                {/* MIDDLE: Number (aligned right) */}
                                <Text style={{ fontSize: 13, width: '40%', textAlign: 'right' }}>
                                  {item.EMER_XNUM}
                                </Text>
                              
                                {/* RIGHT: Call Icon */}
                                <TouchableOpacity
                                  style={{ width: '20%', alignItems: 'flex-end' }}
                                  onPress={() => Linking.openURL(`tel:${item.EMER_XNUM}`)}
                                >
                                  <Feather name="phone-call" size={18} color={'#43C6DB'} />
                                </TouchableOpacity>
                              
                              </View>
                              
                              )
                            }} />
                        }
                    </View>

                    <View style={styles.boxsingle}>
                      <Text
                        Bold
                        style={styles.headerText}>
                        MANESAR PLANT
                      </Text>
                      {manesar.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                        <View style={styles.responseBox}>
                           <FlatList
                            data={manesar}
                            keyExtractor={({ item, index }) => index}
                            renderItem={({ item, index }) => {
                              return (
                                <View style={styles.responseBox1}>
  
  {/* LEFT: Label */}
  <Text style={{ fontSize: 13, width: '40%' }}>
    {item.EMER_SPOC}
  </Text>

  {/* MIDDLE: Number (aligned right) */}
  <Text style={{ fontSize: 13, width: '40%', textAlign: 'right' }}>
    {item.EMER_XNUM}
  </Text>

  {/* RIGHT: Call Icon */}
  <TouchableOpacity
    style={{ width: '20%', alignItems: 'flex-end' }}
    onPress={() => Linking.openURL(`tel:${item.EMER_XNUM}`)}
  >
    <Feather name="phone-call" size={18} color={'#43C6DB'} />
  </TouchableOpacity>

</View>

                              )
                            }} />
                          {/* <Text style={{fontSize:13}}>{manesar[0].EMER_XNUM}</Text>
                          <TouchableOpacity onPress={() => {
                            Linking.openURL(`tel:${manesar[0].EMER_XNUM}`)
                          }}>
                            <Feather name="phone-call" size={18} color={'#43C6DB'} />
                          </TouchableOpacity> */}
                        </View>}
                    </View>
                    
                    <View style={styles.boxsingle}>
                      <Text
                        Bold
                        style={styles.headerText}>
                        MPT CASTING PLANT
                      </Text>
                      {casting.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                        <View style={styles.responseBox}>
                           <FlatList
                            data={casting}
                            keyExtractor={({ item, index }) => index}
                            renderItem={({ item, index }) => {
                              return (
                                <View style={styles.responseBox1}>
  
                                {/* LEFT: Label */}
                                <Text style={{ fontSize: 13, width: '40%' }}>
                                  {item.EMER_SPOC}
                                </Text>
                              
                                {/* MIDDLE: Number (aligned right) */}
                                <Text style={{ fontSize: 13, width: '40%', textAlign: 'right' }}>
                                  {item.EMER_XNUM}
                                </Text>
                              
                                {/* RIGHT: Call Icon */}
                                <TouchableOpacity
                                  style={{ width: '20%', alignItems: 'flex-end' }}
                                  onPress={() => Linking.openURL(`tel:${item.EMER_XNUM}`)}
                                >
                                  <Feather name="phone-call" size={18} color={'#43C6DB'} />
                                </TouchableOpacity>
                              
                              </View>
                              
                              )
                            }} />
                          {/* <Text style={{fontSize:13}}>{casting[0].EMER_XNUM}</Text>
                          <TouchableOpacity onPress={() => {
                            Linking.openURL(`tel:${casting[0].EMER_XNUM}`)
                          }}>
                            <Feather name="phone-call" size={18} color={'#43C6DB'} />
                          </TouchableOpacity> */}
                        </View>}
                    </View>
                    
                    <View style={styles.boxsingle}>
                      <Text
                        Bold
                        style={styles.headerText}>
                        ROHTAK PLANT
                      </Text>
                      {rothak.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                        <View style={styles.responseBox1}>
                           <FlatList
                            data={rothak}
                            keyExtractor={({ item, index }) => index}
                            renderItem={({ item, index }) => {
                              return (
                                <View style={styles.responseBox}>
  
  {/* LEFT: Label */}
  <Text style={{ fontSize: 13, width: '40%' }}>
    {item.EMER_SPOC}
  </Text>

  {/* MIDDLE: Number (aligned right) */}
  <Text style={{ fontSize: 13, width: '40%', textAlign: 'right' }}>
    {item.EMER_XNUM}
  </Text>

  {/* RIGHT: Call Icon */}
  <TouchableOpacity
    style={{ width: '20%', alignItems: 'flex-end' }}
    onPress={() => Linking.openURL(`tel:${item.EMER_XNUM}`)}
  >
    <Feather name="phone-call" size={18} color={'#43C6DB'} />
  </TouchableOpacity>

</View>

                              )
                            }} />
                          {/* <Text style={{fontSize:13}}>{rothak[0].EMER_XNUM}</Text>
                          <TouchableOpacity onPress={() => {
                            Linking.openURL(`tel:${rothak[0].EMER_XNUM}`)
                          }}>
                            <Feather name="phone-call" size={18} color={'#43C6DB'} />
                          </TouchableOpacity> */}
                        </View>}
                    </View>

                    <View style={styles.boxsingle}>
                      <Text
                        Bold
                        style={styles.headerText}>
                        KHARKHODA PLANT
                      </Text>
                      {kharkhoda.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                        <FlatList
                          data={kharkhoda}
                          keyExtractor={({ item, index }) => index}
                          renderItem={({ item, index }) => {
                            return (
                              <View style={styles.responseBox1}>
  
  {/* LEFT: Label */}
  <Text style={{ fontSize: 13, width: '40%' }}>
    {item.EMER_SPOC}
  </Text>

  {/* MIDDLE: Number (aligned right) */}
  <Text style={{ fontSize: 13, width: '40%', textAlign: 'right' }}>
    {item.EMER_XNUM}
  </Text>

  {/* RIGHT: Call Icon */}
  <TouchableOpacity
    style={{ width: '20%', alignItems: 'flex-end' }}
    onPress={() => Linking.openURL(`tel:${item.EMER_XNUM}`)}
  >
    <Feather name="phone-call" size={18} color={'#43C6DB'} />
  </TouchableOpacity>

</View>

                            )
                          }} />}
                    </View>   

                  </View>
                ) 
                 : 
                 (
                   PageName === "Helpdesk"
                   ) ? (
                  <View style={{ marginBottom: 90 }}>
                  <View style={styles.boxsingle}>
                    <Text
                      Bold
                      style={styles.headerText}>
                      MPT ENGINE PLANT
                    </Text>
                    {mpt.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                      <FlatList
                        data={mpt}
                        keyExtractor={({ item, index }) => index}
                        renderItem={({ item, index }) => {
                          return (
                            <View style={styles.responseBox}>
                              <Text style={{fontSize:13}}>{item.EMER_XNUM}</Text>
                              <TouchableOpacity
                                onPress={() => {
                                  Linking.openURL(`tel:${item.EMER_XNUM}`)
                                }}
                              >
                                <Feather name="phone-call" size={18} color={'#43C6DB'} />
                              </TouchableOpacity>
                            </View>
                          )
                        }} />}
                  </View>

                  <View style={styles.boxsingle}>
                    <Text
                      Bold
                      style={styles.headerText}>
                      GURGAON PLANT
                    </Text>
                      {gurgaon.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                        <FlatList
                          data={gurgaon}
                          keyExtractor={({ item, index }) => index}
                          renderItem={({ item, index }) => {
                            return (
                              <View style={styles.responseBox}>
                                <Text style={{fontSize:13}}>{item.EMER_XNUM}</Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    Linking.openURL(`tel:${item.EMER_XNUM}`)
                                  }}
                                >
                                  <Feather name="phone-call" size={18} color={'#43C6DB'} />
                                </TouchableOpacity>
                              </View>
                            )
                          }} />
                      }
                  </View>

                  <View style={styles.boxsingle}>
                    <Text
                      Bold
                      style={styles.headerText}>
                      MANESAR PLANT
                    </Text>
                    {manesar.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                      <View style={styles.responseBox}>
                        <Text style={{fontSize:13}}>{manesar[0].EMER_XNUM}</Text>
                        <TouchableOpacity onPress={() => {
                          Linking.openURL(`tel:${manesar[0].EMER_XNUM}`)
                        }}>
                          <Feather name="phone-call" size={18} color={'#43C6DB'} />
                        </TouchableOpacity>
                      </View>}
                  </View>
                  
                  <View style={styles.boxsingle}>
                    <Text
                      Bold
                      style={styles.headerText}>
                      MPT CASTING PLANT
                    </Text>
                    {casting.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                      <View style={styles.responseBox}>
                        <Text style={{fontSize:13}}>{casting[0].EMER_XNUM}</Text>
                        <TouchableOpacity onPress={() => {
                          Linking.openURL(`tel:${casting[0].EMER_XNUM}`)
                        }}>
                          <Feather name="phone-call" size={18} color={'#43C6DB'} />
                        </TouchableOpacity>
                      </View>}
                  </View>
                  
                  <View style={styles.boxsingle}>
                    <Text
                      Bold
                      style={styles.headerText}>
                      ROHTAK PLANT
                    </Text>
                    {rothak.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                      <View style={styles.responseBox}>
                        <Text style={{fontSize:13}}>{rothak[0].EMER_XNUM}</Text>
                        <TouchableOpacity onPress={() => {
                          Linking.openURL(`tel:${rothak[0].EMER_XNUM}`)
                        }}>
                          <Feather name="phone-call" size={18} color={'#43C6DB'} />
                        </TouchableOpacity>
                      </View>}
                  </View>

                  <View style={styles.boxsingle}>
                      <Text
                        Bold
                        style={styles.headerText}>
                        KHARKHODA PLANT
                      </Text>
                      {kharkhoda.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                        <FlatList
                          data={kharkhoda}
                          keyExtractor={({ item, index }) => index}
                          renderItem={({ item, index }) => {
                            return (
                              <View style={styles.responseBox}>
                                <Text style={{fontSize:13}}>{item.EMER_PNUM}</Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    Linking.openURL(`tel:${item.EMER_PNUM}`)
                                  }}
                                >
                                  <Feather name="phone-call" size={18} color={'#43C6DB'} />
                                </TouchableOpacity>
                              </View>
                            )
                          }} />}
                    </View>   


                    <View style={styles.boxsingle}>
                      <Text
                        Bold
                        style={styles.headerText}>
                        HR-SS(HR SHARED-SERVICES)
                      </Text>
                      {HRSS.length == 0 ? <Text style={{paddingHorizontal:10}}>Not Found</Text> :
                        <FlatList
                          data={HRSS}
                          keyExtractor={({ item, index }) => index}
                          renderItem={({ item, index }) => {
                            return (
                              <View style={styles.responseBox}>
                                <Text style={{fontSize:13}}>{item.EMER_XNUM}</Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    Linking.openURL(`tel:${item.EMER_XNUM}`)
                                  }}
                                >
                                  <Feather name="phone-call" size={18} color={'#43C6DB'} />
                                </TouchableOpacity>
                              </View>
                            )
                          }} />}
                    </View>   
                    

                </View>
                 )
                 :
                 
                 null
              }
            </View>
          }

        </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalColor.PrimaryLight,
  },
  responseBox: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    paddingHorizontal: 10
  },
  responseBox1: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    paddingHorizontal: 10,
  },
  
  // headerText: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   marginTop: 20,
  //   color: '#333',
  // },
  cardContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginVertical: 5,
  },
  memberText: {
    fontSize: 14,
    color: '#555',
  },
  headerText: {
    padding: 5,
    paddingHorizontal:10,
    fontSize:13,
  },
  boxsingle:{
    marginBottom:10,
    borderBottomWidth: 0.5,
    borderBottomColor:GlobalColor.LightDark,
    paddingHorizontal:5, 
    borderBottomWidth:0.5, 
    paddingBottom:10,
   
  },
  tabsContainer: {
    marginTop: Platform.OS === 'ios' ? 10 : 5,
    borderRadius: 8,
    width: width * 0.98,           // 90% of screen width
    height: height * 0.06,        // 8% of screen height
    marginHorizontal: width * 0.01, // 5% horizontal margin
    marginVertical: height * 0.02,  // 2% vertical margin
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  tabStyle: {
    paddingVertical: 9,
    paddingHorizontal: -4,
    borderWidth: 1,
    borderRadius: 0,
    borderColor: '#43C6DB',
    minWidth: 50,             // ensures enough room for short labels
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabTextStyle: {
    fontSize: 11,
    color: 'grey',
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
    flexShrink: 1,            // allow text to shrink if needed
    flexWrap: 'wrap',         // allow text to wrap to 2 lines if needed
  },
  activeTabStyle: {
    backgroundColor: GlobalColor.PrimaryLight,
    borderBottomWidth: 4,
    borderBottomColor: '#43C6DB',
  },
  activeTabTextStyle: {
    color: '#43C6DB',
  },
  linkcolor:{
    color:'#43C6DB',
    fontSize:13
  }
});

//make this component available to the app
export default DoctorsContacts;
